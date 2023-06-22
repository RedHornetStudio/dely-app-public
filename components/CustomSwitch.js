import React from 'react';
import { StyleSheet, Switch } from 'react-native';

import values from '../constants/values';
import colors from '../constants/colors';
import { addOpacityToColor } from '../shared/sharedFunctions';

const trackColorFalse = addOpacityToColor(colors.primaryColor, values.opacity);
const trackColorTrue = addOpacityToColor(colors.secondaryColor, values.opacity);
const trakcColorFalseDarkTheme = addOpacityToColor(colors.thirdColor, values.opacity);

const CustomSwitch = props => {
  return (
    <Switch
      {...props}
      style={[styles.switch, props.style]}
      thumbColor={props.darkTheme ? props.value ? colors.secondaryColor : colors.thirdColor : props.value ? colors.secondaryColor : colors.primaryColor}
      trackColor={props.darkTheme ? { false: trakcColorFalseDarkTheme, true: trackColorTrue } : { false: trackColorFalse, true: trackColorTrue }}
    />
  );
};

const styles = StyleSheet.create({
  switch: {
    height: values.regularTextSize * 1.5,
  },
});

export default CustomSwitch;