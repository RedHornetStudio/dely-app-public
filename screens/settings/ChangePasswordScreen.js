import React, { useState, useRef, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

import colors from '../../constants/colors';
import values from '../../constants/values';
import RegularText from '../../components/RegularText';
import CustomImageBackground from '../../components/CustomImageBackground';
import CustomSafeAreaScrollViewWindow from '../../components/CustomSafeAreaScrollViewWindow';
import HeaderBigIcon from '../../components/HeaderBigIcon';
import InputField from '../../components/InputField';
import getLocalizedText from '../../constants/getLocalizedText';
import LoadingModal from '../../components/LoadingModal';
import AboveMessage from '../../components/AboveMessage';
import { businessUserSignIn, businessUserSignOut } from '../../features/authSlice';
import BottomButtonContainer from '../../components/BottomButtonContainer';

const ChangePasswordScreen = props => {
  console.log('----Change Password Screen rerendered----');

  const dispatch = useDispatch();

  const auth = useSelector(state => state.authSlice);

  // ### Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // ### Input field values
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newConfirmPassword, setNewConfirmPassword] = useState('');

  // ### Incorrect input value message
  const [wrongInputVisible, setWrongInputVisible] = useState(false);
  const [wrongInputMessage, setWrongInputMessage] = useState('');

  // ### Going to next input field by pressing return key
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  // ### Modals
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [passwordChangedSuccessfullyMessage, setPasswordChangedSuccessfullyMessage] = useState(false);

  // ### Changing password in the database
  const changePasswordHandler = async () => {
    setLoadingModalVisible(true);
    try {
      const res = (await axios.post(`${values.requestUrl}auth/postBusinessPassword`, { refreshToken: auth.refreshToken, oldPassword, newPassword, newConfirmPassword })).data;
      if (res.status === 'FAILED' && res.errors[0].msg === 'Unauthorized') {
        try {
          await SecureStore.deleteItemAsync('accessToken');
          await SecureStore.deleteItemAsync('refreshToken');
          await SecureStore.deleteItemAsync('pushToken');
        } catch {
          console.log('Error while updating tokens in SecureStore');
        }
        dispatch(businessUserSignOut());
        props.navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'BusinessSignIn' }] });
        return;
      }
      if (res.status === 'FAILED' && res.errors[0].param) {
        switch (`${res.errors[0].msg} ${res.errors[0].param}`) {
          case 'Invalid oldPassword':
            setWrongInputMessage(appText.invalidOldPassword);
            break;
          case 'Empty value newPassword':
            setWrongInputMessage(appText.emptyInputNewPassword);
            break;
          case 'Value is to short newPassword':
            setWrongInputMessage(appText.shortInputNewPassword);
            break;
          case 'Empty value newConfirmPassword':
            setWrongInputMessage(appText.emptyInputConfirmNewPassword);
            break;
          case 'Values are not equal newPassword, newConfirmPassword':
            setWrongInputMessage(appText.newPasswordsAreNotEqual);
            break;
        }
        setLoadingModalVisible(false);
        setWrongInputVisible(true);
        return;
      } 
      if (res.status === 'FAILED') throw new Error(res.errors[0].msg);
      dispatch(businessUserSignIn({ accessToken: res.data.accessToken, refreshToken: res.data.refreshToken, pushToken: auth.pushToken }));
      try {
        await SecureStore.setItemAsync('accessToken', res.data.accessToken);
        await SecureStore.setItemAsync('refreshToken', res.data.refreshToken);
      } catch (error) {
        console.log(`Error while saving user credentials to async storage: ${error}`);
      }
      setLoadingModalVisible(false);
      setPasswordChangedSuccessfullyMessage(true);
    } catch (error) {
      console.log(`Error while changing password: ${error.message}`);
      setLoadingModalVisible(false);
      setWrongInputMessage(appText.somethingWentWrongAndTryLater);
      setWrongInputVisible(true);
    }
  };
  // ########################################################################

  // ### Handlers
  const passwordChangedHandler = () => {
    props.navigation.navigate('Admin');
  };

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
      <CustomSafeAreaScrollViewWindow
        contentContainerStyle={styles.contentContainerStyle}
        contentMinHeight={{ value: values.headerBigIconSize - values.mainButtonHeight - values.topMargin, useWindowHeight: true, useInsetsTop: true }}
      >
        <HeaderBigIcon><MaterialIcons name="lock" size={values.headerBigIconSize} color={colors.primaryColor} /></HeaderBigIcon>
        <RegularText style={styles.settingsGroup}>{appText.changePassword}</RegularText>
        <InputField
          containerStyle={styles.textInput}
          value={oldPassword}
          onChangeText={setOldPassword}
          placeholder={appText.oldPassword}
          secureTextEntry={true}
          icon={{ Family: MaterialIcons, name: 'lock-outline' }}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => passwordInputRef.current.focus()}
        />
        <InputField
          containerStyle={styles.textInput}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder={appText.newPassword}
          secureTextEntry={true}
          icon={{ Family: MaterialIcons, name: 'lock' }}
          ref={passwordInputRef}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => confirmPasswordInputRef.current.focus()}
        />
        <InputField
          containerStyle={styles.textInput}
          value={newConfirmPassword}
          onChangeText={setNewConfirmPassword}
          placeholder={appText.confirmNewPassword}
          secureTextEntry={true}
          icon={{ Family: MaterialIcons, name: 'lock' }}
          ref={confirmPasswordInputRef}
        />
      </CustomSafeAreaScrollViewWindow>

      <BottomButtonContainer
        onPress={changePasswordHandler}
        title={appText.save}
      />

      <AboveMessage
        visible={wrongInputVisible}
        closeOnBackButtonPress={true}
        messageText={wrongInputMessage}
        setModalVisibility={setWrongInputVisible}
        confirmButtonText={appText.confirm}
      />

      <AboveMessage
        visible={passwordChangedSuccessfullyMessage}
        messageText={appText.passwordChangedSuccessfully}
        confirmButtonText={appText.confirm}
        onConfirm={passwordChangedHandler}
        onRequestClose={passwordChangedHandler}
      />

      <LoadingModal visible={loadingModalVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  contentContainerStyle: {
    paddingHorizontal: values.windowHorizontalPadding,
    paddingBottom: values.topMargin,
  },
  settingsGroup: {
    marginTop: values.topMargin,
    marginLeft: values.windowHorizontalPadding,
    fontSize: values.headerTextSize,
  },
  textInput: {
    marginTop: values.topMargin,
  },
  buttonContainer: {
    marginTop: values.topMargin,
    alignItems: 'center',
  },
});

export default ChangePasswordScreen;