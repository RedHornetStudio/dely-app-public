import React, { useLayoutEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import colors from '../../constants/colors';
import values from '../../constants/values';
import BoldText from '../../components/BoldText';
import RegularText from '../../components/RegularText';
import ShopImage from '../../components/ShopImage';
import CustomPressableOpacity from '../../components/CustomPressableOpacity';
import PressableListItem from '../../components/PressableListItem';
import BottomLine from '../../components/BottomLine';
import HeaderButtons, { headerButtonsStyles } from '../../components/HeaderButtons';

const AdminScreenLoadableContent = props => {
  const { appText, shopData, addImageHandler, onPressEditHandler, onSettingsHandler, onPressManageLocationsHandler, onPressManageProductsHandler, onPressManageOrdersHandler, onPressManageNotificationsHandler, onPressManageUsersHandler } = props;

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

  return (
    <Animated.View style={animatedStyle}>
      <ShopImage
        imageUrl={shopData.image_url}
        showAddPhoteIcon={shopData.role === 'admin'}
        addPhoteIconPressHandler={addImageHandler}
      />
      
      <HeaderButtons style={styles.headerButtonsContainer}>
        {shopData.role === 'admin' &&
          <CustomPressableOpacity style={headerButtonsStyles.headerButtons} onPress={onPressEditHandler}>
            <Feather name="edit-3" size={values.headerTextSize} color={colors.primaryColor} />
          </CustomPressableOpacity>
        }
        <CustomPressableOpacity style={headerButtonsStyles.headerButtons} onPress={onSettingsHandler}>
          <Feather name="settings" size={values.headerTextSize} color={colors.primaryColor} />
        </CustomPressableOpacity>
        <CustomPressableOpacity style={headerButtonsStyles.headerButtons} onPress={() => props.setLogoutMessage(true)}>
          <FontAwesome name="sign-out" size={values.headerTextSize} color={colors.primaryColor} />
        </CustomPressableOpacity>
      </HeaderButtons> 
      <View style={styles.contentContainer}>
        <BoldText style={styles.topMargin} numberOfLines={1}>{`${appText.loggedAs}:`}</BoldText>
        <RegularText style={styles.data}>{`${shopData.email}`}</RegularText>
        <RegularText style={styles.data}>{`(${appText[shopData.role]})`}</RegularText>
        <BottomLine style={styles.topMargin} />
        <Text style={styles.topMargin}><BoldText style={styles.title}>{`${appText.country}: `}</BoldText><RegularText style={styles.data}>{`${appText.countries[shopData.country]} (${shopData.currency})`}</RegularText></Text>
        <BottomLine style={styles.topMargin} />
        <Text style={styles.topMargin}><BoldText style={styles.title}>{`${appText.businessName}: `}</BoldText><RegularText style={styles.data}>{shopData.title}</RegularText></Text>
        <BottomLine style={styles.topMargin} />
        <Text style={styles.topMargin}>
          <BoldText style={styles.title}>{`${appText.description}: `}</BoldText>
          {!shopData.description || shopData.description.length === 0
            ? <RegularText style={styles.data}>{'...'}</RegularText>
            : <RegularText style={styles.data}>{shopData.description}</RegularText>
          }
        </Text>
        <BottomLine style={styles.topMargin} />
        {/* <BottomLine style={styles.topMargin} />
        <RegularText style={styles.title} numberOfLines={1}>{appText.country}</RegularText>
        <BoldText style={styles.data}>{`${appText.countries[shopData.country]} (${shopData.currency})`}</BoldText>
        <RegularText style={styles.title} numberOfLines={1}>{appText.businessName}</RegularText>
        <BoldText style={styles.data}>{shopData.title}</BoldText>
        <RegularText style={styles.title} numberOfLines={1}>{appText.description}</RegularText>
        {!shopData.description || shopData.description.length === 0
          ? <BoldText style={styles.data}>{'...'}</BoldText>
          : <BoldText style={styles.data}>{shopData.description}</BoldText>
        } */}
        {shopData.role === 'admin' && <PressableListItem onPress={onPressManageLocationsHandler} settingTitle={appText.manageLocations} />}
        {shopData.role === 'admin' && <PressableListItem onPress={onPressManageProductsHandler} settingTitle={appText.manageProducts} />}
        <PressableListItem onPress={onPressManageOrdersHandler} settingTitle={appText.manageOrders} />
        <PressableListItem onPress={onPressManageNotificationsHandler} settingTitle={appText.manageNotifications} />
        {shopData.role === 'admin' && <PressableListItem onPress={onPressManageUsersHandler} settingTitle={appText.manageUsers} />}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerButtonsContainer: {
    marginHorizontal: values.windowHorizontalPadding,
  },
  contentContainer: {
    marginHorizontal: values.windowHorizontalPadding,
  },
  // title: {
  //   flex: 1,
  //   marginTop: values.topMargin,
  //   marginLeft: values.windowHorizontalPadding,
  //   fontSize: values.regularTextSize * 1.2,
  // },
  icon: {
    marginStart: 30,
  },
  // data: {
  //   marginTop: values.topMargin / 2,
  // },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  editText: {
    marginEnd: 5,
  },
  line: {
    marginTop: values.topMargin,
  },
  topMargin: {
    marginTop: values.topMargin,
  }
});

export default AdminScreenLoadableContent;