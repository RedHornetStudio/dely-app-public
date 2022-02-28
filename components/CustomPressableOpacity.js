import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import values from '../constants/values';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CustomPressableOpacity = props => {
  const animatedOpacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
    }
  });

  const fadeOut = () => {
    animatedOpacity.value = withTiming(values.opacity, { duration: 50 });
  };

  const fadeIn = () => {
    animatedOpacity.value = withTiming(1, { duration: 200 });
  };

  return (
    <AnimatedPressable
      {...props}
      style={[styles.container, props.style, animatedStyle]}
      onPressIn={() => {fadeOut(); if(props.onPressIn) props.onPressIn()}} 
      onPressOut={() => {fadeIn(); if(props.onPressOut) props.onPressOut()}}
    >
      {props.children}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {

  },
});

export default CustomPressableOpacity;