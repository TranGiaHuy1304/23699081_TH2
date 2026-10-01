import { useState, useCallback, useEffect } from 'react';
import { Platform, PermissionsAndroid, Linking } from 'react-native';
import { BASE_SHIP_FEE, VARIANT } from '@constants/student';
import { CAMPUS_GATE_COORDS } from '@constants/theme';

export type PermissionStatus = 'idle' | 'granted' | 'denied' | 'blocked';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

// Biến lưu trữ phí ship và toạ độ chia sẻ giữa Tab Tôi và Tab Giỏ
let sharedShipFee: number = BASE_SHIP_FEE;
let sharedCoords: LocationCoords | null = null;
let sharedDistanceKm: number = 0;

export const getSharedShipFee = () => sharedShipFee;
export const getSharedCoords = () => sharedCoords;
export const getSharedDistanceKm = () => sharedDistanceKm;

// Tính khoảng cách Haversine (đơn vị: km)
export function calculateHaversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

// Tính phí ship theo công thức A hoặc B dựa vào VARIANT
export function calculateShipFee(km: number): number {
  if (VARIANT.shipFormula === 'A') {
    return BASE_SHIP_FEE + Math.round(km * 2000);
  } else {
    // Công thức B cho MSSV số cuối lẻ (23699081)
    return BASE_SHIP_FEE + Math.round(km * 1500) + 2000;
  }
}

export function useCampusLocation() {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('idle');
  const [coords, setCoords] = useState<LocationCoords | null>(sharedCoords);
  const [distanceKm, setDistanceKm] = useState<number>(sharedDistanceKm);
  const [shipFee, setShipFee] = useState<number>(sharedShipFee);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const openSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  const requestPermissionAndFetchLocation = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      let isGranted = false;

      if (Platform.OS === 'android') {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'KTXGo cần quyền vị trí',
            message: 'KTXGo cần truy cập vị trí của bạn để tính phí giao hàng đến phòng KTX.',
            buttonPositive: 'Cho phép',
            buttonNegative: 'Từ chối',
          }
        );

        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          setPermissionStatus('granted');
          isGranted = true;
        } else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          setPermissionStatus('blocked');
          setErrorMessage('Quyền vị trí đã bị chặn. Vui lòng mở Cài đặt để cấp lại quyền.');
          setLoading(false);
          return;
        } else {
          setPermissionStatus('denied');
          setErrorMessage('Bạn đã từ chối cấp quyền vị trí.');
          setLoading(false);
          return;
        }
      } else {
        // iOS or fallback
        setPermissionStatus('granted');
        isGranted = true;
      }

      if (isGranted) {
        // Mock toạ độ phòng sinh viên gần KTX (máy ảo Simulator/Emulator)
        // Cách cổng trường ~ 1.85 km (ví dụ: đường Nguyễn Oanh/Quang Trung Gò Vấp)
        const userLat = 10.8350;
        const userLon = 106.6780;
        const newCoords: LocationCoords = { latitude: userLat, longitude: userLon };

        const km = calculateHaversineKm(
          newCoords.latitude,
          newCoords.longitude,
          CAMPUS_GATE_COORDS.latitude,
          CAMPUS_GATE_COORDS.longitude
        );

        const fee = calculateShipFee(km);

        sharedCoords = newCoords;
        sharedDistanceKm = km;
        sharedShipFee = fee;

        setCoords(newCoords);
        setDistanceKm(km);
        setShipFee(fee);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi lấy vị trí');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Tự động kiểm tra quyền ban đầu
    if (Platform.OS === 'android') {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        .then((hasPermission) => {
          if (hasPermission) {
            setPermissionStatus('granted');
          }
        })
        .catch(() => {});
    }
  }, []);

  return {
    permissionStatus,
    coords,
    distanceKm,
    shipFee,
    loading,
    errorMessage,
    requestPermission: requestPermissionAndFetchLocation,
    openSettings,
  };
}
