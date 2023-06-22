import React, { memo, useLayoutEffect, useMemo } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import BoldText from '../BoldText';
import CustomPressableOpacity from '../CustomPressableOpacity';
import colors from '../../constants/colors';
import values from '../../constants/values';
import { addOpacityToColor } from '../../shared/sharedFunctions';

const backgroundColor = addOpacityToColor(colors.thirdColor, values.titleOnImageOpacity);

const ShopTile = props => {
  
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
  // ####################################

  const imageUrl = useMemo(() => {
    return props.imageUrl && props.imageUrl.length > 0 ? { uri: props.imageUrl } : require('../../assets/dely-placeholder.png')
  }, [props.imageUrl]);

  const navigateToLocations = () => {
    props.navigation.navigate('Locations', {
      shopId: props.shopId,
      shopTitle: props.title,
      shopDescription: props.description,
      shopImageUrl: props.imageUrl,
      currency: props.currency,
      fromShopsScreen: true,
    });
  };

  return (
    <Animated.View style={[styles.tileContainer, animatedStyle]}>
      <CustomPressableOpacity style={styles.tile} onPress={navigateToLocations}>
        <Image style={styles.image} source={imageUrl} />
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
    borderRadius: values.borderRadius,
    backgroundColor: colors.imageBackgroundColor
  },
  image: {
    width: '100%',
    height: '100%'
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 10,
    backgroundColor: backgroundColor,
  },
  titleText: {
    fontSize: values.headerTextSize / 1.4,
  }
});

export default memo(ShopTile);