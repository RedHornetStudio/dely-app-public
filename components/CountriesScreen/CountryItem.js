import React, { memo, useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import values from '../../constants/values';
import BoldText from '../../components/BoldText';
import CustomPressableOpacity from '../../components/CustomPressableOpacity';
import { countryChanged } from '../../features/appSettingsSlice';
import BottomLine from '../../components/BottomLine';

const CountryItem = props => {

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
  }, [props.index]);
  // #############################################

  // Selecting country
  const dispatch = useDispatch();
  const countrySelected = async () => {
    try {
      await AsyncStorage.setItem('@country', props.id);
    } catch (error) {
      console.log(`Error while saving settings to memory: ${error}`);
    }
    dispatch(countryChanged(props.id));
    props.settingsPicker ? props.navigation.goBack() : props.navigation.replace('Main');
  };

  return (
    <Animated.View style={[styles.countryContainer, animatedStyle]}>
      <View />
      <CustomPressableOpacity onPress={countrySelected}>
        <BoldText style={styles.country}>{props.appText.countries[props.id]}</BoldText>
      </CustomPressableOpacity>
      <BottomLine style={styles.bottomLine} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  countryContainer: {
    justifyContent: 'space-between',
    height: values.countryListItemHeight,
  },
});

export default memo(CountryItem);