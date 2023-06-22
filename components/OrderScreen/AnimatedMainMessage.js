import React, { useLayoutEffect, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import BoldText from '../BoldText';
import values from '../../constants/values';

const AnimatedMainMessage = props => {

  // ### Fading in
  const animatedOpacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
    }
  });
  // On first render show text without fade in
  const firstRender = useRef(true);
  useEffect(() => {
    firstRender.current = false;
  }, []);
  useLayoutEffect(() => {
    if (firstRender.current) return;
    animatedOpacity.value = 0;
    animatedOpacity.value = withTiming(1, { duration: values.animationDuration });
  }, [props.children]);
  // ###################################

  return (
    <Animated.View style={[props.style, animatedStyle]}>
      <BoldText style={styles.text}>{props.children}</BoldText>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    fontSize: values.headerTextSize,
  },
});

export default AnimatedMainMessage;