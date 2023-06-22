import React, { useLayoutEffect } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import colors from '../constants/colors';
import values from '../constants/values';
import RegularText from './RegularText';

const Loading = props => {

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
    <Animated.View style={[styles.infoContainer, props.style, animatedStyle]}>
      <ActivityIndicator size={'large'} color={colors.primaryColor} />
    </Animated.View>
  );
}

const Error = props => {

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
    <Animated.View style={[styles.infoContainer, props.style, animatedStyle]}>
      <MaterialIcons style={styles.errorIcon} name="error-outline" size={values.headerTextSize * 2} color={colors.primaryColor} />
      <RegularText style={styles.infoText}>{props.somethingWentWrongText}</RegularText>
    </Animated.View>
  );
}

const NoItems = props => {
  
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
    <Animated.View style={[styles.infoContainer, props.style, animatedStyle]}>
      <RegularText style={styles.infoText}>{props.noItemsText}</RegularText>
    </Animated.View>
  );
}

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
    <Animated.View style={[styles.infoContainer, props.style, animatedStyle]}>
      <RegularText style={styles.infoText}>{props.noItemsAfterSearchText}</RegularText>
    </Animated.View>
  );
}

const LoadingErrorIndicator = props => {
  if (props.loading) {
    return (
      <Loading style={props.style} />
    );
  }
  if (props.loadingError) {
    return (
      <Error style={props.style} somethingWentWrongText={props.somethingWentWrongText} />
    );
  }
  if (!props.loading && !props.loadingError && props.noItems) {
    return (
      <NoItems style={props.style} noItemsText={props.noItemsText} />
    );
  }
  if (!props.loading && !props.loadingError && !props.noItems && props.noItemsAfterSearch) {
    return (
      <NoItemsAfterSearch style={props.style} noItemsAfterSearchText={props.noItemsAfterSearchText} />
    );
  }
  return null;
};

const styles = StyleSheet.create({
  infoContainer: {
    marginTop: values.topMargin,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIcon: {
    alignSelf: 'center',
  },
  infoText: {
    textAlign: 'center',
  },
});

export default LoadingErrorIndicator;