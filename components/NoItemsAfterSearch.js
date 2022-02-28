import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import values from '../constants/values';
import RegularText from './RegularText';

const NoItemsAfterSearch = props => {
  
  // Fading in
  const animatedOpacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
    }
  });

  useEffect(() => {
    animatedOpacity.value = withTiming(1, { duration: values.animationDuration });
  });
  // --------------------------------------------

  return (
    <Animated.View style={[styles.infoContainer, animatedStyle]}>
      <RegularText style={styles.infoText}>{props.text}</RegularText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: values.topMargin,
  },
});

export default NoItemsAfterSearch;