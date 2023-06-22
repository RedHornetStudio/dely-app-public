import React, { useLayoutEffect } from "react";
import { StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import values from "../../constants/values";
import BottomButtonContainer from "../BottomButtonContainer";

const AnimatedBottomButtonContainer = props => {

  // ### Fading in
  const animatedOpacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
    }
  });
  useLayoutEffect(() => {
    animatedOpacity.value = 0;
    animatedOpacity.value = withTiming(1, { duration: values.animationDuration });
  }, []);
  // ###################################

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <BottomButtonContainer {...props} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {

  }
});

export default AnimatedBottomButtonContainer;