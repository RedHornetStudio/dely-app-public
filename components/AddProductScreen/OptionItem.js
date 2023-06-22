import React, { memo, useLayoutEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

import colors from '../../constants/colors';
import values from '../../constants/values';
import BoldText from '../BoldText';
import RegularText from '../RegularText';
import BottomLine from '../BottomLine';
import Badge from '../../components/Badge';
import CustomPressableOpacity from '../CustomPressableOpacity';

const OptionItem = props => {

  // ### Fading in animation
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
  // ##########################################

  // ### Creating options string
  const optionsString = useMemo(() => {
    let optionsString = '';
    props.option.options.map(option => {
      optionsString = optionsString.length === 0 ? `${option.title}${option.price.length > 0 ? ` (${option.price}${props.currency})` : ``} `  : `${optionsString} ${option.title}${option.price.length > 0 ? ` (${option.price}${props.currency})` : ``} `
    });
    return optionsString;
  }, []);

  // ### Handlers
  const onEditPressHandler = () => {
    props.navigation.navigate('AddOption', { optionToEditIndex: props.index, optionToEdit: props.option });
  };

  const onDeletePressHandler = () => {
    props.setItemToDeleteIndex(props.index);
    props.setDeleteModalVisibility(true);
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.titleContainer}>
        <BoldText style={styles.titleText} numberOfLines={1}>{props.option.title}</BoldText>
        <View style={styles.badgeContainer}>
          {props.option.required
            ? <Badge style={styles.badge} badgeTextStyle={styles.badgeText}>{props.appText.required}</Badge>
            : null
          }
          {props.option.multiple
            ? <Badge style={styles.badge} badgeTextStyle={styles.badgeText}>{props.appText.multiple}</Badge>
            : null
          }
        </View>
      </View>
      <View style={styles.optionsContainer}>
        <RegularText style={styles.optionsString}>{optionsString}</RegularText>
        <CustomPressableOpacity style={styles.buttons} onPress={onDeletePressHandler}>
          <MaterialIcons name="delete" size={values.headerTextSize} color={colors.primaryColor} />
        </CustomPressableOpacity>
        <CustomPressableOpacity style={styles.buttons} onPress={onEditPressHandler}>
          <Feather name="edit-3" size={values.headerTextSize} color={colors.primaryColor} />
        </CustomPressableOpacity>
      </View>
      <BottomLine/>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: values.topMargin,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '65%',
  },
  badgeContainer: {
    flexDirection: 'row',
    marginLeft: 5,
  },
  badge: {
    width: 'auto',
    height: 'auto',
    paddingHorizontal: 5,
  },
  badgeText: {
    fontSize: values.regularTextSize / 1.5,
  },
  optionsString: {
    flex: 1,
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  buttons: {
    marginLeft: 10,
  },
});

export default memo(OptionItem);