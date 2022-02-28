import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Entypo } from '@expo/vector-icons';

import colors from '../constants/colors';
import BoldText from './BoldText';
import RegularText from './RegularText';
import values from '../constants/values';
import { headerBigIconSize } from './HeaderBigIcon';

const ShopImage = props => {
  return (
    <View style={styles.shopImageContainer}>
      <Image style={styles.image} source={{ uri: props.imageUrl }} />
      <View style={styles.titleContainer}>
        <BoldText style={styles.titleText} numberOfLines={1}>{props.title}</BoldText>
        {props.shopAddress && 
          <View style={styles.adressContainer}>
            <Entypo name="location-pin" size={values.regularTextSize} color={colors.primaryColor} />
            <RegularText style={styles.addressText} numberOfLines={1}>{props.shopAddress}</RegularText>
          </View>
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shopImageContainer: {
    height: headerBigIconSize + values.topMargin,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  titleText: {
    fontSize: values.headerTextSize,
  },
  adressContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  addressText: {
    flex: 1,
    fontSize: values.regularTextSize / 1.5,
  },
});

export default ShopImage;