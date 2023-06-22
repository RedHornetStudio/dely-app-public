import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import bigDecimal from 'js-big-decimal';

import values from '../../constants/values';
import colors from '../../constants/colors';
import MainButton from '../MainButton';
import RegularText from '../RegularText';

const BuyButtonContainerComponent = props => {

  const insets = useSafeAreaInsets();

  const totalPrice = useMemo(() => {
    let totalPrice = new bigDecimal(0);
    props.shoppingCartParsed.items.forEach(item => {
      totalPrice = totalPrice.add(new bigDecimal(item.price).multiply(new bigDecimal(item.count)));
    });
    totalPrice = totalPrice.add(new bigDecimal(props.deliveryPrice));
    return totalPrice.round(2).getValue();
  }, [props.shoppingCartParsed, props.deliveryPrice]);

  const onPresBuyHandler = () => {
    const order = {
      locationId: props.shoppingCartParsed.shopDetails.locationId,
      currency: props.shoppingCartParsed.shopDetails.currency,
      deliveryPrice: props.deliveryPrice,
      totalPrice: totalPrice,
      deliveryMethodDetails: {
        deliveryMethod: props.deliveryMethod,
        name: '',
        phoneNumber: '',
        address: '',
        doorCode: '',
      },
      shoppingCartItems: props.shoppingCartParsed.items,
    }
    props.navigation.navigate('Address', {
      order: order,
      currency: props.shoppingCartParsed.shopDetails.currency,
      shopTitle: props.shoppingCartParsed.shopDetails.shopTitle,
      locationCity: props.shoppingCartParsed.shopDetails.locationCity,
      locationAddress: props.shoppingCartParsed.shopDetails.locationAddress,
    });
  };

  return (
    <View style={[styles.container, { paddingTop: values.topMargin / 2, paddingBottom: values.topMargin / 2 + insets.bottom }]}>
      <View style={styles.totalPriceContainer}>
        <RegularText style={styles.text} numberOfLines={1}>{props.appText.totalPrice}</RegularText>
        <RegularText style={styles.text} numberOfLines={1}>{`${props.shoppingCartParsed.shopDetails.currency} ${totalPrice}`}</RegularText>
      </View>
      <MainButton onPress={onPresBuyHandler}>{props.appText.buy}</MainButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: values.windowHorizontalPadding,
    backgroundColor: colors.thirdColor,
  },
  text: {
    fontSize: values.regularTextSize * 1.2,
  },
});

export default BuyButtonContainerComponent;
