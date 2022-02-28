import React from 'react';
import { StyleSheet, View } from 'react-native';

import BoldText from '../../components/BoldText';

const ShopDetailsScreen = props => {
  return (
    <View style={styles.screen}>
      <BoldText>{`Shop with id ${props.route.params.shopId} details`}</BoldText>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default ShopDetailsScreen;