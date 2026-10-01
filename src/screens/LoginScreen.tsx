import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@stores/authStore';
import { STUDENT, VARIANT, ROOM_LABEL } from '@constants/student';
import { COLORS } from '@constants/theme';
import { Watermark } from '@components/Watermark';

export const LoginScreen: React.FC = () => {
  const [phone, setPhone] = useState('');
  const login = useAuthStore((state) => state.login);

  const handleLogin = () => {
    if (!phone.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập số điện thoại sinh viên để tiếp tục!');
      return;
    }
    // Đăng nhập lưu token giả ktxgo-{mssv}-{stamp}
    login(phone.trim());
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <View style={styles.container}>
          {/* Header biểu tượng và tên ứng dụng KTXGo */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoIcon}>📦</Text>
            </View>
            <Text style={styles.title}>KTXGo</Text>
            <Text style={styles.subtitle}>
              Dịch vụ giao đồ tận phòng KTX · {ROOM_LABEL}
            </Text>
          </View>

          {/* Form đăng nhập */}
          <View style={styles.card}>
            <Text style={styles.formTitle}>Đăng nhập sinh viên</Text>
            <Text style={styles.label}>
              {VARIANT.authField === 'phone' ? 'Số điện thoại' : 'Email'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={
                VARIANT.authField === 'phone'
                  ? 'Nhập số điện thoại (vd: 0912345678)'
                  : 'Nhập địa chỉ email'
              }
              placeholderTextColor={COLORS.textLight}
              value={phone}
              onChangeText={setPhone}
              keyboardType={
                VARIANT.authField === 'phone' ? 'phone-pad' : 'email-address'
              }
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>Vào cửa hàng</Text>
            </TouchableOpacity>

            <View style={styles.noteBox}>
              <Text style={styles.noteText}>
                MSSV: {STUDENT.mssv} — {STUDENT.hoTen}
              </Text>
              <Text style={styles.subNoteText}>
                Biến thể: Ô đăng nhập [{VARIANT.authField.toUpperCase()}]
              </Text>
            </View>
          </View>
        </View>

        {/* Watermark ở dưới đáy theo số cuối MSSV = 1 */}
        {!VARIANT.watermarkAtTop && <Watermark />}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  logoIcon: {
    fontSize: 36,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 18,
    textAlign: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: '#F8FAFC',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  noteBox: {
    marginTop: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
  },
  noteText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  subNoteText: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
});
