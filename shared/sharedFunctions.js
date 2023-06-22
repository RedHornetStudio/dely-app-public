import * as SecureStore from 'expo-secure-store';
import { isDevice } from 'expo-device';
import * as Notifications from 'expo-notifications';
import axios from 'axios';

import { businessUserAccessTokenUpdated, businessUserSignOut } from '../features/authSlice';
import values from '../constants/values';

export const findStyleProp = (style, prop) => {
  if (!style) return undefined;
  let styleProp = undefined;
  const find = elems => {
    if (Array.isArray(elems)) {
      elems.forEach(elem => {
        find(elem);
      });
    } else {
      if (elems && elems[prop]) styleProp = elems[prop];
    }
  }
  find(style);
  return styleProp;
}; 

export const roundWithZeros = (value, decimal = 0) => {
  const number = Number(Math.round(value + 'e' + decimal) + 'e-' + decimal);
  const splited = number.toString().split('.');
  const wholeNumber = splited[0];
  let decimalNumber = '';
  if (splited[1]) {
    decimalNumber = splited[1];
    for (let i = 0; i < decimal - splited[1].length; i++) {
      decimalNumber = decimalNumber + '0';
    }
  } else {
    for (let i = 0; i < decimal; i++) {
      decimalNumber = decimalNumber + '0';
    }
  }
  return decimal === 0 ? wholeNumber : wholeNumber + '.' + decimalNumber;
};

export const addOpacityToColor = (color, opacity) => {
  const colorWithOpacitySplitedArray = color.split(' ');
  const colorWithOpacity = `${colorWithOpacitySplitedArray[0]} ${colorWithOpacitySplitedArray[1]} ${colorWithOpacitySplitedArray[2]} ${opacity})`;
  return colorWithOpacity;
};

export const concatErrors = errors => {
  let errorsString = '';
  if (errors.length === 1) {
    return errors[0].msg;
  } else {
    errors.forEach((error, index) => {
      errorsString += `Error ${index + 1}: ${error.msg}`;
      if (index < errors.length - 1) errorsString += `${'\n'}`;
    });
    return errorsString;
  }
};

// get push notification token
export const registerForPushNotificationsAsync = async () => {
  let token = '';
  if (isDevice) {
    try {
      token = (await Notifications.getExpoPushTokenAsync({
        experienceId: '@redhornetstudio/Dely',
      })).data;
    } catch (error) {
      console.log('Error while registering to push notifications: ' + error.message);
    }
  }
  return token;
}

export const pushTokenUpdate = async (refreshToken) => {
  const pushToken = await registerForPushNotificationsAsync();
  if (pushToken.length > 0) {
    try {
      let res = (await axios.post(`${values.requestUrl}auth/postPushToken`, { refreshToken: refreshToken, pushToken: pushToken })).data;
    } catch (error) {
      console.log('Error while saving updated pushToken to database: ' + error.message);
    }
  }
};

export const getNewAccessTokenAsync = async (refreshToken, dispatch, controller) => {
  let res;
  controller
    ? res = (await axios.post(`${values.requestUrl}auth/getBusinessAccessToken`, { refreshToken: refreshToken }, { signal: controller.signal })).data
    : res = (await axios.post(`${values.requestUrl}auth/getBusinessAccessToken`, { refreshToken: refreshToken })).data
  
  if (res.status === 'FAILED' && res.errors[0].msg === 'Unauthorized') {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    dispatch(businessUserSignOut());
    return { success: false, newAccessToken: null };
  }

  if (res.status === 'FAILED') {
    throw new Error(res.errors[0].msg);
  }

  await SecureStore.setItemAsync('accessToken', res.data.accessToken);
  if (res.data.pushTokenIsEmpty) {
    pushTokenUpdate(refreshToken);
  }
  
  dispatch(businessUserAccessTokenUpdated({ accessToken: res.data.accessToken }));
  return { success: true, newAccessToken: res.data.accessToken, };
}