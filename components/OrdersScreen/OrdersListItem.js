import React, { memo, useLayoutEffect, useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import colors from '../../constants/colors';
import values from '../../constants/values';
import RegularText from '../RegularText';
import BoldText from '../BoldText';
import BottomLine from '../BottomLine';
import CustomPressableOpacity from '../CustomPressableOpacity';
import MainButton from '../MainButton';

const OrdersListItem = props => {

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

  // ### Creating order creation time and status color
  const time = useMemo(() => {
    const creationHourString = new Date(props.order_generation_time).getHours().toString();
    const hours = creationHourString.length === 1 ? `0${creationHourString}` : creationHourString;
    const creationMinutesString = new Date(props.order_generation_time).getMinutes().toString();
    const minutes = creationMinutesString.length === 1 ? `0${creationMinutesString}` : creationMinutesString;
    return `${hours}:${minutes}`;
  }, [props.order_generation_time]);
  const statusColor = useMemo(() => {
    let statusColor = colors.primaryColor;
    switch (props.status) {
      case 'preparing':
        statusColor = colors.secondaryColor;
        break;
      case 'ready':
        statusColor = colors.fourthColor;
        break;
    }
    return statusColor;
  }, [props.status]);
  const items = useMemo(() => {
    return JSON.parse(props.items);
  }, [props.items]);
  // ####################

  // ### Handlers
  const onPressSendTimeHandler = () => {
    props.setHours('');
    props.setMinutes('');
    props.setSendTimeOrderId(props.id);
    props.setSendTimeAboveMessage(true);
  };

  const onPressChangeStatusHandler = () => {
    let nextStatus = 'preparing';
    switch (props.status) {
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
    props.setChangeStatusAboveMessageOrderNumberAndId({ number: props.order_number, id: props.id });
    props.setChangeStatusAboveMessageNextStatus(nextStatus);
    props.setChangeStatusAboveMessage(true);
  };

  const onPressItemHandler = () => {
    props.navigation.navigate('OrderDetails', { orderId: props.id, orderNumber: props.order_number, currency: props.currency, orderManaging: true });
  };
  // ####################################################################

  return (
    <Animated.View style={[styles.container, { height: values.orderListItemHeight + (items.length - 1) * values.orderListItemAdditionalHeight }, animatedStyle]}>
      <CustomPressableOpacity style={styles.pressable} onPress={onPressItemHandler}>
        <View style={styles.contentContainer}>
          <View style={styles.firstRow}>
            <BoldText style={styles.number}>{props.order_number}</BoldText>
            <RegularText>{`${props.appText[props.delivery_method]}${props.delivery_method === 'delivery' ? props.delivery_price === '0.00' ? '' : ` (${props.currency} ${props.delivery_price})` : ''}`}</RegularText>
            <RegularText style={[styles.statusText, { color: statusColor }]}>{props.appText[props.status]}</RegularText>
            <RegularText style={styles.time}>{time}</RegularText>
          </View>
            {items.map(item => {
              let itemTitle = '';
              if (item.count > 1) itemTitle = `${item.count} x `;
              itemTitle += `${item.title} (${props.currency} ${item.price})`;
              let itemOptions = '';
              item.selectedOptions?.forEach(selectedOption => {
                itemOptions += ` ${selectedOption}`;
              });
              return (
                <View style={styles.item} key={item.id}>
                  <Text numberOfLines={2}><BoldText>{`- ${itemTitle}`}</BoldText><RegularText>{itemOptions}</RegularText></Text>
                </View>
              );
            })}
          <View style={styles.price}><BoldText>{`${props.appText.totalPrice}`}</BoldText><BoldText>{` ${props.currency} ${props.total_price}`}</BoldText></View>
          <View style={styles.buttonsContainer}>
            <MainButton style={styles.button} empty={props.time_sended === 1} buttonTextStyle={styles.buttonTextStyle} onPress={onPressSendTimeHandler} useRegularText={true} numberOfLines={1}>{props.appText.sendTime}</MainButton>
            <MainButton style={[styles.button, styles.margin]} buttonTextStyle={styles.buttonTextStyle} onPress={onPressChangeStatusHandler} useRegularText={true} numberOfLines={1}>{props.appText.changeStatus}</MainButton>
          </View>
        </View>
      </CustomPressableOpacity>
      <BottomLine />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: values.windowHorizontalPadding,
  },
  pressable: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  firstRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: values.topMargin / 3,
  },
  order: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  number: {
    fontSize: values.regularTextSize * 1.3,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: values.topMargin / 2,
  },
  button: {
    width: 150,
    height: 25,
    paddingHorizontal: 5,
    borderRadius: 100,
  },
  buttonTextStyle: {
    fontSize: values.regularTextSize / 1.2,
  },
  margin: {
    marginStart: 10,
  },
});

export default memo(OrdersListItem);