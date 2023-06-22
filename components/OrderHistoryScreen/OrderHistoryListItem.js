import React, { memo, useLayoutEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import values from '../../constants/values';
import RegularText from '../RegularText';
import BoldText from '../BoldText';
import CustomPressableOpacity from '../CustomPressableOpacity';
import BottomLine from '../BottomLine';

const OrderHistoryListItem = props => {
  console.log('OrderHistoryListItem: ' + props.order_number);

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
  }, [props.index]);
  // ###################################

  const onPressHandler = () => {
    props.navigation.navigate('Order', { orderId: props.id, orderNumber: props.order_number, deliveryMethod: props.delivery_method, loadOnStart: true });
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View />
      <CustomPressableOpacity style={styles.textContainer} onPress={onPressHandler}>
        <Text><BoldText>{`${props.appText.order}: `}</BoldText><RegularText style={styles.number}>{props.order_number}</RegularText></Text>
        <RegularText>{props.order_generation_time}</RegularText>
      </CustomPressableOpacity>
      <BottomLine />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    height: values.orderHistoryListItemHeight,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  number: {
    fontSize: values.regularTextSize * 1.3,
  },
});

export default memo(OrderHistoryListItem);