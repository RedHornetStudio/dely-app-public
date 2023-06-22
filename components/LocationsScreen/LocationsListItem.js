import React, { memo, useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

import RegularText from '../RegularText';
import BoldText from '../BoldText';
import Badge from '../Badge';
import values from '../../constants/values';
import colors from '../../constants/colors';
import CustomPressableOpacity from '../CustomPressableOpacity';
import BottomLine from '../BottomLine';
import MainSwitch from '../MainSwitch';

const LocationListItem = props => {

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
  }, [props.index, props.stringifiedData]);
  // ###################################

  // ### Handlers
  const onPressitemHandlers = () => {
    if (props.manageOrders) {
      props.navigation.navigate('Orders', {
        locationId: props.locationId,
        shopTitle: props.shopTitle,
        shopImageUrl: props.shopImageUrl,
        currency: props.currency,
        locationCity: props.city,
        locationAddress: props.address,
      });
      return;
    }
    if (props.regularScreen) {
      props.navigation.navigate('Products', {
        shopId: props.shopId,
        shopTitle: props.shopTitle,
        shopDescription: props.shopDescription,
        shopImageUrl: props.shopImageUrl,
        currency: props.currency,
        locationId: props.locationId,
        locationCity: props.city,
        locationAddress: props.address,
        deliveryMethods: {
          delivery: props.deliveryMethodDelivery,
          inPlace: props.deliveryMethodInPlace,
          takeAway: props.deliveryMethodTakeAway
        },
        deliveryPrice: props.deliveryPrice,
        phoneNumber: props.phoneNumber,
        workingHours: props.workingHours,
        opened: props.opened,
      });
      return;
    }
  };

  const onDeletePressHandler = () => {
    props.setDeleteModalVisibility(true);
    props.setItemToDeleteId(props.id);
  };

  const onEditPressHandler = () => {
    props.navigation.navigate('AddLocation', {
      editingMode: true,
      id: props.id,
      shopId: props.shopId,
      city: props.city,
      address: props.address,
      phoneNumber: props.phoneNumber,
      timeZone: props.timeZone,
      delivery: props.delivery,
      inPlace: props.inPlace,
      takeAway: props.takeAway,
      workingHours: JSON.parse(props.workingHours),
      deliveryPrice: props.deliveryPrice,
    });
  };
  // ##################################################

  return (
    <Animated.View style={[styles.container, props.style, animatedStyle]}>
      <View></View>
      <CustomPressableOpacity disabled={props.disabled} onPress={onPressitemHandlers}>
        <View style={styles.infoContainer}>
          <View style={styles.addressContainer}>
            <BoldText numberOfLines={1} style={[styles.text, props.manageLocations ? {} : { marginRight: 5, }]}>{`${props.city}, ${props.address}`}</BoldText>
            <RegularText numberOfLines={1} style={[styles.text, props.manageLocations ? {} : { marginRight: 5, }]}>{`${props.appText.today} ${props.todayWorkingTimes === 'closed' ? `--${props.appText.closed}--`.toLowerCase() : props.todayWorkingTimes}`}</RegularText>
          </View>
          {props.showBadge &&
            <Badge style={styles.badge} badgeTextStyle={styles.badgeTextStyle} empty={!props.opened}>{props.opened ? props.appText.opened : props.appText.closed}</Badge>
          }
          {props.manageNotifications &&
            <MainSwitch
              index={props.index}
              value={true}
              switchValue={props.switchValue}
              setSwitchValues={props.setSwitchValues}
              multiple={true}
            />
          }
        </View>
      </CustomPressableOpacity>
      {props.manageLocations
        ? <View style={styles.buttonsContainer}>
          <CustomPressableOpacity style={styles.buttons} onPress={onDeletePressHandler}>
            <MaterialIcons name="delete" size={values.headerTextSize} color={colors.primaryColor} />
          </CustomPressableOpacity>
          <CustomPressableOpacity style={styles.editButton} onPress={onEditPressHandler}>
            <Feather name="edit-3" size={values.headerTextSize} color={colors.primaryColor} />
          </CustomPressableOpacity>
        </View>
        : null
      }
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
  text: {
    // backgroundColor: 'red',
  },
  badge: {
    width: values.regularTextSize * 4,
    height: values.regularTextSize * 1.5,
  },
  badgeTextStyle: {
    fontSize: values.regularTextSize / 1.5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    right: 0,
    bottom: 0,
    marginBottom: values.locationListItemHeight / 7,
  },
  editButton: {
    marginLeft: 10,
  },
});

export default memo(LocationListItem);