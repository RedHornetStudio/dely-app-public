import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

import CustomImageBackground from '../../components/CustomImageBackground';
import CustomSafeAreaScrollViewWindow from '../../components/CustomSafeAreaScrollViewWindow';
import HeaderBigIcon, { headerBigIconSize, headerBigIconColor } from '../../components/HeaderBigIcon';
import values from '../../constants/values';
import getLocalizedText, { languages } from '../../constants/getLocalizedText';
import SettingsListItem from '../../components/SettingsScreen/SettingsListItem';

const SettingsScreen = props => {
  console.log('----Settings Screen rerender');

  // Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = getLocalizedText(appLanguage);

  // Getting current country from global state
  const country = useSelector(state => state.appSettingsSlice.country);

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor="rgba(0, 0, 0, 0.5)" />
      <CustomSafeAreaScrollViewWindow
        windowStyle={styles.windowStyle}
      >
        <HeaderBigIcon><Feather name="settings" size={headerBigIconSize} color={headerBigIconColor} /></HeaderBigIcon>
        <SettingsListItem onPress={() => props.navigation.navigate('Languages')} settingTitle={appText.languageToChoose} currentSetting={languages[appLanguage + 'Translated']} />
        <SettingsListItem onPress={() => props.navigation.navigate('Countries')} settingTitle={appText.countryToChoose} currentSetting={appText.countries[country]} />
      </CustomSafeAreaScrollViewWindow>
    </View>
  );
};

const styles = StyleSheet.create({
  // ----Screen----
  screen: {
    flex: 1,
  },
  windowStyle: {
    paddingHorizontal: values.windowHorizontalPadding,
    paddingBottom: values.topMargin,
  },
});

export default SettingsScreen;