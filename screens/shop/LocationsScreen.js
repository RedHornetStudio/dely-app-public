import React, { useState, useRef, useLayoutEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import colors from '../../constants/colors';
import getLocalizedText from '../../constants/getLocalizedText';
import CustomImageBackground from '../../components/CustomImageBackground';
import CustomSafeAreaFlatListWindow from '../../components/CustomSafeAreaFlatListWindow';
import values from '../../constants/values';
import LocationListItem from '../../components/LocationsScreen/LocationsListItem';
import LocationsScreenListHeaderComponent from '../../components/LocationsScreen/LocationsScreenListHeaderComponenet';
import { concatErrors } from '../../shared/sharedFunctions';
import AboveMessage from '../../components/AboveMessage';
import LoadingModal from '../../components/LoadingModal';
import { getNewAccessTokenAsync } from '../../shared/sharedFunctions';
import AnimatedBottomButtonContainer from '../../components/LocationsScreen/AnimatedBottomButtonContainer';

const LocationsScreen = props => {
  console.log('----Locations Screen rerendered----');

  const dispatch = useDispatch();

  // ### Auth tokens
  const auth = useSelector(state => state.authSlice);

  // ### Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // ### Loading locations data from data base
  const [locationsData, setLocationsData] = useState([]);
  const [loadingErrorIndicatorState, setLoadingErrorIndicatorState] = useState({
    noItems: true,
    loading: true,
    loadingError: false,
  });

  const controllerRef = useRef(null);
  const locationUpdateIsExecutingRef = useRef(false);
  const loadLocationsAsync = async () => {
    if (locationUpdateIsExecutingRef.current === true) return;
    locationUpdateIsExecutingRef.current = true;
    controllerRef.current = new AbortController();
    if (props.route.params.manageNotifications) {
      try {
        let res = (await axios.post(`${values.requestUrl}admin/getLocationsWithNotifications`, { accessToken: auth.accessToken }, { signal: controllerRef.current.signal })).data;
        if (res.status === 'FAILED' && res.errors[0].msg === 'Unauthorized') {
          const { success, newAccessToken } = await getNewAccessTokenAsync(auth.refreshToken, dispatch);
          if (success) {
            res = (await axios.post(`${values.requestUrl}admin/getLocationsWithNotifications`, { accessToken: newAccessToken }, { signal: controllerRef.current.signal })).data;
          } else {
            props.navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'BusinessSignIn' }] });
            return;
          }
        }
        if (res.status === 'FAILED') throw new Error (concatErrors(res.errors));
        const collator = new Intl.Collator(appLanguage);
        res.data.sort((a, b) => collator.compare(`${a.city}, ${a.address}`, `${b.city}, ${b.address}`));
        setLoadingErrorIndicatorState({
          noItems: res.data.length === 0,
          loading: false,
          loadingError: false,
        });
        setLocationsData(res.data);
      } catch (error) {
        console.log(`Error while loading locations from database: ${error.message}`);
        if (error.message !== 'canceled') {
          setLocationsData([]);
          setLoadingErrorIndicatorState({
            noItems: true,
            loading: false,
            loadingError: true,
          });
        }
      } finally {
        locationUpdateIsExecutingRef.current = false;
      }
      return;
    }
    try {
      const { data: res } = await axios.post(`${values.requestUrl}getLocations`, { shopId: props.route.params.shopId }, { signal: controllerRef.current.signal });
      if (res.status === 'FAILED') throw new Error (concatErrors(res.errors));
      const collator = new Intl.Collator(appLanguage);
      res.data.sort((a, b) => collator.compare(`${a.city}, ${a.address}`, `${b.city}, ${b.address}`));
      setLoadingErrorIndicatorState({
        noItems: res.data.length === 0,
        loading: false,
        loadingError: false,
      });
      setLocationsData(res.data);
    } catch (error) {
      console.log(`Error while loading locations from database: ${error.message}`);
      if (error.message !== 'canceled') {
        setLocationsData([]);
        setLoadingErrorIndicatorState({
          noItems: true,
          loading: false,
          loadingError: true,
        });
      }
    } finally {
      locationUpdateIsExecutingRef.current = false;
    }
  };

    // // ### If returning from add location screen
  // useEffect(() => {
  //   if (props.route.params?.needUpdate) {
  //     loadLocationsAsync();
  //   }
  // }, [props.route.params?.needUpdate]);

    // useEffect(() => {
  //     loadLocationsAsync();

  //     return () => {
  //       if (controllerRef.current) controllerRef.current.abort();
  //     };
  //   }, [appLanguage]);

  // ### Load locations after some interval when screen is focused
  useFocusEffect(
    useCallback(() => {
      let intervalId;
      loadLocationsAsync();
      intervalId = setInterval(() => {
        loadLocationsAsync();
      }, 30000);
      return () => {
        if (intervalId) clearInterval(intervalId);
        if (controllerRef.current) controllerRef.current.abort();
      }
    }, [])
  );
  // ####################################

  // ### Delete modal
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [deleteModalVisibility, setDeleteModalVisibility] = useState(false);
  const [loadingModalVisibility, setLoadingModalVisibility] = useState(false);
  const [errorModalVisibility, setErrorModalVisibility] = useState(false);
  const [permissionDeniedModalVisibility, setPermissionDeniedModalVisibility] = useState(false);
  // const [locationDoNotExistModal, setLocationDoNotExistModal] = useState(false);
  const [someLocationDoNotExistModal, setSomeLocationDoNotExistModal] = useState(false);

  const onConfirmDeleteHandler = () => {
    setLoadingModalVisibility(true);
    (async () => {
      try {
        let res = (await axios.post(`${values.requestUrl}admin/postDeleteLocation`, { locationId: itemToDeleteId, accessToken: auth.accessToken })).data;
        if (res.status === 'FAILED' && res.errors[0].msg === 'Unauthorized') {
          const { success, newAccessToken } = await getNewAccessTokenAsync(auth.refreshToken, dispatch);
          if (success) {
            res = (await axios.post(`${values.requestUrl}admin/postDeleteLocation`, { locationId: itemToDeleteId, accessToken: newAccessToken })).data;
          } else {
            props.navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'BusinessSignIn' }] });
            return;
          }
        }
        if (res.status === 'FAILED' && res.errors[0].msg === 'Permission denied') {
          setLoadingModalVisibility(false);
          setPermissionDeniedModalVisibility(true);
          return;
        }
        if (res.status === 'FAILED' && res.errors[0].msg === 'Location do not exist') {
          res.status = 'SUCCESS';
          // setLoadingModalVisibility(false);
          // setLocationDoNotExistModal(true);
          // return;
        }
        if (res.status === 'FAILED') throw new Error (concatErrors(res.errors));
        if (controllerRef.current) controllerRef.current.abort();
        await loadLocationsAsync();
        setTimeout(() => {
          setLoadingModalVisibility(false);
        }, 100);
      } catch (error) {
        console.log(`Error while deleting location from database: ${error.message}`);
        if (error.message !== 'canceled') {
          setLoadingModalVisibility(false);
          setErrorModalVisibility(true);
        }
      }
    })();
  };
  // ###################################

  // ### Filtering locations by search term
  const [inputText, setInputText] = useState('');
  const filteredShopLocationsData = useMemo(() => {
    return inputText.trim().length > 0
      ? locationsData.filter(location => `${location.city}, ${location.address}`.toLowerCase().includes(inputText.toLowerCase().trim()))
      : locationsData;
  }, [inputText, locationsData]);

  // ### Rendering FlatList components
  // const listHeaderComponentHeight = values.topMargin * 3 + values.headerBigIconSize + values.headerTextSize + values.searchBarHeight;
  const listHeaderComponentHeightRef = useRef(0);
  const insets = useSafeAreaInsets();

  // Hadling notifications
  const [switchValues, setSwitchValues] = useState([]);
  useLayoutEffect(() => {
    if (props.route.params.manageNotifications && filteredShopLocationsData.length > 0) {
      setSwitchValues(switchValues => {
        const newSwitchValues = [];
        filteredShopLocationsData.forEach(filteredShopLocationData => {
          filteredShopLocationData.notificationEnabled ? newSwitchValues.push(true) : newSwitchValues.push(false);
        });
        return newSwitchValues;
      });
    }
  }, [filteredShopLocationsData]);

  const saveNotificationsHandler = () => {
    setLoadingModalVisibility(true);
    const notifications = [];
    filteredShopLocationsData.forEach((filteredShopLocationData, index) => {
      notifications.push({ locationId: filteredShopLocationData.id, notificationEnbaled: switchValues[index] });
    });
    (async () => {
      try {
        let res = (await axios.post(`${values.requestUrl}admin/postNotifications`, { accessToken: auth.accessToken, notifications: notifications })).data;
        if (res.status === 'FAILED' && res.errors[0].msg === 'Unauthorized') {
          const { success, newAccessToken } = await getNewAccessTokenAsync(auth.refreshToken, dispatch);
          if (success) {
            res = (await axios.post(`${values.requestUrl}admin/postNotifications`, { accessToken: newAccessToken, notifications: notifications })).data;
          } else {
            props.navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'BusinessSignIn' }] });
            return;
          }
        }
        if (res.status === 'FAILED' && res.errors[0].msg === 'Location do not exist') {
          setLoadingModalVisibility(false);
          setSomeLocationDoNotExistModal(true);
          return;
        }
        if (res.status === 'FAILED') throw new Error (concatErrors(res.errors));
        props.navigation.goBack();
      } catch (error) {
        console.log(`Error while saving notifications in database: ${error.message}`);
        if (error.message !== 'canceled') {
          setLoadingModalVisibility(false);
          setErrorModalVisibility(true);
        }
      }
    })();
  };
  // ##################################################

  const renderItem = itemData => {
    if (props.route.params.manageLocations) {
      return (
        <LocationListItem 
          style={styles.locationListItem}
          disabled={true}
          manageLocations={props.route.params.manageLocations}
          id={itemData.item.id}
          shopId={itemData.item.shop_id}
          city={itemData.item.city}
          address={itemData.item.address}
          todayWorkingTimes={itemData.item.todayWorkingTimes}
          opened={itemData.item.opened}
          phoneNumber={itemData.item.phone_number}
          timeZone={itemData.item.time_zone}
          delivery={itemData.item.delivery_method_delivery}
          inPlace={itemData.item.delivery_method_in_place}
          takeAway={itemData.item.delivery_method_take_away}
          workingHours={JSON.stringify(itemData.item.working_hours)}
          deliveryPrice={itemData.item.delivery_price}
          appText={appText}
          index={itemData.index}
          stringifiedData={JSON.stringify({ city: itemData.item.city, address: itemData.item.address, todayWorkingTimes: itemData.item.todayWorkingTimes })}
          setDeleteModalVisibility={setDeleteModalVisibility}
          setItemToDeleteId={setItemToDeleteId}
          navigation={props.navigation}
        />
      );
    }
    if (props.route.params.manageOrders) {
      return (
        <LocationListItem 
          style={styles.locationListItem}
          locationId={itemData.item.id}
          shopTitle={props.route.params.shopTitle}
          shopImageUrl={props.route.params.shopImageUrl}
          currency={props.route.params.currency}
          city={itemData.item.city}
          address={itemData.item.address}
          todayWorkingTimes={itemData.item.todayWorkingTimes}
          opened={itemData.item.opened}
          appText={appText}
          index={itemData.index}
          showBadge={true}
          manageOrders={props.route.params.manageOrders}
          navigation={props.navigation}
        />
      );
    }
    if (props.route.params.manageNotifications) {
      return (
        <LocationListItem 
          style={styles.locationListItem} 
          disabled={true}
          city={itemData.item.city}
          address={itemData.item.address}
          todayWorkingTimes={itemData.item.todayWorkingTimes}
          appText={appText}
          index={itemData.index}
          manageNotifications={props.route.params.manageNotifications}
          switchValue={switchValues[itemData.index] ? true : false} // because first time array is empty and returns undefined
          setSwitchValues={setSwitchValues}
        />
      );
    }
    return (
      <LocationListItem 
        style={styles.locationListItem}
        locationId={itemData.item.id}
        shopId={props.route.params.shopId}
        shopTitle={props.route.params.shopTitle}
        shopDescription={props.route.params.shopDescription}
        shopImageUrl={props.route.params.shopImageUrl}
        currency={props.route.params.currency}
        city={itemData.item.city}
        address={itemData.item.address}
        workingHours={JSON.stringify(itemData.item.working_hours)}
        todayWorkingTimes={itemData.item.todayWorkingTimes}
        opened={itemData.item.opened}
        deliveryMethodDelivery={itemData.item.delivery_method_delivery}
        deliveryMethodInPlace={itemData.item.delivery_method_in_place}
        deliveryMethodTakeAway={itemData.item.delivery_method_take_away}
        phoneNumber={itemData.item.phone_number}
        deliveryPrice={itemData.item.delivery_price}
        appText={appText}
        index={itemData.index}
        showBadge={true}
        regularScreen={true}
        navigation={props.navigation}
      />
    );
  };

  const getItemLayout = (data, index) => {
    if (index < 0) return { length: 0, offset: 0, index };
    return { length: values.locationListItemHeight, offset: insets.top + listHeaderComponentHeightRef.current + values.locationListItemHeight * index, index };
  };

  const keyExtractor = item => item.id;
  // ############################################

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
      <CustomSafeAreaFlatListWindow
        contentContainerStyle={styles.customSafeAreaFlatListWindowContentContainerStyle}
        doNotUseInsetsBottom={props.route.params.manageNotifications ? true : false}
        ListHeaderComponent={
          <LocationsScreenListHeaderComponent
            shopId={props.route.params.shopId}
            shopTitle={props.route.params.shopTitle}
            shopImageUrl={props.route.params.shopImageUrl}
            inputText={inputText}
            appText={appText}
            loadingErrorIndicatorState={loadingErrorIndicatorState}
            filteredShopLocationsData={filteredShopLocationsData}
            setInputText={setInputText}
            // listHeaderComponentHeight={listHeaderComponentHeight}
            listHeaderComponentHeightRef={listHeaderComponentHeightRef}
            navigation={props.navigation}
            fromShopsScreen={props.route.params.fromShopsScreen}
            manageLocations={props.route.params.manageLocations}
            manageOrders={props.route.params.manageOrders}
            manageNotifications={props.route.params.manageNotifications}
          />
        }
        data={filteredShopLocationsData}
        renderItem={renderItem}
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        windowSize={21}
        getItemLayout={getItemLayout}
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps={'always'}
        contentMinHeight={props.route.params.manageNotifications ? { value: values.headerBigIconSize + values.topMargin - values.topMargin - values.mainButtonHeight, useWindowHeight: true, useInsetsTop: true } : { value: values.headerBigIconSize + values.topMargin, useWindowHeight: true, useInsetsTop: true }}
      />

      {props.route.params.manageNotifications && filteredShopLocationsData.length > 0 &&
        <AnimatedBottomButtonContainer
          onPress={saveNotificationsHandler}
          title={appText.save}
        />
      }

      {/* Delete modal */}
      <AboveMessage
        visible={deleteModalVisibility}
        setModalVisibility={setDeleteModalVisibility}
        closeOnBackButtonPress={true}
        messageText={appText.areYouSureDeleteItem}
        confirmButtonText={appText.confirm}
        onConfirm={onConfirmDeleteHandler}
        cancelButtonText={appText.cancel}
      />
      <AboveMessage
        visible={errorModalVisibility}
        setModalVisibility={setErrorModalVisibility}
        closeOnBackButtonPress={true}
        messageText={appText.somethingWentWrongAndTryLater}
        confirmButtonText={appText.confirm}
      />
      <AboveMessage
        visible={permissionDeniedModalVisibility}
        setModalVisibility={setPermissionDeniedModalVisibility}
        closeOnBackButtonPress={true}
        messageText={appText.permissionDenied}
        confirmButtonText={appText.confirm}
      />
      {/* <AboveMessage
        visible={locationDoNotExistModal}
        setModalVisibility={setLocationDoNotExistModal}
        closeOnBackButtonPress={true}
        messageText={appText.locationDoNotExist}
        confirmButtonText={appText.confirm}
      /> */}
      <AboveMessage
        visible={someLocationDoNotExistModal}
        setModalVisibility={setSomeLocationDoNotExistModal}
        closeOnBackButtonPress={true}
        messageText={appText.someOfLocationDoNotExist}
        confirmButtonText={appText.confirm}
      />
      <LoadingModal
        visible={loadingModalVisibility}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // ----Screen----
  screen: {
    flex: 1,
  },
  customSafeAreaFlatListWindowContentContainerStyle: {
    paddingBottom: values.topMargin,
  },
  locationListItem: {
    marginHorizontal: values.windowHorizontalPadding,
  },
});

export default LocationsScreen;