import React, { useState, useRef, useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; 
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { getCalendars } from 'expo-localization';

import colors from '../../constants/colors';
import values from '../../constants/values';
import RegularText from '../../components/RegularText';
import getLocalizedText from '../../constants/getLocalizedText';
import CustomImageBackground from '../../components/CustomImageBackground';
import CustomSafeAreaScrollViewWindowWithInsets from '../../components/CustomSafeAreaScrollViewWindowWithInsets';
import HeaderBigIcon from '../../components/HeaderBigIcon';
import InputField from '../../components/InputField';
import BottomButtonContainer from '../../components/BottomButtonContainer';
import CustomSwitch from '../../components/CustomSwitch';
import LoadingModal from '../../components/LoadingModal';
import { getNewAccessTokenAsync } from '../../shared/sharedFunctions';
import AboveMessage from '../../components/AboveMessage';
import DeliveryPriceInput from '../../components/AddLocationSreen/DeliveryPriceInput';

const AddLocationScreen = props => {
  console.log('----Add Location Screen rerendered----');

  // ### auth tokens
  const auth = useSelector(state => state.authSlice);

  // ### Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // ### Loading modals
  const [addLoadingModal, setAddLoadingModal] = useState(false);

  const sortedTimeZones = useMemo(() => {
    const collator = new Intl.Collator(appLanguage);
    return values.timeZones.sort((a, b) => collator.compare(a.title, b.title));
  }, [appLanguage]);

  // ## On first render show delivery price input without fade in
  const firstRender = useRef(true);
  useEffect(() => {
    firstRender.current = false;
  }, []);

  // ### Above message
  const [aboveMessageText, setAboveMessageText] = useState('');
  const [aboveMessageVisible, setAboveMessageVisible] = useState(false);
  const [permissionDeniedModalVisibility, setPermissionDeniedModalVisibility] = useState(false);

  // ### Input values
  const [city, setCity] = useState(props.route.params?.editingMode ? props.route.params.city : '');
  const [address, setAddress] = useState(props.route.params?.editingMode ? props.route.params.address : '');
  const [phoneNumber, setPhoneNumber] = useState(props.route.params?.editingMode ? props.route.params.phoneNumber : '');
  const [timeZone, setTimeZone] = useState(props.route.params?.editingMode ? props.route.params.timeZone : getCalendars()[0].timeZone)
  const addressInputRef = useRef(null);
  const phoneNumberInputRef = useRef(null);

  const [inPlace, setInPlace] = useState(props.route.params?.editingMode ? props.route.params.inPlace ? true : false : false);
  const [takeAway, setTakeAway] = useState(props.route.params?.editingMode ? props.route.params.takeAway ? true : false : false);
  const [delivery, setDelivery] = useState(props.route.params?.editingMode ? props.route.params.delivery ? true : false : false);
  const [deliveryPrice, setDeliveryPrice] = useState(props.route.params?.editingMode ? props.route.params.delivery ? props.route.params.deliveryPrice : '' : '');

  const [mondayStartHour, setMondayStartHour] = useState(props.route.params?.editingMode ? props.route.params.workingHours['1'] !== 'closed' ? props.route.params.workingHours['1'].split(/:|-/)[0] : '' : '');
  useEffect(() => { if (mondayStartHour.length > 1) mondayStartMinuteRef.current.focus() }, [mondayStartHour]);
  const [mondayStartMinute, setMondayStartMinute] = useState(props.route.params?.editingMode ? props.route.params.workingHours['1'] !== 'closed' ? props.route.params.workingHours['1'].split(/:|-/)[1] : '' : '');
  useEffect(() => { if (mondayStartMinute.length > 1) mondayEndHourRef.current.focus() }, [mondayStartMinute]);
  const [mondayEndHour, setMondayEndHour] = useState(props.route.params?.editingMode ? props.route.params.workingHours['1'] !== 'closed' ? props.route.params.workingHours['1'].split(/:|-/)[2] : '' : '');
  useEffect(() => { if (mondayEndHour.length > 1) mondayEndMinuteRef.current.focus() }, [mondayEndHour]);
  const [mondayEndMinute, setMondayEndMinute] = useState(props.route.params?.editingMode ? props.route.params.workingHours['1'] !== 'closed' ? props.route.params.workingHours['1'].split(/:|-/)[3] : '' : '');
  useEffect(() => { if (mondayEndMinute.length > 1) tuesdayStartHourRef.current.focus() }, [mondayEndMinute]);
  const mondayStartHourRef = useRef(null);
  const mondayStartMinuteRef = useRef(null);
  const mondayEndHourRef = useRef(null);
  const mondayEndMinuteRef = useRef(null);

  const [tuesdayStartHour, setTuesdayStartHour] = useState(props.route.params?.editingMode ? props.route.params.workingHours['2'] !== 'closed' ? props.route.params.workingHours['2'].split(/:|-/)[0] : '' : '');
  useEffect(() => { if (tuesdayStartHour.length > 1) tuesdayStartMinuteRef.current.focus() }, [tuesdayStartHour]);
  const [tuesdayStartMinute, setTuesdayStartMinute] = useState(props.route.params?.editingMode ? props.route.params.workingHours['2'] !== 'closed' ? props.route.params.workingHours['2'].split(/:|-/)[1] : '' : '');
  useEffect(() => { if (tuesdayStartMinute.length > 1) tuesdayEndHourRef.current.focus() }, [tuesdayStartMinute]);
  const [tuesdayEndHour, setTuesdayEndHour] = useState(props.route.params?.editingMode ? props.route.params.workingHours['2'] !== 'closed' ? props.route.params.workingHours['2'].split(/:|-/)[2] : '' : '');
  useEffect(() => { if (tuesdayEndHour.length > 1) tuesdayEndMinuteRef.current.focus() }, [tuesdayEndHour]);
  const [tuesdayEndMinute, setTuesdayEndMinute] = useState(props.route.params?.editingMode ? props.route.params.workingHours['2'] !== 'closed' ? props.route.params.workingHours['2'].split(/:|-/)[3] : '' : '');
  useEffect(() => { if (tuesdayEndMinute.length > 1) wednesdayStartHourRef.current.focus() }, [tuesdayEndMinute]);
  const tuesdayStartHourRef = useRef(null);
  const tuesdayStartMinuteRef = useRef(null);
  const tuesdayEndHourRef = useRef(null);
  const tuesdayEndMinuteRef = useRef(null);

  const [wednesdayStartHour, setWednesdayStartHour] = useState(props.route.params?.editingMode ? props.route.params.workingHours['3'] !== 'closed' ? props.route.params.workingHours['3'].split(/:|-/)[0] : '' : '');
  useEffect(() => { if (wednesdayStartHour.length > 1) wednesdayStartMinuteRef.current.focus() }, [wednesdayStartHour]);
  const [wednesdayStartMinute, setWednesdayStartMinute] = useState(props.route.params?.editingMode ? props.route.params.workingHours['3'] !== 'closed' ? props.route.params.workingHours['3'].split(/:|-/)[1] : '' : '');
  useEffect(() => { if (wednesdayStartMinute.length > 1) wednesdayEndHourRef.current.focus() }, [wednesdayStartMinute]);
  const [wednesdayEndHour, setWednesdayEndHour] = useState(props.route.params?.editingMode ? props.route.params.workingHours['3'] !== 'closed' ? props.route.params.workingHours['3'].split(/:|-/)[2] : '' : '');
  useEffect(() => { if (wednesdayEndHour.length > 1) wednesdayEndMinuteRef.current.focus() }, [wednesdayEndHour]);
  const [wednesdayEndMinute, setWednesdayEndMinute] = useState(props.route.params?.editingMode ? props.route.params.workingHours['3'] !== 'closed' ? props.route.params.workingHours['3'].split(/:|-/)[3] : '' : '');
  useEffect(() => { if (wednesdayEndMinute.length > 1) thursdayStartHourRef.current.focus() }, [wednesdayEndMinute]);
  const wednesdayStartHourRef = useRef(null);
  const wednesdayStartMinuteRef = useRef(null);
  const wednesdayEndHourRef = useRef(null);
  const wednesdayEndMinuteRef = useRef(null);

  const [thursdayStartHour, setThursdayStartHour] = useState(props.route.params?.editingMode ? props.route.params.workingHours['4'] !== 'closed' ? props.route.params.workingHours['4'].split(/:|-/)[0] : '' : '');
  useEffect(() => { if (thursdayStartHour.length > 1) thursdayStartMinuteRef.current.focus() }, [thursdayStartHour]);
  const [thursdayStartMinute, setThursdayStartMinute] = useState(props.route.params?.editingMode ? props.route.params.workingHours['4'] !== 'closed' ? props.route.params.workingHours['4'].split(/:|-/)[1] : '' : '');
  useEffect(() => { if (thursdayStartMinute.length > 1) thursdayEndHourRef.current.focus() }, [thursdayStartMinute]);
  const [thursdayEndHour, setThursdayEndHour] = useState(props.route.params?.editingMode ? props.route.params.workingHours['4'] !== 'closed' ? props.route.params.workingHours['4'].split(/:|-/)[2] : '' : '');
  useEffect(() => { if (thursdayEndHour.length > 1) thursdayEndMinuteRef.current.focus() }, [thursdayEndHour]);
  const [thursdayEndMinute, setThursdayEndMinute] = useState(props.route.params?.editingMode ? props.route.params.workingHours['4'] !== 'closed' ? props.route.params.workingHours['4'].split(/:|-/)[3] : '' : '');
  useEffect(() => { if (thursdayEndMinute.length > 1) fridayStartHourRef.current.focus() }, [thursdayEndMinute]);
  const thursdayStartHourRef = useRef(null);
  const thursdayStartMinuteRef = useRef(null);
  const thursdayEndHourRef = useRef(null);
  const thursdayEndMinuteRef = useRef(null);

  const [fridayStartHour, setFridayStartHour] = useState(props.route.params?.editingMode ? props.route.params.workingHours['5'] !== 'closed' ? props.route.params.workingHours['5'].split(/:|-/)[0] : '' : '');
  useEffect(() => { if (fridayStartHour.length > 1) fridayStartMinuteRef.current.focus() }, [fridayStartHour]);
  const [fridayStartMinute, setFridayStartMinute] = useState(props.route.params?.editingMode ? props.route.params.workingHours['5'] !== 'closed' ? props.route.params.workingHours['5'].split(/:|-/)[1] : '' : '');
  useEffect(() => { if (fridayStartMinute.length > 1) fridayEndHourRef.current.focus() }, [fridayStartMinute]);
  const [fridayEndHour, setFridayEndHour] = useState(props.route.params?.editingMode ? props.route.params.workingHours['5'] !== 'closed' ? props.route.params.workingHours['5'].split(/:|-/)[2] : '' : '');
  useEffect(() => { if (fridayEndHour.length > 1) fridayEndMinuteRef.current.focus() }, [fridayEndHour]);
  const [fridayEndMinute, setFridayEndMinute] = useState(props.route.params?.editingMode ? props.route.params.workingHours['5'] !== 'closed' ? props.route.params.workingHours['5'].split(/:|-/)[3] : '' : '');
  useEffect(() => { if (fridayEndMinute.length > 1) saturdayStartHourRef.current.focus() }, [fridayEndMinute]);
  const fridayStartHourRef = useRef(null);
  const fridayStartMinuteRef = useRef(null);
  const fridayEndHourRef = useRef(null);
  const fridayEndMinuteRef = useRef(null);

  const [saturdayStartHour, setSaturdayStartHour] = useState(props.route.params?.editingMode ? props.route.params.workingHours['6'] !== 'closed' ? props.route.params.workingHours['6'].split(/:|-/)[0] : '' : '');
  useEffect(() => { if (saturdayStartHour.length > 1) saturdayStartMinuteRef.current.focus() }, [saturdayStartHour]);
  const [saturdayStartMinute, setSaturdayStartMinute] = useState(props.route.params?.editingMode ? props.route.params.workingHours['6'] !== 'closed' ? props.route.params.workingHours['6'].split(/:|-/)[1] : '' : '');
  useEffect(() => { if (saturdayStartMinute.length > 1) saturdayEndHourRef.current.focus() }, [saturdayStartMinute]);
  const [saturdayEndHour, setSaturdayEndHour] = useState(props.route.params?.editingMode ? props.route.params.workingHours['6'] !== 'closed' ? props.route.params.workingHours['6'].split(/:|-/)[2] : '' : '');
  useEffect(() => { if (saturdayEndHour.length > 1) saturdayEndMinuteRef.current.focus() }, [saturdayEndHour]);
  const [saturdayEndMinute, setSaturdayEndMinute] = useState(props.route.params?.editingMode ? props.route.params.workingHours['6'] !== 'closed' ? props.route.params.workingHours['6'].split(/:|-/)[3] : '' : '');
  useEffect(() => { if (saturdayEndMinute.length > 1) sundayStartHourRef.current.focus() }, [saturdayEndMinute]);
  const saturdayStartHourRef = useRef(null);
  const saturdayStartMinuteRef = useRef(null);
  const saturdayEndHourRef = useRef(null);
  const saturdayEndMinuteRef = useRef(null);

  const [sundayStartHour, setSundayStartHour] = useState(props.route.params?.editingMode ? props.route.params.workingHours['0'] !== 'closed' ? props.route.params.workingHours['0'].split(/:|-/)[0] : '' : '');
  useEffect(() => { if (sundayStartHour.length > 1) sundayStartMinuteRef.current.focus() }, [sundayStartHour]);
  const [sundayStartMinute, setSundayStartMinute] = useState(props.route.params?.editingMode ? props.route.params.workingHours['0'] !== 'closed' ? props.route.params.workingHours['0'].split(/:|-/)[1] : '' : '');
  useEffect(() => { if (sundayStartMinute.length > 1) sundayEndHourRef.current.focus() }, [sundayStartMinute]);
  const [sundayEndHour, setSundayEndHour] = useState(props.route.params?.editingMode ? props.route.params.workingHours['0'] !== 'closed' ? props.route.params.workingHours['0'].split(/:|-/)[2] : '' : '');
  useEffect(() => { if (sundayEndHour.length > 1) sundayEndMinuteRef.current.focus() }, [sundayEndHour]);
  const [sundayEndMinute, setSundayEndMinute] = useState(props.route.params?.editingMode ? props.route.params.workingHours['0'] !== 'closed' ? props.route.params.workingHours['0'].split(/:|-/)[3] : '' : '');
  // useEffect(() => { if (sundayEndMinute.length > 1) sundayEndMinuteRef.current.focus() }, [sundayEndMinute]);
  const sundayStartHourRef = useRef(null);
  const sundayStartMinuteRef = useRef(null);
  const sundayEndHourRef = useRef(null);
  const sundayEndMinuteRef = useRef(null);

  // ### Handling location adding
  const dispatch = useDispatch();
  const onPressAddHandler = () => {
    (async () => {
      try {
        setAddLoadingModal(true);
        let res = (await axios.post(`${values.requestUrl}admin/postAddLocation`, {
          accessToken: auth.accessToken,
          city,
          address,
          phoneNumber,
          delivery,
          inPlace,
          takeAway,
          workingHours: {
            monday: { startHour: mondayStartHour, startMinute: mondayStartMinute, endHour: mondayEndHour, endMinute: mondayEndMinute },
            tuesday: { startHour: tuesdayStartHour, startMinute: tuesdayStartMinute, endHour: tuesdayEndHour, endMinute: tuesdayEndMinute },
            wednesday: { startHour: wednesdayStartHour, startMinute: wednesdayStartMinute, endHour: wednesdayEndHour, endMinute: wednesdayEndMinute },
            thursday: { startHour: thursdayStartHour, startMinute: thursdayStartMinute, endHour: thursdayEndHour, endMinute: thursdayEndMinute },
            friday: { startHour: fridayStartHour, startMinute: fridayStartMinute, endHour: fridayEndHour, endMinute: fridayEndMinute },
            saturday: { startHour: saturdayStartHour, startMinute: saturdayStartMinute, endHour: saturdayEndHour, endMinute: saturdayEndMinute },
            sunday: { startHour: sundayStartHour, startMinute: sundayStartMinute, endHour: sundayEndHour, endMinute: sundayEndMinute },
          },
          deliveryPrice,
          timeZone,
        })).data;
        if (res.status === 'FAILED' && res.errors[0].msg === 'Unauthorized') {
          const { success, newAccessToken } = await getNewAccessTokenAsync(auth.refreshToken, dispatch);
          if (success) {
            res = (await axios.post(`${values.requestUrl}admin/postAddLocation`, {
              accessToken: newAccessToken,
              city,
              address,
              phoneNumber,
              delivery,
              inPlace,
              takeAway,
              workingHours: {
                monday: { startHour: mondayStartHour, startMinute: mondayStartMinute, endHour: mondayEndHour, endMinute: mondayEndMinute },
                tuesday: { startHour: tuesdayStartHour, startMinute: tuesdayStartMinute, endHour: tuesdayEndHour, endMinute: tuesdayEndMinute },
                wednesday: { startHour: wednesdayStartHour, startMinute: wednesdayStartMinute, endHour: wednesdayEndHour, endMinute: wednesdayEndMinute },
                thursday: { startHour: thursdayStartHour, startMinute: thursdayStartMinute, endHour: thursdayEndHour, endMinute: thursdayEndMinute },
                friday: { startHour: fridayStartHour, startMinute: fridayStartMinute, endHour: fridayEndHour, endMinute: fridayEndMinute },
                saturday: { startHour: saturdayStartHour, startMinute: saturdayStartMinute, endHour: saturdayEndHour, endMinute: saturdayEndMinute },
                sunday: { startHour: sundayStartHour, startMinute: sundayStartMinute, endHour: sundayEndHour, endMinute: sundayEndMinute },
              },
              deliveryPrice,
              timeZone,
            })).data;
          } else {
            props.navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'BusinessSignIn' }] });
            return;
          }
        }
        if (res.status === 'FAILED' && res.errors[0].msg === 'Permission denied') {
          setAboveMessageText(appText.permissionDenied);
          setAboveMessageVisible(true);
          setAddLoadingModal(false);
          return;
        }
        if (res.status === 'FAILED' && res.errors[0].param) {
          switch (`${res.errors[0].msg} ${res.errors[0].param}`) {
            case 'Empty value city':
              setAboveMessageText(appText.emptyInputCity);
              break;
            case 'Empty value address':
              setAboveMessageText(appText.emptyInputAddress);
              break;
            case 'Empty value phoneNumber':
              setAboveMessageText(appText.emptyInputPhoneNumber);
              break;
            case 'Invalid value phoneNumber':
              setAboveMessageText(appText.invalidInputPhoneNumber);
              break;
            case 'Invalid value monday':
              setAboveMessageText(appText.invaliTimeFormatMonday);
              break;
            case 'Invalid value tuesday':
              setAboveMessageText(appText.invaliTimeFormatTuesday);
              break;
            case 'Invalid value wednesday':
              setAboveMessageText(appText.invaliTimeFormatWednesday);
              break;
            case 'Invalid value thursday':
              setAboveMessageText(appText.invaliTimeFormatThursday);
              break;
            case 'Invalid value friday':
              setAboveMessageText(appText.invaliTimeFormatFriday);
              break;
            case 'Invalid value saturday':
              setAboveMessageText(appText.invaliTimeFormatSaturday);
              break;
            case 'Invalid value sunday':
              setAboveMessageText(appText.invaliTimeFormatSunday);
              break;
            case 'Not chosen deliveryMethods':
              setAboveMessageText(appText.chooseDeliveryMethods);
              break;
            case 'Empty value deliveryPrice':
              setAboveMessageText(appText.emptyInputDeliveryPrice);
              break;
            case 'Invalid value deliveryPrice':
              setAboveMessageText(appText.invalidInputDeliveryPrice);
              break;
          }
          setAboveMessageVisible(true);
          setAddLoadingModal(false);
          return; 
        }
        if (res.status === 'FAILED') throw new Error(res.errors[0].msg);
        props.navigation.navigate({
          name: 'Locations',
          params: { needUpdate: {} },
          merge: true,
        });
      } catch (error) {
        console.log(`Error while updating shop data in database: ${error.message}`);
        setAboveMessageText(appText.somethingWentWrongAndTryLater);
        setAboveMessageVisible(true);
        setAddLoadingModal(false);
      }
    })();
  };
  // ####################################################

  // ### Handling location editing
  const onPressEditHandler = () => {
    (async () => {
      try {
        setAddLoadingModal(true);
        let res = (await axios.post(`${values.requestUrl}admin/postEditLocation`, {
          accessToken: auth.accessToken,
          id: props.route.params.id,
          city,
          address,
          phoneNumber,
          delivery,
          inPlace,
          takeAway,
          workingHours: {
            monday: { startHour: mondayStartHour, startMinute: mondayStartMinute, endHour: mondayEndHour, endMinute: mondayEndMinute },
            tuesday: { startHour: tuesdayStartHour, startMinute: tuesdayStartMinute, endHour: tuesdayEndHour, endMinute: tuesdayEndMinute },
            wednesday: { startHour: wednesdayStartHour, startMinute: wednesdayStartMinute, endHour: wednesdayEndHour, endMinute: wednesdayEndMinute },
            thursday: { startHour: thursdayStartHour, startMinute: thursdayStartMinute, endHour: thursdayEndHour, endMinute: thursdayEndMinute },
            friday: { startHour: fridayStartHour, startMinute: fridayStartMinute, endHour: fridayEndHour, endMinute: fridayEndMinute },
            saturday: { startHour: saturdayStartHour, startMinute: saturdayStartMinute, endHour: saturdayEndHour, endMinute: saturdayEndMinute },
            sunday: { startHour: sundayStartHour, startMinute: sundayStartMinute, endHour: sundayEndHour, endMinute: sundayEndMinute },
          },
          deliveryPrice,
          timeZone,
        })).data;
        if (res.status === 'FAILED' && res.errors[0].msg === 'Unauthorized') {
          const { success, newAccessToken } = await getNewAccessTokenAsync(auth.refreshToken, dispatch);
          if (success) {
            res = (await axios.post(`${values.requestUrl}admin/postEditLocation`, {
              accessToken: newAccessToken,
              id: props.route.params.id,
              city,
              address,
              phoneNumber,
              delivery,
              inPlace,
              takeAway,
              workingHours: {
                monday: { startHour: mondayStartHour, startMinute: mondayStartMinute, endHour: mondayEndHour, endMinute: mondayEndMinute },
                tuesday: { startHour: tuesdayStartHour, startMinute: tuesdayStartMinute, endHour: tuesdayEndHour, endMinute: tuesdayEndMinute },
                wednesday: { startHour: wednesdayStartHour, startMinute: wednesdayStartMinute, endHour: wednesdayEndHour, endMinute: wednesdayEndMinute },
                thursday: { startHour: thursdayStartHour, startMinute: thursdayStartMinute, endHour: thursdayEndHour, endMinute: thursdayEndMinute },
                friday: { startHour: fridayStartHour, startMinute: fridayStartMinute, endHour: fridayEndHour, endMinute: fridayEndMinute },
                saturday: { startHour: saturdayStartHour, startMinute: saturdayStartMinute, endHour: saturdayEndHour, endMinute: saturdayEndMinute },
                sunday: { startHour: sundayStartHour, startMinute: sundayStartMinute, endHour: sundayEndHour, endMinute: sundayEndMinute },
              },
              deliveryPrice,
              timeZone,
            })).data;
          } else {
            props.navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'BusinessSignIn' }] });
            return;
          }
        }
        if (res.status === 'FAILED' && res.errors[0].msg === 'Permission denied') {
          setAboveMessageText(appText.permissionDenied);
          setAboveMessageVisible(true);
          setAddLoadingModal(false);
          return;
        }
        if (res.status === 'FAILED' && res.errors[0].msg === 'Location do not exist') {
          setAboveMessageText(appText.locationDoNotExist);
          setAboveMessageVisible(true);
          setAddLoadingModal(false);
          return;
        }
        if (res.status === 'FAILED' && res.errors[0].param) {
          switch (`${res.errors[0].msg} ${res.errors[0].param}`) {
            case 'Empty value city':
              setAboveMessageText(appText.emptyInputCity);
              break;
            case 'Empty value address':
              setAboveMessageText(appText.emptyInputAddress);
              break;
            case 'Empty value phoneNumber':
              setAboveMessageText(appText.emptyInputPhoneNumber);
              break;
            case 'Invalid value phoneNumber':
              setAboveMessageText(appText.invalidInputPhoneNumber);
              break;
            case 'Invalid value monday':
              setAboveMessageText(appText.invaliTimeFormatMonday);
              break;
            case 'Invalid value tuesday':
              setAboveMessageText(appText.invaliTimeFormatTuesday);
              break;
            case 'Invalid value wednesday':
              setAboveMessageText(appText.invaliTimeFormatWednesday);
              break;
            case 'Invalid value thursday':
              setAboveMessageText(appText.invaliTimeFormatThursday);
              break;
            case 'Invalid value friday':
              setAboveMessageText(appText.invaliTimeFormatFriday);
              break;
            case 'Invalid value saturday':
              setAboveMessageText(appText.invaliTimeFormatSaturday);
              break;
            case 'Invalid value sunday':
              setAboveMessageText(appText.invaliTimeFormatSunday);
              break;
            case 'Not chosen deliveryMethods':
              setAboveMessageText(appText.chooseDeliveryMethods);
              break;
            case 'Empty value deliveryPrice':
              setAboveMessageText(appText.emptyInputDeliveryPrice);
              break;
            case 'Invalid value deliveryPrice':
              setAboveMessageText(appText.invalidInputDeliveryPrice);
              break;
          }
          setAboveMessageVisible(true);
          setAddLoadingModal(false);
          return; 
        }
        if (res.status === 'FAILED') throw new Error(res.errors[0].msg);
        props.navigation.navigate({
          name: 'Locations',
          params: { needUpdate: {} },
          merge: true,
        });
      } catch (error) {
        console.log(`Error while updating shop data in database: ${error.message}`);
        setAboveMessageText(appText.somethingWentWrongAndTryLater);
        setAboveMessageVisible(true);
        setAddLoadingModal(false);
      }
    })();
  };
  // ####################################################

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
      <CustomSafeAreaScrollViewWindowWithInsets
        contentMinHeight={{ value: (values.headerBigIconSize - values.mainButtonHeight - values.topMargin) * 2, useWindowHeight: true, useInsetsTop: true }}
        doNotUseInsetsBottom={true}
      >
        <HeaderBigIcon><Entypo name="location-pin" size={values.headerBigIconSize} color={colors.primaryColor} /></HeaderBigIcon>
        <View style={styles.contentContainer}>
          <RegularText style={styles.headerText} numberOfLines={2}>{props.route.params?.editingMode ? appText.editLocation : appText.addNewLocation}</RegularText>
          <InputField
            containerStyle={styles.textInput}
            value={city}
            onChangeText={setCity}
            placeholder={appText.city}
            icon={{ Family: MaterialIcons, name: 'location-city' }}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => addressInputRef.current.focus()}
          />
          <InputField
            ref={addressInputRef}
            containerStyle={styles.textInput}
            value={address}
            onChangeText={setAddress}
            placeholder={appText.address}
            icon={{ Family: Entypo, name: 'location-pin' }}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => phoneNumberInputRef.current.focus()}
          />
          <InputField
            ref={phoneNumberInputRef}
            containerStyle={styles.textInput}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder={appText.phoneNumber}
            icon={{ Family: Entypo, name: 'phone' }}
            keyboardType="phone-pad"
            inputType="phone-number"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => mondayStartHourRef.current.focus()}
          />
          <RegularText style={styles.secondHeaderText} numberOfLines={1}>{appText.workingHours}</RegularText>
          <View style={styles.daysContainer}>
            <View style={styles.leftColumn}>
              <View style={styles.dayTextContainer}><RegularText style={styles.dayText}>{appText.monday}</RegularText></View>
              <View style={styles.dayTextContainer}><RegularText style={styles.dayText}>{appText.tuesday}</RegularText></View>
              <View style={styles.dayTextContainer}><RegularText style={styles.dayText}>{appText.wednesday}</RegularText></View>
              <View style={styles.dayTextContainer}><RegularText style={styles.dayText}>{appText.thursday}</RegularText></View>
              <View style={styles.dayTextContainer}><RegularText style={styles.dayText}>{appText.friday}</RegularText></View>
              <View style={styles.dayTextContainer}><RegularText style={styles.dayText}>{appText.saturday}</RegularText></View>
              <View style={styles.dayTextContainer}><RegularText style={styles.dayText}>{appText.sunday}</RegularText></View>
            </View>
            <View style={styles.rightColumn}>
              <View style={styles.timeContainer}>
                {/* MONDAY */}
                <InputField
                  ref={mondayStartHourRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={mondayStartHour}
                  onChangeText={setMondayStartHour}
                  placeholder={appText.hh}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
                <RegularText style={[styles.timeText, styles.timeMarginLeft]}>:</RegularText>
                <InputField
                  ref={mondayStartMinuteRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={mondayStartMinute}
                  onChangeText={setMondayStartMinute}
                  placeholder={appText.mm}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
                <RegularText style={[styles.timeText, styles.timeMarginLeft]}>-</RegularText>
                <InputField
                  ref={mondayEndHourRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={mondayEndHour}
                  onChangeText={setMondayEndHour}
                  placeholder={appText.hh}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
                <RegularText style={[styles.timeText, styles.timeMarginLeft]}>:</RegularText>
                <InputField
                  ref={mondayEndMinuteRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={mondayEndMinute}
                  onChangeText={setMondayEndMinute}
                  placeholder={appText.mm}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
              </View>
              {/* TUESDAY */}
              <View style={styles.timeContainer}>
                <InputField
                  ref={tuesdayStartHourRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={tuesdayStartHour}
                  onChangeText={setTuesdayStartHour}
                  placeholder={appText.hh}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
                <RegularText style={[styles.timeText, styles.timeMarginLeft]}>:</RegularText>
                <InputField
                  ref={tuesdayStartMinuteRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={tuesdayStartMinute}
                  onChangeText={setTuesdayStartMinute}
                  placeholder={appText.mm}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
                <RegularText style={[styles.timeText, styles.timeMarginLeft]}>-</RegularText>
                <InputField
                  ref={tuesdayEndHourRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={tuesdayEndHour}
                  onChangeText={setTuesdayEndHour}
                  placeholder={appText.hh}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
                <RegularText style={[styles.timeText, styles.timeMarginLeft]}>:</RegularText>
                <InputField
                  ref={tuesdayEndMinuteRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={tuesdayEndMinute}
                  onChangeText={setTuesdayEndMinute}
                  placeholder={appText.mm}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
              </View>
              {/* WEDNESDAY */}
              <View style={styles.timeContainer}>
                <InputField
                  ref={wednesdayStartHourRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={wednesdayStartHour}
                  onChangeText={setWednesdayStartHour}
                  placeholder={appText.hh}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
                <RegularText style={[styles.timeText, styles.timeMarginLeft]}>:</RegularText>
                <InputField
                  ref={wednesdayStartMinuteRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={wednesdayStartMinute}
                  onChangeText={setWednesdayStartMinute}
                  placeholder={appText.mm}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
                <RegularText style={[styles.timeText, styles.timeMarginLeft]}>-</RegularText>
                <InputField
                  ref={wednesdayEndHourRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={wednesdayEndHour}
                  onChangeText={setWednesdayEndHour}
                  placeholder={appText.hh}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
                <RegularText style={[styles.timeText, styles.timeMarginLeft]}>:</RegularText>
                <InputField
                  ref={wednesdayEndMinuteRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={wednesdayEndMinute}
                  onChangeText={setWednesdayEndMinute}
                  placeholder={appText.mm}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
              </View>
              {/* THURSDAY */}
              <View style={styles.timeContainer}>
                <InputField
                  ref={thursdayStartHourRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={thursdayStartHour}
                  onChangeText={setThursdayStartHour}
                  placeholder={appText.hh}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
                <RegularText style={[styles.timeText, styles.timeMarginLeft]}>:</RegularText>
                <InputField
                  ref={thursdayStartMinuteRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={thursdayStartMinute}
                  onChangeText={setThursdayStartMinute}
                  placeholder={appText.mm}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
                <RegularText style={[styles.timeText, styles.timeMarginLeft]}>-</RegularText>
                <InputField
                  ref={thursdayEndHourRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={thursdayEndHour}
                  onChangeText={setThursdayEndHour}
                  placeholder={appText.hh}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
                <RegularText style={[styles.timeText, styles.timeMarginLeft]}>:</RegularText>
                <InputField
                  ref={thursdayEndMinuteRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={thursdayEndMinute}
                  onChangeText={setThursdayEndMinute}
                  placeholder={appText.mm}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
              </View>
              {/* FRIDAY */}
              <View style={styles.timeContainer}>
                <InputField
                  ref={fridayStartHourRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={fridayStartHour}
                  onChangeText={setFridayStartHour}
                  placeholder={appText.hh}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
                <RegularText style={[styles.timeText, styles.timeMarginLeft]}>:</RegularText>
                <InputField
                  ref={fridayStartMinuteRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={fridayStartMinute}
                  onChangeText={setFridayStartMinute}
                  placeholder={appText.mm}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
                <RegularText style={[styles.timeText, styles.timeMarginLeft]}>-</RegularText>
                <InputField
                  ref={fridayEndHourRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={fridayEndHour}
                  onChangeText={setFridayEndHour}
                  placeholder={appText.hh}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
                <RegularText style={[styles.timeText, styles.timeMarginLeft]}>:</RegularText>
                <InputField
                  ref={fridayEndMinuteRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={fridayEndMinute}
                  onChangeText={setFridayEndMinute}
                  placeholder={appText.mm}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
              </View>
              {/* SATURDAY */}
              <View style={styles.timeContainer}>
                <InputField
                  ref={saturdayStartHourRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={saturdayStartHour}
                  onChangeText={setSaturdayStartHour}
                  placeholder={appText.hh}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
                <RegularText style={[styles.timeText, styles.timeMarginLeft]}>:</RegularText>
                <InputField
                  ref={saturdayStartMinuteRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={saturdayStartMinute}
                  onChangeText={setSaturdayStartMinute}
                  placeholder={appText.mm}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
                <RegularText style={[styles.timeText, styles.timeMarginLeft]}>-</RegularText>
                <InputField
                  ref={saturdayEndHourRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={saturdayEndHour}
                  onChangeText={setSaturdayEndHour}
                  placeholder={appText.hh}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
                <RegularText style={[styles.timeText, styles.timeMarginLeft]}>:</RegularText>
                <InputField
                  ref={saturdayEndMinuteRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={saturdayEndMinute}
                  onChangeText={setSaturdayEndMinute}
                  placeholder={appText.mm}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
              </View>
              {/* SUNDAY */}
              <View style={styles.timeContainer}>
                <InputField
                  ref={sundayStartHourRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={sundayStartHour}
                  onChangeText={setSundayStartHour}
                  placeholder={appText.hh}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
                <RegularText style={[styles.timeText, styles.timeMarginLeft]}>:</RegularText>
                <InputField
                  ref={sundayStartMinuteRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={sundayStartMinute}
                  onChangeText={setSundayStartMinute}
                  placeholder={appText.mm}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
                <RegularText style={[styles.timeText, styles.timeMarginLeft]}>-</RegularText>
                <InputField
                  ref={sundayEndHourRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={sundayEndHour}
                  onChangeText={setSundayEndHour}
                  placeholder={appText.hh}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
                <RegularText style={[styles.timeText, styles.timeMarginLeft]}>:</RegularText>
                <InputField
                  ref={sundayEndMinuteRef}
                  containerStyle={[styles.timeInput, styles.timeMarginLeft]}
                  style={styles.timeText}
                  value={sundayEndMinute}
                  onChangeText={setSundayEndMinute}
                  placeholder={appText.mm}
                  textAlign="center"
                  keyboardType="number-pad"
                  selectTextOnFocus={true}
                  maxLength={2}
                  inputType="numbers"
                  multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
                />
              </View>
            </View>
          </View>
          <RegularText style={styles.secondHeaderText} numberOfLines={1}>{appText.timeZone}</RegularText>
          <InputField
            containerStyle={styles.textInput}
            appText={appText}
            picker={true}
            pickerValue={timeZone}
            setPickerValue={setTimeZone}
            data={sortedTimeZones}
            placeholder={appText.timeZone}
            searchBarPlaceholder={appText.search}
            icon={{ Family: Ionicons, name: 'md-time' }}
            noItemsAfterSearchText={appText.noTimeZonesMatchYourSearch}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => mondayStartHourRef.current.focus()}
          />
          <RegularText style={styles.secondHeaderText} numberOfLines={1}>{appText.deliveryMethods}</RegularText>
          <View style={styles.switchContainer}>
            <RegularText style={styles.switchText} numberOfLines={1}>{appText.inPlace}</RegularText>
            <CustomSwitch
              value={inPlace}
              onValueChange={() => setInPlace(previousState => !previousState)}
            />
          </View>
          <View style={styles.switchContainer}>
            <RegularText style={styles.switchText} numberOfLines={1}>{appText.takeAway}</RegularText>
            <CustomSwitch
              value={takeAway}
              onValueChange={() => setTakeAway(previousState => !previousState)}
            />
          </View>
          <View style={styles.switchContainer}>
            <RegularText style={styles.switchText} numberOfLines={1}>{appText.delivery}</RegularText>
            <CustomSwitch
              value={delivery}
              onValueChange={() => { setDelivery(previousState => !previousState); setDeliveryPrice('') }}
            />
          </View>
        </View>
        {delivery &&
          <DeliveryPriceInput
            appText={appText}
            firstRender={firstRender}
            deliveryPrice={deliveryPrice}
            setDeliveryPrice={setDeliveryPrice}
          />
        }
      </CustomSafeAreaScrollViewWindowWithInsets>

      <BottomButtonContainer
        onPress={props.route.params?.editingMode ? onPressEditHandler : onPressAddHandler}
        title={props.route.params?.editingMode ? appText.edit : appText.add}      
      />

      <LoadingModal visible={addLoadingModal} />

      <AboveMessage
        visible={aboveMessageVisible}
        closeOnBackButtonPress={true}
        messageText={aboveMessageText}
        onConfirm={() => setAboveMessageText('')}
        setModalVisibility={setAboveMessageVisible}
        confirmButtonText={appText.confirm}
      />

      <AboveMessage
        visible={permissionDeniedModalVisibility}
        setModalVisibility={setPermissionDeniedModalVisibility}
        closeOnBackButtonPress={true}
        messageText={appText.permissionDenied}
        confirmButtonText={appText.confirm}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: values.windowHorizontalPadding,
  },
  // Working hours
  headerText: {
    marginTop: values.topMargin,
    marginLeft: values.windowHorizontalPadding,
    fontSize: values.headerTextSize,
  },
  secondHeaderText: {
    marginTop: values.topMargin,
    marginLeft: values.windowHorizontalPadding,
    fontSize: values.regularTextSize * 1.3, 
  },
  textInput: {
    marginTop: values.topMargin,
  },
  daysContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: values.topMargin,
  },
  dayTextContainer: {
    height: values.regularTextSize * 3,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: values.regularTextSize,
  },
  timeContainer: {
    height: values.regularTextSize * 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },
  timeMarginLeft: {
    marginLeft: 3,
  },
  timeInput: {
    width: values.regularTextSize * 2.6,
  },
  timeText: {
    fontSize: values.regularTextSize * 1.2,
  },
  // Delivery methods
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: values.topMargin,
  },
  switchText: {
    flex: 1,
  },
});

export default AddLocationScreen;