import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, View, AppState } from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import * as Notifications from 'expo-notifications';

import values from '../../constants/values';
import colors from '../../constants/colors';
import getLocalizedText from '../../constants/getLocalizedText';
import CustomImageBackground from '../../components/CustomImageBackground';
import CustomSafeAreaScrollViewWindowWithInsets from '../../components/CustomSafeAreaScrollViewWindow';
import { concatErrors } from '../../shared/sharedFunctions';
import AboveMessage from '../../components/AboveMessage';
import LoadingModal from '../../components/LoadingModal';
import MessagesContainer from '../../components/OrderScreen/MessagesContainer';
import ShowDetailsContainer from '../../components/OrderScreen/ShowDetailsContainer';

const OrderScreen = props => {
  console.log('----Order Screen rerendered----');

  // Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // Handlers
  const showDetailsHandler = () => {
    props.navigation.navigate('OrderDetails', { orderId: props.route.params.orderId, orderNumber: props.route.params.orderNumber });
  };

  // ### Going from order history
  const [mainMessageText, setMainMessageText] = useState(props.route.params?.deliveryMethod === 'delivery' ? appText.preparingMainMessageDelivery?.toUpperCase() : appText.preparingMainMessage?.toUpperCase());
  const [secondaryMessage, setSecondaryMessage] = useState(props.route.params?.deliveryMethod === 'delivery' ? appText.preparingSecondaryMessageDelivery : appText.preparingSecondaryMessage);
  const [initialErrorModal, setInitialErrorModal] = useState(false);
  const [updatingOrderErrorModalVisible, setUpdatingOrderErrorModalVisible] = useState(false);

  const [loadingModal, setLoadingModal] = useState(props.route.params.loadOnStart ? true : false);
  const [initialLoadingComplete, setInitialLoadingComplete] = useState(props.route.params.loadOnStart ? false : true);
  const initialControllerRef = useRef(null);
  useEffect(() => {
    if (props.route.params.loadOnStart) {
      (async () => {
        initialControllerRef.current = new AbortController();
        try {
          const res = (await axios.post(`${values.requestUrl}getOrderUpdate`, { orderId: props.route.params.orderId, orderNumber: props.route.params.orderNumber }, { signal: initialControllerRef.current.signal })).data;
          if (res.status === 'FAILED') throw new Error (concatErrors(res.errors));
          if (res.status === 'SUCCESS' && res.data.orderStatus === 'preparing') {
            setMainMessageText(props.route.params?.deliveryMethod === 'delivery' ? appText.preparingMainMessageDelivery?.toUpperCase() : appText.preparingMainMessage?.toUpperCase());
            setSecondaryMessage(props.route.params?.deliveryMethod === 'delivery' ? appText.preparingSecondaryMessageDelivery : appText.preparingSecondaryMessage);
          }
          if (res.status === 'SUCCESS' && res.data.orderStatus === 'ready') {
            setMainMessageText(props.route.params?.deliveryMethod === 'delivery' ? appText.readyMainMessageDelivery?.toUpperCase() : appText.readyMainMessage?.toUpperCase());
            setSecondaryMessage(props.route.params?.deliveryMethod === 'delivery' ? appText.readySecondaryMessageDelivery : appText.readySecondaryMessage);
          }
          if (res.status === 'SUCCESS' && res.data.orderStatus === 'closed') {
            setMainMessageText(props.route.params?.deliveryMethod === 'delivery' ? appText.closedMainMessageDelivery?.toUpperCase() : appText.closedMainMessage?.toUpperCase());
            setSecondaryMessage(props.route.params?.deliveryMethod === 'delivery' ? appText.closedSecondaryMessageDelivery : appText.closedSecondaryMessage);
          }
          setLoadingModal(false);
          setInitialLoadingComplete(true);
        } catch (error) {
          console.log(`Error while getting initial order status from database: ${error.message}`);
          if (error.message !== 'canceled') {
            setInitialErrorModal(true);
          }
        }
      })();

      return () => {
        if (initialControllerRef.current) initialControllerRef.current.abort();
      }
    }
  }, []);

  // ### Getting order details from database after some interval
  const controllerRef = useRef(null);
  const intervalFunctionIsExecutingRef = useRef(false);
  const intervalIDRef = useRef(null);;
  useEffect(() => {
    intervalIDRef.current = setInterval(async () => {
      if (intervalFunctionIsExecutingRef.current) return;
      if (!initialLoadingComplete) return;
      console.log('Started updating order status');
      intervalFunctionIsExecutingRef.current = true;
      controllerRef.current = new AbortController();
      try {
        const res = (await axios.post(`${values.requestUrl}getOrderUpdate`, { orderId: props.route.params.orderId, orderNumber: props.route.params.orderNumber }, { signal: controllerRef.current.signal })).data;
        if (res.status === 'FAILED') throw new Error (concatErrors(res.errors));
        setUpdatingOrderErrorModalVisible(false);
        console.log('order updated');
        if (res.status === 'SUCCESS' && res.data.orderStatus === 'preparing') {
          setMainMessageText(props.route.params?.deliveryMethod === 'delivery' ? appText.preparingMainMessageDelivery.toUpperCase() : appText.preparingMainMessage.toUpperCase());
          setSecondaryMessage(props.route.params?.deliveryMethod === 'delivery' ? appText.preparingSecondaryMessageDelivery : appText.preparingSecondaryMessage);
          return;
        }
        if (res.status === 'SUCCESS' && res.data.orderStatus === 'ready') {
          setMainMessageText(props.route.params?.deliveryMethod === 'delivery' ? appText.readyMainMessageDelivery.toUpperCase() : appText.readyMainMessage.toUpperCase());
          setSecondaryMessage(props.route.params?.deliveryMethod === 'delivery' ? appText.readySecondaryMessageDelivery : appText.readySecondaryMessage);
          return;
        }
        if (res.status === 'SUCCESS' && res.data.orderStatus === 'closed') {
          setMainMessageText(props.route.params?.deliveryMethod === 'delivery' ? appText.closedMainMessageDelivery.toUpperCase() : appText.closedMainMessage.toUpperCase());
          setSecondaryMessage(props.route.params?.deliveryMethod === 'delivery' ? appText.closedSecondaryMessageDelivery : appText.closedSecondaryMessage);
          return;
        }
      } catch (error) {
        console.log(`Error while updating order status from database: ${error.message}`);
        if (error.message !== 'canceled') {
          setUpdatingOrderErrorModalVisible(true);
        }
      } finally {
        intervalFunctionIsExecutingRef.current = false;
      }
    }, 30000);

    return () => {
      console.log('interval and controllerRef cleaned');
      if (controllerRef.current) controllerRef.current.abort();
      if (intervalIDRef.current) clearInterval(intervalIDRef.current);
    };
  }, [props.route.params.orderId, props.route.params.orderNumber, props.route.params.deliveryMethod, appText, initialLoadingComplete]);
  // ###########################################################################

  // ### Updating orders when notification is delivered;
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Order updated with new data from notification');
      const body = JSON.parse(notification.request.trigger.remoteMessage.data.body);
      if (body.orderStatusUpdate && body.orderId === props.route.params.orderId) {
        if (body.orderStatus === 'preparing') {
          setMainMessageText(props.route.params?.deliveryMethod === 'delivery' ? appText.preparingMainMessageDelivery?.toUpperCase() : appText.preparingMainMessage?.toUpperCase());
          setSecondaryMessage(props.route.params?.deliveryMethod === 'delivery' ? appText.preparingSecondaryMessageDelivery : appText.preparingSecondaryMessage);
        }
        if (body.orderStatus === 'ready') {
          setMainMessageText(props.route.params?.deliveryMethod === 'delivery' ? appText.readyMainMessageDelivery?.toUpperCase() : appText.readyMainMessage?.toUpperCase());
          setSecondaryMessage(props.route.params?.deliveryMethod === 'delivery' ? appText.readySecondaryMessageDelivery : appText.readySecondaryMessage);
        }
        if (body.orderStatus === 'closed') {
          setMainMessageText(props.route.params?.deliveryMethod === 'delivery' ? appText.closedMainMessageDelivery?.toUpperCase() : appText.closedMainMessage?.toUpperCase());
          setSecondaryMessage(props.route.params?.deliveryMethod === 'delivery' ? appText.closedSecondaryMessageDelivery : appText.closedSecondaryMessage);
        }
      }
    });
    return () => subscription.remove();
  }, [props.route.params.orderId, appText]);
  // ############################

  // ### Updating orders status when app comes to foregorund
  const appState = useRef(AppState.currentState);
  const foregroundControllerRef = useRef(null);
  const listenerFunctionIsExecutingRef = useRef(false);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        if (listenerFunctionIsExecutingRef.current) return;
        console.log('Started updating data when returning to foreground');
        listenerFunctionIsExecutingRef.current = true;
        (async () => {
          foregroundControllerRef.current = new AbortController();
          try {
            const res = (await axios.post(`${values.requestUrl}getOrderUpdate`, { orderId: props.route.params.orderId, orderNumber: props.route.params.orderNumber }, { signal: foregroundControllerRef.current.signal })).data;
            if (res.status === 'FAILED') throw new Error (concatErrors(res.errors));
            setUpdatingOrderErrorModalVisible(false);
            console.log('Ended updating data when returning to foreground');
            if (res.status === 'SUCCESS' && res.data.orderStatus === 'preparing') {
              setMainMessageText(props.route.params?.deliveryMethod === 'delivery' ? appText.preparingMainMessageDelivery.toUpperCase() : appText.preparingMainMessage.toUpperCase());
              setSecondaryMessage(props.route.params?.deliveryMethod === 'delivery' ? appText.preparingSecondaryMessageDelivery : appText.preparingSecondaryMessage);
              return;
            }
            if (res.status === 'SUCCESS' && res.data.orderStatus === 'ready') {
              setMainMessageText(props.route.params?.deliveryMethod === 'delivery' ? appText.readyMainMessageDelivery.toUpperCase() : appText.readyMainMessage.toUpperCase());
              setSecondaryMessage(props.route.params?.deliveryMethod === 'delivery' ? appText.readySecondaryMessageDelivery : appText.readySecondaryMessage);
              return;
            }
            if (res.status === 'SUCCESS' && res.data.orderStatus === 'closed') {
              setMainMessageText(props.route.params?.deliveryMethod === 'delivery' ? appText.closedMainMessageDelivery.toUpperCase() : appText.closedMainMessage.toUpperCase());
              setSecondaryMessage(props.route.params?.deliveryMethod === 'delivery' ? appText.closedSecondaryMessageDelivery : appText.closedSecondaryMessage);
              return;
            }
          } catch (error) {
            console.log(`Error while updating order status from database when returning to foreground: ${error.message}`);
            if (error.message !== 'canceled') {
              setUpdatingOrderErrorModalVisible(true);
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
      if (foregroundControllerRef.current) foregroundControllerRef.current.abort();
    };
  }, [props.route.params.orderId, props.route.params.orderNumber, props.route.params.deliveryMethod, appText]);

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
        <CustomSafeAreaScrollViewWindowWithInsets contentContainerStyle={styles.contentContainer} doNotUseInsetsBottom={true}>
          {initialLoadingComplete && 
            <MessagesContainer
              mainMessageText={mainMessageText}
              secondaryMessage={secondaryMessage}
              orderNumber={props.route.params.orderNumber}
              initialLoadingComplete={initialLoadingComplete}
              loadOnStart={props.route.params.loadOnStart}
            />
          }
        </CustomSafeAreaScrollViewWindowWithInsets>
        {initialLoadingComplete && 
          <ShowDetailsContainer
            appText={appText}
            onPress={showDetailsHandler}
            loadOnStart={props.route.params.loadOnStart}
          />
        }
      <AboveMessage
        visible={updatingOrderErrorModalVisible}
        closeOnBackButtonPress={true}
        messageText={appText.somethingWentWrongWhileUpdatingOrderStatus}
        confirmButtonText={appText.confirm}
        setModalVisibility={setUpdatingOrderErrorModalVisible}
      />
      <AboveMessage
        visible={initialErrorModal}
        messageText={appText.somethingWentWrongAndTryLater}
        confirmButtonText={appText.confirm}
        setModalVisibility={setInitialErrorModal}
        onConfirm={props.navigation.goBack}
        onRequestClose={props.navigation.goBack}
      />
      <LoadingModal
        visible={loadingModal}
        onRequestClose={props.navigation.goBack}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: values.windowHorizontalPadding,
  },
});

export default OrderScreen;