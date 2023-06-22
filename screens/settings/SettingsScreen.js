import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

import CustomImageBackground from '../../components/CustomImageBackground';
import CustomSafeAreaScrollViewWindow from '../../components/CustomSafeAreaScrollViewWindow';
import HeaderBigIcon from '../../components/HeaderBigIcon';
import values from '../../constants/values';
import getLocalizedText, { languages } from '../../constants/getLocalizedText';
import PressableListItem from '../../components/PressableListItem';
import colors from '../../constants/colors';
import RegularText from '../../components/RegularText';

const SettingsScreen = props => {
  console.log('----Settings Screen rerender----');

  // Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // Getting current country from global state
  const country = useSelector(state => state.appSettingsSlice.country);

  const onPressLanguagesHandler = () => {
    props.navigation.navigate('Languages');
  };

  const onPressCountriesHandler = () => {
    props.navigation.navigate('Countries', { settingsPicker: true });
  };

  const onPressBusinessAccountHandler = () => {
    props.navigation.navigate('BusinessSettings');
  };

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
      <CustomSafeAreaScrollViewWindow
        contentContainerStyle={styles.contentContainerStyle}
      >
        <HeaderBigIcon><Feather name="settings" size={values.headerBigIconSize} color={colors.primaryColor} /></HeaderBigIcon>
        <RegularText style={styles.settingsGroup}>{appText.settings}</RegularText>
        <PressableListItem onPress={onPressLanguagesHandler} settingTitle={appText.languageToChoose} currentSetting={languages[appLanguage + 'Translated']} />
        <PressableListItem onPress={onPressCountriesHandler} settingTitle={appText.countryToChoose} currentSetting={appText.countries[country]} />
        <RegularText style={styles.settingsGroup}>{appText.businessAccount}</RegularText>
        <PressableListItem onPress={onPressBusinessAccountHandler} settingTitle={appText.goToBusinessSettings} />
      </CustomSafeAreaScrollViewWindow>
    </View>
  );
};

const styles = StyleSheet.create({
  // ----Screen----
  screen: {
    flex: 1,
  },
  contentContainerStyle: {
    paddingHorizontal: values.windowHorizontalPadding,
    paddingBottom: values.topMargin,
  },
  settingsGroup: {
    marginTop: values.topMargin,
    marginLeft: values.windowHorizontalPadding,
    fontSize: values.headerTextSize,
  },
});

export default SettingsScreen;