import React, { useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';

import colors from '../../constants/colors';
import getLocalizedText from '../../constants/getLocalizedText';
import RegularText from '../../components/RegularText';
import BoldText from '../../components/BoldText';
import CustomImageBackground from '../../components/CustomImageBackground';
import HeaderBigIcon from '../../components/HeaderBigIcon';
import HeaderButtons, { headerButtonsStyles } from '../../components/HeaderButtons';
import ShoppingCartIconWithBadge from '../../components/ShoppingCartIconWithBadge';
import CustomPressableOpacity from '../../components/CustomPressableOpacity';
import CustomSafeAreaScrollViewWindow from '../../components/CustomSafeAreaScrollViewWindow';
import values from '../../constants/values';

const MainScreen = props => {
  console.log('----Main Screen rerendered----');

  // checking if user is authenticated
  const auth = useSelector(state => state.authSlice);
  console.log(auth)

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const body = JSON.parse(response.notification.request.trigger.remoteMessage.data.body);
      console.log(body);
      if (body.orderStatusUpdate) {
        setTimeout(() => {
          props.navigation.navigate('Order', { orderId: body.orderId, orderNumber: body.orderNumber, deliveryMethod: body.deliveryMethod, loadOnStart: true });
        }, 500);
      } else if (body.orderReadindessTimeUpdate) {
        setTimeout(() => {
          props.navigation.navigate('Order', { orderId: body.orderId, orderNumber: body.orderNumber, deliveryMethod: body.deliveryMethod, loadOnStart: true });
        }, 500);
      } else if (body.newOrderReceived && auth.refreshToken) {
        setTimeout(() => {
          props.navigation.navigate('Orders', {
            locationId: body.dataForNavigation.location_id,
            shopTitle: body.dataForNavigation.title,
            shopImageUrl: body.dataForNavigation.image_url,
            currency: body.dataForNavigation.currency,
            locationCity: body.dataForNavigation.city,
            locationAddress: body.dataForNavigation.address,
            newOrder: body.newOrder,
          });
          // props.navigation.reset({
          //   index: 0,
          //   routes: [
          //     { name: 'Main' },
          //     { name: 'Admin' },
          //     { name: 'Locations', params: {
          //       shopId: body.dataForNavigation.id,
          //       shopTitle: body.dataForNavigation.title,
          //       shopImageUrl: body.dataForNavigation.image_url,
          //       currency: body.dataForNavigation.currency,
          //       role: body.dataForNavigation.role,
          //       manageOrders: true
          //     }},
          //     { name: 'Orders', params: {
          //       locationId: body.dataForNavigation.location_id,
          //       shopTitle: body.dataForNavigation.title,
          //       shopImageUrl: body.dataForNavigation.image_url,
          //       currency: body.dataForNavigation.currency,
          //       locationCity: body.dataForNavigation.city,
          //       locationAddress: body.dataForNavigation.address,
          //     }},
          //   ] 
          // });
        }, 500);
      }
    });
    return () => subscription.remove();
  }, [props.navigation, auth]);

  const insets = useSafeAreaInsets();
  
  // Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
      <CustomSafeAreaScrollViewWindow
        contentContainerStyle={styles.contentContainerStyle}
      >
        <HeaderBigIcon><Fontisto name="shopping-bag-1" size={values.headerBigIconSize} color={colors.primaryColor} /></HeaderBigIcon>
        <HeaderButtons style={styles.headerButtonsContainer}>
          <ShoppingCartIconWithBadge style={headerButtonsStyles.headerButtons} navigation={props.navigation} />
        </HeaderButtons>
        <View style={styles.list}>
          <CustomPressableOpacity style={styles.listItem} onPress={() => props.navigation.navigate('Shops')}>
            <BoldText style={styles.listItemMainText}>{appText.cafes}</BoldText>
            <RegularText style={styles.listItemSecondaryText}>{appText.belowCafesText}</RegularText>
          </CustomPressableOpacity>
          <CustomPressableOpacity style={styles.listItem} onPress={() => props.navigation.navigate('Shops', { filterFavorites: true })}>
            <BoldText style={styles.listItemMainText}>{appText.favorites}</BoldText>
            <RegularText style={styles.listItemSecondaryText}>{appText.belowFavoritesText}</RegularText>
          </CustomPressableOpacity>
          <CustomPressableOpacity style={styles.listItem} onPress={() => props.navigation.navigate('OrderHistory')}>
            <BoldText style={styles.listItemMainText}>{appText.history}</BoldText>
            <RegularText style={styles.listItemSecondaryText}>{appText.seeYourHistory}</RegularText>
          </CustomPressableOpacity>
          {auth.refreshToken
            ? <CustomPressableOpacity style={styles.listItem} onPress={() => props.navigation.navigate('Admin')}>
              <BoldText style={styles.listItemMainText}>{appText.myShop}</BoldText>
              <RegularText style={styles.listItemSecondaryText}>{appText.manageMyShop}</RegularText>
            </CustomPressableOpacity>
            : null
          }
        </View>
      </CustomSafeAreaScrollViewWindow>
      <View style={[styles.menuSafeAreaContainer, { paddingBottom: insets.bottom }]}>
        <CustomPressableOpacity style={styles.menu} onPress={() => props.navigation.navigate('Settings')}>
          <Entypo name="dots-three-horizontal" size={values.headerTextSize} color={colors.primaryColor} />
        </CustomPressableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // ----Screen----
  screen: {
    flex: 1,
    backgroundColor: 'black',
  },
  // ----List----
  contentContainerStyle: {
    paddingBottom: values.topMargin,
    paddingHorizontal: values.windowHorizontalPadding,
  },
  listItem: {
    marginTop: values.topMargin,
  },
  listItemMainText: {
    fontSize: values.headerTextSize,
  },
  // ----Menu----
  menuSafeAreaContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  menu: {
    marginBottom: 10,
    marginRight: values.windowHorizontalPadding,
  },
});

export default MainScreen;