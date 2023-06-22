import React, { useLayoutEffect, useMemo } from "react";
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import colors from "../../constants/colors";
import values from "../../constants/values";
import MainButton from "../MainButton";
import BoldText from "../BoldText";
import RegularText from "../RegularText";

const OrderDetailsBottomButtons = props => {

  const insets = useSafeAreaInsets();

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

  // ### Creating status color
  const statusColor = useMemo(() => {
    let statusColor = colors.primaryColor;
    switch (props.order.status) {
      case 'preparing':
        statusColor = colors.secondaryColor;
        break;
      case 'ready':
        statusColor = colors.fourthColor;
        break;
    }
    return statusColor;
  }, [props.order]);
  // ####################

  // ### Handlers
  const onPressSendTimeHandler = () => {
    props.setSendTimeAboveMessage(true);
  };

  const onPressChangeStatusHandler = () => {
    let nextStatus = 'preparing';
    switch (props.order.status) {
      case 'preparing':
        nextStatus = 'ready';
        break;
      case 'ready':
        nextStatus = 'closed';
        break;
      case 'closed':
        nextStatus = 'preparing';
        break;
    }
    props.setChangeStatusAboveMessageNextStatus(nextStatus);
    props.setChangeStatusAboveMessage(true);
  };
  // #######################################

  return (
    <Animated.View style={[styles.container, { paddingTop: values.topMargin / 2, paddingBottom: values.topMargin / 2 + insets.bottom }, animatedStyle]}>
      <View style={styles.statusContainer}>
        <BoldText>{`${props.appText.status}:`}</BoldText>
        <RegularText style={[styles.status, { color: statusColor }]}>{props.appText[props.order.status]}</RegularText>
      </View>
      <View style={styles.buttonContainer}>
        <MainButton empty={props.order.time_sended === 1} onPress={onPressSendTimeHandler}>{props.appText.sendTime}</MainButton>
        <MainButton onPress={onPressChangeStatusHandler}>{props.appText.changeStatus}</MainButton>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.thirdColor
  },
  statusContainer: {
    alignItems: 'center',
  },
  status: {
    fontSize: values.regularTextSize * 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: values.topMargin / 2,
  },
});

export default OrderDetailsBottomButtons;