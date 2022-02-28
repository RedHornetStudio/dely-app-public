import React, { useEffect, useState, useRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import getLocalizedText from '../../constants/getLocalizedText';
import CustomImageBackground from '../../components/CustomImageBackground';
import CustomSafeAreaFlatListWindow from '../../components/CustomSafeAreaFlatListWindow';
import { headerBigIconSize } from '../../components/HeaderBigIcon';
import values from '../../constants/values';
import { availableCountries } from '../../constants/getLocalizedText';
import CountryItem from '../../components/CountriesScreen/CountryItem';
import CountriesScreenListHeaderComponenet from '../../components/CountriesScreen/CountriesScreenListHeaderComponenet';

const CountriesScreen = props => {
  console.log('----Countries Screenn rerendered----');

  // Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = getLocalizedText(appLanguage);

  // On first render show country without fade in and sort them
  const firstRender = useRef(true);
  useEffect(() => {
    firstRender.current = false;
  }, []);

  // Sorting available countries
  const sortedLocalizedAvailableCountries = useRef([]);
  if (firstRender.current) {
    const localizedAvailableCountries = availableCountries.map(availableCountry => ({ id: availableCountry, translated: appText.countries[availableCountry] }));
    localizedAvailableCountries.sort((a, b) => a.translated.localeCompare(b.translated, appLanguage));
    sortedLocalizedAvailableCountries.current = localizedAvailableCountries;
  }

  // Filtering countries by serch term from global state
  const [inputText, setInputText] = useState('');
  let filteredCountries = [];
  if (inputText.trim().length > 0) {
    filteredCountries = sortedLocalizedAvailableCountries.current.filter(country => country.translated.toLowerCase().includes(inputText.toLowerCase().trim()));
  } else {
    filteredCountries = sortedLocalizedAvailableCountries.current;
  }

  // Rendering FlatList components
  const listHeaderComponentHeightRef = useRef(0);
  const insets = useSafeAreaInsets();

  const renderItem = useCallback(itemData => {
    return (
      <CountryItem id={itemData.item.id} appText={appText} index={itemData.index} navigation={props.navigation} firstRender={firstRender} />
    );
  }, [props.navigation, appLanguage]);

  const getItemLayout = useCallback((data, index) => {
    if (index < 0) return { length: 0, offset: 0, index };
    return {length: values.countryListItemHeight, offset: insets.top + listHeaderComponentHeightRef.current + values.countryListItemHeight * index, index};
  }, []);

  const keyExtractor = useCallback(item => item.id, []);
  // --------------------------------------------

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor="rgba(0, 0, 0, 0.5)" />
      <CustomSafeAreaFlatListWindow
        contentContainerStyle={styles.customSafeAreaFlatListWindowContentContainerStyle}
        ListHeaderComponent={
          <CountriesScreenListHeaderComponenet
            appText={appText}
            inputText={inputText}
            setInputText={setInputText}
            listHeaderComponentHeightRef={listHeaderComponentHeightRef}
            noItemsAfterSearch={filteredCountries.length === 0}
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
  chooseCountry: {
    marginTop: values.topMargin,
    fontSize: values.headerTextSize,
  },
});

export default CountriesScreen;