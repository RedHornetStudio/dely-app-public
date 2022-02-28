import React, { useLayoutEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import values from '../../constants/values';
import RegularText from '../RegularText';
import BoldText from '../BoldText';
import CustomPressableOpacity from '../CustomPressableOpacity';
import { roundWithZeros } from '../../shared/sharedFunctions';
import BottomLine from '../BottomLine';

const ProductItem = props => {

  // Fading in
  const animatedOpacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
    }
  });

  useLayoutEffect(() => {
    animatedOpacity.value = withTiming(1, { duration: values.animationDuration });
  }, [])
  // --------------------------------------------

  return (
    <Animated.View style={[
        styles.productContainer,
        props.style,
        animatedStyle]}>
      <View />
      <CustomPressableOpacity onPress={props.onPress}>
        <View style={styles.row}>
          <Image style={styles.image} source={{ uri: props.imageUrl }} resizeMode='cover' />
          <View style={styles.titleContainer}>
            <BoldText style={styles.titleText} numberOfLines={2}>{props.title}</BoldText>
            <RegularText>{`${props.currency} ${roundWithZeros(props.price, 2)}`}</RegularText>
          </View>
        </View>
      </CustomPressableOpacity>
      <BottomLine style={styles.bottomLine} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    justifyContent: 'space-between',
    height: values.listItemHeight,
  },
  row: {
    flexDirection: 'row',
  },
  image: {
    width: 140,
    height: 70,
    marginRight: 5,
  },
  titleContainer: {
    flex: 1,
  },
  bottomLine: {

  },
});

export default ProductItem;