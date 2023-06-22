import React, { useState, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

import colors from '../../constants/colors';
import values from '../../constants/values';
import RegularText from '../../components/RegularText';
import CustomImageBackground from '../../components/CustomImageBackground';
import CustomSafeAreaScrollViewWindow from '../../components/CustomSafeAreaScrollViewWindow';
import HeaderBigIcon from '../../components/HeaderBigIcon';
import getLocalizedText from '../../constants/getLocalizedText';
import MainButton from '../../components/MainButton';
import { businessUserSignOut } from '../../features/authSlice';
import LoadingModal from '../../components/LoadingModal';
import AboveMessage from '../../components/AboveMessage';
import PressableListItem from '../../components/PressableListItem';

const BusinessSettingsScreen = props => {
  console.log('----Business Settings Screen rerendered----');

  const dispatch = useDispatch();

  const insets = useSafeAreaInsets();

  // checking if user is authenticated
  const auth = useSelector(state => state.authSlice);

  // Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // Incorrect input value message
  const [wrongInputVisible, setWrongInputVisible] = useState(false);
  const [wrongInputMessage, setWrongInputMessage] = useState('');

  // Loading modal
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);

  const signUpHandler = () => {
    props.navigation.navigate('BusinessSignUp');
  };

  const signInHandler = () => {
    props.navigation.navigate('BusinessSignIn');
  };

  const signOutHandler = async () => {
    setLoadingModalVisible(true);
    try {
      const { data: res } = await axios.post(`${values.requestUrl}auth/postBusinessSignOut`, { refreshToken: auth.refreshToken });
    } catch (error) {
      console.log(`Error while signing out: ${error.message}`);
    } finally {
      try {
        props.navigation.navigate('Main');
        dispatch(businessUserSignOut());
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
      } catch (error) {
        console.log('Error while deleting token from SecureStore: ' + error.message);
      }
    }
  };

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
      <CustomSafeAreaScrollViewWindow
        contentContainerStyle={styles.contentContainerStyle}
      >
        <HeaderBigIcon><Feather name="settings" size={values.headerBigIconSize} color={colors.primaryColor} /></HeaderBigIcon>
        <RegularText style={styles.settingsGroup} numberOfLines={1}>{appText.businessAccount}</RegularText>
        {auth.refreshToken && props.route.params?.email &&
          <View>
            <PressableListItem 
              settingTitle={appText.changePassword}
              onPress={() => props.navigation.navigate('ChangePassword')}
            />
            <PressableListItem 
              settingTitle={appText.changeEmail}
              onPress={() => props.navigation.navigate('ChangeEmail', { email: props.route.params?.email })}
            />
            {props.route.params.role === 'admin' &&
              <PressableListItem 
                settingTitle={appText.deleteBusinessAccount}
                onPress={() => props.navigation.navigate('DeleteAccount')}
              />
            }
          </View>
        }
      </CustomSafeAreaScrollViewWindow>
      {!props.route.params?.email &&
        <View>
          {auth.refreshToken 
            ? <View style={[styles.buttonContainer, { paddingTop: values.topMargin / 2, paddingBottom: values.topMargin / 2 + insets.bottom }]}>
              <MainButton onPress={signOutHandler}>{appText.signout}</MainButton>
            </View>
            : <View style={[styles.buttonContainer, { paddingTop: values.topMargin / 2, paddingBottom: values.topMargin / 2 + insets.bottom }]}>
              <MainButton onPress={signUpHandler} empty={true}>{appText.signup}</MainButton>
              <MainButton onPress={signInHandler}>{appText.signin}</MainButton>
            </View>
          }
        </View>
        }

      <AboveMessage
        visible={wrongInputVisible}
        closeOnBackButtonPress={true}
        messageText={wrongInputMessage}
        onConfirm={() => setWrongInputMessage('')}
        setModalVisibility={setWrongInputVisible}
        confirmButtonText={appText.confirm}
      />

      <LoadingModal visible={loadingModalVisible} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.thirdColor,
  },
});

export default BusinessSettingsScreen;