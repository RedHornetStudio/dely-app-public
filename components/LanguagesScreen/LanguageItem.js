import React, { memo, useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import axios from 'axios';

import values from '../../constants/values';
import RegularText from '../../components/RegularText';
import BoldText from '../../components/BoldText';
import CustomPressableOpacity from '../../components/CustomPressableOpacity';
import BottomLine from '../../components/BottomLine';
import { appLanguageChanged } from '../../features/appSettingsSlice';
import { concatErrors } from '../../shared/sharedFunctions';

const LanguageItem = props => {

  // auth tokens
  const auth = useSelector(state => state.authSlice);

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
  // ####################################

  // Selecting language
  const dispatch = useDispatch();
  const languageSelected = async () => {
      try {
        await AsyncStorage.setItem('@appLanguage', props.id);
      } catch (error) {
        console.log(`Error while saving settings to memory: ${error}`);
      }
      if (auth.refreshToken) {
        try {
          props.setLoadingModal(true);
          let res = (await axios.post(`${values.requestUrl}auth/postChangeLanguage`, { refreshToken: auth.refreshToken, language: props.id })).data;
          if (res.status === 'FAILED') throw new Error (concatErrors(res.errors));
        } catch (error) {
          console.log('Error while changing user language in database: ' + error.message);
          props.setLoadingModal(false);
          props.setAboveMessage(true);
          return;
        }
      }
      dispatch(appLanguageChanged(props.id));
      props.navigation.goBack();
  };

  return (
    <Animated.View style={[styles.languageContainer, animatedStyle]}>
      <View />
      <CustomPressableOpacity onPress={languageSelected}>
        <BoldText style={styles.languageTranslated}>{props.languages[props.id]}</BoldText>
        <RegularText style={styles.language}>{props.languages[props.id + 'Translated']}</RegularText>
      </CustomPressableOpacity>
      <BottomLine style={styles.bottomLine} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  languageContainer: {
    justifyContent: 'space-between',
    height: values.languageListItemHeight,
  },
});

export default memo(LanguageItem);