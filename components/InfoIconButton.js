import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import CustomPressableOpacity from './CustomPressableOpacity';

const InfoIconButton = props => {

  const onPressHandler = useCallback(() => {
    props.navigation.navigate('ShopDetails', { shopId: props.shopId });
  }, [props.shopId]);

  return (
    <CustomPressableOpacity style={props.style} onPress={onPressHandler}>
      <FontAwesome name="info-circle" size={props.size} color={props.color} />
    </CustomPressableOpacity>
  );
};

const styles = StyleSheet.create({

});

export default InfoIconButton;