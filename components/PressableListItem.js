import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import RegularText from './RegularText';
import BoldText from './BoldText';
import values from './../constants/values';
import colors from './../constants/colors';
import CustomPressableOpacity from './CustomPressableOpacity';
import BottomLine from './BottomLine';

const PressableListItem = props => {
  return (
  <View style={[styles.container, props.style]}>
    <CustomPressableOpacity onPress={props.onPress}>
      <View style={styles.infoContainer}>
        <View style={styles.settingContainer}>
          <RegularText style={styles.settingTitle} numberOfLines={2}>{props.settingTitle}</RegularText>
          {props.currentSetting
            ? <BoldText style={styles.settingOption}>{props.currentSetting}</BoldText>
            : null
          }
        </View>
        <MaterialIcons name="keyboard-arrow-right" size={values.headerTextSize} color={colors.primaryColor} />
      </View>
    </CustomPressableOpacity>
    <BottomLine style={styles.bottomLine} />
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: values.topMargin,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: values.regularTextSize,
  },
  bottomLine: {
    marginTop: values.topMargin,
  },
});

export default PressableListItem;