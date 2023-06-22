import React, { useEffect, useState, useRef, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

import colors from '../../constants/colors';
import getLocalizedText from '../../constants/getLocalizedText';
import CustomImageBackground from '../../components/CustomImageBackground';
import CustomSafeAreaFlatListWindow from '../../components/CustomSafeAreaFlatListWindow';
import ShopTile from '../../components/ShopsScreen/ShopTile';
import values from '../../constants/values';
import ShopsScreenListHeaderComponent from '../../components/ShopsScreen/ShopsScreenListHeaderComponent';
import { concatErrors } from '../../shared/sharedFunctions';

const ShopsScreen = props => {
  console.log('----Shops Screen rerendered----');

  // ### Interstitial ad loading and showing
  const interstitialRef = useRef(InterstitialAd.createForAdRequest(values.shopsScreenInterstitial));
  const adIsInitialized = useSelector(state => state.googleMobileAdsSlice.adIsInitialized);
  // Loading interstitial (ad) when ads are initialized
  useEffect(() => {
    if (!adIsInitialized) return;
    const unsubscribe = interstitialRef.current.addAdEventListener(AdEventType.LOADED, () => {
      interstitialRef.current.show();
    });
    // Start loading the interstitial straight away
    interstitialRef.current.load();
    // Unsubscribe from events on unmount
    return unsubscribe;
  }, [adIsInitialized]);
  // ###########################################

  // ### Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // ### Getting current country from global state
  const country = useSelector(state => state.appSettingsSlice.country);

  // ### Getting favorite shop from global state
  const favoriteShopsString = useSelector(state => state.favoriteShopsSlice.favoriteShops);
  const favoriteShops = useMemo(() => {
    return JSON.parse(favoriteShopsString);
  }, [favoriteShopsString]);

  // ### Loading shops data from data base
  const [shopsData, setShopsData] = useState([]);
  const [loadingErrorIndicatorState, setLoadingErrorIndicatorState] = useState({
    noItems: true,
    loading: true,
    loadingError: false,
  });

  useEffect(() => {
    let controller = new AbortController();
    (async () => {
      try {
        const res = props.route.params?.filterFavorites
          ? (await axios.post(`${values.requestUrl}getFavoriteShops`, { country: country, favoriteShops: favoriteShops }, { signal: controller.signal })).data
          : (await axios.post(`${values.requestUrl}getShops`, { country: country }, { signal: controller.signal })).data
        if (res.status === 'FAILED') throw new Error(concatErrors(res.errors));
        const collator = new Intl.Collator(appLanguage);
        res.data.sort((a, b) => collator.compare(a.title, b.title));
        setLoadingErrorIndicatorState({
          noItems: res.data.length === 0,
          loading: false,
          loadingError: false,
        });
        setShopsData(res.data);
      } catch (error) {
        console.log(`Error while loading shops from database: ${error.message}`);
        if (error.message !== 'canceled') {
          setShopsData([]);
          setLoadingErrorIndicatorState({
            noItems: true,
            loading: false,
            loadingError: true,
          });
        }
      }
    })();

    return () => {
      if (controller) controller.abort();
    };
  }, [favoriteShops, props.route.params?.filterFavorites, appLanguage, country]);
  // ##################################

  // ### Filtering shops by search term
  const [inputText, setInputText] = useState('');
  const filteredShopsData = useMemo(() => {
    return inputText.trim().length > 0
      ? shopsData.filter(shopData => shopData.title.toLowerCase().includes(inputText.toLowerCase().trim()))
      : shopsData;
  }, [inputText, shopsData]);

  // ### Rendering FlatList components
  // const listHeaderComponentHeight = values.topMargin * 3 + values.headerBigIconSize + values.headerTextSize + values.searchBarHeight;
  const listHeaderComponentHeightRef = useRef(0);
  const insets = useSafeAreaInsets();

  const renderItem = itemData => {
    return (
      <ShopTile
        shopId={itemData.item.id}
        title={itemData.item.title}
        description={itemData.item.description}
        imageUrl={itemData.item.image_url}
        currency={itemData.item.currency}
        index={itemData.index}
        navigation={props.navigation}
      />
    );
  };

  const getItemLayout = (data, index) => {
    if (index < 0) return { length: 0, offset: 0, index };
    return {length: values.shopTileHeight, offset: insets.top + listHeaderComponentHeightRef.current + values.topMargin * (index + 1) + values.shopTileHeight * index, index};
  };

  const keyExtractor = item => item.id;
  // ###########################

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
      <CustomSafeAreaFlatListWindow
        contentContainerStyle={styles.customSafeAreaFlatListWindowContentContainerStyle}
        ListHeaderComponent={
          <ShopsScreenListHeaderComponent
            inputText={inputText}
            setInputText={setInputText}
            loadingErrorIndicatorState={loadingErrorIndicatorState}
            filteredShopsData={filteredShopsData}
            appText={appText}
            filterFavorites={props.route.params?.filterFavorites}
            // listHeaderComponentHeight={listHeaderComponentHeight}
            listHeaderComponentHeightRef={listHeaderComponentHeightRef}
            navigation={props.navigation}
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
        contentMinHeight={{ value: values.headerBigIconSize + values.topMargin + 1, useWindowHeight: true, useInsetsTop: true }}
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
});

export default ShopsScreen;