import React, { useState, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Foundation } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

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
import { businessUserSignOut } from '../../features/authSlice';

const DeleteAccountScreen = props => {
  console.log('----Change Password Screen rerendered----');

  const dispatch = useDispatch();

  const auth = useSelector(state => state.authSlice);

  // ### Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // ### Input field values
  const [businessName, setBusinessName] = useState('');

  // ### Incorrect input value message
  const [wrongInputVisible, setWrongInputVisible] = useState(false);
  const [wrongInputMessage, setWrongInputMessage] = useState('');

  // ### Modals
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [accountDeletedSuccessfullyMessage, setAccountDeletedSuccessfullyMessage] = useState(false);

  // ### Changing password in the database
  const deleteAccountHandler = () => {
    (async () => {
      setLoadingModalVisible(true);
      try {
        let res = (await axios.post(`${values.requestUrl}auth/postDeleteBusinessAccount`, { accessToken: auth.accessToken, businessName })).data;
        if (res.status === 'FAILED' && res.errors[0].msg === 'Unauthorized') {
          const { success, newAccessToken } = await getNewAccessTokenAsync(auth.refreshToken, dispatch);
          if (success) {
            res = (await axios.post(`${values.requestUrl}auth/postDeleteBusinessAccount`, { accessToken: newAccessToken, businessName })).data;
          } else {
            props.navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'BusinessSignIn' }] });
            return;
          }
        }
        if (res.status === 'FAILED' && res.errors[0].param) {
          switch (`${res.errors[0].msg} ${res.errors[0].param}`) {
            case 'Invalid value businessName':
              setWrongInputMessage(appText.invalidBusinessAcccountToDelete);
              break;
          }
          setLoadingModalVisible(false);
          setWrongInputVisible(true);
          return;
        }
        if (res.status === 'FAILED' && res.errors[0].msg === 'Permission denied') {
          setWrongInputMessage(appText.permissionDenied);
          setLoadingModalVisible(false);
          setWrongInputVisible(true);
          return;
        }
        if (res.status === 'FAILED') throw new Error(res.errors[0].msg);
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        dispatch(businessUserSignOut());
        setLoadingModalVisible(false);
        setAccountDeletedSuccessfullyMessage(true);
      } catch (error) {
        console.log(`Error while deleting business account: ${error.message}`);
        setLoadingModalVisible(false);
        setWrongInputMessage(appText.somethingWentWrongAndTryLater);
        setWrongInputVisible(true);
      }
    })();
  };
  // ########################################################################

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
      <CustomSafeAreaScrollViewWindow
        contentContainerStyle={styles.contentContainerStyle}
        contentMinHeight={{ value: values.headerBigIconSize - values.mainButtonHeight - values.topMargin, useWindowHeight: true, useInsetsTop: true }}
      >
        <HeaderBigIcon><Foundation name="page-delete" size={values.headerBigIconSize} color={colors.primaryColor} /></HeaderBigIcon>
        <RegularText style={styles.settingsGroup}>{appText.deleteBusinessAccount}</RegularText>
        <RegularText style={styles.deleteText}>{appText.typeBusinessAccount}</RegularText>
        <InputField
          containerStyle={styles.textInput}
          value={businessName}
          onChangeText={setBusinessName}
          placeholder={appText.businessName}
          icon={{ Family: Foundation, name: 'shopping-bag' }}
        />
      </CustomSafeAreaScrollViewWindow>

      <BottomButtonContainer
        onPress={deleteAccountHandler}
        title={appText.delete}
      />

      <AboveMessage
        visible={wrongInputVisible}
        closeOnBackButtonPress={true}
        messageText={wrongInputMessage}
        setModalVisibility={setWrongInputVisible}
        confirmButtonText={appText.confirm}
      />

      <AboveMessage
        visible={accountDeletedSuccessfullyMessage}
        setModalVisibility={setAccountDeletedSuccessfullyMessage}
        messageText={appText.accountDeleteddSuccessfully}
        confirmButtonText={appText.confirm}
        onConfirm={() => props.navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
        onRequestClose={() => props.navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
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
  deleteText: {
    marginTop: values.topMargin,
  },
  textInput: {
    marginTop: values.topMargin,
  },
  buttonContainer: {
    marginTop: values.topMargin,
    alignItems: 'center',
  },
});

export default DeleteAccountScreen;