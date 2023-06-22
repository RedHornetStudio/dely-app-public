import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import colors from '../../constants/colors';
import getLocalizedText from '../../constants/getLocalizedText';
import CustomImageBackground from '../../components/CustomImageBackground';
import values from '../../constants/values';
import ProductItem from '../../components/ProductsScreen/ProductItem';
import ProductsSectionHeader from '../../components/ProductsScreen/ProductsSectionHeader';
import CustomSafeAreaFlatListWindow from '../../components/CustomSafeAreaFlatListWindow';
import ScrollingNavigation from '../../components/ProductsScreen/ScrollingNavigation';
import ProductsScreenListHeaderComponent from '../../components/ProductsScreen/ProductsScreenListHeaderComponent';
import { concatErrors } from '../../shared/sharedFunctions';
import AboveMessage from '../../components/AboveMessage';
import LoadingModal from '../../components/LoadingModal';
import { getNewAccessTokenAsync } from '../../shared/sharedFunctions';

const ProductsScreen = props => {
  console.log('----Products Screen rerendered----');

  const dispatch = useDispatch();

  // ### auth tokens
  const auth = useSelector(state => state.authSlice);

  // ### Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // ### Loading shops data from data base
  const [productsData, setProductsData] = useState({ sortedProductsData: [], availableSections: [] });
  const [loadingErrorIndicatorState, setLoadingErrorIndicatorState] = useState({
    noItems: true,
    loading: true,
    loadingError: false,
  });

  // ### Loading products
  const controllerRef = useRef(null);
  const loadProductsAsync = async () => {
    controllerRef.current = new AbortController();
    try {
      const { data: res } = await axios.post(`${values.requestUrl}getProducts`, { shopId: props.route.params.shopId }, { signal: controllerRef.current.signal });
      if (res.status === 'FAILED') throw new Error (concatErrors(res.errors));
      const productsDataFilteredByShop = res.data;
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
      const collator = new Intl.Collator(appLanguage);
      productsByCategories.sort((a, b) => collator.compare(a.title, b.title));
      productsByCategories.forEach(productByCategories => {
        productByCategories.data.sort((a, b) => collator.compare(a.title, b.title));
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
      setProductsData({ sortedProductsData: sortedProductsData, availableSections: availableSections });
    } catch (error) {
      console.log(`Error while loading products from database: ${error.message}`);
      if (error.message !== 'canceled') {
        setProductsData({ sortedProductsData: [], availableSections: [] });
        setLoadingErrorIndicatorState({
          noItems: true,
          loading: false,
          loadingError: true,
        });
      }
    }
  };

  useEffect(() => {
    loadProductsAsync();

    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [appLanguage]);
  // #####################################

  // ### If returning from add product screen
  useEffect(() => {
    if (props.route.params?.needUpdate) {
      loadProductsAsync()
    }
  }, [props.route.params?.needUpdate]);

  // ### Delete modal
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [deleteModalVisibility, setDeleteModalVisibility] = useState(false);
  const [loadingModalVisibility, setLoadingModalVisibility] = useState(false);
  const [errorModalVisibility, setErrorModalVisibility] = useState(false);
  const [permissionDeniedModalVisibility, setPermissionDeniedModalVisibility] = useState(false);
  // const [productDoNotExistModal, setProductDoNotExistModal] = useState(false);

  const onConfirmHandler = () => {
    setLoadingModalVisibility(true);
    (async () => {
      try {
        let res = (await axios.post(`${values.requestUrl}admin/postDeleteProduct`, { productId: itemToDeleteId, accessToken: auth.accessToken })).data;
        if (res.status === 'FAILED' && res.errors[0].msg === 'Unauthorized') {
          const { success, newAccessToken } = await getNewAccessTokenAsync(auth.refreshToken, dispatch);
          if (success) {
            res = (await axios.post(`${values.requestUrl}admin/postDeleteProduct`, { productId: itemToDeleteId, accessToken: newAccessToken })).data;
          } else {
            props.navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'BusinessSignIn' }] });
            return;
          }
        }
        if (res.status === 'FAILED' && res.errors[0].msg === 'Permission denied') {
          setLoadingModalVisibility(false);
          setPermissionDeniedModalVisibility(true);
          return;
        }
        if (res.status === 'FAILED' && res.errors[0].msg === 'Product do not exist') {
          res.status = 'SUCCESS';
          // setLoadingModalVisibility(false);
          // setProductDoNotExistModal(true);
          // return;
        }
        if (res.status === 'FAILED') throw new Error (concatErrors(res.errors));
        await loadProductsAsync();
        setTimeout(() => {
          setLoadingModalVisibility(false);
        }, 100);
      } catch (error) {
        console.log(`Error while deleting product from database: ${error.message}`);
        if (error.message !== 'canceled') {
          setLoadingModalVisibility(false);
          setErrorModalVisibility(true);
        }
      }
    })();
  };
  // ###################################

  // ### Rendering FlatList components
  const listHeaderComponentHeightRef = useRef(0);
  const listRef = useRef(null);
  const [visibleCategory, setVisibleCategory] = useState(null);
  const navigationItemPressedRef = useRef(false);
  // const listHeaderComponentHeight = values.topMargin * 3 + values.headerBigIconSize + values.headerTextSize;
  const insets = useSafeAreaInsets();

  const renderItem = itemData => {
    if (itemData.item.itemType === 'item') {
      return (
        props.route.params.manageProducts
          ? <ProductItem
            style={styles.productItem}
            disabled={true}
            productId={itemData.item.data.id}
            title={itemData.item.data.title}
            price={itemData.item.data.price}
            currency={props.route.params.currency}
            imageUrl={itemData.item.data.image_url}
            category={itemData.item.data.category}
            navigation={props.navigation}
            index={itemData.index}
            stringifiedData={JSON.stringify({ title: itemData.item.data.title, price: itemData.item.data.price })}
            manageProducts={props.route.params.manageProducts}
            setDeleteModalVisibility={setDeleteModalVisibility}
            setItemToDeleteId={setItemToDeleteId}
          />
          : <ProductItem
            style={styles.productItem}
            productId={itemData.item.data.id}
            title={itemData.item.data.title}
            price={itemData.item.data.price}
            currency={props.route.params.currency}
            imageUrl={itemData.item.data.image_url}
            shopId={props.route.params.shopId}
            shopTitle={props.route.params.shopTitle}
            locationId={props.route.params.locationId}
            locationCity={props.route.params.locationCity}
            locationAddress={props.route.params.locationAddress}
            deliveryMethods={JSON.stringify(props.route.params.deliveryMethods)}
            deliveryPrice={props.route.params.deliveryPrice}
            navigation={props.navigation}
            index={itemData.index}
            opened={props.route.params.opened}
          />
      );
    }
    if (itemData.item.itemType === 'header') {
      return (
        <ProductsSectionHeader style={styles.productsSectionHeader} title={itemData.item.data.category} index={itemData.index} />
      );
    }
  };
  
  const keyExtractor = item => item.id;

  const getItemLayout = (data, index) => {
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
        break;
    }
    return {length: length, offset: insets.top + listHeaderComponentHeightRef.current + sectionHeaderCount * values.sectionHeaderHeight + itemCount * values.listItemHeight, index};
  };

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 100, waitForInteraction: false }).current;

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems[0]) {
      if (!navigationItemPressedRef.current) setVisibleCategory(viewableItems[0].item.data.category);
    };
  }, []);
  // #################################

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
      <CustomSafeAreaFlatListWindow
        ref={listRef}
        contentContainerStyle={styles.customSafeAreaSectionListWindowContentContainerStyle}
        doNotUseInsetsBottom={true}
        ListHeaderComponent={
          <ProductsScreenListHeaderComponent
            shopId={props.route.params.shopId}
            locationId={props.route.params.locationId}
            shopTitle={props.route.params.shopTitle}
            shopDescription={props.route.params.shopDescription}
            imageUrl={props.route.params.shopImageUrl}
            locationCity={props.route.params.locationCity}
            locationAddress={props.route.params.locationAddress}
            deliveryMethods={props.route.params.deliveryMethods}
            deliveryPrice={props.route.params.deliveryPrice}
            phoneNumber={props.route.params.phoneNumber}
            workingHours={props.route.params.workingHours}
            loadingErrorIndicatorState={loadingErrorIndicatorState}
            appText={appText}
            listHeaderComponentHeightRef={listHeaderComponentHeightRef}
            // listHeaderComponentHeight={listHeaderComponentHeight}
            navigation={props.navigation}
            manageProducts={props.route.params.manageProducts}
            currency={props.route.params.currency}
            opened={props.route.params.opened}
          />
        }
        data={productsData.sortedProductsData}
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
        insetsBottom={insets.bottom}
        navigationItemPressedRef={navigationItemPressedRef}
        availableSections={productsData.availableSections}
        visibleCategory={visibleCategory}
        setVisibleCategory={setVisibleCategory}
      />

      {/* ### Delete modal */}
      <AboveMessage
        visible={deleteModalVisibility}
        setModalVisibility={setDeleteModalVisibility}
        closeOnBackButtonPress={true}
        messageText={appText.areYouSureDeleteItemFromProducts}
        confirmButtonText={appText.confirm}
        onConfirm={onConfirmHandler}
        cancelButtonText={appText.cancel}
      />
      <AboveMessage
        visible={errorModalVisibility}
        setModalVisibility={setErrorModalVisibility}
        closeOnBackButtonPress={true}
        messageText={appText.somethingWentWrongAndTryLater}
        confirmButtonText={appText.confirm}
      />
      <AboveMessage
        visible={permissionDeniedModalVisibility}
        setModalVisibility={setPermissionDeniedModalVisibility}
        closeOnBackButtonPress={true}
        messageText={appText.permissionDenied}
        confirmButtonText={appText.confirm}
      />
      {/* <AboveMessage
        visible={productDoNotExistModal}
        setModalVisibility={setProductDoNotExistModal}
        closeOnBackButtonPress={true}
        messageText={appText.productDoNotExist}
        confirmButtonText={appText.confirm}
      /> */}
      <LoadingModal
        visible={loadingModalVisibility}
      />
      {/* ########################### */}
    </View>
  );
};

const styles = StyleSheet.create({
  // ----Screen----
  screen: {
    flex: 1,
  },
  // List
  productsSectionHeader: {
    marginHorizontal: values.windowHorizontalPadding,
  },
  productItem: {
    marginHorizontal: values.windowHorizontalPadding,
  },
});

export default ProductsScreen;