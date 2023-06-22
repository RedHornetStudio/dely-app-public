import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

import BoldText from './BoldText';
import values from '../constants/values';
import CustomPressableOpacity from './CustomPressableOpacity';
import colors from '../constants/colors';

const ShoppingCartIconWithBadge = props => {

  const shoppingCartStringed = useSelector(state => state.shoppingCartSlice.shoppingCart);
  const shoppingCartParsed = useMemo(() => {
      return JSON.parse(shoppingCartStringed);
    }, [shoppingCartStringed]);

  const badgeNumber = useMemo(() => {
      let count = 0;
      shoppingCartParsed.items.forEach(elem => count += elem.count);
      return count;
    }, [shoppingCartParsed]);

  const onPressHandler = () => {
    props.navigation.navigate('Cart');
  };

  return (
    <CustomPressableOpacity style={props.style} onPress={onPressHandler}>
      <Entypo name="shopping-cart" size={values.headerTextSize} color={colors.primaryColor} />
      {badgeNumber > 0 && <View style={[styles.badge, { backgroundColor: colors.secondaryColor }]}><BoldText style={[styles.badgeNumber, { color: colors.primaryColor }]} numberOfLines={1}>{badgeNumber}</BoldText></View>}
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