import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import bigDecimal from 'js-big-decimal';
import axios from 'axios';

import colors from '../../constants/colors';
import values from '../../constants/values';
import getLocalizedText from '../../constants/getLocalizedText';
import CustomSafeAreaScrollViewWindowWithInsets from '../../components/CustomSafeAreaScrollViewWindowWithInsets';
import CustomImageBackground from '../../components/CustomImageBackground';
import ProductImage from '../../components/ProductImage';
import BoldText from '../../components/BoldText';
import AddProductComponent from '../../components/ProductDetailsScreen/AddProductComponent';
import LoadingErrorIndicator from '../../components/LoadingErrorIndicator';
import LoadableContent from '../../components/ProductDetailsScreen/LoadableContent';
import GoToCartModal from '../../components/ProductDetailsScreen/GoToCartModal';
import AboveMessage from '../../components/AboveMessage';
import { itemsDeletedFromShoppingCart } from '../../features/shoppingCartSlice';
import { concatErrors } from '../../shared/sharedFunctions';

const ProductDetailsScreen = props => {
  console.log('----ProductDetails Screen rerendered----');

  const dispatch = useDispatch();

  // ### GoToCart, RequiredOptions and EmptyTheCartOverlay overlay
  const [goToCartModalVisible, setGoToCartModalVisible] = useState(false);
  const [selectRequiredOptionsModalVisible, setSelectRequiredOptionsModalVisible] = useState(false);
  const [emptyTheCartModalVisible, setEmptyTheCartModalVisible] = useState(false);

  // ### Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // ### Loading shops data from data base
  const [productData, setProductData] = useState({});
  const [loadingErrorIndicatorState, setLoadingErrorIndicatorState] = useState({
    noItems: false,
    loading: true,
    loadingError: false,
  });

  // ### Saving user options choice 
  const [choices, setChoices] = useState(null);

  useEffect(() => {
    let controller = new AbortController();
    (async () => {
      try {
        const res = (await axios.post(`${values.requestUrl}getProductDetails`, { productId: props.route.params.productId }, { signal: controller.signal })).data;
        if (res.status === 'FAILED' && res.errors[0].msg === 'Product do not exist or where been deleted') {
          setLoadingErrorIndicatorState({
            noItems: true,
            loading: false,
            loadingError: false,
          });
          return
        }
        if (res.status === 'FAILED') throw new Error (concatErrors(res.errors));
        setLoadingErrorIndicatorState({
          noItems: false,
          loading: false,
          loadingError: false,
        });
        setChoices(() => {
          const options = res.data.options;
          const choicesOptions = [];
          options.forEach(option => {
            const userChoices = option.variants.map(availableChoice => ({ title: availableChoice.title, selected: false, price: new bigDecimal(availableChoice.price) }));
            choicesOptions.push({ title: option.title, required: option.required, userChoices: userChoices });
          });
          const choices = {
            price: new bigDecimal(props.route.params.price),
            priceWithOptions: new bigDecimal(props.route.params.price),
            noteForKitchen: '',
            options: choicesOptions
          };
          return choices;
        });
        setProductData(res.data);
      } catch (error) {
        console.log(`Error while loading product details from database: ${error.message}`);
        if (error.message !== 'canceled') {
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
  }, []);
  // #########################################

  const emtyTheCartHandler = () => {
    dispatch(itemsDeletedFromShoppingCart());
  };

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
      <CustomSafeAreaScrollViewWindowWithInsets contentContainerStyle={styles.contentContainerStyle} doNotUseInsetsBottom={true}>
        <ProductImage imageUrl={props.route.params.imageUrl} />
        <View style={styles.contentStyle}>
          <BoldText style={styles.title} numberOfLines={2}>{props.route.params.title}</BoldText>
          <LoadingErrorIndicator
            loading={loadingErrorIndicatorState.loading}
            loadingError={loadingErrorIndicatorState.loadingError}
            noItems={loadingErrorIndicatorState.noItems}
            noItemsText={appText.productDoNotExist}
            somethingWentWrongText={appText.somethingWentWrong}
          />
          {!loadingErrorIndicatorState.loading && !loadingErrorIndicatorState.loadingError && Object.keys(productData).length !== 0 &&
            <LoadableContent
              productData={productData}
              currency={props.route.params.currency}
              price={props.route.params.price}
              setChoices={setChoices}
              appText={appText}
            />
          }
        </View>
      </CustomSafeAreaScrollViewWindowWithInsets>
      {Object.keys(productData).length !== 0 &&
        <AddProductComponent
          productId={props.route.params.productId}
          shopId={props.route.params.shopId}
          shopTitle={props.route.params.shopTitle}
          title={props.route.params.title}
          currency={props.route.params.currency}
          choices={choices}
          appText={appText}
          setGoToCartModalVisible={setGoToCartModalVisible}
          setSelectRequiredOptionsModalVisible={setSelectRequiredOptionsModalVisible}
          setEmptyTheCartModalVisible={setEmptyTheCartModalVisible}
          locationId={props.route.params.locationId}
          locationCity={props.route.params.locationCity}
          locationAddress={props.route.params.locationAddress}
          deliveryMethods={props.route.params.deliveryMethods}
          deliveryPrice={props.route.params.deliveryPrice}
          eMail={props.route.params.eMail}
          opened={props.route.params.opened}
        />
      }
      <GoToCartModal
        visible={goToCartModalVisible}
        appText={appText}
        navigation={props.navigation}
      />
      <AboveMessage
        visible={selectRequiredOptionsModalVisible}
        closeOnBackButtonPress={true}
        messageText={appText.selectRequiredOptions}
        confirmButtonText={appText.confirm}
        setModalVisibility={setSelectRequiredOptionsModalVisible}
      />
      <AboveMessage
        visible={emptyTheCartModalVisible}
        closeOnBackButtonPress={true}
        messageText={appText.emptyCart}
        confirmButtonText={appText.confirm}
        onConfirm={emtyTheCartHandler}
        cancelButtonText={appText.cancel}
        setModalVisibility={setEmptyTheCartModalVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentContainerStyle: {
    paddingBottom: values.topMargin,
  },
  contentStyle: {
    paddingHorizontal: values.windowHorizontalPadding,
  },
  title: {
    marginTop: values.topMargin,
    fontSize: values.headerTextSize,
    textAlign: 'center',
  },
});

export default ProductDetailsScreen;