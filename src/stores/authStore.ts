import { create } from 'zustand';
import { STUDENT, examStamp } from '@constants/student';

interface AuthState {
  token: string | null;
  phoneNumber: string;
  login: (phone: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  phoneNumber: '',
  login: (phone: string) => {
    // Lưu token giả theo định dạng yêu cầu: ktxgo-{mssv}-{stamp}
    const token = `ktxgo-${STUDENT.mssv}-${examStamp()}`;
    set({ token, phoneNumber: phone });
  },
  logout: () => {
    set({ token: null, phoneNumber: '' });
  },
}));
