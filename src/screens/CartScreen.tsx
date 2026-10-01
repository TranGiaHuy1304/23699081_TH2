import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore, CartItem } from '@stores/cartStore';
import { getSharedShipFee, getSharedDistanceKm } from '@hooks/useCampusLocation';
import { Watermark } from '@components/Watermark';
import {
  ROOM_LABEL,
  PRICE_MULTIPLIER,
  BASE_SHIP_FEE,
  VARIANT,
} from '@constants/student';
import { COLORS } from '@constants/theme';

export const CartScreen: React.FC = () => {
  const items = useCartStore((state) => state.items);
  const changeQty = useCartStore((state) => state.changeQty);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  // Lấy phí ship đã ước tính từ GPS (nếu có), nếu chưa có dùng BASE_SHIP_FEE
  const shipFee = getSharedShipFee() || BASE_SHIP_FEE;
  const distanceKm = getSharedDistanceKm();

  const subtotal = items.reduce((sum, item) => {
    return sum + Math.round(item.product.price * PRICE_MULTIPLIER) * item.quantity;
  }, 0);

  const grandTotal = items.length > 0 ? subtotal + shipFee : 0;

  const handleClear = () => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa hết', style: 'destructive', onPress: clearCart },
    ]);
  };

  const renderItem = ({ item }: { item: CartItem }) => {
    const itemPrice = Math.round(item.product.price * PRICE_MULTIPLIER);

    return (
      <View style={styles.cartCard}>
        <Image
          source={{ uri: item.product.image }}
          style={styles.itemImage}
          resizeMode="contain"
        />

        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {item.product.title}
          </Text>
          <Text style={styles.itemPrice}>
            {itemPrice.toLocaleString('vi-VN')} đ
          </Text>

          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => changeQty(item.product.id, -1)}
            >
              <Text style={styles.qtyButtonText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.quantityText}>{item.quantity}</Text>

            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => changeQty(item.product.id, 1)}
            >
              <Text style={styles.qtyButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromCart(item.product.id)}
        >
          <Text style={styles.removeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <View style={styles.container}>
        {/* Header thông tin giao hàng tận phòng */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Giỏ hàng KTXGo</Text>
            <Text style={styles.subtitle}>
              Giao tận phòng: <Text style={styles.roomHighlight}>{ROOM_LABEL}</Text>
            </Text>
          </View>

          {items.length > 0 && (
            <TouchableOpacity onPress={handleClear}>
              <Text style={styles.clearText}>Xóa tất cả</Text>
            </TouchableOpacity>
          )}
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>
            <Text style={styles.emptySubtitle}>
              Hãy chọn các món ăn và đồ dùng ưa thích để KTXGo phục vụ bạn nhé!
            </Text>
          </View>
        ) : (
          <View style={styles.cartContent}>
            <FlatList
              data={items}
              keyExtractor={(item) => `cart-${item.product.id}`}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />

            {/* Khối tính tiền chi tiết */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tiền hàng:</Text>
                <Text style={styles.summaryValue}>
                  {subtotal.toLocaleString('vi-VN')} đ
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <View>
                  <Text style={styles.summaryLabel}>Phí giao hàng:</Text>
                  {distanceKm > 0 && (
                    <Text style={styles.distLabel}>
                      (GPS: {distanceKm} km · Công thức {VARIANT.shipFormula})
                    </Text>
                  )}
                </View>
                <Text style={styles.shipFeeValue}>
                  {shipFee.toLocaleString('vi-VN')} đ
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tổng cộng:</Text>
                <Text style={styles.totalValue}>
                  {grandTotal.toLocaleString('vi-VN')} đ
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

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
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  roomHighlight: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  clearText: {
    color: COLORS.error,
    fontSize: 13,
    fontWeight: '600',
  },
  cartContent: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: 12,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  itemImage: {
    width: 65,
    height: 65,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 18,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 4,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  qtyButton: {
    backgroundColor: '#EFF6FF',
    width: 26,
    height: 26,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  qtyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: -2,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginHorizontal: 12,
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    fontSize: 16,
    color: COLORS.textLight,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  distLabel: {
    fontSize: 11,
    color: COLORS.secondary,
    fontStyle: 'italic',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  shipFeeValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary,
  },
});
