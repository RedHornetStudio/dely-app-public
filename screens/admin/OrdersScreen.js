import React, { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import { StyleSheet, View, AppState } from 'react-native';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import * as Notifications from 'expo-notifications';

import values from '../../constants/values';
import colors from '../../constants/colors';
import getLocalizedText from '../../constants/getLocalizedText';
import { concatErrors } from '../../shared/sharedFunctions';
import { getNewAccessTokenAsync } from '../../shared/sharedFunctions';
import CustomImageBackground from '../../components/CustomImageBackground';
import CustomSafeAreaFlatListWindow from '../../components/CustomSafeAreaFlatListWindow';
import OrdersScreenListHeaderComponent from '../../components/OrdersScreen/OrdersScreenListHeaderComponent';
import OrdersListItem from '../../components/OrdersScreen/OrdersListItem';
import AboveMessage from '../../components/AboveMessage';
import LoadingModal from '../../components/LoadingModal';
import ChangeFiltersAboveMessage from '../../components/OrdersScreen/ChangeFiltersAboveMessage';
import SendTimeAboveMessage from '../../components/OrdersScreen/SendTimeAboveMessage';

const OrdersScreen = props => {
  console.log('----Orders Screen rerendered----');

  const dispatch = useDispatch();

  // ### Auth tokens
  const auth = useSelector(state => state.authSlice);

  // ### Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // ### Loading and somethingWentWron modals
  const [loadingModalVisibility, setLoadingModalVisibility] = useState(false);
  const [somethingWentWrongModal, setSomethingWentWrongModal] = useState(false);

  // ### Getting order status filters
  const filtersString = useSelector(state => state.ordersFiltersSlice.ordersFilters);
  const filters = useMemo(() => {
    return JSON.parse(filtersString);
  }, [filtersString]);
  const [changeFiltersAboveMessage, setChangeFiltersAboveMessage] = useState(false);

  // ### Controllers
  const controllerRef = useRef(null);
  const updatingControllerRef = useRef(null);
  const foregroundControllerRef = useRef(null);
  const notificationControllerRef =useRef(null);

  // ### Loading orders data from database on initial render and when filters change
  const [ordersData, setOrdersData] = useState([]);
  const [loadingErrorIndicatorState, setLoadingErrorIndicatorState] = useState({
    noItems: true,
    loading: true,
    loadingError: false,
  });
  const lastOrderGenerationTime = useRef('');

  const loadOrdersAsync = async () => {
    controllerRef.current = new AbortController();
    try {
      let res = (await axios.post(`${values.requestUrl}admin/getOrders`, { accessToken: auth.accessToken, locationId: props.route.params.locationId, filters: filters, lastOrderGenerationTime: '' }, { signal: controllerRef.current.signal })).data;
      if (res.status === 'FAILED' && res.errors[0].msg === 'Unauthorized') {
        const { success, newAccessToken } = await getNewAccessTokenAsync(auth.refreshToken, dispatch, controllerRef.current);
        if (success) {
          res = (await axios.post(`${values.requestUrl}admin/getOrders`, { accessToken: newAccessToken, locationId: props.route.params.locationId, filters: filters, lastOrderGenerationTime: ''}, { signal: controllerRef.current.signal })).data;
        } else {
          props.navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'BusinessSignIn' }] });
          return;
        }
      }
      if (res.status === 'FAILED') throw new Error (concatErrors(res.errors));
      const sortedData = res.data.sort((a, b) => {
        if (a.order_generation_time > b.order_generation_time) {
          return -1;
        }
        if (a.order_generation_time < b.order_generation_time) {
          return 1;
        }
        return 0;
      });
      sortedData.length === 0 ? lastOrderGenerationTime.current = '' : lastOrderGenerationTime.current = sortedData[0].order_generation_time;
      setLoadingErrorIndicatorState({
        noItems: res.data.length === 0,
        loading: false,
        loadingError: false,
      });
      setOrdersData(sortedData);
    } catch (error) {
      console.log(`Error while loading orders from database: ${error.message}`);
      if (error.message !== 'canceled') {
        setOrdersData([]);
        setLoadingErrorIndicatorState({
          noItems: true,
          loading: false,
          loadingError: true,
        });
      }
    }
  };

  useEffect(() => {
    setOrdersData([]);
    setLoadingErrorIndicatorState({
      noItems: true,
      loading: true,
      loadingError: false,
    });
    loadOrdersAsync();

    return () => {
      if (controllerRef.current) controllerRef.current.abort();
      if (updatingControllerRef.current) updatingControllerRef.current.abort();
      if (foregroundControllerRef.current) foregroundControllerRef.current.abort();
      if (notificationControllerRef.current) notificationControllerRef.current.abort();
    };
  }, [filters]);
  // ####################################

  // ### Updating orders after some interval
  const [updatingOrdersErrorModalVisible, setUpdatingOrdersErrorModalVisible] = useState(false);
  const intervalFunctionIsExecutingRef = useRef(false);
  const intervalIDRef = useRef(null);
  useEffect(() => {
    intervalIDRef.current = setInterval(async () => {
      if (intervalFunctionIsExecutingRef.current) return;
      console.log('started updating orders');
      intervalFunctionIsExecutingRef.current = true;
      updatingControllerRef.current = new AbortController();
      try {
        let res = (await axios.post(`${values.requestUrl}admin/getOrders`, { accessToken: auth.accessToken, locationId: props.route.params.locationId, filters: filters, lastOrderGenerationTime: '' }, { signal: updatingControllerRef.current.signal })).data;
        if (res.status === 'FAILED' && res.errors[0].msg === 'Unauthorized') {
          const { success, newAccessToken } = await getNewAccessTokenAsync(auth.refreshToken, dispatch, updatingControllerRef.current);
          if (success) {
            res = (await axios.post(`${values.requestUrl}admin/getOrders`, { accessToken: newAccessToken, locationId: props.route.params.locationId, filters: filters, lastOrderGenerationTime: '' }, { signal: updatingControllerRef.current.signal })).data;
          } else {
            props.navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'BusinessSignIn' }] });
            return;
          }
        }
        if (res.status === 'FAILED') throw new Error (concatErrors(res.errors));
        const sortedData = res.data.sort((a, b) => {
          if (a.order_generation_time > b.order_generation_time) {
            return -1;
          }
          if (a.order_generation_time < b.order_generation_time) {
            return 1;
          }
          return 0;
        });
        sortedData.length === 0 ? lastOrderGenerationTime.current = '' : lastOrderGenerationTime.current = sortedData[0].order_generation_time;
        setLoadingErrorIndicatorState({
          noItems: res.data.length === 0,
          loading: false,
          loadingError: false,
        });
        setUpdatingOrdersErrorModalVisible(false);
        setOrdersData(sortedData);
        console.log('orders updated');
      } catch (error) {
        console.log(`Error while updating orders from database: ${error.message}`);
        if (error.message !== 'canceled') {
          setUpdatingOrdersErrorModalVisible(true);
        }
      } finally {
        intervalFunctionIsExecutingRef.current = false;
      }
    }, 30000);

    return () => {
      console.log('updating interval cleaned');
      if (intervalIDRef.current) clearInterval(intervalIDRef.current);
    };
  }, [props.route.params.locationId, auth, filters]);
  // ##########################################################################3

  // ### Returning from OrderDetailsScreen with new status
  useLayoutEffect(() => {
    if (props.route.params.newStatus) {
      const index = ordersData.findIndex(order => order.id === props.route.params.newStatus.id);
      const isInFilters = filters.indexOf(props.route.params.newStatus.status) >= 0;
      if (!ordersData[index] && isInFilters) {
        if (updatingControllerRef.current) updatingControllerRef.current.abort();
        setOrdersData([]);
        setLoadingErrorIndicatorState({
          noItems: true,
          loading: true,
          loadingError: false,
        });
        loadOrdersAsync();
        return;
      }
      if (ordersData[index] && ordersData[index].status !== props.route.params.newStatus.status) {
        if (updatingControllerRef.current) updatingControllerRef.current.abort();
        setOrdersData(ordersData => {
          const newOrdersData = [...ordersData];
          if (isInFilters) {
            const orderData = { ...newOrdersData[index] };
            orderData.status = props.route.params.newStatus.status;
            newOrdersData[index] = orderData;
          } else {
            newOrdersData.splice(index, 1)
          }
          setLoadingErrorIndicatorState({
            noItems: newOrdersData.length === 0,
            loading: false,
            loadingError: false,
          });
          return newOrdersData;
        });
      }
    }
  }, [props.route.params.newStatus]);
  // ############################################################

  // ### Returning from OrderDetailsScreen with new timeSended
  useLayoutEffect(() => {
    if (props.route.params.newTimeSended) {
      const index = ordersData.findIndex(order => order.id === props.route.params.newStatus.id);
      if (ordersData[index] && ordersData[index].time_sended !== props.route.params.newTimeSended.time_sended) {
        if (updatingControllerRef.current) updatingControllerRef.current.abort();
        setOrdersData(ordersData => {
          const newOrdersData = [...ordersData];
          const orderData = { ...newOrdersData[index] };
          orderData.time_sended = props.route.params.newTimeSended.time_sended;
          newOrdersData[index] = orderData;
          return newOrdersData;
        });
      }
    }
  }, [props.route.params.newTimeSended]);
  // ############################################################

  // ### Updating orders data with new orders when app comes to foregorund
  const appState = useRef(AppState.currentState);
  const listenerFunctionIsExecutingRef = useRef(false);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        if (listenerFunctionIsExecutingRef.current) return;
        console.log('Started updating data when returning to foreground');
        listenerFunctionIsExecutingRef.current = true;
        if (loadingErrorIndicatorState.loading) {
          if (controllerRef.current) controllerRef.current.abort();
          if (updatingControllerRef.current) updatingControllerRef.current.abort();
          setOrdersData([]);
          setLoadingErrorIndicatorState({
            noItems: true,
            loading: true,
            loadingError: false,
          });
          loadOrdersAsync();
          listenerFunctionIsExecutingRef.current = false;
          return;
        }
        (async () => {
          if (updatingControllerRef.current) updatingControllerRef.current.abort();
          foregroundControllerRef.current = new AbortController();
          try {
            let res = (await axios.post(`${values.requestUrl}admin/getOrders`, { accessToken: auth.accessToken, locationId: props.route.params.locationId, filters: filters, lastOrderGenerationTime: lastOrderGenerationTime.current }, { signal: foregroundControllerRef.current.signal })).data;
            if (res.status === 'FAILED' && res.errors[0].msg === 'Unauthorized') {
              const { success, newAccessToken } = await getNewAccessTokenAsync(auth.refreshToken, dispatch, foregroundControllerRef.current);
              if (success) {
                res = (await axios.post(`${values.requestUrl}admin/getOrders`, { accessToken: newAccessToken, locationId: props.route.params.locationId, filters: filters, lastOrderGenerationTime: lastOrderGenerationTime.current }, { signal: foregroundControllerRef.current.signal })).data;
              } else {
                props.navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'BusinessSignIn' }] });
                return;
              }
            }
            if (res.status === 'FAILED') throw new Error (concatErrors(res.errors));
            const sortedData = res.data.sort((a, b) => {
              if (a.order_generation_time > b.order_generation_time) {
                return -1;
              }
              if (a.order_generation_time < b.order_generation_time) {
                return 1;
              }
              return 0;
            });
            if (sortedData.length > 0) lastOrderGenerationTime.current = sortedData[0].order_generation_time;
            // setOrdersData(sortedData);
            setOrdersData(oldOrdersData => {
              const newOrdersData = [...oldOrdersData];
              for (let i = sortedData.length - 1; i >= 0; i--) {
                const alreadyExist = oldOrdersData.findIndex(oldOrderData => oldOrderData.order_generation_time === sortedData[i].order_generation_time) >= 0;
                if (!alreadyExist) newOrdersData.unshift(sortedData[i])
              }
              setLoadingErrorIndicatorState({
                noItems: newOrdersData.length === 0,
                loading: false,
                loadingError: false,
              });
              return newOrdersData;
            });
            console.log('Ended updating data when returning to foreground');
          } catch (error) {
            console.log(`Error while loading new orders data when coming from background to foreground from database: ${error.message}`);
            if (error.message !== 'canceled') {
              setUpdatingOrdersErrorModalVisible(true);
            }
          } finally {
            listenerFunctionIsExecutingRef.current = false;
          }
        })();
      }

      appState.current = nextAppState;
    });

    return () => {
      console.log('App state listener removed');
      subscription.remove();
    };
  }, [props.route.params.locationId, auth, filters, loadingErrorIndicatorState]);

  // ### Updating orders when notification is delivered
  const notificationListenerFunctionIsExecutingRef = useRef(false);
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const body = JSON.parse(notification.request.trigger.remoteMessage.data.body);
      if (!body.newOrderReceived || body.dataForNavigation.location_id !== props.route.params.locationId) return;
      if (notificationListenerFunctionIsExecutingRef.current) return;
      console.log('Started updating data when getting notification');
      notificationListenerFunctionIsExecutingRef.current = true;
      if (loadingErrorIndicatorState.loading) {
        if (controllerRef.current) controllerRef.current.abort();
        if (updatingControllerRef.current) updatingControllerRef.current.abort();
        setOrdersData([]);
        setLoadingErrorIndicatorState({
          noItems: true,
          loading: true,
          loadingError: false,
        });
        loadOrdersAsync();
        notificationListenerFunctionIsExecutingRef.current = false;
        return;
      }
      (async () => {
        if (updatingControllerRef.current) updatingControllerRef.current.abort();
        notificationControllerRef.current = new AbortController();
        try {
          let res = (await axios.post(`${values.requestUrl}admin/getOrders`, { accessToken: auth.accessToken, locationId: props.route.params.locationId, filters: filters, lastOrderGenerationTime: lastOrderGenerationTime.current }, { signal: notificationControllerRef.current.signal })).data;
          if (res.status === 'FAILED' && res.errors[0].msg === 'Unauthorized') {
            const { success, newAccessToken } = await getNewAccessTokenAsync(auth.refreshToken, dispatch, notificationControllerRef.current);
            if (success) {
              res = (await axios.post(`${values.requestUrl}admin/getOrders`, { accessToken: newAccessToken, locationId: props.route.params.locationId, filters: filters, lastOrderGenerationTime: lastOrderGenerationTime.current }, { signal: notificationControllerRef.current.signal })).data;
            } else {
              props.navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'BusinessSignIn' }] });
              return;
            }
          }
          if (res.status === 'FAILED') throw new Error (concatErrors(res.errors));
          const sortedData = res.data.sort((a, b) => {
            if (a.order_generation_time > b.order_generation_time) {
              return -1;
            }
            if (a.order_generation_time < b.order_generation_time) {
              return 1;
            }
            return 0;
          });
          if (sortedData.length > 0) lastOrderGenerationTime.current = sortedData[0].order_generation_time;
          setOrdersData(oldOrdersData => {
            const newOrdersData = [...oldOrdersData];
            for (let i = sortedData.length - 1; i >= 0; i--) {
              const alreadyExist = oldOrdersData.findIndex(oldOrderData => oldOrderData.order_generation_time === sortedData[i].order_generation_time) >= 0;
              if (!alreadyExist) newOrdersData.unshift(sortedData[i])
            }
            setLoadingErrorIndicatorState({
              noItems: newOrdersData.length === 0,
              loading: false,
              loadingError: false,
            });
            return newOrdersData;
          });
          console.log('Ended updating data when getting notification');
        } catch (error) {
          console.log(`Error while loading new orders data from database when getting notification: ${error.message}`);
          if (error.message !== 'canceled') {
            setUpdatingOrdersErrorModalVisible(true);
          }
        } finally {
          notificationListenerFunctionIsExecutingRef.current = false;
        }
      })();
    });

    return () => {
      console.log('Notification listener removed');
      subscription.remove();
    };
  }, [props.route.params.locationId, auth, filters, loadingErrorIndicatorState]);

  // ### Change status above message
  const [changeStatusAboveMessage, setChangeStatusAboveMessage] = useState(false);
  const [changeStatusAboveMessageOrderNumberAndId, setChangeStatusAboveMessageOrderNumberAndId] = useState(null);
  const [changeStatusAboveMessageNextStatus, setChangeStatusAboveMessageNextStatus] = useState('');
  const onChangeStatusConfirmHandler = async () => {
    setLoadingModalVisibility(true);
    try {
      let res = (await axios.post(`${values.requestUrl}admin/postChangeOrderStatus`, { accessToken: auth.accessToken, orderId: changeStatusAboveMessageOrderNumberAndId.id, orderStatus: changeStatusAboveMessageNextStatus })).data;
      if (res.status === 'FAILED' && res.errors[0].msg === 'Unauthorized') {
        const { success, newAccessToken } = await getNewAccessTokenAsync(auth.refreshToken, dispatch);
        if (success) {
          res = (await axios.post(`${values.requestUrl}admin/postChangeOrderStatus`, { accessToken: newAccessToken, orderId: changeStatusAboveMessageOrderNumberAndId.id, orderStatus: changeStatusAboveMessageNextStatus })).data;
        } else {
          props.navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'BusinessSignIn' }] });
          return;
        }
      }
      if (res.status === 'FAILED' && res.errors[0].msg === 'Order do not exist') {
        setLoadingModalVisibility(false);
        setErrorMessageModalText(appText.orderDoNotExist);
        setErrorMessageModal(true);
        return;
      }
      if (res.status === 'FAILED') throw new Error (concatErrors(res.errors));
      if (updatingControllerRef.current) updatingControllerRef.current.abort();
      setLoadingModalVisibility(false);
      setOrdersData(ordersData => {
        const newOrdersData = [...ordersData];
        const isInFilters = filters.indexOf(res.data.orderStatus) >= 0;
        const index = newOrdersData.findIndex(order => order.id === res.data.orderId);
        if (isInFilters) {
          const orderData = { ...newOrdersData[index] };
          orderData.status = res.data.orderStatus;
          newOrdersData[index] = orderData;
        } else {
          newOrdersData.splice(index, 1)
        }
        setLoadingErrorIndicatorState({
          noItems: newOrdersData.length === 0,
          loading: false,
          loadingError: false,
        });
        return newOrdersData;
      });
    } catch (error) {
      console.log(`Error while updating order status in database: ${error.message}`);
      if (error.message !== 'canceled') {
        setLoadingModalVisibility(false);
        setSomethingWentWrongModal(true);
      }
    }
  };
  // #########################################################
  
  // ### Send time above message
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [sendTimeOrderId, setSendTimeOrderId] = useState(null);
  const [sendTimeAboveMessage, setSendTimeAboveMessage] = useState(false);
  const [errorMessageModalText, setErrorMessageModalText] = useState('');
  const [errorMessageModal, setErrorMessageModal] = useState(false);
  const onSendTimeConfirmHandler = async () => {
    setLoadingModalVisibility(true);
    try {
      let res = (await axios.post(`${values.requestUrl}admin/postSendOrderTime`, { accessToken: auth.accessToken, orderId: sendTimeOrderId, hours: hours, minutes: minutes })).data;
      if (res.status === 'FAILED' && res.errors[0].msg === 'Unauthorized') {
        const { success, newAccessToken } = await getNewAccessTokenAsync(auth.refreshToken, dispatch);
        if (success) {
          res = (await axios.post(`${values.requestUrl}admin/postSendOrderTime`, { accessToken: newAccessToken, orderId: sendTimeOrderId, hours: hours, minutes: minutes })).data;
        } else {
          props.navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'BusinessSignIn' }] });
          return;
        }
      }
      if (res.status === 'FAILED' && res.errors[0].msg === 'Order do not exist') {
        setLoadingModalVisibility(false);
        setErrorMessageModalText(appText.orderDoNotExist);
        setErrorMessageModal(true);
        return;
      }
      if (res.status === 'FAILED' && res.errors[0].param) {
        switch (`${res.errors[0].msg} ${res.errors[0].param}`) {
          case 'Empty value time':
            setErrorMessageModalText(appText.emptyInputTime);
            break;
          case 'Invalid value time':
            setErrorMessageModalText(appText.invalidInputTime);
            break;
        }
        setLoadingModalVisibility(false);
        setErrorMessageModal(true);
        return; 
      }
      if (res.status === 'FAILED') throw new Error (concatErrors(res.errors));
      if (updatingControllerRef.current) updatingControllerRef.current.abort();
      setSendTimeAboveMessage(false);
      setLoadingModalVisibility(false);
      setOrdersData(ordersData => {
        const newOrdersData = [...ordersData];
        const index = newOrdersData.findIndex(order => order.id === res.data.orderId);
        if (index >= 0) newOrdersData[index].time_sended = 1;
        return newOrdersData;
      });
    } catch (error) {
      console.log(`Error while updating order status in database: ${error.message}`);
      if (error.message !== 'canceled') {
        setLoadingModalVisibility(false);
        setSomethingWentWrongModal(true);
      }
    }
  };
  // #########################################################

  // ### Rendering FlatList components
  const listHeaderComponentHeightRef = useRef(0);
  const insets = useSafeAreaInsets();

  const renderItem = itemData => {
    return (
      <OrdersListItem
        id={itemData.item.id}
        currency={itemData.item.currency}
        delivery_method={itemData.item.delivery_method}
        delivery_price={itemData.item.delivery_price}
        items={JSON.stringify(itemData.item.items)}
        order_generation_time={itemData.item.order_generation_time}
        order_number={itemData.item.order_number}
        time_sended={itemData.item.time_sended}
        total_price={itemData.item.total_price}
        status={itemData.item.status}
        index={itemData.index}
        appText={appText}
        setChangeStatusAboveMessage={setChangeStatusAboveMessage}
        setChangeStatusAboveMessageOrderNumberAndId={setChangeStatusAboveMessageOrderNumberAndId}
        setChangeStatusAboveMessageNextStatus={setChangeStatusAboveMessageNextStatus}
        setHours={setHours}
        setMinutes={setMinutes}
        setSendTimeAboveMessage={setSendTimeAboveMessage}
        setSendTimeOrderId={setSendTimeOrderId}
        navigation={props.navigation}
      />
    );
  };

  const getItemLayout = (data, index) => {
    if (index < 0) return { length: 0, offset: 0, index };
    let additionalHeightCount = 0;
    for (let i = 0; i < index; i++) {
      additionalHeightCount += data[i].items.length - 1;
    }
    const additionalHeight = additionalHeightCount * values.orderListItemAdditionalHeight;
    return { length: values.orderListItemHeight, offset: insets.top + listHeaderComponentHeightRef.current + additionalHeight + values.orderListItemHeight * index, index };
  };

  const keyExtractor = item => item.id;
  // ############################################

  // ### Filtering orders by order number entered in search bar
  const [inputText, setInputText] = useState('');
  const filteredOrdersData = useMemo(() => {
    return inputText.trim().length > 0
      ? ordersData.filter(order => order.order_number.toLowerCase().includes(inputText.toLowerCase().trim()))
      : ordersData;
  }, [inputText, ordersData]);

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
      <CustomSafeAreaFlatListWindow
        contentContainerStyle={styles.customSafeAreaFlatListWindowContentContainerStyle}
        ListHeaderComponent={
          <OrdersScreenListHeaderComponent
            shopTitle={props.route.params.shopTitle}
            shopImageUrl={props.route.params.shopImageUrl}
            locationCity={props.route.params.locationCity}
            locationAddress={props.route.params.locationAddress}
            inputText={inputText}
            setInputText={setInputText}
            loadingErrorIndicatorState={loadingErrorIndicatorState}
            filteredOrdersData={filteredOrdersData}
            listHeaderComponentHeightRef={listHeaderComponentHeightRef}
            appText={appText}
            setChangeFiltersAboveMessage={setChangeFiltersAboveMessage}
          />
        }
        data={filteredOrdersData}
        renderItem={renderItem}
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        windowSize={21}
        getItemLayout={getItemLayout}
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps={'always'}
        contentMinHeight={{ value: values.headerBigIconSize + values.topMargin, useWindowHeight: true, useInsetsTop: true }}
      />

      <AboveMessage
        visible={updatingOrdersErrorModalVisible}
        closeOnBackButtonPress={true}
        messageText={appText.somethingWentWrongWhileUpdatingOrders}
        confirmButtonText={appText.confirm}
        setModalVisibility={setUpdatingOrdersErrorModalVisible}
      />
      <ChangeFiltersAboveMessage
        visible={changeFiltersAboveMessage}
        closeOnBackButtonPress={true}
        confirmButtonText={appText.confirm}
        cancelButtonText={appText.cancel}
        setModalVisibility={setChangeFiltersAboveMessage}
        headerText={appText.filters}
        filters={filters}
        appText={appText}
      />
      <AboveMessage
        visible={changeStatusAboveMessage}
        closeOnBackButtonPress={true}
        messageText={`${appText.changeStatusTo} "${appText[changeStatusAboveMessageNextStatus]}"`}
        confirmButtonText={appText.confirm}
        onConfirm={onChangeStatusConfirmHandler}
        cancelButtonText={appText.cancel}
        setModalVisibility={setChangeStatusAboveMessage}
      />
      <SendTimeAboveMessage
        appText={appText}
        visible={sendTimeAboveMessage}
        closeOnBackButtonPress={true}
        confirmButtonText={appText.confirm}
        doNotCloseOnConfirm={true}
        onConfirm={onSendTimeConfirmHandler}
        cancelButtonText={appText.cancel}
        setModalVisibility={setSendTimeAboveMessage}
        hours={hours}
        setHours={setHours}
        minutes={minutes}
        setMinutes={setMinutes}
      />
      <AboveMessage
        visible={somethingWentWrongModal}
        closeOnBackButtonPress={true}
        messageText={appText.somethingWentWrongAndTryLater}
        confirmButtonText={appText.confirm}
        setModalVisibility={setSomethingWentWrongModal}
      />
      <AboveMessage
        visible={errorMessageModal}
        closeOnBackButtonPress={true}
        messageText={errorMessageModalText}
        confirmButtonText={appText.confirm}
        setModalVisibility={setErrorMessageModal}
      />
      <LoadingModal
        visible={loadingModalVisibility}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  customSafeAreaFlatListWindowContentContainerStyle: {
    paddingBottom: values.topMargin,
  },
});

export default OrdersScreen;