import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

import colors from '../../constants/colors';
import values from '../../constants/values';
import RegularText from '../../components/RegularText';
import CustomImageBackground from '../../components/CustomImageBackground';
import CustomSafeAreaScrollViewWindowWithInsets from '../../components/CustomSafeAreaScrollViewWindowWithInsets';
import HeaderBigIcon from '../../components/HeaderBigIcon';
import InputField from '../../components/InputField';
import BottomButtonContainer from '../../components/BottomButtonContainer';
import getLocalizedText from '../../constants/getLocalizedText';
import AboveMessage from '../../components/AboveMessage';
import LoadingModal from '../../components/LoadingModal';
import { getNewAccessTokenAsync } from '../../shared/sharedFunctions';

const AddUserScreen = props => {
  console.log('----Add User Screen rerendered----');

  const dispatch = useDispatch();

  // ### Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // ### Auth tokens
  const auth = useSelector(state => state.authSlice);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');

  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef =useRef(null);

  // ### Modals
  const [loadingModal, setLoadingModal] = useState(false);
  const [aboveMessageText, setAboveMessageText] = useState('');
  const [aboveMessage, setAboveMessage] = useState(false);

  const onPressAddHandler = async () => {
    setLoadingModal(true);
    try {
      let res = (await axios.post(`${values.requestUrl}auth/postAddUser`, { accessToken: auth.accessToken, email: email, password: password, confirmPassword: confirmPassword })).data;
      if (res.status === 'FAILED' && res.errors[0].msg === 'Unauthorized') {
        const { success, newAccessToken } = await getNewAccessTokenAsync(auth.refreshToken, dispatch);
        if (success) {
          res = (await axios.post(`${values.requestUrl}auth/postAddUser`, { accessToken: newAccessToken, email: email, password: password, confirmPassword: confirmPassword })).data;
        } else {
          props.navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'BusinessSignIn' }] });
          return;
        }
      }
      if (res.status === 'FAILED' && res.errors[0].msg === 'Permission denied') {
        setAboveMessageText(appText.permissionDenied);
        setLoadingModal(false);
        setAboveMessage(true);
        return;
      }
      if (res.status === 'FAILED' && res.errors[0].param) {
        switch (`${res.errors[0].msg} ${res.errors[0].param}`) {
          case 'Empty value email':
            setAboveMessageText(appText.emptyInputEmail);
            break;
          case 'Invalid value email':
            setAboveMessageText(appText.invalidInputEmail);
            break;
          case 'Empty value password':
            setAboveMessageText(appText.emptyInputPassword);
            break;
          case 'Value is to short password':
            setAboveMessageText(appText.shortInputPassword);
            break;
          case 'Empty value confirmPassword':
            setAboveMessageText(appText.emptyInputConfirmPassword);
            break;
          case 'Values are not equal password, confirmPassword':
            setAboveMessageText(appText.passwordsAreNotEqual);
            break;
          case 'Already exists email':
            setAboveMessageText(appText.emailExists);
            break;
        }
        setLoadingModal(false);
        setAboveMessage(true);
        return;
      }
      if (res.status === 'FAILED') {
        throw new Error(res.errors[0].msg);
      }
      props.navigation.navigate({
        name: 'Users',
        params: { newUser: { userId: res.data.userId, email: email.trim() } },
        merge: true,
      });
    } catch (error) {
      console.log(`Error while adding user: ${error.message}`);
      setAboveMessageText(appText.somethingWentWrongAndTryLater);
      setLoadingModal(false);
      setAboveMessage(true);
    }
  };

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
      <CustomSafeAreaScrollViewWindowWithInsets
        contentContainerStyle={styles.contentContainerStyle}
        contentMinHeight={{ value: values.headerBigIconSize - values.mainButtonHeight - values.topMargin, useWindowHeight: true, useInsetsTop: true }}
        doNotUseInsetsBottom={true}
      >
        <HeaderBigIcon><FontAwesome name="user-plus" size={values.headerBigIconSize} color={colors.primaryColor} /></HeaderBigIcon>
        <RegularText style={styles.settingsGroup}>{appText.addUser}</RegularText>
        <InputField
          containerStyle={styles.textInput}
          value={email}
          onChangeText={setEmail}
          placeholder={appText.email}
          autoCapitalize="none"
          icon={{ Family: MaterialIcons, name: 'email' }}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => passwordInputRef.current.focus()}
        />
        <InputField
          ref={passwordInputRef}
          containerStyle={styles.textInput}
          value={password}
          onChangeText={setPassword}
          placeholder={appText.password}
          secureTextEntry={true}
          icon={{ Family: MaterialIcons, name: 'lock' }}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => confirmPasswordInputRef.current.focus()}
        />
        <InputField
          ref={confirmPasswordInputRef}
          containerStyle={styles.textInput}
          value={confirmPassword}
          onChangeText={setconfirmPassword}
          placeholder={appText.confirmPassword}
          secureTextEntry={true}
          icon={{ Family: MaterialIcons, name: 'lock' }}
        />
      </CustomSafeAreaScrollViewWindowWithInsets>

      <BottomButtonContainer
        onPress={onPressAddHandler}
        title={appText.add}
      />

      <AboveMessage
        visible={aboveMessage}
        setModalVisibility={setAboveMessage}
        closeOnBackButtonPress={true}
        messageText={aboveMessageText}
        confirmButtonText={appText.confirm}
      />
      <LoadingModal
        visible={loadingModal}
      />
    </View>
  );
};

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

export default AddUserScreen;