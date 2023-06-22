import React, { useState, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
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
import BottomButtonContainer from '../../components/BottomButtonContainer';

const ResetPasswordScreen = props => {
  console.log('----Reset Password Screen rerendered----');

  const dispatch = useDispatch();

  // ### Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // ### Input field values
  const [email, setEmail] = useState('');

  // ### Incorrect input value message
  const [wrongInputVisible, setWrongInputVisible] = useState(false);
  const [wrongInputMessage, setWrongInputMessage] = useState('');
  const [passwordSendedMessage, setPasswordSendedMessage] = useState(false);

  // ### Loading modal
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);

  // ### Sign up request to the server
  const resetPasswordHandler = async () => {
    console.log('reset password pressed');
    setLoadingModalVisible(true);
    try {
      const { data: res } = await axios.post(`${values.requestUrl}auth/resetPassword`, { email, appLanguage });
      if (res.status === 'FAILED' && res.errors[0].param) {
        switch (`${res.errors[0].msg} ${res.errors[0].param}`) {
          case 'Empty value email':
            setWrongInputMessage(appText.emptyInputEmail);
            break;
          case 'User with this email do not exist email':
            setWrongInputMessage(appText.userWithEmailDoNotExist);
            break;
        }
        setLoadingModalVisible(false);
        setWrongInputVisible(true);
        return;
      }
      if (res.status === 'FAILED') {
        throw new Error(res.errors[0].msg);
      }
      setLoadingModalVisible(false);
      setPasswordSendedMessage(true);
    } catch (error) {
      console.log(`Error while reseting password: ${error.message}`);
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
        <RegularText style={styles.settingsGroup} numberOfLines={1}>{appText.resetYourPassword}</RegularText>
        <RegularText style={styles.description}>{appText.lostYourPasswordText}</RegularText>
        <InputField
          containerStyle={styles.textInput}
          value={email}
          onChangeText={setEmail}
          placeholder={appText.email}
          autoCapitalize="none"
          icon={{ Family: MaterialIcons, name: 'email' }}
        />
      </CustomSafeAreaScrollViewWindow>

      <BottomButtonContainer
        onPress={resetPasswordHandler}
        title={appText.resetPassword}
      />

      <AboveMessage
        visible={wrongInputVisible}
        closeOnBackButtonPress={true}
        messageText={wrongInputMessage}
        setModalVisibility={setWrongInputVisible}
        confirmButtonText={appText.confirm}
      />

      <AboveMessage
        visible={passwordSendedMessage}
        closeOnBackButtonPress={true}
        messageText={appText.newPasswordSendedSuccessfully}
        setModalVisibility={setPasswordSendedMessage}
        confirmButtonText={appText.confirm}
        onConfirm={() => props.navigation.goBack()}
        onRequestClose={() => props.navigation.goBack()}
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
  description: {
    marginTop: values.topMargin,
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

export default ResetPasswordScreen;