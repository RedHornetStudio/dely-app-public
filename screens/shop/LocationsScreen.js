import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';

import getLocalizedText from '../../constants/getLocalizedText';
import CustomImageBackground from '../../components/CustomImageBackground';
import CustomSafeAreaFlatListWindow from '../../components/CustomSafeAreaFlatListWindow';
import values from '../../constants/values';
import LocationListItem from '../../components/LocationsScreen/LocationsListItem';
import { headerBigIconSize } from '../../components/HeaderBigIcon';
import LocationsScreenListHeaderComponent from '../../components/LocationsScreen/LocationsScreenListHeaderComponenet';

// ----Database simulation----
import locationsDataInDatabase from '../../data/locationsDataInDatabase';

const LocationsScreen = props => {
  console.log('----Locations Screen rerendered----');

  // Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = getLocalizedText(appLanguage);

  // ----Loading shops data from data base----
  const [locationsData, setLocationsData] = useState([]);
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
    //     const response = await axios.post('http://example.com/getLocations.php', { shopId: props.route.params.shopId }, { signal: controller.signal });
    //     response.data.sort((a, b) => `${a.city}, ${a.address}`.localeCompare(`${b.city}, ${b.address}`, appLanguage));
    //     setLocationsData(response.data);
    //     setLoadingErrorIndicatorState({
    //       noItems: response.data.length === 0,
    //       loading: false,
    //       loadingError: false,
    //     });
    //   } catch (error) {
    //     console.log(`Error while loading locations from database: ${error.message}`);
    //     if (error.message !== 'canceled') {
    //       setLocationsData([]);
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
      const locationsDataFilteredByShop = locationsDataInDatabase.filter(locationsData => locationsData.shopId === props.route.params.shopId);
      locationsDataFilteredByShop.sort((a, b) => `${a.city}, ${a.address}`.localeCompare(`${b.city}, ${b.address}`, appLanguage));
      setLocationsData(locationsDataFilteredByShop);
      setLoadingErrorIndicatorState({
        noItems: locationsDataFilteredByShop.length === 0,
        loading: false,
        loadingError: false,
      });
    }, 400);

    return () => {
      clearTimeout(myTimeout);
    };
  }, []);
  // --------------------------------------------

  // Filtering locations by search term
  const [inputText, setInputText] = useState('');
  let filteredShopLocationsData = [];
  if (inputText.trim().length > 0) {
    filteredShopLocationsData = locationsData.filter(location => `${location.city}, ${location.address}`.toLowerCase().includes(inputText.toLowerCase().trim()));
  } else {
    filteredShopLocationsData = locationsData;
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
      <LocationListItem 
        style={styles.locationListItem} 
        onPress={() => {
          props.navigation.navigate('Products', { shopId: props.route.params.shopId, shopTitle: props.route.params.shopTitle, shopImageUrl: props.route.params.shopImageUrl, locationCity: itemData.item.city, locationAddress: itemData.item.address });
        }}
        city={itemData.item.city}
        address={itemData.item.address}
        opened={JSON.parse(itemData.item.opened)}
        appText={appText}
        index={itemData.index}
      />
    );
  }, [props.navigation, props.route.params, appLanguage]);

  const getItemLayout = useCallback((data, index) => {
    if (index < 0) return { length: 0, offset: 0, index };
    return {length: values.locationListItemHeight, offset: insets.top + listHeaderComponentHeightRef.current + values.locationListItemHeight * index, index};
  }, []);
  // --------------------------------------------

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor="rgba(0, 0, 0, 0.5)" />
      <CustomSafeAreaFlatListWindow
        contentContainerStyle={styles.customSafeAreaFlatListWindowContentContainerStyle}
        ListHeaderComponent={
          <LocationsScreenListHeaderComponent
            listHeaderComponentHeightRef={listHeaderComponentHeightRef}
            shopId={props.route.params.shopId}
            shopTitle={props.route.params.shopTitle}
            shopImageUrl={props.route.params.shopImageUrl}
            inputText={inputText}
            appText={appText}
            loadingErrorIndicatorState={loadingErrorIndicatorState}
            filteredShopLocationsData={filteredShopLocationsData}
            setInputText={setInputText}
          />
        }
        data={filteredShopLocationsData}
        renderItem={renderItem}
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        windowSize={21}
        getItemLayout={getItemLayout}
        keyExtractor={item => `${item.city} ${item.address}`}
        keyboardShouldPersistTaps={'always'}
        contentMinHeight={{ value: headerBigIconSize + values.topMargin, plusWindowHeight: true }}
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
    paddingBottom: values.topMargin,
  },
  locationListItem: {
    marginHorizontal: values.windowHorizontalPadding,
  },
});

export default LocationsScreen;