import React, { useState, useRef, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useSelector } from 'react-redux';

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
import { businessUserSignIn } from '../../features/authSlice';
import BottomButtonContainer from '../../components/BottomButtonContainer';
import { registerForPushNotificationsAsync } from '../../shared/sharedFunctions';
import CustomPressableOpacity from '../../components/CustomPressableOpacity';

const BusinessSignInScreen = props => {
  console.log('----Business Sign Up Screen rerendered----');

  const dispatch = useDispatch();

  // ### Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // ### Input field values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ### Incorrect input value message
  const [wrongInputVisible, setWrongInputVisible] = useState(false);
  const [wrongInputMessage, setWrongInputMessage] = useState('');

  // ### Loading modal
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);

  // ### Going to next input field by pressing return key
  const passwordInputRef = useRef();

  // ### Sign up request to the server
  const signInHandler = async () => {
    setLoadingModalVisible(true);
    try {
      const pushToken = await registerForPushNotificationsAsync();

      const credentials = {
        email: email,
        password: password,
        pushToken: pushToken,
        language: appLanguage,
      };

      const { data: res } = await axios.post(`${values.requestUrl}auth/postBusinessSignIn`, credentials);
      if (res.status === 'FAILED' && res.errors[0].param) {
        switch (`${res.errors[0].msg} ${res.errors[0].param}`) {
          case 'Empty value email':
            setWrongInputMessage(appText.emptyInputEmail);
            break;
          case 'Invalid value email':
            setWrongInputMessage(appText.invalidInputEmail);
            break;
          case 'Empty value password':
            setWrongInputMessage(appText.emptyInputPassword);
            break;
        }
        setLoadingModalVisible(false);
        setWrongInputVisible(true);
        return;
      } 
      if (res.status === 'FAILED' && res.errors[0].msg === 'Invalid credentials') {
        setLoadingModalVisible(false);
        setWrongInputMessage(appText.invalidCredentials);
        setWrongInputVisible(true);
        return;
      } 
      if (res.status === 'FAILED') {
        throw new Error(res.errors[0].msg);
      }
      dispatch(businessUserSignIn({ accessToken: res.data.accessToken, refreshToken: res.data.refreshToken }));
      try {
        await SecureStore.setItemAsync('accessToken', res.data.accessToken);
        await SecureStore.setItemAsync('refreshToken', res.data.refreshToken);
      } catch (error) {
        console.log(`Error while saving user credentials to async storage: ${error}`);
      }
      props.navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'Admin' }] });
    } catch (error) {
      console.log(`Error while signing in: ${error.message}`);
      setWrongInputMessage(appText.somethingWentWrongAndTryLater);
      setLoadingModalVisible(false);
      setWrongInputVisible(true);
    }
  };

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
      <CustomSafeAreaScrollViewWindow
        contentContainerStyle={styles.contentContainerStyle}
        contentMinHeight={{ value: values.headerBigIconSize - values.mainButtonHeight - values.topMargin, useWindowHeight: true, useInsetsTop: true }}
      >
        <HeaderBigIcon><FontAwesome name="sign-in" size={values.headerBigIconSize} color={colors.primaryColor} /></HeaderBigIcon>
        <RegularText style={styles.settingsGroup} numberOfLines={1}>{appText.signin}</RegularText>
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
          containerStyle={styles.textInput}
          value={password}
          onChangeText={setPassword}
          placeholder={appText.password}
          secureTextEntry={true}
          icon={{ Family: MaterialIcons, name: 'lock' }}
          ref={passwordInputRef}
        />
        <CustomPressableOpacity style={styles.forgotPassword} onPress={() => props.navigation.navigate('ResetPassword')}>
          <RegularText>{appText.forgotPassword}</RegularText>
        </CustomPressableOpacity>
      </CustomSafeAreaScrollViewWindow>

      <BottomButtonContainer
        onPress={signInHandler}
        title={appText.signin}
      />

      <AboveMessage
        visible={wrongInputVisible}
        closeOnBackButtonPress={true}
        messageText={wrongInputMessage}
        setModalVisibility={setWrongInputVisible}
        confirmButtonText={appText.confirm}
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
  forgotPassword: {
    alignSelf: 'center',
    marginTop: values.topMargin,
  }
});

export default BusinessSignInScreen;