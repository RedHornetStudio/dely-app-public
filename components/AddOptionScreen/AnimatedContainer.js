import React, { useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import values from '../../constants/values';

const AnimatedContainer = props => {

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
  }, [props.additionalPrice]);
  // ########################################

  return (
    <Animated.View style={[props.style, animatedStyle]}>
      {props.children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({

});

export default AnimatedContainer;