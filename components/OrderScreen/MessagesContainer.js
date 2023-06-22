import React, { useLayoutEffect } from 'react';
import  { StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
// import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import colors from '../../constants/colors';
import values from '../../constants/values';
import BoldText from '../BoldText';
import HeaderBigIcon from '../HeaderBigIcon';
import AnimatedMainMessage from './AnimatedMainMessage';
import AnimatedSecondaryMessage from './AnimatedSecondaryMessage';

const MessagesContainer = props => {
  const { mainMessageText, secondaryMessage, orderNumber } = props;

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
    <Animated.View style={animatedStyle}>
      <AnimatedMainMessage style={styles.mainMessage}>{mainMessageText}</AnimatedMainMessage>
      {/* <HeaderBigIcon><FontAwesome name="qrcode" size={values.headerBigIconSize} color={colors.primaryColor} /></HeaderBigIcon> */}
      <HeaderBigIcon><Ionicons name="time-outline" size={values.headerBigIconSize} color={colors.primaryColor} /></HeaderBigIcon>
      <BoldText style={styles.orderNumber}>{orderNumber}</BoldText>
      <AnimatedSecondaryMessage style={styles.secondaryMessage}>{secondaryMessage}</AnimatedSecondaryMessage>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  mainMessage: {
    marginTop: values.topMargin * 2,
  },
  orderNumber: {
    fontSize: values.headerTextSize * 2,
    textAlign: 'center',
  },
  secondaryMessage: {
    marginTop: values.topMargin,
  },
});

export default MessagesContainer;