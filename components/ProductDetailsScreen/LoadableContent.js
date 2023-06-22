import React, { useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import values from '../../constants/values';
import RegularText from '../RegularText';
import OptionItem from './OptionItem';

const LoadableContent = props => {
  const options = props.productData.options;

  // Fading in
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
      <RegularText style={styles.description}>{props.productData.description}</RegularText>
      {options.map((option, index) => {
        return (
          <OptionItem
            key={JSON.stringify(option)}
            option={option}
            currency={props.currency}
            productData={props.productData}
            index={index}
            setChoices={props.setChoices}
            appText={props.appText}
          />
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: values.topMargin,
  },
});

export default LoadableContent;