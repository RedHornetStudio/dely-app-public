import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';

import BoldText from './BoldText';
import values from '../constants/values';
import CustomPressableOpacity from './CustomPressableOpacity';

const ShoppingCartIconWithBadge = props => {

  const badgeNumber = 0;

  const onPressHandler = useCallback(() => {
    console.log('Shopping cart icon pressed');
  }, []);

  return (
    <CustomPressableOpacity style={props.style} onPress={onPressHandler}>
      <Entypo name="shopping-cart" size={props.size} color={props.color} />
      {badgeNumber > 0 && <View style={[styles.badge, { backgroundColor: props.badgeColor }]}><BoldText style={[styles.badgeNumber, { color: props.badgeNumberColor }]} numberOfLines={1}>{badgeNumber}</BoldText></View>}
    </CustomPressableOpacity>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -7,
    right: -7,
    justifyContent: 'center',
    alignItems: 'center',
    width: values.headerTextSize / 1.3,
    height: values.headerTextSize / 1.3,
    borderRadius: 10,
  },
  badgeNumber: {
    fontSize: values.headerTextSize / 2.8,
  },
});

export default ShoppingCartIconWithBadge;