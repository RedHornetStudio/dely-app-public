import React, { useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import values from '../../constants/values';
import InputField from '../InputField';

const DeliveryPriceInput = props => {

  // ### Fading in
  const animatedOpacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
    }
  });
  useLayoutEffect(() => {
    if (props.firstRender.current) return;
    animatedOpacity.value = 0;
    animatedOpacity.value = withTiming(1, { duration: values.animationDuration });
  }, []);
  // ########################################

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <InputField
        containerStyle={styles.deliveryPriceInput}
        value={props.deliveryPrice}
        onChangeText={props.setDeliveryPrice}
        placeholder={props.appText.deliveryPrice}
        keyboardType="decimal-pad"
        inputType="decimal"
        icon={{ Family: Ionicons, name: 'pricetags' }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: values.topMargin,
    marginHorizontal: values.windowHorizontalPadding,
  },
});

export default DeliveryPriceInput;