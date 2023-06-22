import React from 'react';
import { StyleSheet, View } from 'react-native';
import values from '../constants/values';

const HeaderButtons = props => {
  return (
    <View style={[styles.headerButtonsContainer, props.style]}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  headerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: values.topMargin,
  },
});

export const headerButtonsStyles = StyleSheet.create({
  headerButtons: {
    marginStart: 15,
  },
});

export default HeaderButtons;