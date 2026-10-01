import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import { productApi, Product } from '@services/productApi';
import { ProductCard } from '@components/ProductCard';
import { Watermark } from '@components/Watermark';
import { useCartStore } from '@stores/cartStore';
import { useDebouncedValue } from '@hooks/useDebouncedValue';
import {
  STUDENT,
  DEBOUNCE_MS,
  STALE_TIME_MS,
  ROOM_LABEL,
  VARIANT,
} from '@constants/student';
import { COLORS } from '@constants/theme';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, DEBOUNCE_MS);

  const addToCart = useCartStore((state) => state.addToCart);

  // useQuery với staleTime: STALE_TIME_MS theo đúng yêu cầu đề bài
  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<Product[]>({
    queryKey: ['products', STUDENT.mssv],
    queryFn: productApi.getProducts,
    staleTime: STALE_TIME_MS,
  });

  // Lọc sản phẩm theo chuỗi đã debounce
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!debouncedSearch.trim()) return products;
    return products.filter((item) =>
      item.title.toLowerCase().includes(debouncedSearch.toLowerCase().trim())
    );
  }, [products, debouncedSearch]);

  const handleCardPress = (id: number) => {
    navigation.navigate('Detail', { id: String(id) });
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Watermark ở trên nếu VARIANT yêu cầu (số cuối chẵn) */}
      {VARIANT.watermarkAtTop && <Watermark />}

      <View style={styles.container}>
        {/* (A) Header KTXGO + Giao tận {ROOM_LABEL} */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandTitle}>KTXGO</Text>
            <View style={styles.roomBadge}>
              <Text style={styles.roomText}>📍 Giao tận {ROOM_LABEL}</Text>
            </View>
          </View>
        </View>

        {/* (B) Ô tìm kiếm controlled, filter theo chuỗi debounce */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={`Tìm món ăn, đồ dùng (Debounce ${DEBOUNCE_MS}ms)...`}
            placeholderTextColor={COLORS.textLight}
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Ba trạng thái mạng theo yêu cầu Câu 2b */}
        {isLoading ? (
          // Trạng thái 1: Đang tải
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Đang tải thực đơn KTXGo...</Text>
          </View>
        ) : isError ? (
          // Trạng thái 2: Lỗi mạng (có MSSV + Thử lại)
          <View style={styles.centerContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Lỗi kết nối mạng!</Text>
            <Text style={styles.errorMessage}>
              MSSV: {STUDENT.mssv} — {error?.message || 'Không thể tải dữ liệu sản phẩm.'}
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
              <Text style={styles.retryButtonText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Trạng thái 3: Có dữ liệu - FlashList 2 cột (không bọc trong ScrollView dọc)
          <View style={styles.listWrapper}>
            <FlashList<Product>
              data={filteredProducts}
              numColumns={2}
              {...({ estimatedItemSize: 260 } as any)}
              keyExtractor={(item: Product) => `${STUDENT.mssv}-${item.id}`}
              renderItem={({ item }: { item: Product }) => (
                <ProductCard
                  product={item}
                  onPress={() => handleCardPress(item.id)}
                  onAddToCart={() => handleAddToCart(item)}
                />
              )}
              refreshControl={
                <RefreshControl
                  refreshing={isRefetching}
                  onRefresh={() => {
                    refetch();
                  }}
                  colors={[COLORS.primary]}
                />
              }
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    Không tìm thấy món "{debouncedSearch}"
                  </Text>
                </View>
              }
            />
          </View>
        )}
      </View>

      {/* Watermark ở dưới đáy theo số cuối MSSV = 1 */}
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
    paddingHorizontal: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 0.8,
  },
  roomBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  roomText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 44,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    height: '100%',
  },
  clearIcon: {
    fontSize: 14,
    color: COLORS.textLight,
    padding: 4,
  },
  listWrapper: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.error,
    marginBottom: 6,
  },
  errorMessage: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 18,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
});
