import React from 'react';
import { StyleSheet, View } from 'react-native';

import colors from '../constants/colors';
import values from '../constants/values';
import RegularText from './RegularText';

const Badge = props => {
  return (
    <View style={[styles.badge, props.style, { backgroundColor: props.empty ? 'transparent' : colors.primaryColor }]}>
      <RegularText style={[styles.badgeText, props.badgeTextStyle, { color: props.empty ? colors.primaryColor : 'black' }]} numberOfLines={1}>{props.children}</RegularText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    justifyContent: 'center',
    width: 100,
    height: 30,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.primaryColor,
    backgroundColor: colors.primaryColor,
  },
  badgeText: {
    color: colors.darkColor,
    fontSize: values.regularTextSize,
    textAlign: 'center',
  },
});

export default Badge;