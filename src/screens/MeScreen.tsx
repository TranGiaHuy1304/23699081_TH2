import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@stores/authStore';
import { useCampusLocation } from '@hooks/useCampusLocation';
import { Watermark } from '@components/Watermark';
import {
  STUDENT,
  ROOM_LABEL,
  VARIANT,
  examStamp,
  BASE_SHIP_FEE,
} from '@constants/student';
import { COLORS, CAMPUS_GATE_COORDS } from '@constants/theme';

export const MeScreen: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const phoneNumber = useAuthStore((state) => state.phoneNumber);

  const {
    permissionStatus,
    coords,
    distanceKm,
    shipFee,
    loading,
    errorMessage,
    requestPermission,
    openSettings,
  } = useCampusLocation();

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất khỏi KTXGo?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ]);
  };

  const stamp = examStamp();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <ScrollView contentContainerStyle={styles.container}>
        {/* Header thông tin sinh viên */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {STUDENT.hoTen.charAt(0)}
            </Text>
          </View>
          <Text style={styles.userName}>{STUDENT.hoTen}</Text>
          <Text style={styles.userMssv}>MSSV: {STUDENT.mssv}</Text>
          <Text style={styles.stampBadge}>Stamp: #{stamp}</Text>
          {phoneNumber ? (
            <Text style={styles.phoneText}>SĐT: {phoneNumber}</Text>
          ) : null}
          <View style={styles.roomTag}>
            <Text style={styles.roomTagText}>Ký túc xá · Phòng {ROOM_LABEL}</Text>
          </View>
        </View>

        {/* Khối quản lý quyền Vị trí GPS & Phí Ship */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📍 Định vị & Ước tính Phí Ship</Text>
          <Text style={styles.sectionSubtitle}>
            Khoảng cách tính từ vị trí của bạn đến {CAMPUS_GATE_COORDS.name}
          </Text>

          {/* Trạng thái quyền Location */}
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Trạng thái quyền vị trí:</Text>
            <Text
              style={[
                styles.statusValue,
                permissionStatus === 'granted'
                  ? styles.statusGranted
                  : permissionStatus === 'blocked'
                  ? styles.statusBlocked
                  : styles.statusDenied,
              ]}
            >
              {permissionStatus === 'granted'
                ? '✅ ĐÃ CẤP QUYỀN (GRANTED)'
                : permissionStatus === 'blocked'
                ? '🚫 BỊ CHẶN (BLOCKED)'
                : permissionStatus === 'denied'
                ? '❌ TỪ CHỐI (DENIED)'
                : '⚪ CHƯA KIỂM TRA'}
            </Text>
          </View>

          {errorMessage && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}

          {/* Hiển thị tọa độ và tính toán Haversine */}
          {coords ? (
            <View style={styles.coordsCard}>
              <View style={styles.coordRow}>
                <Text style={styles.coordLabel}>Vĩ độ (Latitude):</Text>
                <Text style={styles.coordVal}>{coords.latitude.toFixed(4)}</Text>
              </View>
              <View style={styles.coordRow}>
                <Text style={styles.coordLabel}>Kinh độ (Longitude):</Text>
                <Text style={styles.coordVal}>{coords.longitude.toFixed(4)}</Text>
              </View>
              <View style={styles.coordRow}>
                <Text style={styles.coordLabel}>Khoảng cách Haversine:</Text>
                <Text style={styles.coordHighlight}>{distanceKm} km</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.coordRow}>
                <View>
                  <Text style={styles.feeLabel}>Phí giao hàng ước tính:</Text>
                  <Text style={styles.formulaNote}>
                    (Công thức {VARIANT.shipFormula}: Cơ bản {BASE_SHIP_FEE.toLocaleString('vi-VN')}đ + 1.500đ/km + 2.000đ)
                  </Text>
                </View>
                <Text style={styles.feeVal}>
                  {shipFee.toLocaleString('vi-VN')} đ
                </Text>
              </View>
            </View>
          ) : null}

          {/* Các nút hành động cho quyền vị trí */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.locationButton}
              onPress={requestPermission}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.locationButtonText}>
                  {coords ? 'Cập nhật toạ độ GPS' : 'Xin quyền & Lấy vị trí GPS'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Nút mở Settings hệ thống khi quyền bị blocked */}
            {permissionStatus === 'blocked' && (
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={openSettings}
                activeOpacity={0.8}
              >
                <Text style={styles.settingsButtonText}>⚙️ Mở Cài đặt hệ thống</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Nút Đăng xuất */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Đăng xuất tài khoản</Text>
        </TouchableOpacity>
      </ScrollView>

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: 16,
    paddingBottom: 24,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  userMssv: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  stampBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 6,
  },
  phoneText: {
    fontSize: 13,
    color: COLORS.text,
    marginTop: 4,
  },
  roomTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roomTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 14,
    lineHeight: 16,
  },
  statusBox: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  statusValue: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  statusGranted: {
    color: COLORS.success,
  },
  statusBlocked: {
    color: COLORS.error,
  },
  statusDenied: {
    color: '#D97706',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginBottom: 10,
  },
  coordsCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  coordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 3,
  },
  coordLabel: {
    fontSize: 12,
    color: COLORS.text,
  },
  coordVal: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  coordHighlight: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  feeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  formulaNote: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  feeVal: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.secondary,
  },
  actionButtonsRow: {
    gap: 8,
  },
  locationButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  locationButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  settingsButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: COLORS.error,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  settingsButtonText: {
    color: COLORS.error,
    fontWeight: '700',
    fontSize: 13,
  },
  logoutButton: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  logoutText: {
    color: COLORS.error,
    fontSize: 15,
    fontWeight: '700',
  },
});
