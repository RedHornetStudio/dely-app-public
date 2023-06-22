import React from 'react';
import { StyleSheet, RefreshControl } from 'react-native';

import colors from '../constants/colors';

const CustomRefreshControl = props => {
  return (
    <RefreshControl {...props} colors={[colors.secondaryColor]} /> 
  );
};

const styles = StyleSheet.create({

});

export default CustomRefreshControl;