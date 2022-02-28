import React, { useState, useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { useCallback } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';

import values from '../constants/values';
import MainStackNavigator from './MainStackNavigator';
import { appLanguageChanged, countryChanged } from '../features/appSettingsSlice';
import { favoriteShopsChanged } from '../features/favoriteShopsSlice';
import { availableLocalizations } from '../constants/getLocalizedText';

const AppRoot = props => {
  console.log('----App Root rerendered----');
  
  // Loading fonts
  let [fontsLoaded] = useFonts({
    'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
  });
  // --------------------------------------------

  // Loading settings
  const dispatch = useDispatch();

  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [country, setCountry] = useState(null);

  useEffect(() => {
    (async () => {
      const deviceLanguage = Localization.locale.slice(0, 2);
      const language = availableLocalizations.indexOf(deviceLanguage) >= 0 ? deviceLanguage : 'en';
      let country;
      let favoriteShops;
      let appLanguage;
      try {
        favoriteShops = await AsyncStorage.getItem('@favoriteShops');
        country = await AsyncStorage.getItem('@country');
        appLanguage = await AsyncStorage.getItem('@appLanguage');
        if (!appLanguage) {
          await AsyncStorage.setItem('@appLanguage', language);
          appLanguage = language;
        }
      } catch (error) {
        appLanguage = language;
        console.log(`Error while loading settings on first app boot: ${error}`);
      }
      if (country) dispatch(countryChanged(country));
      if (favoriteShops) dispatch(favoriteShopsChanged(favoriteShops));
      dispatch(appLanguageChanged(appLanguage));
      setCountry(country);
      setSettingsLoaded(true);
    })();
  }, []);
  // --------------------------------------------

  // Loading my own created splash screen and animating it
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
  }, []);

  useEffect(() => {
    if (splashScreenHidden) {
      animatedOpacity.value = withTiming(0, { duration: values.animationDuration }, () => runOnJS(setSplashAnimationComplete)(true));
    }
  }, [splashScreenHidden])
  // --------------------------------------------

  if (!fontsLoaded || !settingsLoaded) {
    return <AppLoading autoHideSplash={false} />
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
      <StatusBar style="light" backgroundColor="#00000000" translucent={true} />
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