import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Shop
import MainScreen from '../screens/shop/MainScreen';
import ShopsScreen from '../screens/shop/ShopsScreen';
import LocationsScreen from '../screens/shop/LocationsScreen';
import ProductsScreen from '../screens/shop/ProductsScreen';
import ShopDetailsScreen from '../screens/shop/ShopDetailsScreen';
import ProductDetailsScreen from '../screens/shop/ProductDetailsScreen';
import CartScreen from '../screens/shop/CartScreen';
import AddressScreen from '../screens/shop/AddressScreen';
import OrderScreen from '../screens/shop/OrderScreen';
import OrderDetailsScreen from '../screens/shop/OrderDetailsScreen';

// Settings
import SettingsScreen from '../screens/settings/SettingsScreen';
import LanguagesScreen from '../screens/settings/LanguagesScreen';
import CountriesScreen from '../screens/settings/CountriesScreen';
import BusinessSettingsScreen from '../screens/settings/BusinessSettingsScreen';
import ChangePasswordScreen from '../screens/settings/ChangePasswordScreen';
import ChangeEmailScreen from '../screens/settings/ChangeEmailScreen';
import DeleteAccountScreen from '../screens/settings/DeleteAccountScreen';

// Admin
import BusinessSignUpScreen from '../screens/admin/BusinessSignUpScreen';
import BusinessSignInScreen from '../screens/admin/BusinessSignInScreen';
import AdminScreen from '../screens/admin/AdminScreen';
import EditShopScreen from '../screens/admin/EditShopScreen';
import AddProductScreen from '../screens/admin/AddProductScreen';
import AddOptionScreen from '../screens/admin/AddOptionScreen';
import AddLocationScreen from '../screens/admin/AddLocationScreen';
import OrdersScreen from '../screens/admin/OrdersScreen';
import OrderHistoryScreen from '../screens/shop/OrderHistoryScreen';
import UsersScreen from '../screens/admin/UsersScreen';
import AddUserScreen from '../screens/admin/AddUserScreen';
import ResetPasswordScreen from '../screens/admin/ResetPasswordScreen';

const MainStack = createNativeStackNavigator();

const MainStackNavigator = props => {
  const initialRouteName = props.country ? 'Main' : 'Countries';

  return (
    <MainStack.Navigator 
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <MainStack.Screen name="Main" component={MainScreen} />
      <MainStack.Screen name="Shops" component={ShopsScreen} />
      <MainStack.Screen name="Locations" component={LocationsScreen} />
      <MainStack.Screen name="Products" component={ProductsScreen} />
      <MainStack.Screen name="ShopDetails" component={ShopDetailsScreen} />
      <MainStack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <MainStack.Screen name="Cart" component={CartScreen} />
      <MainStack.Screen name="Address" component={AddressScreen} />
      <MainStack.Screen name="Order" component={OrderScreen} getId={({ params }) => params.orderId } />

      <MainStack.Screen name="Settings" component={SettingsScreen} />
      <MainStack.Screen name="Languages" component={LanguagesScreen} />
      <MainStack.Screen name="Countries" component={CountriesScreen} />
      <MainStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <MainStack.Screen name="ChangeEmail" component={ChangeEmailScreen} />
      <MainStack.Screen name="DeleteAccount" component={DeleteAccountScreen} />

      <MainStack.Screen name="BusinessSettings" component={BusinessSettingsScreen} />
      <MainStack.Screen name="BusinessSignUp" component={BusinessSignUpScreen} />
      <MainStack.Screen name="BusinessSignIn" component={BusinessSignInScreen} />
      <MainStack.Screen name="Admin" component={AdminScreen} />
      <MainStack.Screen name="EditShop" component={EditShopScreen} />
      <MainStack.Screen name="AddProduct" component={AddProductScreen} />
      <MainStack.Screen name="AddOption" component={AddOptionScreen} />
      <MainStack.Screen name="AddLocation" component={AddLocationScreen} />
      <MainStack.Screen name="Orders" component={OrdersScreen} getId={({ params }) => params.locationId } />
      <MainStack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <MainStack.Screen name="OrderHistory" component={OrderHistoryScreen} />
      <MainStack.Screen name="Users" component={UsersScreen} />
      <MainStack.Screen name="AddUser" component={AddUserScreen} />
      <MainStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </MainStack.Navigator>
  );
};

export default MainStackNavigator;