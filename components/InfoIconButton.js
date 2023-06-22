import React from 'react';
import { StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import values from '../constants/values';
import colors from '../constants/colors';
import CustomPressableOpacity from './CustomPressableOpacity';

const InfoIconButton = props => {

  const onPressHandler = () => {
    props.navigation.navigate('ShopDetails', {
      shopId: props.shopId,
      shopTitle: props.shopTitle,
      shopDescription: props.shopDescription,
      imageUrl: props.imageUrl,
      locationCity: props.locationCity,
      locationAddress: props.locationAddress,
      locationId: props.locationId,
      deliveryMethods: props.deliveryMethods,
      deliveryPrice: props.deliveryPrice,
      phoneNumber: props.phoneNumber,
      workingHours: props.workingHours,
      currency: props.currency,
    });
  };

  return (
    <CustomPressableOpacity style={props.style} onPress={onPressHandler}>
      <FontAwesome name="info-circle" size={values.headerTextSize} color={colors.primaryColor} />
    </CustomPressableOpacity>
  );
};

const styles = StyleSheet.create({

});

export default InfoIconButton;