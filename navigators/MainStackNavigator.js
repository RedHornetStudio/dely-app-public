import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Shop
import InitialCountriesScreen from '../screens/shop/InitialCountriesScreen';
import MainScreen from '../screens/shop/MainScreen';
import ShopsScreen from '../screens/shop/ShopsScreen';
import LocationsScreen from '../screens/shop/LocationsScreen';
import ProductsScreen from '../screens/shop/ProductsScreen';
import FavoritesScreen from '../screens/shop/FavoritesScreen';
import ShopDetailsScreen from '../screens/shop/ShopDetailsScreen';
import ProductDetailsScreen from '../screens/shop/ProductDetailsScreen';

// Settings
import SettingsScreen from '../screens/settings/SettingsScreen';
import LanguagesScreen from '../screens/settings/LanguagesScreen';
import CountriesScreen from '../screens/settings/CountriesScreen';

const MainStack = createNativeStackNavigator();

const MainStackNavigator = props => {
  const initialRouteName = props.country ? 'Main' : 'InitialCountries';

  return (
    <MainStack.Navigator 
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <MainStack.Screen name="InitialCountries" component={InitialCountriesScreen} />
      <MainStack.Screen name="Main" component={MainScreen} />
      <MainStack.Screen name="Shops" component={ShopsScreen} />
      <MainStack.Screen name="Locations" component={LocationsScreen} />
      <MainStack.Screen name="Products" component={ProductsScreen} />
      <MainStack.Screen name="Favorites" component={FavoritesScreen} />
      <MainStack.Screen name="ShopDetails" component={ShopDetailsScreen} />
      <MainStack.Screen name="ProductDetails" component={ProductDetailsScreen} />

      <MainStack.Screen name="Settings" component={SettingsScreen} />
      <MainStack.Screen name="Languages" component={LanguagesScreen} />
      <MainStack.Screen name="Countries" component={CountriesScreen} />
    </MainStack.Navigator>
  );
};

export default MainStackNavigator;