import React, { useLayoutEffect, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import values from '../constants/values';
import RegularText from './RegularText';

const NoItemsAfterSearch = props => {
  
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
  // ################################

  return (
    <Animated.View style={[styles.infoContainer, animatedStyle]}>
      <RegularText style={styles.infoText}>{props.text}</RegularText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: values.topMargin,
  },
  infoText: {
    textAlign: 'center',
  },
});

export default NoItemsAfterSearch;