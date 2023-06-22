import React, { memo, useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';

import colors from '../../constants/colors';
import values from '../../constants/values';
import BoldText from '../BoldText';
import CustomPressableOpacity from '../CustomPressableOpacity';
import BottomLine from '../BottomLine';

const UserListItem = props => {

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
  // ###################################

  const onDeletePressHandler = () => {
    props.setUserIdAndEmail({ id: props.id, email: props.email });
    props.setDeleteUserModal(true);
  };

  return (
    <Animated.View style={[styles.container, props.style, animatedStyle]}>
      <View />
      <View style={styles.textContainer}>
        <BoldText style={styles.email} numberOfLines={1}>{props.email}</BoldText>
        <CustomPressableOpacity style={styles.buttons} onPress={onDeletePressHandler}>
          <MaterialIcons name="delete" size={values.headerTextSize} color={colors.primaryColor} />
        </CustomPressableOpacity>
      </View>
      <BottomLine />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    height: values.userListItemHeight,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  email: {
    flex: 1,
    marginRight: 5,
  },
});

export default memo(UserListItem);