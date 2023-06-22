import React, { useEffect, useState, useRef, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import colors from '../../constants/colors';
import getLocalizedText, { availableCountries } from '../../constants/getLocalizedText';
import CustomImageBackground from '../../components/CustomImageBackground';
import CustomSafeAreaFlatListWindow from '../../components/CustomSafeAreaFlatListWindow';
import values from '../../constants/values';
import CountryItem from '../../components/CountriesScreen/CountryItem';
import CountriesScreenListHeaderComponenet from '../../components/CountriesScreen/CountriesScreenListHeaderComponenet';

const CountriesScreen = props => {
  console.log('----Countries Screen rerendered----');

  // Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // Sorting available countries
  const sortedLocalizedAvailableCountries = useMemo(() => {
    const localizedAvailableCountries = availableCountries.map(availableCountry => ({ id: availableCountry, translated: appText.countries[availableCountry] }));
    const collator = new Intl.Collator(appLanguage);
    return localizedAvailableCountries.sort((a, b) => collator.compare(a.translated, b.translated));
  }, []);

  // Filtering countries by serch term from global state
  const [inputText, setInputText] = useState('');
  const filteredCountries = useMemo(() => {
    return inputText.trim().length > 0
      ? sortedLocalizedAvailableCountries.filter(country => country.translated.toLowerCase().includes(inputText.toLowerCase().trim()))
      : sortedLocalizedAvailableCountries;
  }, [inputText, sortedLocalizedAvailableCountries]);


  // On first render show country without fade in and sort them
  const firstRender = useRef(true);
  useEffect(() => {
    firstRender.current = false;
  }, [filteredCountries]);

  // ### Rendering FlatList components
  // const listHeaderComponentHeight = values.topMargin * 2 + values.headerBigIconSize + values.searchBarHeight;
  const listHeaderComponentHeightRef = useRef(0);
  const insets = useSafeAreaInsets();

  const renderItem = itemData => {
    return (
      <CountryItem
        id={itemData.item.id}
        appText={appText}
        index={itemData.index}
        navigation={props.navigation}
        firstRender={firstRender}
        settingsPicker={props.route.params?.settingsPicker}
      />
    );
  };

  const getItemLayout = (data, index) => {
    if (index < 0) return { length: 0, offset: 0, index };
    return {length: values.countryListItemHeight, offset: insets.top + listHeaderComponentHeightRef.current + values.countryListItemHeight * index, index};
  };

  const keyExtractor = item => item.id;
  // ##################################################

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
      <CustomSafeAreaFlatListWindow
        contentContainerStyle={styles.customSafeAreaFlatListWindowContentContainerStyle}
        ListHeaderComponent={
          <CountriesScreenListHeaderComponenet
            appText={appText}
            inputText={inputText}
            setInputText={setInputText}
            // listHeaderComponentHeight={listHeaderComponentHeight}
            listHeaderComponentHeightRef={listHeaderComponentHeightRef}
            noItemsAfterSearch={filteredCountries.length === 0}
            settingsPicker={props.route.params?.settingsPicker}
          />
        }
        data={filteredCountries}
        renderItem={renderItem}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={21}
        getItemLayout={getItemLayout}
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps={'always'}
        contentMinHeight={{ value: values.headerBigIconSize, useWindowHeight: true, useInsetsTop: true }}
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
  chooseCountry: {
    marginTop: values.topMargin,
    fontSize: values.headerTextSize,
  },
});

export default CountriesScreen;