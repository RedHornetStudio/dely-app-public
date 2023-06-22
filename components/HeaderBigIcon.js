import React from 'react';
import { StyleSheet, View } from 'react-native';

import values from '../constants/values';

const HeaderBigIcon = props => {
  return (
    <View style={styles.headerBigIconContainer}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  headerBigIconContainer: {
    alignItems: 'center',
    marginTop: values.topMargin,
  },
});

export default HeaderBigIcon;