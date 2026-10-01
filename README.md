# TRAN GIA HUY — 23699081 — https://github.com/TranGiaHuy1304/23699081_TH2.git — #145479 — Số cuối: 1 — VARIANT: [Watermark: Dưới | Login: phone | Tab: Shop→Giỏ→Tôi | Haptic: selection | Phí: B | Detail: card]

## BÀI THI THỰC HÀNH 2: ỨNG DỤNG KTXGo
- **Môn thi**: Lập trình cho thiết bị di động (TH)
- **Họ và tên thí sinh**: TRẦN GIA HUY
- **MSSV**: 23699081
- **Phòng KTX giao hàng**: P.181
- **Mã kiểm tra (Exam Stamp)**: #145479

---

### Bảng thông số cấu hình định danh theo MSSV (23699081):
| Thông số | Giá trị tính toán | Giải thích công thức |
| :--- | :--- | :--- |
| **LAST_DIGIT** | `1` | Chữ số cuối cùng của MSSV 23699081 |
| **STUDENT_SEED** | `81` | 3 chữ số cuối `081` chuyển thành số nguyên |
| **DEBOUNCE_MS** | `400 ms` | `300 + (81 % 5) * 100` |
| **STALE_TIME_MS** | `11,000 ms` | `10_000 + (81 % 20) * 1000` |
| **PRICE_MULTIPLIER** | `15,500` | `15000 + (81 % 40) * 500` |
| **BASE_SHIP_FEE** | `9,000 đ` | `8000 + (81 % 10) * 1000` |
| **ROOM_LABEL** | `P.181` | `P.${100 + (81 % 400)}` |
| **Watermark** | **Dưới** | `LAST_DIGIT % 2 === 0` = false |
| **Ô Login** | **phone** | Số cuối lẻ = 'phone' |
| **Thứ tự Tab** | **Shop → Giỏ → Tôi** | `LAST_DIGIT < 5` = 'shopFirst' |
| **Haptic khi thêm** | **selection** | `LAST_DIGIT % 3 === 0` = false |
| **Công thức Phí Ship** | **Công thức B** | `BASE_SHIP_FEE + Math.round(km * 1500) + 2000` |
| **Detail Presentation**| **card** | `LAST_DIGIT < 5` = 'card' |
| **Persist Key Giỏ** | `ktxgo-cart-23699081` | `ktxgo-cart-${mssv}` |

---

### Danh sách các câu hỏi đã hoàn thiện:

#### Câu 1: (3.0 điểm) — Navigation & Định danh
- Cấu trúc thư mục chuẩn `KTXGo_23699081` với 7 Path Alias: `@screens`, `@components`, `@constants`, `@services`, `@stores`, `@hooks`, `@navigation`.
- `student.ts` cấu hình đầy đủ thông tin định danh, seed, stamp và các hằng số.
- Màn `LoginScreen` với ô nhập số điện thoại (`phone`), nút "Vào cửa hàng" sinh token `ktxgo-23699081-145479`.
- `RootNavigator` chuyển hướng tự động giữa `AuthStack` và `MainTabs` theo token.
- `MainTabs` sắp xếp theo thứ tự `Shop → Giỏ → Tôi`, có badge hiển thị tổng số lượng món trong giỏ hàng.
- Dòng Watermark định danh `TH2 · 23699081 · TRAN GIA HUY · #145479` xuất hiện ở dưới đáy mọi màn hình.

#### Câu 2: (3.0 điểm) — FlashList 2 cột & TanStack Query + Axios
- `apiClient.ts` sử dụng Axios instance với Interceptor tự động gắn header `X-Student-Id: 23699081`.
- `productApi.ts` lấy danh sách 12 món ăn/sản phẩm từ `https://fakestoreapi.com/products?limit=12`.
- `HomeScreen.tsx` tích hợp `FlashList` lưới 2 cột (`numColumns={2}`, `estimatedItemSize={260}`, key ghép `${STUDENT.mssv}-${item.id}`).
- Ô tìm kiếm hỗ trợ debounce `400ms` thông qua hook `useDebouncedValue`.
- Đầy đủ 3 trạng thái mạng: Đang tải (ActivityIndicator), Lỗi mạng (hiển thị MSSV + nút Thử lại), và Dữ liệu sản phẩm (kèm Pull-to-refresh).

#### Câu 3: (4.0 điểm) — Zustand Cart Persist & Quyền Location / Haptic
- `cartStore.ts` bằng Zustand kết hợp `persist` qua AsyncStorage với key `ktxgo-cart-23699081`.
- Haptic rung phản hồi `selection` khi bấm nút `+` ở màn Home hoặc "Thêm vào giỏ" ở màn Detail. Màn Detail hiển thị Alert kèm MSSV.
- `CartScreen.tsx` hiển thị đầy đủ số lượng, tăng giảm món, xoá món, thông tin phòng `P.181`, tạm tính, phí ship và tổng tiền.
- Hook `useCampusLocation.ts` xử lý đủ 3 trạng thái quyền Location: Granted, Denied, Blocked (có nút mở Cài đặt `Linking.openSettings()`).
- Tự động tính khoảng cách Haversine đến Cổng KTX và tính phí ship theo **Công thức B** (Phí cơ bản 9.000đ). Phí ship phản ánh trực tiếp ở cả Tab Tôi và Tab Giỏ hàng.
- Nút "Đăng xuất" ở Tab Tôi xoá token và đưa người dùng về màn Login.

---

### Hướng dẫn chạy ứng dụng:
1. Chạy Metro Bundler:
   ```bash
   npm start
   ```
2. Chạy ứng dụng trên Android:
   ```bash
   npm run android
   ```
3. Chạy ứng dụng trên iOS:
   ```bash
   npm run ios
   ```
