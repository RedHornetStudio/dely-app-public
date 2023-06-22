import React from "react";
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import colors from "../constants/colors";
import values from "../constants/values";
import MainButton from "./MainButton";

const BottomButtonContainer = props => {

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: values.topMargin / 2, paddingBottom: values.topMargin / 2 + insets.bottom }]}>
      <MainButton onPress={props.onPress}>{props.title}</MainButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.thirdColor
  }
});

export default BottomButtonContainer;