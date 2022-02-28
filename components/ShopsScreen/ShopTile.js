import React, { useLayoutEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import BoldText from '../BoldText';
import CustomPressableOpacity from '../CustomPressableOpacity';
import values from '../../constants/values';

const ShopTile = props => {

  // Fading in
  const animatedOpacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
    }
  });

  useLayoutEffect(() => {
    animatedOpacity.value = 0;
    animatedOpacity.value = withTiming(1, { duration: values.animationDuration });
  }, [props.index])
  // --------------------------------------------

  return (
    <Animated.View style={[styles.tileContainer, animatedStyle]}>
      <CustomPressableOpacity style={styles.tile} onPress={props.onPress}>
        <Image style={styles.image} source={{ uri: props.imageUrl }} />
        <View style={styles.titleContainer}>
          <BoldText style={styles.titleText} numberOfLines={1}>{props.title}</BoldText>
        </View>
      </CustomPressableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tileContainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: values.topMargin,
  },
  tile: {
    overflow: 'hidden',
    height: values.shopTileHeight,
    borderRadius: 15,
  },
  image: {
    flex: 1,
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  titleText: {
    fontSize: values.regularTextSize,
  }
});

export default ShopTile;