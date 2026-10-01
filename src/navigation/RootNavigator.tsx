import React from 'react';
import { useAuthStore } from '@stores/authStore';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';

export const RootNavigator: React.FC = () => {
  const token = useAuthStore((state) => state.token);

  // Chưa có token Zustand -> chỉ thấy AuthStack (Login).
  // Đã có token -> vào MainTabs.
  if (!token) {
    return <AuthStack />;
  }

  return <MainTabs />;
};
