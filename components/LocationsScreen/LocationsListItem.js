import React, { useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import RegularText from '../RegularText';
import BoldText from '../BoldText';
import Badge from '../Badge';
import values from '../../constants/values';
import CustomPressableOpacity from '../CustomPressableOpacity';
import BottomLine from '../BottomLine';
import { backgroundColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

const LocationListItem = props => {

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


  // Showing shop is closed or opened
  let todayWorkingTimes = props.opened[new Date().getDay()];
  let shopOpened;
  if (todayWorkingTimes === 'closed') {
    shopOpened = false;
    todayWorkingTimes = `--${props.appText.closed}--`.toLowerCase();
  } else {
    const openTime = todayWorkingTimes.split('-')[0];
    const closeTime = todayWorkingTimes.split('-')[1];
    const todayDate = new Date();
    const openTimeDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), parseInt(openTime.split(':')[0]), parseInt(openTime.split(':')[1]), 0);
    const closeTimeDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), parseInt(closeTime.split(':')[0]), parseInt(closeTime.split(':')[1]), 59);
    shopOpened = todayDate.getTime() >= openTimeDate.getTime() && todayDate.getTime() <= closeTimeDate.getTime() ? true : false;
  }

  return (
    <Animated.View style={[styles.container, props.style, animatedStyle]}>
      <View></View>
      <CustomPressableOpacity onPress={props.onPress}>
        <View style={styles.infoContainer}>
          <View style={styles.addressContainer}>
            <BoldText style={styles.addressText} numberOfLines={1}>{`${props.city}, ${props.address}`}</BoldText>
            <RegularText style={styles.addressTime}>{`${props.appText.today} ${todayWorkingTimes}`}</RegularText>
          </View>
          <Badge style={styles.badge} badgeTextStyle={styles.badgeTextStyle} empty={!shopOpened}>{shopOpened ? props.appText.opened : props.appText.closed}</Badge>
        </View>
      </CustomPressableOpacity>
      <BottomLine style={styles.bottomLine} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginTop: values.topMargin,
    justifyContent: 'space-between',
    height: values.locationListItemHeight,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressContainer: {
    flex: 1,
  },
  badge: {
    width: values.regularTextSize * 4,
    height: values.regularTextSize * 1.5,
  },
  badgeTextStyle: {
    fontSize: values.regularTextSize / 1.5,
  },
});

export default LocationListItem;