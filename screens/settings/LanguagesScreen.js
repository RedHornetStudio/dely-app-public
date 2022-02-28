import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import getLocalizedText, { availableLocalizations, languages } from '../../constants/getLocalizedText';
import CustomImageBackground from '../../components/CustomImageBackground';
import CustomSafeAreaFlatListWindow from '../../components/CustomSafeAreaFlatListWindow';
import { headerBigIconSize } from '../../components/HeaderBigIcon'
import values from '../../constants/values';
import LanguageItem from '../../components/LanguagesScreen/LanguageItem';
import LanguagesScreenListHeaderComponenet from '../../components/LanguagesScreen/LanguagesScreenListHeaderComponenet';

const LanguagesScreen = props => {
  console.log('----Languages Screenn rerendered----');

  // Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = getLocalizedText(appLanguage);

  // On first render show language without fade in and sort them
  const firstRender = useRef(true);
  useEffect(() => {
    firstRender.current = false;
  }, []);

  // Sorting available countries
  const sortedAvailableLocalizationsInTwoLanguages = useRef([]);
  if (firstRender.current) {
    const availableLocalizationsInTwoLanguages = availableLocalizations.map(localization => ({ id: localization, english: languages[localization], translated: languages[localization + 'Translated'] }));
    availableLocalizationsInTwoLanguages.sort((a, b) => a.english.localeCompare(b.english, appLanguage));
    sortedAvailableLocalizationsInTwoLanguages.current = availableLocalizationsInTwoLanguages;
  }
  
  // Filtering countries by serch term from global state
  const [inputText, setInputText] = useState('');
  let filteredLocalizations = [];
  if (inputText.trim().length > 0) {
    filteredLocalizations = sortedAvailableLocalizationsInTwoLanguages.current.filter(localization => localization.english.toLowerCase().includes(inputText.toLowerCase().trim()) ||  localization.translated.toLowerCase().includes(inputText.toLowerCase().trim()));
  } else {
    filteredLocalizations = sortedAvailableLocalizationsInTwoLanguages.current;
  }

  // Rendering FlatList components
  const listHeaderComponentHeightRef = useRef(0);
  const insets = useSafeAreaInsets();

  const renderItem = useCallback(itemData => {
    return (
      <LanguageItem id={itemData.item.id} languages={languages} index={itemData.index} navigation={props.navigation} firstRender={firstRender} />
    );
  }, [props.navigation]);

  const getItemLayout = useCallback((data, index) => {
    if (index < 0) return { length: 0, offset: 0, index };
    return {length: values.languageListItemHeight, offset: insets.top + listHeaderComponentHeightRef.current + values.languageListItemHeight * index, index};
  }, []);

  const keyExtractor = useCallback(item => item.id, []);
  // --------------------------------------------

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor="rgba(0, 0, 0, 0.5)" />
      <CustomSafeAreaFlatListWindow
        contentContainerStyle={styles.customSafeAreaFlatListWindowContentContainerStyle}
        ListHeaderComponent={
          <LanguagesScreenListHeaderComponenet
            inputText={inputText}
            setInputText={setInputText}
            appText={appText}
            listHeaderComponentHeightRef={listHeaderComponentHeightRef}
            noItemsAfterSearch={filteredLocalizations.length === 0}
          />
        }
        data={filteredLocalizations}
        renderItem={renderItem}
        initialNumToRender={12}
        maxToRenderPerBatch={10}
        windowSize={21}
        getItemLayout={getItemLayout}
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps={'always'}
        contentMinHeight={{ value: headerBigIconSize + values.topMargin + 1, plusWindowHeight: true }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // ----Screen----
  screen: {
    flex: 1,
  },
  customSafeAreaFlatListWindowContentContainerStyle: {
    paddingHorizontal: values.windowHorizontalPadding,
    paddingBottom: values.topMargin,
  },
  chooseLanguage: {
    marginTop: values.topMargin,
    fontSize: values.headerTextSize,
  },
});

export default LanguagesScreen;