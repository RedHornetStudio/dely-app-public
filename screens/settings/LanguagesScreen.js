import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import colors from '../../constants/colors';
import getLocalizedText, { availableLocalizations, languages } from '../../constants/getLocalizedText';
import CustomImageBackground from '../../components/CustomImageBackground';
import CustomSafeAreaFlatListWindow from '../../components/CustomSafeAreaFlatListWindow';
import values from '../../constants/values';
import LanguageItem from '../../components/LanguagesScreen/LanguageItem';
import LanguagesScreenListHeaderComponenet from '../../components/LanguagesScreen/LanguagesScreenListHeaderComponenet';
import LoadingModal from '../../components/LoadingModal';
import AboveMessage from '../../components/AboveMessage';

const LanguagesScreen = props => {
  console.log('----Languages Screenn rerendered----');

  // Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // Modals
  const [loadingModal, setLoadingModal] = useState(false);
  const [aboveMessage, setAboveMessage] = useState(false);

  const sortedAvailableLocalizationsInTwoLanguages = useMemo(() => {
    const availableLocalizationsInTwoLanguages = availableLocalizations.map(localization => ({ id: localization, english: languages[localization], translated: languages[localization + 'Translated'] }));
    const collator = new Intl.Collator(appLanguage);
    return availableLocalizationsInTwoLanguages.sort((a, b) => collator.compare(a.english, b.english));
  }, [appLanguage, appText, languages, availableLocalizations]);
  
  // Filtering countries by serch term from global state
  const [inputText, setInputText] = useState('');
  const filteredLocalizations = useMemo(() => {
    return inputText.trim().length > 0
    ? sortedAvailableLocalizationsInTwoLanguages.filter(localization => localization.english.toLowerCase().includes(inputText.toLowerCase().trim()) ||  localization.translated.toLowerCase().includes(inputText.toLowerCase().trim()))
    : sortedAvailableLocalizationsInTwoLanguages;
  }, [inputText, sortedAvailableLocalizationsInTwoLanguages]);

  // On first render show country without fade in and sort them
  const firstRender = useRef(true);
  useEffect(() => {
    firstRender.current = false;
  }, [filteredLocalizations]);

  // ### Rendering FlatList components
  // const listHeaderComponentHeight = values.topMargin * 2 + values.headerBigIconSize + values.searchBarHeight;
  const listHeaderComponentHeightRef = useRef(0);
  const insets = useSafeAreaInsets();

  const renderItem = itemData => {
    return (
      <LanguageItem
        id={itemData.item.id}
        languages={languages}
        index={itemData.index}
        navigation={props.navigation}
        firstRender={firstRender}
        setLoadingModal={setLoadingModal}
        setAboveMessage={setAboveMessage}
      />
    );
  };

  const getItemLayout = (data, index) => {
    if (index < 0) return { length: 0, offset: 0, index };
    return {length: values.languageListItemHeight, offset: insets.top + listHeaderComponentHeightRef.current + values.languageListItemHeight * index, index};
  };

  const keyExtractor = item => item.id;
  // #################################################3

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
      <CustomSafeAreaFlatListWindow
        contentContainerStyle={styles.customSafeAreaFlatListWindowContentContainerStyle}
        ListHeaderComponent={
          <LanguagesScreenListHeaderComponenet
            inputText={inputText}
            setInputText={setInputText}
            appText={appText}
            // listHeaderComponentHeight={listHeaderComponentHeight}
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
        contentMinHeight={{ value: values.headerBigIconSize, useWindowHeight: true, useInsetsTop: true }}
      />

      <LoadingModal
        visible={loadingModal}
      />
      <AboveMessage
        visible={aboveMessage}
        setModalVisibility={setAboveMessage}
        messageText={appText.somethingWentWrongAndTryLater}
        closeOnBackButtonPress={true}
        confirmButtonText={appText.confirm}
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