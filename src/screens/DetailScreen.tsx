import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { productApi, Product } from '@services/productApi';
import { useCartStore } from '@stores/cartStore';
import { Watermark } from '@components/Watermark';
import { STUDENT, PRICE_MULTIPLIER, VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';

export const DetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { id } = route.params as { id: string };

  const addToCart = useCartStore((state) => state.addToCart);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductById(id),
  });

  const handleAddToCart = () => {
    if (!product) return;

    // Haptic selection (40ms)
    Vibration.vibrate(40);

    addToCart(product, 1);

    // Alert có MSSV theo đúng yêu cầu đề bài
    Alert.alert(
      'Thành công',
      `Đã thêm "${product.title}" vào giỏ hàng!\n[MSSV: ${STUDENT.mssv}]`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {VARIANT.watermarkAtTop && <Watermark />}

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Đang tải chi tiết món...</Text>
        </View>
      ) : isError || !product ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Không tìm thấy thông tin món ăn.</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Ảnh sản phẩm */}
            <View style={styles.imageBox}>
              <Image
                source={{ uri: product.image }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            {/* Chi tiết nội dung */}
            <View style={styles.content}>
              <View style={styles.badgeRow}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{product.category}</Text>
                </View>
                {product.rating && (
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>
                      ⭐ {product.rating.rate} ({product.rating.count} đánh giá)
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.title}>{product.title}</Text>

              <Text style={styles.price}>
                {(
                  Math.round(product.price * PRICE_MULTIPLIER)
                ).toLocaleString('vi-VN')}{' '}
                đ
              </Text>

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>Mô tả món</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          </ScrollView>

          {/* Thanh đặt hàng cố định dưới đáy */}
          <View style={styles.bottomBar}>
            <View>
              <Text style={styles.bottomLabel}>Giá tiền</Text>
              <Text style={styles.bottomPrice}>
                {(
                  Math.round(product.price * PRICE_MULTIPLIER)
                ).toLocaleString('vi-VN')}{' '}
                đ
              </Text>
            </View>

            <TouchableOpacity
              style={styles.orderButton}
              onPress={handleAddToCart}
              activeOpacity={0.8}
            >
              <Text style={styles.orderButtonText}>+ Thêm vào giỏ</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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
  },
  scrollContent: {
    paddingBottom: 24,
  },
  imageBox: {
    width: '100%',
    height: 280,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  ratingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    color: '#D97706',
    fontWeight: '600',
    fontSize: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 26,
    marginBottom: 12,
  },
  price: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 22,
  },
  bottomBar: {
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomLabel: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  bottomPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  orderButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.textLight,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
