import React from 'react';
import { StyleSheet, View } from 'react-native';

import BoldText from '../../components/BoldText';

const ProductDetailsScreen = props => {
  return (
    <View style={styles.screen}>
      <BoldText>{`Product with id ${props.route.params.productId} details`}</BoldText>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default ProductDetailsScreen;