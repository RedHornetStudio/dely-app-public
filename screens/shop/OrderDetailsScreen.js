import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import axios from 'axios';

import colors from '../../constants/colors';
import values from '../../constants/values';
import getLocalizedText from '../../constants/getLocalizedText';
import CustomImageBackground from '../../components/CustomImageBackground';
import CustomSafeAreaScrollViewWindowWithInsets from '../../components/CustomSafeAreaScrollViewWindowWithInsets';
import LoadingModal from '../../components/LoadingModal';
import { concatErrors } from '../../shared/sharedFunctions';
import AboveMessage from '../../components/AboveMessage';
import OrderDetailsBottomButtons from '../../components/OrderDetailsScreen/OrderDetailsBottomButtons';
import OrderDetailsContainer from '../../components/OrderDetailsScreen/OrderDetailsContainer';
import SendTimeAboveMessage from '../../components/OrdersScreen/SendTimeAboveMessage';
import { getNewAccessTokenAsync } from '../../shared/sharedFunctions';

const OrderDetailsScreen = props => {
  console.log('----Order Details Screen rerendered----');

  // ### Auth tokens
  const auth = useSelector(state => state.authSlice);

  // ### Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // ### Loading order data from database
  const [order, setOrder] = useState(null);
  const [orderDate, setOrderDate] = useState('');
  const [loadingModal, setLoadingModal] = useState(true);

  const [aboveMessge, setAboveMessage] = useState(false);
  const [aboveMessageText, setAboveMessageText] = useState('');

  useEffect(() => {
    let controller = new AbortController();
    (async () => {
      try {
        const res = (await axios.post(`${values.requestUrl}getOrderDetails`, { orderId: props.route.params.orderId, orderNumber: props.route.params.orderNumber }, { signal: controller.signal })).data;
        if (res.status === 'FAILED' && res.errors[0].msg === 'Order do not exist') {
          setAboveMessageText(appText.orderDoNotExist);
          setAboveMessage(true);
          setLoadingModal(false);
          return;
        }
        if (res.status === 'FAILED') throw new Error (concatErrors(res.errors));

        const creationDate = new Date(res.data.order_generation_time);
        const creationDateString = creationDate.getDate().toString();
        const date = creationDateString.length === 1 ? `0${creationDateString}` : creationDateString;
        const creationMonthString = (creationDate.getMonth() + 1).toString();
        const month = creationMonthString.length === 1 ? `0${creationMonthString}` : creationMonthString;
        const creationYearString = creationDate.getFullYear().toString();
        let year;
        switch(creationYearString.length) {
          case 1:
            year = `000${creationYearString}`
            break;
          case 2:
            year = `00${creationYearString}`
            break;
          case 3:
            year = `0${creationYearString}`
            break;
          default:
            year = creationYearString;
        }
        const creationHourString = new Date(creationDate).getHours().toString();
        const hours = creationHourString.length === 1 ? `0${creationHourString}` : creationHourString;
        const creationMinutesString = new Date(creationDate).getMinutes().toString();
        const minutes = creationMinutesString.length === 1 ? `0${creationMinutesString}` : creationMinutesString;
        // const creationSecondsString = new Date(props.data.order_generation_time).getSeconds().toString();
        // const seconds = creationSecondsString.length === 1 ? `0${creationSecondsString}` : creationSecondsString;
        const orderDate = `${date}.${month}.${year} ${hours}:${minutes}`
        setOrderDate(orderDate);
        setLoadingModal(false);
        setOrder(res.data);
      } catch (error) {
        console.log(`Error while loading order details from database: ${error.message}`);
        if (error.message !== 'canceled') {
          setAboveMessageText(appText.somethingWentWrongAndTryLater);
          setAboveMessage(true);
          setLoadingModal(false);
        }
      }
    })();

    return () => {
      if (controller) controller.abort();
    };
  }, []);
  // ##########################################

   // ### Change status above message
   const [changeStatusAboveMessage, setChangeStatusAboveMessage] = useState(false);
   const [changeStatusAboveMessageNextStatus, setChangeStatusAboveMessageNextStatus] = useState('');
   const [somethingWentWrongModal, setSomethingWentWrongModal] = useState(false);
   const [loadingModalVisibility, setLoadingModalVisibility] = useState(false);
   const [errorMessageModalText, setErrorMessageModalText] = useState('');
   const [errorMessageModal, setErrorMessageModal] = useState(false);
   const onChangeStatusConfirmHandler = async () => {
    setLoadingModalVisibility(true);
    try {
      let res = (await axios.post(`${values.requestUrl}admin/postChangeOrderStatus`, { accessToken: auth.accessToken, orderId: order.id, orderStatus: changeStatusAboveMessageNextStatus })).data;
      if (res.status === 'FAILED' && res.errors[0].msg === 'Unauthorized') {
        const { success, newAccessToken } = await getNewAccessTokenAsync(auth.refreshToken, dispatch);
        if (success) {
          res = (await axios.post(`${values.requestUrl}admin/postChangeOrderStatus`, { accessToken: newAccessToken, orderId: order.id, orderStatus: changeStatusAboveMessageNextStatus })).data;
        } else {
          props.navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'BusinessSignIn' }] });
          return;
        }
      }
      if (res.status === 'FAILED' && res.errors[0].msg === 'Order do not exist') {
        setErrorMessageModalText(appText.orderDoNotExist);
        setErrorMessageModal(true);
        setLoadingModalVisibility(false);
        return;
      }
      if (res.status === 'FAILED') throw new Error (concatErrors(res.errors));
      setOrder(order => {
        const newOrder = {...order};
        newOrder.status = res.data.orderStatus;
        return newOrder;
      });
      setLoadingModalVisibility(false);
    } catch (error) {
      console.log(`Error while updating order status in database: ${error.message}`);
      if (error.message !== 'canceled') {
        setLoadingModalVisibility(false);
        setSomethingWentWrongModal(true);
      }
    }
  };
  // #################################################

  // ### Send time above message
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [sendTimeAboveMessage, setSendTimeAboveMessage] = useState(false);
  const onSendTimeConfirmHandler = async () => {
    setLoadingModalVisibility(true);
    try {
      let res = (await axios.post(`${values.requestUrl}admin/postSendOrderTime`, { accessToken: auth.accessToken, orderId: order.id, hours: hours, minutes: minutes })).data;
      if (res.status === 'FAILED' && res.errors[0].msg === 'Unauthorized') {
        const { success, newAccessToken } = await getNewAccessTokenAsync(auth.refreshToken, dispatch);
        if (success) {
          res = (await axios.post(`${values.requestUrl}admin/postSendOrderTime`, { accessToken: newAccessToken, orderId: order.id, hours: hours, minutes: minutes })).data;
        } else {
          props.navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'BusinessSignIn' }] });
          return;
        }
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
      if (res.status === 'FAILED' && res.errors[0].msg === 'Order do not exist') {
        setErrorMessageModalText(appText.orderDoNotExist);
        setErrorMessageModal(true);
        setLoadingModalVisibility(false);
        return;
      }
      if (res.status === 'FAILED') throw new Error (concatErrors(res.errors));
      setSendTimeAboveMessage(false);
      setLoadingModalVisibility(false);
      setOrder(order => {
        const newOrder = {...order};
        newOrder.time_sended = 1;
        return newOrder;
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

  // ### Returning to OrdersScreen with new status
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        if (props.route.params.orderManaging && order) {
          props.navigation.navigate({
            name: 'Orders',
            params: { newStatus: { status: order.status, id: order.id }, newTimeSended: { time_sended: order.time_sended, id: order.id } },
            merge: true,
          });
          return true;
        } else {
          return false;
        }
      });

      return () => subscription.remove();
    }, [order, props.route.params.orderManaging])
  );
   
  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
      <CustomSafeAreaScrollViewWindowWithInsets
        contentContainerStyle={styles.contentContainerStyle}
      >
        {order &&
          <OrderDetailsContainer
            appText={appText}
            orderNumber={props.route.params.orderNumber}
            order={order}
            orderDate={orderDate}
            orderDeliveryMethod={order.delivery_method}
          />
        }
      </CustomSafeAreaScrollViewWindowWithInsets>

      {props.route.params.orderManaging && order &&
        <OrderDetailsBottomButtons
          appText={appText}
          order={order}
          setChangeStatusAboveMessage={setChangeStatusAboveMessage}
          setChangeStatusAboveMessageNextStatus={setChangeStatusAboveMessageNextStatus}
          setSendTimeAboveMessage={setSendTimeAboveMessage}
        />
      }

      <AboveMessage
        visible={aboveMessge}
        setModalVisibility={setAboveMessage}
        messageText={aboveMessageText}
        confirmButtonText={appText.confirm}
        onConfirm={() => props.navigation.goBack()}
        onRequestClose={() => props.navigation.goBack()}
      />
      <LoadingModal
        visible={loadingModal}
        setModalVisibility={setLoadingModal}
        onRequestClose={() => props.navigation.goBack()}
      />

      {/* Change status modals */}
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
        visible={errorMessageModal}
        closeOnBackButtonPress={true}
        messageText={errorMessageModalText}
        confirmButtonText={appText.confirm}
        setModalVisibility={setErrorMessageModal}
      />
      <AboveMessage
        visible={somethingWentWrongModal}
        closeOnBackButtonPress={true}
        messageText={appText.somethingWentWrongAndTryLater}
        confirmButtonText={appText.confirm}
        setModalVisibility={setSomethingWentWrongModal}
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
  contentContainerStyle: {
    paddingTop: values.topMargin,
    paddingHorizontal: values.windowHorizontalPadding
  },
});

export default OrderDetailsScreen;