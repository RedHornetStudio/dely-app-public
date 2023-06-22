import React, { useState, useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { getLocales } from 'expo-localization';
import { useCallback } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import * as Notifications from 'expo-notifications';
import mobileAds from 'react-native-google-mobile-ads';

import values from '../constants/values';
import MainStackNavigator from './MainStackNavigator';
import { appLanguageChanged, countryChanged } from '../features/appSettingsSlice';
import { favoriteShopsChanged } from '../features/favoriteShopsSlice';
import { businessUserSignIn } from '../features/authSlice';
import { ordresFiltersChanged } from '../features/ordersFiltersSlice';
import { ordersHistoryChanged } from '../features/ordersHistorySlice';
import { availableLocalizations } from '../constants/getLocalizedText';
import { contactInfoChanged } from '../features/contactInfoSlice';
import { initializationStatusChanged } from '../features/googleMobileAdsSlice';

// When a notification is received while the app is running,
// using this function you can set a callback that will decide whether the notification should be shown to the user or not
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// for getting notifications on Android
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
  });
}

SplashScreen.preventAutoHideAsync();

const AppRoot = props => {
  console.log('----App Root rerendered----');

  const dispatch = useDispatch();

  // // Initializing google mobile ads 
  // useEffect(() => {
  //   mobileAds()
  //     .initialize()
  //     .then(adapterStatuses => {
  //       dispatch(initializationStatusChanged(true));
  //     });
  // }, []);
  
  // ### Loading fonts
  let [fontsLoaded] = useFonts({
    'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
  });
  // #############################################

  // ### Loading settings
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [country, setCountry] = useState(null);

  useEffect(() => {
    (async () => {
      let country;
      let favoriteShops;
      let accessToken;
      let refreshToken;
      let appLanguage;
      let ordersFilters;
      let ordersHistory;
      let phoneNumber;
      let address;
      let doorCode;
      try {
        country = await AsyncStorage.getItem('@country');
        favoriteShops = await AsyncStorage.getItem('@favoriteShops');
        accessToken = await SecureStore.getItemAsync('accessToken');
        refreshToken = await SecureStore.getItemAsync('refreshToken');
        appLanguage = await AsyncStorage.getItem('@appLanguage');
        ordersFilters = await AsyncStorage.getItem('@ordersFilters');
        ordersHistory = await AsyncStorage.getItem('@ordersHistory');
        phoneNumber = await AsyncStorage.getItem('@phoneNumber');
        address = await AsyncStorage.getItem('@address');
        doorCode = await AsyncStorage.getItem('@doorCode');
      } catch (error) {
        console.log(`Error while loading settings on first app boot: ${error}`);
      }
      if (!appLanguage) {
        const deviceLanguage = getLocales()[0].languageCode;
        const language = availableLocalizations.indexOf(deviceLanguage) >= 0 ? deviceLanguage : 'en';
        await AsyncStorage.setItem('@appLanguage', language);
        appLanguage = language;
      }
      if (!ordersFilters) {
        await AsyncStorage.setItem('@ordersFilters', '["preparing", "ready"]');
      }
      if (country) dispatch(countryChanged(country));
      if (favoriteShops) dispatch(favoriteShopsChanged(favoriteShops));
      dispatch(businessUserSignIn({ accessToken: accessToken, refreshToken: refreshToken }));
      dispatch(appLanguageChanged(appLanguage));
      if (ordersFilters) dispatch(ordresFiltersChanged(ordersFilters));
      if (ordersHistory) dispatch(ordersHistoryChanged(ordersHistory));
      dispatch(contactInfoChanged({ phoneNumber: typeof phoneNumber === 'string' ? phoneNumber : '', address: typeof address === 'string' ? address : '', doorCode: typeof doorCode === 'string' ? doorCode : '' }));
      setCountry(country);
      setSettingsLoaded(true);
    })();
  }, []);
  // #######################################################3

  // ### Loading my own created splash screen and animating it
  const [splashScreenHidden, setSplashScreenHidden] = useState(false);
  const [splashAnimationComplete, setSplashAnimationComplete] = useState(false);

  const animatedOpacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
    }
  });

  const onImageLoaded = useCallback(async () => {
    try {
      await SplashScreen.hideAsync();
      setSplashScreenHidden(true);
    } catch (error) {
      console.log(error);
    }
  }, [setSplashScreenHidden]);

  const setSplashAnimationCompleteWrapper = useCallback(value => {
    setSplashAnimationComplete(value);
  }, [setSplashAnimationComplete]);

  useEffect(() => {
    if (splashScreenHidden) {
      animatedOpacity.value = withTiming(0, { duration: values.animationDuration }, () => runOnJS(setSplashAnimationCompleteWrapper)(true));
    }
  }, [splashScreenHidden])
  // ###########################################################3

  if (!fontsLoaded || !settingsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <MainStackNavigator country={country} />
      </NavigationContainer>
      {!splashAnimationComplete &&
        <Animated.View style={[styles.animatedSplashScreenContainer, animatedStyle]} pointerEvents="none" >
          <Image
            style={styles.animatedSplashScreenImage}
            source={require('../assets/dely-splash.png')}
            resizeMode="contain"
            fadeDuration={0}
            onLoadEnd={onImageLoaded} />
        </Animated.View>
      }
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  animatedSplashScreenContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#171717',
  },
  animatedSplashScreenImage: {
    width: '100%',
    height: '100%',
  },
});

export default AppRoot;