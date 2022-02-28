import React from 'react';
import { StyleSheet } from 'react-native';

import colors from '../constants/colors';
import values from '../constants/values';
import BoldText from './BoldText';
import CustomPressableOpacity from './CustomPressableOpacity';

const MainButton = props => {
  return (
    <CustomPressableOpacity
      {...props}
      style={[styles.button, props.style, { backgroundColor: props.empty ? 'transparent' : colors.primaryColor }]}
    >
      <BoldText style={[styles.buttonText, props.buttonTextStyle, { color: props.empty ? colors.primaryColor : colors.darkColor }]} numberOfLines={1}>{props.children}</BoldText>
    </CustomPressableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 50,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.primaryColor,
    backgroundColor: colors.primaryColor,
  },
  buttonText: {
    color: colors.darkColor,
    fontSize: values.regularTextSize,
    textAlign: 'center',
  },
});

export default MainButton;