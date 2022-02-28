import React, { useEffect, useState, useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';

import getLocalizedText from '../../constants/getLocalizedText';
import CustomImageBackground from '../../components/CustomImageBackground';
import { headerBigIconSize } from '../../components/HeaderBigIcon';
import CustomSafeAreaFlatListWindow from '../../components/CustomSafeAreaFlatListWindow';
import ShopTile from '../../components/ShopsScreen/ShopTile';
import values from '../../constants/values';
import FavoritesScreenListHeaderComponent from '../../components/FavoritesScreen/FavoritesScreenListHeaderComponent';

// ----Database simulation----
import shopsDataInDatabase from '../../data/shopsDataInDatabase';

const FavoritesScreen = props => {
  console.log('----Favorites Screen rerendered----')

  // Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = getLocalizedText(appLanguage);

  // Getting current country from global state
  const country = useSelector(state => state.appSettingsSlice.country);

  // Getting favorite shop from global state
  const favoriteShopsString = useSelector(state => state.favoriteShopsSlice.favoriteShops);
  const favoriteShops = JSON.parse(favoriteShopsString);

  // ----Loading shops data from data base----
  const [shopsData, setShopsData] = useState([]);
  const [loadingErrorIndicatorState, setLoadingErrorIndicatorState] = useState({
    noItems: true,
    loading: true,
    loadingError: false,
  });

  useEffect(() => {
    // let controller;
    // (async () => {
    //   try {
    //     controller = new AbortController();
    //     const response = await axios.post('http://example.com/getFavoriteShops.php', { country: country, favoriteShops: favoriteShopsString }, { signal: controller.signal });
    //     response.data.sort((a, b) => a.title.localeCompare(b.title, appLanguage));
    //     setShopsData(response.data);
    //     setLoadingErrorIndicatorState({
    //       noItems: response.data.length === 0,
    //       loading: false,
    //       loadingError: false,
    //     });
    //   } catch (error) {
    //     console.log(`Error while loading shops from database: ${error.message}`);
    //     if (error.message !== 'canceled') {
    //       setLoadingErrorIndicatorState({
    //         noItems: true,
    //         loading: false,
    //         loadingError: true,
    //       });
    //     }
    //   }
    // })();

    // return () => {
    //   if (controller) controller.abort();
    // };

    const myTimeout = setTimeout(() => {
      const shopsDataFilteredByCountry = shopsDataInDatabase.filter(shopData => shopData.country === country && favoriteShops.indexOf(shopData.id) >= 0);
      shopsDataFilteredByCountry.sort((a, b) => a.title.localeCompare(b.title, appLanguage));
      setShopsData(shopsDataFilteredByCountry);
      setLoadingErrorIndicatorState({
        noItems: shopsDataFilteredByCountry.length === 0,
        loading: false,
        loadingError: false,
      });
    }, 400);

    return () => {
      clearTimeout(myTimeout);
    };
  }, [favoriteShopsString]);
  // --------------------------------------------

  // Filtering shops by search term
  const [inputText, setInputText] = useState('');
  let filteredShopsData = [];
  if (inputText.trim().length > 0) {
    filteredShopsData = shopsData.filter(shopData => shopData.title.toLowerCase().includes(inputText.toLowerCase().trim()));
  } else {
    filteredShopsData = shopsData;
  }

  // // Clearing textInput when navigating to new screen
  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener('transitionEnd', (e) => {
  //     setInputText('');
  //   });
  
  //   return unsubscribe;
  // }, [props.navigation]);

  // Rendering FlatList components
  const listHeaderComponentHeightRef = useRef(0);
  const insets = useSafeAreaInsets();

  const renderItem = useCallback(itemData => {
    return (
      <ShopTile
        onPress={() => {
          props.navigation.navigate('Locations', { shopId: itemData.item.id, shopTitle: itemData.item.title, shopImageUrl: itemData.item.imageUrl });
        }}
        title={itemData.item.title}
        imageUrl={itemData.item.imageUrl}
        index={itemData.index}
        navigation={props.navigation}
      />
    );
  }, [props.navigation])

  const getItemLayout = useCallback((data, index) => {
    if (index < 0) return { length: 0, offset: 0, index };
    return {length: values.shopTileHeight, offset: insets.top + listHeaderComponentHeightRef.current + values.topMargin * (index + 1) + values.shopTileHeight * index, index};
  }, []);

  const keyExtractor = useCallback(item => item.id, []);
  // --------------------------------------------

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor="rgba(0, 0, 0, 0.5)" />
      <CustomSafeAreaFlatListWindow
        contentContainerStyle={styles.customSafeAreaFlatListWindowContentContainerStyle}
        ListHeaderComponent={
          <FavoritesScreenListHeaderComponent
            inputText={inputText}
            setInputText={setInputText}
            loadingErrorIndicatorState={loadingErrorIndicatorState}
            filteredShopsData={filteredShopsData}
            appText={appText}
            listHeaderComponentHeightRef={listHeaderComponentHeightRef}
          />
        }
        data={filteredShopsData}
        renderItem={renderItem}
        initialNumToRender={6}
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
  // ----Loading----
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: values.headerTextSize,
  },
  errorIcon: {
    alignSelf: 'center',
  },
});

export default FavoritesScreen;