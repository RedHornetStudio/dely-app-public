import React, { useState, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
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
import BottomButtonContainer from '../../components/BottomButtonContainer';
import { getNewAccessTokenAsync } from '../../shared/sharedFunctions';

const ChangeEmailScreen = props => {
  console.log('----Change Email Screen rerendered----');

  const dispatch = useDispatch();

  const auth = useSelector(state => state.authSlice);

  // ### Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // ### Incorrect input value message
  const [wrongInputVisible, setWrongInputVisible] = useState(false);
  const [wrongInputMessage, setWrongInputMessage] = useState('');

  const [email, setEmail] = useState(props.route.params.email);

  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [emailChangedSuccessfullyMessage, setEmailChangedSuccessfullyMessage] = useState(false);

  // ### Changing password in the database
  const changeEmailHandler = async () => {
    setLoadingModalVisible(true);
    try {
      let res = (await axios.post(`${values.requestUrl}auth/postBusinessEmail`, { accessToken: auth.accessToken, email })).data;
      if (res.status === 'FAILED' && res.errors[0].msg === 'Unauthorized') {
        const { success, newAccessToken } = await getNewAccessTokenAsync(auth.refreshToken, dispatch);
        if (success) {
          res = (await axios.post(`${values.requestUrl}auth/postBusinessEmail`, { accessToken: newAccessToken, email })).data;
        } else {
          props.navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'BusinessSignIn' }] });
          return;
        }
      }
      if (res.status === 'FAILED' && res.errors[0].param) {
        switch (`${res.errors[0].msg} ${res.errors[0].param}`) {
          case 'Empty value email':
            setWrongInputMessage(appText.emptyInputEmail);
            break;
          case 'Invalid value email':
            setWrongInputMessage(appText.invalidInputEmail);
            break;
          case 'Already exists email':
            setWrongInputMessage(appText.emailExists);
            break;
        }
        setLoadingModalVisible(false);
        setWrongInputVisible(true);
        return;
      } 
      if (res.status === 'FAILED') throw new Error(res.errors[0].msg);
      setLoadingModalVisible(false);
      setEmailChangedSuccessfullyMessage(true);
    } catch (error) {
      console.log(`Error while changing email: ${error.message}`);
      setLoadingModalVisible(false);
      setWrongInputMessage(appText.somethingWentWrongAndTryLater);
      setWrongInputVisible(true);
    }
  };
  // ########################################################################

  const emailChangedHandler = () => {
    props.navigation.navigate({
      name: 'Admin',
      params: { newEmail: email },
      merge: true,
    });
  };

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
      <CustomSafeAreaScrollViewWindow
        contentContainerStyle={styles.contentContainerStyle}
        contentMinHeight={{ value: values.headerBigIconSize - values.mainButtonHeight - values.topMargin, useWindowHeight: true, useInsetsTop: true }}
      >
        <HeaderBigIcon><MaterialIcons name="email" size={values.headerBigIconSize} color={colors.primaryColor} /></HeaderBigIcon>
        <RegularText style={styles.settingsGroup}>{appText.changeEmail}</RegularText>
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
        onPress={changeEmailHandler}
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
        visible={emailChangedSuccessfullyMessage}
        messageText={appText.emailChangedSuccessfully}
        confirmButtonText={appText.confirm}
        onConfirm={emailChangedHandler}
        onRequestClose={emailChangedHandler}
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

export default ChangeEmailScreen;