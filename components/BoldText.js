import React from 'react';
import { StyleSheet, Text } from 'react-native';

import colors from '../constants/colors';
import values from '../constants/values';

const BoldText = props => {
  return (
    <Text {...props} style={[styles.text, props.style]}>{props.children}</Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: values.regularTextSize,
    color: colors.primaryColor,
    fontFamily: 'Montserrat-Bold',
  },
});

export default BoldText;