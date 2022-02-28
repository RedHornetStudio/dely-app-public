import React, { useEffect, useLayoutEffect } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import colors from '../constants/colors';
import values from '../constants/values';
import RegularText from './RegularText';

const Loading = props => {

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
      <ActivityIndicator size={'large'} color={colors.primaryColor} />
    </Animated.View>
  );
}

const Error = props => {

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
      <MaterialIcons style={styles.errorIcon} name="error-outline" size={values.headerTextSize * 2} color={colors.primaryColor} />
      <RegularText style={styles.infoText}>{props.appText.somethingWentWrong}</RegularText>
    </Animated.View>
  );
}

const NoItems = props => {
  
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
      <RegularText style={styles.infoText}>{props.noItemsText}</RegularText>
    </Animated.View>
  );
}

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
      <RegularText style={styles.infoText}>{props.noItemsAfterSearchText}</RegularText>
    </Animated.View>
  );
}

const LoadingErrorIndicator = props => {
  if (props.loading) {
    return (
      <Loading />
    );
  }
  if (props.loadingError) {
    return (
      <Error appText={props.appText} />
    );
  }
  if (!props.loading && !props.loadingError && props.noItems) {
    return (
      <NoItems noItemsText={props.noItemsText} />
    );
  }
  if (!props.loading && !props.loadingError && !props.noItems && props.noItemsAfterSearch) {
    return (
      <NoItemsAfterSearch noItemsAfterSearchText={props.noItemsAfterSearchText} />
    );
  }
  return null;
};

const styles = StyleSheet.create({
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: values.topMargin,
  },
  errorIcon: {
    alignSelf: 'center',
  },
});

export default LoadingErrorIndicator;