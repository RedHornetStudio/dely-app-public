import React, { useLayoutEffect } from 'react';
import  { StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';

import colors from '../../constants/colors';
import values from '../../constants/values';
import RegularText from '../../components/RegularText';
import CustomPressableOpacity from '../../components/CustomPressableOpacity';

const ShowDetailsContainer = props => {
  const { appText } = props;

  // ### Fading in
  const animatedOpacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
    }
  });
  useLayoutEffect(() => {
    if (!props.loadOnStart) return;
    animatedOpacity.value = 0;
    animatedOpacity.value = withTiming(1, { duration: values.animationDuration });
  }, []);
  // ###################################

  return (
    <Animated.View style={[styles.showDetailsContainer, animatedStyle]}>
      <CustomPressableOpacity style={styles.button} onPress={props.onPress}>
        <RegularText>{appText.showDetails}</RegularText>
        <MaterialIcons name="keyboard-arrow-right" size={values.headerTextSize} color={colors.primaryColor} />
      </CustomPressableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  showDetailsContainer: {
    backgroundColor: colors.thirdColor,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: values.topMargin,
  },
});

export default ShowDetailsContainer;