import React, { useState, useLayoutEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import bigDecimal from 'js-big-decimal';

import colors from '../../constants/colors';
import values from '../../constants/values';
import MainButton from '../MainButton';
import RegularText from '../RegularText';
import CustomPressableOpacity from '../CustomPressableOpacity';
import { itemAddedToShoppingCart } from '../../features/shoppingCartSlice';

const AddProductComponent = props => {
  const { choices } = props;

  const insets = useSafeAreaInsets();

  const dispatch = useDispatch();

  // ### Fading in
  const animatedOpacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
    }
  });
  useLayoutEffect(() => {
    animatedOpacity.value = 0;
    animatedOpacity.value = withTiming(1, { duration: values.animationDuration });
  }, []);
  // #######################

  const shoppingCartStringed = useSelector(state => state.shoppingCartSlice.shoppingCart);
  const shoppingCartParsed = useMemo(() => {
    return JSON.parse(shoppingCartStringed);
  }, [shoppingCartStringed]);

  const [productCount, setProductCount] = useState(1);

  const onPressHandler = () => {
    // ### Check are all required options choosen
    let allRequiredFieldsAreChoosen = true;
    choices.options.forEach(option => {
      if (option.required) {
        let isItemSelected = false;
        option.userChoices.forEach(userChoice => {
          if (userChoice.selected === true) isItemSelected = true;
        });
        if (!isItemSelected) allRequiredFieldsAreChoosen = false;
      };
    });

    if (!allRequiredFieldsAreChoosen) {
      props.setSelectRequiredOptionsModalVisible(true);
      return;
    }
    // ############################################

    // ### Check if shopping cart have products from another shop
    if (shoppingCartParsed.items.length > 0) {
      if (shoppingCartParsed.shopDetails.shopId !== props.shopId || shoppingCartParsed.shopDetails.locationId !== props.locationId) {
        props.setEmptyTheCartModalVisible(true);
        return;
      }
    }

    // ### Creating shopping cart item and adding it to shopping cart
    const shoppingCartItemOptions = [];
    choices.options.forEach(option => {
      const selectedItems = { title: option.title, selected: [] };
      option.userChoices.forEach(userChoice => {
        if (userChoice.selected === true) selectedItems.selected.push(userChoice.title);
      });
      shoppingCartItemOptions.push(selectedItems);
    });
    const shoppingCartItem = {
      id: new Date().getTime(),
      productId: props.productId,
      locationId: props.locationId,
      locationCity: props.locationCity,
      locationAddress: props.locationAddress,
      shopId: props.shopId,
      shopTitle: props.shopTitle,
      deliveryMethods: props.deliveryMethods,
      deliveryPrice: props.deliveryPrice,
      currency: props.currency,
      title: props.title,
      price: choices.priceWithOptions.round(2).getValue(),
      noteForKitchen: choices.noteForKitchen,
      count: productCount,
      options: shoppingCartItemOptions
    };

    dispatch(itemAddedToShoppingCart(shoppingCartItem));
    props.setGoToCartModalVisible(true);
    // ##############################################
  };

  return (
    <Animated.View style={[styles.container, { paddingTop: values.topMargin / 2, paddingBottom: values.topMargin / 2 + insets.bottom }, animatedStyle]}>
      <View style={styles.countContainer}>
        <CustomPressableOpacity style={styles.countButton} onPress={() => setProductCount(productCount => productCount > 1 ? --productCount : productCount)}>
          <FontAwesome name="minus-circle" size={values.headerTextSize / 1.2} color={colors.primaryColor} />
        </CustomPressableOpacity>
        <RegularText style={[styles.countText]} numberOfLines={1}>{productCount}</RegularText>
        <CustomPressableOpacity style={styles.countButton} onPress={() => setProductCount(productCount => ++productCount)}>
          <FontAwesome name="plus-circle" size={values.headerTextSize / 1.2} color={colors.primaryColor} />
        </CustomPressableOpacity>
      </View>
      <MainButton
        disabled={props.opened === false}
        onPress={onPressHandler}
      >{`${props.appText.add}\n${props.currency} ${choices.priceWithOptions.multiply(new bigDecimal(productCount)).round(2).getValue()}`}</MainButton>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: values.windowHorizontalPadding,
    backgroundColor: colors.thirdColor,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
  },
  countButton: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    width: 50,
  },
  countText: {
    width: values.headerTextSize * 1.5,
    fontSize: values.headerTextSize,
    textAlign: 'center',
  },
});

export default AddProductComponent;