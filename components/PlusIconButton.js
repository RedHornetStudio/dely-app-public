import React from 'react';
import { StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import values from '../constants/values';
import colors from '../constants/colors';
import CustomPressableOpacity from './CustomPressableOpacity';

const PlusIconButton = props => {
  return (
    <CustomPressableOpacity {...props} style={props.style} onPress={props.onPress}>
      <FontAwesome name="plus-circle" size={values.headerTextSize} color={colors.primaryColor} />
    </CustomPressableOpacity>
  );
};

const styles = StyleSheet.create({

});

export default PlusIconButton;