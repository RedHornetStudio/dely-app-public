import React, { useState, useRef, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { itemsDeletedFromShoppingCart } from '../../features/shoppingCartSlice';
import { ordersHistoryChanged } from '../../features/ordersHistorySlice';
import values from '../../constants/values';
import colors from '../../constants/colors';
import RegularText from '../../components/RegularText';
import BoldText from '../../components/BoldText';
import CustomImageBackground from '../../components/CustomImageBackground';
import CustomSafeAreaScrollViewWindowWithInsets from '../../components/CustomSafeAreaScrollViewWindowWithInsets';
import HeaderBigIcon from '../../components/HeaderBigIcon';
import InputField from '../../components/InputField';
import getLocalizedText from '../../constants/getLocalizedText';
import MainButton from '../../components/MainButton';
import AboveMessage from '../../components/AboveMessage';
import LoadingModal from '../../components/LoadingModal';
import { registerForPushNotificationsAsync } from '../../shared/sharedFunctions';
import { contactInfoChanged } from '../../features/contactInfoSlice';

const AddressScreen = props => {
  console.log('----Address Screen rerendered----');

  const insets = useSafeAreaInsets();

  const dispatch = useDispatch();

  const [enterAllRequiredFieldsModalText, setEnterAllRequiredFieldsModalText] = useState('');
  const [enterAllRequiredFieldsModalVisible, setEnterAllRequiredFieldsModalVisible] = useState(false);
  const [sendingOrderErrorModalVisible, setSendingOrderErrorModalVisible] = useState(false);
  const [sendingOrder, setSendingOrder] = useState(false);

  // ### Getting contact info
  const contactInfo = useSelector(state => state.contactInfoSlice);

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(contactInfo.phoneNumber);
  const [address, setAddress] = useState(props.route.params.order.deliveryMethodDetails.deliveryMethod === 'delivery' ? contactInfo.address : '');
  const [doorCode, setDoorCode] = useState(props.route.params.order.deliveryMethodDetails.deliveryMethod === 'delivery' ? contactInfo.doorCode : '');

  // Going to next input field by pressing return key
  const phoneInputRef = useRef();
  const addressInputRef = useRef();
  const doorCodeInputRef = useRef();

  // Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // Buy button code
  const onPressBuyHandler = () => {
    setSendingOrder(true);
    const order = props.route.params.order;
    order.language = appLanguage;
    order.deliveryMethodDetails.name = name;
    order.deliveryMethodDetails.phoneNumber = phoneNumber;
    order.deliveryMethodDetails.address = address;
    order.deliveryMethodDetails.doorCode = doorCode;
    (async () => {
      try {
        const pushToken = await registerForPushNotificationsAsync();
        order.pushToken = pushToken;
        const res = (await axios.post(`${values.requestUrl}postOrder`, { order })).data;
        if (res.status === 'FAILED' && res.errors[0].param) {
          switch (`${res.errors[0].msg} ${res.errors[0].param}`) {
            case 'Empty value address':
              setEnterAllRequiredFieldsModalText(appText.emptyInputAddress);
              break;
            case 'Empty value phoneNumber':
              setEnterAllRequiredFieldsModalText(appText.emptyInputPhoneNumber);
              break;
            case 'Invalid value phoneNumber':
              setEnterAllRequiredFieldsModalText(appText.invalidInputPhoneNumber);
              break;
          }
          setEnterAllRequiredFieldsModalVisible(true);
          setSendingOrder(false);
          return; 
        }
        if (res.status === 'FAILED' && res.errors[0].msg === 'Location do not exist') {
          setEnterAllRequiredFieldsModalText(appText.restaurantWithThisLocationDoNotExist);
          setEnterAllRequiredFieldsModalVisible(true);
          setSendingOrder(false);
          return;
        }
        if (res.status === 'FAILED' && res.errors[0].msg === 'Location is closed') {
          setEnterAllRequiredFieldsModalText(appText.restaurantInThisLocationIsClosed);
          setEnterAllRequiredFieldsModalVisible(true);
          setSendingOrder(false);
          return;
        }
        if (res.status === 'FAILED') throw new Error(res.errors[0].msg);

        // saving last orders to AsyncStorage
        const newOrderHistoryString = await AsyncStorage.getItem('@ordersHistory');
        const newOrderHistory = newOrderHistoryString ? JSON.parse(newOrderHistoryString) : []; 
        if (newOrderHistory.length >= values.orderHistoryCount) {
          newOrderHistory.shift();
          newOrderHistory.push({ id: res.data.orderId, number: res.data.orderNumber });
        } else {
          newOrderHistory.push({ id: res.data.orderId, number: res.data.orderNumber });
        }
        AsyncStorage.setItem('@ordersHistory', JSON.stringify(newOrderHistory));
        AsyncStorage.setItem('@phoneNumber', phoneNumber);
        AsyncStorage.setItem('@address', props.route.params.order.deliveryMethodDetails.deliveryMethod === 'delivery' ? address : contactInfo.address);
        AsyncStorage.setItem('@doorCode', props.route.params.order.deliveryMethodDetails.deliveryMethod === 'delivery' ? doorCode : contactInfo.doorCode);
        dispatch(contactInfoChanged({
          phoneNumber: phoneNumber,
          address: props.route.params.order.deliveryMethodDetails.deliveryMethod === 'delivery' ? address : contactInfo.address,
          doorCode: props.route.params.order.deliveryMethodDetails.deliveryMethod === 'delivery' ? doorCode : contactInfo.doorCode
        }))

        dispatch(ordersHistoryChanged(JSON.stringify(newOrderHistory)));
        dispatch(itemsDeletedFromShoppingCart());
        props.navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'Order', params: { orderId: res.data.orderId, orderNumber: res.data.orderNumber, deliveryMethod: order.deliveryMethodDetails.deliveryMethod } }] });
      } catch (error) {
        console.log(`Error while sending order: ${error.message}`);
        if (error.message !== 'canceled') {
          setSendingOrderErrorModalVisible(true);
          setSendingOrder(false);
        }
      }
    })();
  };

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
      <CustomSafeAreaScrollViewWindowWithInsets
        contentContainerStyle={styles.contentContainerStyle}
        doNotUseInsetsBottom={true}
        contentMinHeight={{ value: values.headerBigIconSize - values.mainButtonHeight - values.topMargin, useWindowHeight: true, useInsetsTop: true }}
      >
        <HeaderBigIcon><MaterialIcons name="delivery-dining" size={values.headerBigIconSize} color={colors.primaryColor} /></HeaderBigIcon>
        <BoldText style={styles.titleText}>{props.route.params.shopTitle}</BoldText>
        <View style={styles.addressContainer}>
          <Entypo name="location-pin" size={values.regularTextSize} color={colors.primaryColor} />
          <RegularText style={styles.addressText}>{`${props.route.params.locationCity}, ${props.route.params.locationAddress}`}</RegularText>
        </View>
        <RegularText style={styles.chooseDeliverTitle}>{appText.enterDeliveryDetails}</RegularText>
        {/* <InputField
          containerStyle={styles.textInput}
          value={name}
          onChangeText={setName}
          placeholder={`${appText.name}*`}
          icon={{ Family: Ionicons, name: 'people-sharp' }}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => phoneInputRef.current.focus()}
        /> */}
        {props.route.params.order.deliveryMethodDetails.deliveryMethod === 'delivery'
          ? <View>
            <InputField
              containerStyle={styles.textInput}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder={`${appText.phoneNumber}*`}
              keyboardType="phone-pad"
              inputType='phone-number'
              icon={{ Family: Entypo, name: 'phone' }}
              ref={phoneInputRef}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => addressInputRef.current.focus()}
            />
            <InputField
              containerStyle={styles.textInput}
              value={address}
              onChangeText={setAddress}
              placeholder={`${appText.address}*`}
              icon={{ Family: Entypo, name: 'location-pin' }}
              ref={addressInputRef}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => doorCodeInputRef.current.focus()}
            />
            <InputField
              containerStyle={styles.textInput}
              value={doorCode}
              onChangeText={setDoorCode}
              placeholder={appText.doorCode}
              keyboardType="phone-pad"
              icon={{ Family: MaterialIcons, name: 'sensor-door' }}
              ref={doorCodeInputRef}
            />
          </View>
          : <InputField
            containerStyle={styles.textInput}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder={`${appText.phoneNumber}*`}
            keyboardType="phone-pad"
            inputType='phone-number'
            icon={{ Family: Entypo, name: 'phone' }}
            ref={phoneInputRef}
          />
        }
      </CustomSafeAreaScrollViewWindowWithInsets>
      <View style={[styles.buyButtonContainer, { paddingTop: values.topMargin / 2, paddingBottom: values.topMargin / 2 + insets.bottom }]}>
          <View style={styles.totalPriceContainer}>
            <RegularText style={styles.text} numberOfLines={1}>{appText.totalPrice}</RegularText>
            <RegularText style={styles.text} numberOfLines={1}>{`${props.route.params.currency} ${props.route.params.order.totalPrice}`}</RegularText>
          </View>
          <MainButton onPress={onPressBuyHandler}>{appText.buy}</MainButton>
      </View>
      <AboveMessage
        visible={enterAllRequiredFieldsModalVisible}
        closeOnBackButtonPress={true}
        messageText={enterAllRequiredFieldsModalText}
        confirmButtonText={appText.confirm}
        setModalVisibility={setEnterAllRequiredFieldsModalVisible}
      />
      <AboveMessage
        visible={sendingOrderErrorModalVisible}
        closeOnBackButtonPress={true}
        messageText={appText.somethingWentWrongWhileSendingOrder}
        confirmButtonText={appText.confirm}
        setModalVisibility={setSendingOrderErrorModalVisible}
      />
      <LoadingModal visible={sendingOrder} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentContainerStyle: {
    paddingHorizontal: values.windowHorizontalPadding,
  },
  textInput: {
    marginTop: values.topMargin,
  },
  titleText: {
    textAlign: 'center',
    fontSize: values.headerTextSize,
  },
  chooseDeliverTitle: {
    marginTop: values.topMargin,
    textAlign: 'center',
    fontSize: values.headerTextSize / 1,
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buyButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: values.windowHorizontalPadding,
    backgroundColor: colors.thirdColor,
  },
  text: {
    fontSize: values.regularTextSize * 1.2,
  },
});

export default AddressScreen;