import React from 'react';
import { StyleSheet, View } from 'react-native';

import values from '../constants/values';
import colors from '../constants/colors';

const primaryColorSplitedArray = colors.primaryColor.split(' ');
const primaryColorWithOpacity = `${primaryColorSplitedArray[0]} ${primaryColorSplitedArray[1]} ${primaryColorSplitedArray[2]} ${values.opacity})`;

const BottomLine = props => {
  return (
    <View style={[styles.bottomLine, props.style]} />
  );
}

const styles = StyleSheet.create({
  bottomLine: {
    height: values.lineWidth,
    backgroundColor: primaryColorWithOpacity,
  },
});

export default BottomLine;