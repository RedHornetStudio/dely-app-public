import React, { useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import colors from '../../constants/colors';
import values from '../../constants/values';
import BoldText from '../BoldText';

const ProductsSectionHeader = props => {

  // Fading in
  const animatedOpacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
    }
  });

  useLayoutEffect(() => {
    animatedOpacity.value = withTiming(1, { duration: values.animationDuration });
  }, [])
  // --------------------------------------------

  return (
    <Animated.View style={[styles.sectionContainer, props.style, animatedStyle]}>
      <BoldText style={styles.titleText}>{props.title}</BoldText>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    justifyContent: 'center',
    height: values.sectionHeaderHeight,
    paddingHorizontal: 10,
    backgroundColor: colors.primaryColor,
  },
  titleText: {
    color: 'black',
  }
});

export default ProductsSectionHeader;