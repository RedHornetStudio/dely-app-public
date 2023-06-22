import React, { useLayoutEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import values from '../../constants/values';
import RegularText from '../RegularText';
import BoldText from '../BoldText';
import BottomLine from '../BottomLine';

const OrderDetailsContainer = props => {
  const { appText, order, orderNumber, orderDate, orderDeliveryMethod } = props;

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

  return (
    <Animated.View style={[styles.dataContainer, animatedStyle]}>
      <View style={styles.itemContainer}>
        <Text><BoldText>{`${appText.order}: `}</BoldText><RegularText style={styles.orderNumber}>{orderNumber}</RegularText></Text>
        <RegularText style={styles.date}>{orderDate}</RegularText>
        <BottomLine style={styles.line} />
      </View>
      <View style={styles.itemContainer}>
        <Text><BoldText>{`${appText.where}: `}</BoldText><RegularText>{`${order.locationData.shopTitle}, ${order.locationData.address}, ${order.locationData.city}`}</RegularText></Text>
        <BottomLine style={styles.line} />
      </View>
      <View style={styles.itemContainer}>
        <Text><BoldText>{`${appText.deliveryMethod}: `}</BoldText><RegularText>{`${props.appText[orderDeliveryMethod]}${orderDeliveryMethod === 'delivery' ? order.delivery_price === '0.00' ? '' : ` (${order.currency} ${order.delivery_price})` : ''}`}</RegularText></Text>
        <BottomLine style={styles.line} />
      </View>
      <View>
        {order.items.map((item, index) => {
          return (
            <View key={index} style={styles.item}>
              {item.count > 1
                ? <BoldText style={styles.itemTitle}>{`${item.count} x ${item.title} (${order.currency} ${item.price})`}</BoldText>
                : <BoldText style={styles.itemTitle}>{`${item.title} (${order.currency} ${item.price})`}</BoldText>
              }
              {item.options.map((option, index) => {
                return (
                  <Text key={index} style={styles.option}>
                    <BoldText>{`${option.title}:`}</BoldText>
                    {option.selectedOptions.length === 0 &&
                      <RegularText key={index}>{' ---'}</RegularText>
                    }
                    {option.selectedOptions.map((selectedOption, index) => {
                      return (
                        index + 1 < option.selectedOptions.length
                          ? <RegularText key={index}>{` ${selectedOption.title},`}</RegularText>
                          : <RegularText key={index}>{` ${selectedOption.title}`}</RegularText>
                      );
                    })}
                  </Text>
                );
              })}
            </View>
          );
        })}
        <BottomLine style={styles.line} />
        <View style={styles.itemContainer}>
          <Text style={styles.totalPrice}><BoldText>{`${appText.totalPrice}`}</BoldText><BoldText>{` ${order.currency} ${order.total_price}`}</BoldText></Text>
          <BottomLine style={styles.line} />
        </View>
        <View style={styles.itemContainer}>
          <Text>
            <BoldText>{`${appText.who}: `}</BoldText>
            {/* {order.buyer_name.lenght > 0
              ? <RegularText>{order.buyer_name}</RegularText>
              : null
            } */}
            {order.phone_number.length > 0
              ? <RegularText>{`${appText.phoneNumber[0].toLowerCase()}${appText.phoneNumber.substring(1)} ${order.phone_number}`}</RegularText>
              : null
            }
            {order.address.length > 0
              ? <RegularText>{`, ${order.address}`}</RegularText>
              : null
            }
            {order.door_code.length > 0
              ? <RegularText>{`, ${appText.doorCode[0].toLowerCase()}${appText.doorCode.substring(1)} ${order.door_code}`}</RegularText>
              : null
            }
          </Text>
          <BottomLine style={styles.line} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    marginTop: values.topMargin,
  },
  line: {
    marginTop: values.topMargin,
  },
  orderNumber: {
    fontSize: values.regularTextSize * 1.3,
  },
  date: {
    marginTop: values.topMargin / 5,
    fontSize: values.regularTextSize / 1.1,
  },
  item: {
    marginTop: values.topMargin,
  },
  itemTitle: {
    fontSize: values.regularTextSize * 1.1,
  },
  option: {
    marginLeft: 10,
    marginTop: values.topMargin / 4,
  },
  totalPrice: {
    alignSelf: 'flex-end',
  },
});

export default OrderDetailsContainer;