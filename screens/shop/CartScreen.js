import React, { useState, useMemo, useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Entypo } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

import values from '../../constants/values';
import colors from '../../constants/colors';
import getLocalizedText from '../../constants/getLocalizedText';
import RegularText from '../../components/RegularText';
import BoldText from '../../components/BoldText';
import DeliveryMethodSwitch from '../../components/CartScreen/DeliveryMethodSwitch';
import CustomImageBackground from '../../components/CustomImageBackground';
import CustomSafeAreaScrollViewWindowWithInsets from '../../components/CustomSafeAreaScrollViewWindowWithInsets';
import HeaderBigIcon from '../../components/HeaderBigIcon';
import BuyButtonContainerComponent from '../../components/CartScreen/BuyButtonContainerComponent';
import CartItem from '../../components/CartScreen/CartItem';
import AboveMessage from '../../components/AboveMessage';
import { itemDeleted } from '../../features/shoppingCartSlice';

const CartScreen = props => {
  console.log('----Cart Screen rerendered----');

  const dispatch = useDispatch();

  // Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // On first render show shopping cart items without fade in
  const firstRender = useRef(true);
  useEffect(() => {
    firstRender.current = false;
  }, []);

  // Getting shopping cart items from global state
  const shoppingCartStringed = useSelector(state => state.shoppingCartSlice.shoppingCart);
  const shoppingCartParsed = useMemo(() => {
    return JSON.parse(shoppingCartStringed);
  }, [shoppingCartStringed]);

  // Setting delivery method
  const deliveryMethods = useMemo(() => {
    let deliveryMethods = [];
    if (shoppingCartParsed.items.length > 0) {
      Object.keys(shoppingCartParsed.shopDetails.deliveryMethods).forEach(method => {
        if (shoppingCartParsed.shopDetails.deliveryMethods[method]) deliveryMethods.push(method);
      });
    }
    return deliveryMethods;
  }, []);

  const [deliveryMethodsSwitchValues, setDeliveryMethodsSwitchValues] = useState(() => {
    let deliveryMethods = [];
    if (shoppingCartParsed.items.length > 0) {
      Object.keys(shoppingCartParsed.shopDetails.deliveryMethods).forEach(method => {
        if (shoppingCartParsed.shopDetails.deliveryMethods[method]) deliveryMethods.push(method);
      });
    }
    return deliveryMethods.map((deliveryMethod, index) => index === 0 ? true : false);
  });

  const onPressDeliveryMethodHandler = indexPressed => {
    setDeliveryMethodsSwitchValues(deliveryMethodsSwitchValues => deliveryMethodsSwitchValues.map((value, index) => index === indexPressed ? true : false));
  };

  // Delete modal
  const [showDeleteItemModal, setShowDeleteItemModal] = useState(false);
  const onPressModalConfirmHandler = () => {
    dispatch(itemDeleted(showDeleteItemModal.index));
  };

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
      <CustomSafeAreaScrollViewWindowWithInsets contentContainerStyle={styles.contentContainerStyle} doNotUseInsetsBottom={true}>
        <HeaderBigIcon><Entypo name="shopping-cart" size={values.headerBigIconSize} color={colors.primaryColor} /></HeaderBigIcon>
        {shoppingCartParsed.items.length === 0 &&
          <View style={styles.contentContainer}>
            <RegularText style={styles.emptyText}>{appText.cartIsEmpty}</RegularText>
          </View>
        }
        {shoppingCartParsed.items.length > 0 &&
          <View style={styles.contentContainer}>
            <BoldText style={styles.titleText}>{shoppingCartParsed.shopDetails.shopTitle}</BoldText>
            <View style={styles.addressContainer}>
              <Entypo name="location-pin" size={values.regularTextSize} color={colors.primaryColor} />
              <RegularText style={styles.addressText}>{`${shoppingCartParsed.shopDetails.locationCity}, ${shoppingCartParsed.shopDetails.locationAddress}`}</RegularText>
            </View>
            <RegularText style={styles.chooseDeliverTitle}>{appText.chooseDelivery}</RegularText>
            <View style={styles.deliveryMethodContainer}>
              {deliveryMethods.map((deliveryMethod, index) => {
                return (
                  <DeliveryMethodSwitch
                    key={deliveryMethod}
                    style={[styles.deliveryMethodItem, { marginRight: index < deliveryMethods.length - 1 ? '2%' : 0 }]}
                    buttonTextStyle={styles.deliveryMethodTextStyle}
                    empty={!deliveryMethodsSwitchValues[index]}
                    useRegularText={!deliveryMethodsSwitchValues[index]}
                    numberOfLines={2}
                    onPress={() => onPressDeliveryMethodHandler(index)}
                    firstLine={appText[deliveryMethod]}
                    secondLine={deliveryMethod === 'delivery' ? shoppingCartParsed.shopDetails.deliveryPrice === '0.00' ? '' : `${shoppingCartParsed.shopDetails.currency} ${shoppingCartParsed.shopDetails.deliveryPrice}` : ''}
                  />
                );
              })}
            </View>
            {shoppingCartParsed.items.map((cartItem, index) => {
              return (
                <CartItem
                  key={cartItem.id}
                  productId={cartItem.productId}
                  title={cartItem.title}
                  price={cartItem.price}
                  count={cartItem.count}
                  noteForKitchen={cartItem.noteForKitchen}
                  options={JSON.stringify(cartItem.options)}
                  index={index}
                  currency={shoppingCartParsed.shopDetails.currency}
                  setShowDeleteItemModal={setShowDeleteItemModal}
                  firstRender={firstRender}
                />
              );
            })}
          </View>
        }
      </CustomSafeAreaScrollViewWindowWithInsets>
      {shoppingCartParsed.items.length > 0 &&
        <BuyButtonContainerComponent
          appText={appText}
          shoppingCartParsed={shoppingCartParsed}
          deliveryMethod={deliveryMethods[deliveryMethodsSwitchValues.indexOf(true)]}
          deliveryPrice={deliveryMethods[deliveryMethodsSwitchValues.indexOf(true)] === 'delivery' ? shoppingCartParsed.shopDetails.deliveryPrice : '0.00'}
          navigation={props.navigation}
        />
      }
      <AboveMessage
        visible={showDeleteItemModal ? true : false}
        setModalVisibility={setShowDeleteItemModal}
        confirmButtonText={appText.confirm}
        onConfirm={onPressModalConfirmHandler}
        cancelButtonText={appText.cancel}
        messageText={showDeleteItemModal ? appText.areYouSureDeleteItemFromCart : ''}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentContainerStyle: {
    paddingHorizontal: values.windowHorizontalPadding,
  },
  contentContainer: {
    marginTop: values.topMargin,
  },
  emptyText: {
    textAlign: 'center',
  },
  titleText: {
    textAlign: 'center',
    fontSize: values.headerTextSize,
  },
  chooseDeliverTitle: {
    marginTop: values.topMargin,
    textAlign: 'center',
    fontSize: values.headerTextSize / 1,
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  deliveryMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: values.topMargin / 2,
  },
  deliveryMethodItem: {
    width: '31%',
    height: 'auto',
    paddingVertical: 3,
    paddingHorizontal: 0,
  },
  deliveryMethodTextStyle: {
    fontSize: values.regularTextSize / 1.3,
  },
});

export default CartScreen;