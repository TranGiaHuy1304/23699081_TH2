import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ShopStack } from './ShopStack';
import { CartScreen } from '@screens/CartScreen';
import { MeScreen } from '@screens/MeScreen';
import { useCartStore } from '@stores/cartStore';
import { VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';

export type MainTabsParamList = {
  ShopTab: undefined;
  CartTab: undefined;
  MeTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export const MainTabs: React.FC = () => {
  const totalQuantity = useCartStore((state) => state.getTotalQuantity());

  // Định nghĩa các tab riêng biệt
  const shopTabScreen = (
    <Tab.Screen
      key="shopTab"
      name="ShopTab"
      component={ShopStack}
      options={{
        title: 'Cửa hàng',
        headerShown: false,
        tabBarIcon: ({ color }) => (
          <Text style={{ fontSize: 20, color }}>🏪</Text>
        ),
      }}
    />
  );

  const cartTabScreen = (
    <Tab.Screen
      key="cartTab"
      name="CartTab"
      component={CartScreen}
      options={{
        title: 'Giỏ hàng',
        headerShown: false,
        tabBarBadge: totalQuantity > 0 ? totalQuantity : undefined,
        tabBarBadgeStyle: {
          backgroundColor: COLORS.secondary,
          color: '#FFFFFF',
          fontSize: 11,
          fontWeight: 'bold',
        },
        tabBarIcon: ({ color }) => (
          <Text style={{ fontSize: 20, color }}>🛒</Text>
        ),
      }}
    />
  );

  const meTabScreen = (
    <Tab.Screen
      key="meTab"
      name="MeTab"
      component={MeScreen}
      options={{
        title: 'Tôi',
        headerShown: false,
        tabBarIcon: ({ color }) => (
          <Text style={{ fontSize: 20, color }}>👤</Text>
        ),
      }}
    />
  );

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      {/* Thứ tự Tab theo VARIANT:
          - shopFirst (MSSV < 5): Shop → Giỏ → Tôi
          - cartFirst (MSSV >= 5): Giỏ → Shop → Tôi
      */}
      {VARIANT.tabOrder === 'shopFirst' ? (
        <>
          {shopTabScreen}
          {cartTabScreen}
          {meTabScreen}
        </>
      ) : (
        <>
          {cartTabScreen}
          {shopTabScreen}
          {meTabScreen}
        </>
      )}
    </Tab.Navigator>
  );
};
