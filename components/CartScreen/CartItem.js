import React, { memo, useLayoutEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import bigDecimal from 'js-big-decimal';

import values from '../../constants/values';
import colors from '../../constants/colors';
import BoldText from '../BoldText';
import RegularText from '../RegularText';
import BottmLine from '../BottomLine';
import CustomPressableOpacity from '../CustomPressableOpacity';
import { itemCountIncreased, itemCountDecrased } from '../../features/shoppingCartSlice';

const CartItem = props => {

  const dispatch = useDispatch();

  // ### Fading in
  const animatedOpacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
    }
  });
  useLayoutEffect(() => {
    if (props.firstRender.current) return;
    animatedOpacity.value = 0;
    animatedOpacity.value = withTiming(1, { duration: values.animationDuration });
  }, [props.index])
  // #############################################

  const choicesString = useMemo(() => {
    let choicesString = '';
    JSON.parse(props.options).forEach(option => {
      option.selected.forEach(elem => {
        choicesString = choicesString.length === 0 ? `${elem} `  : `${choicesString} ${elem} `
      });
    });
    return choicesString;
  }, [props.options]);

  const increaseCountOnPressHandler = () => {
    dispatch(itemCountIncreased(props.index))
  };

  const decreaseCountOnPressHandler = () => {
    dispatch(itemCountDecrased(props.index))
  };

  const deleteItemOnPressHandler = () => {
    props.setShowDeleteItemModal({ index: props.index, title: props.title })
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <BoldText>{props.title}</BoldText>
      {choicesString.length > 0
        ? <RegularText>{choicesString}</RegularText>
        : null
      }
      <View style={styles.priceAndButtonContainer}>
        <BoldText>{`${props.currency} ${new bigDecimal(props.price).multiply(new bigDecimal(props.count)).round(2).getValue()}`}</BoldText>
        <View style={styles.buttonContainer}>
          <CustomPressableOpacity style={[styles.button, styles.deleteButton]} onPress={deleteItemOnPressHandler}>
            <MaterialIcons name="delete" size={values.headerTextSize} color={colors.primaryColor} />
          </CustomPressableOpacity>
          <View style={styles.countContainer}>
            <CustomPressableOpacity style={styles.button} onPress={decreaseCountOnPressHandler}>
              <FontAwesome name="minus-circle" size={values.headerTextSize / 1.3} color={colors.primaryColor} />
            </CustomPressableOpacity>
            <RegularText style={styles.countText} numberOfLines={1}>{props.count}</RegularText>
            <CustomPressableOpacity style={styles.button} onPress={increaseCountOnPressHandler}>
              <FontAwesome name="plus-circle" size={values.headerTextSize / 1.3} color={colors.primaryColor} />
            </CustomPressableOpacity>
          </View>
        </View>
      </View>
      <BottmLine style={styles.bottomLine} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: values.topMargin,
  },
  priceAndButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  countContainer: {
    flexDirection: 'row',
  },
  button: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    marginRight: 10,
  },
  countText: {
    alignSelf: 'center',
    width: 25,
    textAlign: 'center',
  },
});

export default memo(CartItem);