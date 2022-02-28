import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';

import getLocalizedText from '../../constants/getLocalizedText';
import CustomImageBackground from '../../components/CustomImageBackground';
import values from '../../constants/values';
import ProductItem from '../../components/ProductsScreen/ProductItem';
import ProductsSectionHeader from '../../components/ProductsScreen/ProductsSectionHeader';
import CustomSafeAreaFlatListWindow from '../../components/CustomSafeAreaFlatListWindow';
import ScrollingNavigation from '../../components/ProductsScreen/ScrollingNavigation';
import ProductsScreenListHeaderComponent from '../../components/ProductsScreen/ProductsScreenListHeaderComponent';

// ----Database simulation----
import productsDataInDatabase from '../../data/productsDataInDatabase';

const ProductsScreen = props => {
  console.log('----Products Screen rerendered----');

  // Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = getLocalizedText(appLanguage);

  // ----Loading shops data from data base----
  const [sortedProductsData, setSortedProductsData] = useState([]);
  const [availableSections, setAvailableSections] = useState([]);
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
    //     const response = await axios.post('http://example.com/getProducts.php', { shopId: props.route.params.shopId }, { signal: controller.signal });
    //     // Deviding products in categories
    //     let productsByCategories = [];
    //     productsDataFilteredByShop.forEach((product, index) => {
    //       if (index === 0) {
    //         productsByCategories.push({ title: product.category, data: [product] });
    //       } else {
    //         const category = productsByCategories.find(category => category.title === product.category);
    //         category ? category.data.push(product) : productsByCategories.push({ title: product.category, data: [product] });
    //       }
    //     });
    //     // Sorting categories and items in that categories
    //     productsByCategories.sort((a, b) => a.title.localeCompare(b.title, appLanguage));
    //     productsByCategories.forEach(productByCategories => {
    //       productByCategories.data.sort((a, b) => a.title.localeCompare(b.title, appLanguage));
    //     });
    //     // Creating sortedProductsData with headers
    //     const sortedProductsData = [];
    //     productsByCategories.forEach(productByCategories => {
    //       sortedProductsData.push({ id: productByCategories.title, itemType: 'header', data: { title: productByCategories.title } });
    //       productByCategories.data.forEach(product => {
    //         sortedProductsData.push({ id: product.id, itemType: 'item', data: product });
    //       });
    //     });
    //     // Creating available section for ScrollingNavigation
    //     const availableSections = [];
    //     sortedProductsData.forEach((data, index) => {
    //       if (data.itemType === 'header') {
    //         availableSections.push({ categoryIndex: index, category: data.data.title });
    //       }
    //     });
    //     setSortedProductsData(sortedProductsData);
    //     setAvailableSections(availableSections);
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
      const productsDataFilteredByShop = productsDataInDatabase.filter(productData => productData.shopId === props.route.params.shopId);
      // Deviding products in categories
      let productsByCategories = [];
      productsDataFilteredByShop.forEach((product, index) => {
        if (index === 0) {
          productsByCategories.push({ title: product.category, data: [product] });
        } else {
          const category = productsByCategories.find(category => category.title === product.category);
          category ? category.data.push(product) : productsByCategories.push({ title: product.category, data: [product] });
        }
      });
      // Sorting categories and items in that categories
      productsByCategories.sort((a, b) => a.title.localeCompare(b.title, appLanguage));
      productsByCategories.forEach(productByCategories => {
        productByCategories.data.sort((a, b) => a.title.localeCompare(b.title, appLanguage));
      });
      // Creating sortedProductsData with headers
      const sortedProductsData = [];
      productsByCategories.forEach(productByCategories => {
        sortedProductsData.push({ id: productByCategories.title, itemType: 'header', data: { category: productByCategories.title } });
        productByCategories.data.forEach(product => {
          sortedProductsData.push({ id: product.id, itemType: 'item', data: product });
        });
      });
      // Creating available section for ScrollingNavigation
      const availableSections = [];
      sortedProductsData.forEach((data, index) => {
        if (data.itemType === 'header') {
          availableSections.push({ categoryIndex: index, category: data.data.category });
        }
      });
      setLoadingErrorIndicatorState({
        noItems: sortedProductsData.length === 0,
        loading: false,
        loadingError: false,
      });
      setAvailableSections(availableSections);
      setSortedProductsData(sortedProductsData);
    }, 400);

    return () => {
      clearTimeout(myTimeout);
    };
  }, []);
  // --------------------------------------------

  // Rendering FlatList components
  const listRef = useRef(null);
  const settingVisibleCategoryRef = useRef(null);
  const navigationItemPressedRef = useRef(false);
  const listHeaderComponentHeightRef = useRef(0);
  const insets = useSafeAreaInsets();

  const renderItem = useCallback(itemData => {
    if (itemData.item.itemType === 'item') {
      return (
        <ProductItem
          style={styles.productItem}
          onPress={() => {
            props.navigation.navigate('ProductDetails', { productId: itemData.item.data.id });
          }}
          title={itemData.item.data.title}
          price={itemData.item.data.price}
          currency={itemData.item.data.currency}
          imageUrl={itemData.item.data.imageUrl}
          navigation={props.navigation}
        />
      );
    }
    if (itemData.item.itemType === 'header') {
      return (
        <ProductsSectionHeader style={styles.productsSectionHeader} title={itemData.item.data.category} />
      );
    }
  }, [props.navigation]);
  
  const keyExtractor = useCallback(item => item.id, []);

  const getItemLayout = useCallback((data, index) => {
    if (index < 0) return { length: 0, offset: 0, index };
    let sectionHeaderCount = 0;
    let itemCount = 0;
    for (let i = 0; i < index; i++) {
      if (data[i].itemType === 'header') {
        sectionHeaderCount++;
      } else if (data[i].itemType === 'item') {
        itemCount++;
      }
    }
    let length;
    switch (data[index].itemType) {
      case 'header':
        length = values.sectionHeaderHeight;
        break;
      case 'item':
        length = values.listItemHeight;
    }
    return {length: length, offset: insets.top + listHeaderComponentHeightRef.current + sectionHeaderCount * values.sectionHeaderHeight + itemCount * values.listItemHeight, index};
  }, []);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 100, waitForInteraction: false }).current;

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems[0]) {
      if (!navigationItemPressedRef.current) settingVisibleCategoryRef.current(viewableItems[0].item.data.category);
    };
  }, []);
  // --------------------------------------------

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor="rgba(0, 0, 0, 0.5)" />
      <CustomSafeAreaFlatListWindow
        listRef={listRef}
        contentContainerStyle={styles.customSafeAreaSectionListWindowContentContainerStyle}
        ListHeaderComponent={
          <ProductsScreenListHeaderComponent
            shopId={props.route.params.shopId}
            shopTitle={props.route.params.shopTitle}
            shopImageUrl={props.route.params.shopImageUrl}
            locationCity={props.route.params.locationCity}
            locationAddress={props.route.params.locationAddress}
            loadingErrorIndicatorState={loadingErrorIndicatorState}
            appText={appText}
            listHeaderComponentHeightRef={listHeaderComponentHeightRef}
            navigation={props.navigation}
          />
        }
        data={sortedProductsData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        windowSize={21}
        getItemLayout={getItemLayout}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        keyboardShouldPersistTaps={'always'}
      />
      <ScrollingNavigation
        listRef={listRef}
        settingVisibleCategoryRef={settingVisibleCategoryRef}
        navigationItemPressedRef={navigationItemPressedRef}
        availableSections={availableSections}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // ----Screen----
  screen: {
    flex: 1,
  },
  // List
  availableSectionContainer: {
    marginTop: values.topMargin,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productsSectionHeader: {
    marginHorizontal: values.windowHorizontalPadding,
  },
  productItem: {
    marginHorizontal: values.windowHorizontalPadding,
  },
});

export default ProductsScreen;