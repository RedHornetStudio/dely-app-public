import React, { useState, useRef, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Foundation } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
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
import getLocalizedText, { availableCountries, availableCurrencies } from '../../constants/getLocalizedText';
import LoadingModal from '../../components/LoadingModal';
import AboveMessage from '../../components/AboveMessage';
import { businessUserSignIn } from '../../features/authSlice';
import BottomButtonContainer from '../../components/BottomButtonContainer';
import { registerForPushNotificationsAsync } from '../../shared/sharedFunctions';

const BusinessSignUpScreen = props => {
  console.log('----Business Sign Up Screen rerendered----');

  const dispatch = useDispatch();

  // ### Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // ### Input field values
  const [country, setCountry] = useState('');
  const [currency, setCurrency] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ### Incorrect input value message
  const [wrongInputVisible, setWrongInputVisible] = useState(false);
  const [wrongInputMessage, setWrongInputMessage] = useState('');

  // ### Loading modal
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);

  // Going to next input field by pressing return key
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  // Sign up request to the server
  const signUpHandler = async () => {
    setLoadingModalVisible(true);
    try {
      const pushToken = await registerForPushNotificationsAsync();

      const credentials = {
        country: country,
        currency: currency,
        businessName: businessName,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        pushToken: pushToken,
        language: appLanguage,
      };

      const { data: res } = await axios.post(`${values.requestUrl}auth/postBusinessSignUp`, credentials);
      if (res.status === 'FAILED' && res.errors[0].param) {
        switch (`${res.errors[0].msg} ${res.errors[0].param}`) {
          case 'Empty value country':
            setWrongInputMessage(appText.emptyInputCountry);
            break;
          case 'Invalid value country':
            setWrongInputMessage(appText.invalidInputCountry);
            break;
          case 'Empty value currency':
            setWrongInputMessage(appText.emptyInputCurrency);
            break;
          case 'Empty value businessName':
            setWrongInputMessage(appText.emptyInputBusinessName);
            break;
          case 'Invalid value businessName':
            setWrongInputMessage(appText.invalidInputBusinessName);
            break;
          case 'Empty value email':
            setWrongInputMessage(appText.emptyInputEmail);
            break;
          case 'Invalid value email':
            setWrongInputMessage(appText.invalidInputEmail);
            break;
          case 'Empty value password':
            setWrongInputMessage(appText.emptyInputPassword);
            break;
          case 'Value is to short password':
            setWrongInputMessage(appText.shortInputPassword);
            break;
          case 'Empty value confirmPassword':
            setWrongInputMessage(appText.emptyInputConfirmPassword);
            break;
          case 'Values are not equal password, confirmPassword':
            setWrongInputMessage(appText.passwordsAreNotEqual);
            break;
          case 'Already exists email':
            setWrongInputMessage(appText.emailExists);
            break;
        }
        setLoadingModalVisible(false);
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
      console.log(`Error while signing up: ${error.message}`);
      setWrongInputVisible(true);
      setLoadingModalVisible(false);
      setWrongInputMessage(appText.somethingWentWrongAndTryLater);
    }
  };

  // ### On first render sort available countries and make array of currencies for picker
  const sortedLocalizedAvailableCountries = useMemo(() => {
    const localizedAvailableCountries = availableCountries.map(availableCountry => ({ value: availableCountry, title: appText.countries[availableCountry] }));
    const collator = new Intl.Collator(appLanguage);
    return localizedAvailableCountries.sort((a, b) => collator.compare(a.title, b.title));
  }, []);
  const currencies = useMemo(() => {
    return availableCurrencies.map(currency => ({ value: currency, title: currency }));
  }, []);

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
      <CustomSafeAreaScrollViewWindow
        contentContainerStyle={styles.contentContainerStyle}
        contentMinHeight={{ value: values.headerBigIconSize - values.mainButtonHeight - values.topMargin, useWindowHeight: true, useInsetsTop: true }}
      >
        <HeaderBigIcon><MaterialIcons name="add-business" size={values.headerBigIconSize} color={colors.primaryColor} /></HeaderBigIcon>
        <RegularText style={styles.settingsGroup}>{appText.createNewAccount}</RegularText>
        <InputField
          containerStyle={styles.textInput}
          picker={true}
          pickerValue={country}
          setPickerValue={setCountry}
          placeholder={appText.country}
          searchBarPlaceholder={appText.search}
          data={sortedLocalizedAvailableCountries}
          noItemsAfterSearchText={appText.noCountriesMatchYourSearch}
          appText={appText}
          icon={{ Family: Entypo, name: 'location-pin' }}
        />
        <InputField
          containerStyle={styles.textInput}
          picker={true}
          pickerValue={currency}
          setPickerValue={setCurrency}
          placeholder={appText.currency}
          searchBarPlaceholder={appText.search}
          data={currencies}
          noItemsAfterSearchText={appText.noCurrenciesMatchYourSearch}
          appText={appText}
          icon={{ Family: FontAwesome5, name: 'money-bill' }}
        />
        <InputField
          containerStyle={styles.textInput}
          value={businessName}
          onChangeText={setBusinessName}
          placeholder={appText.businessName}
          icon={{ Family: Foundation, name: 'shopping-bag' }}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => emailInputRef.current.focus()}
        />
        <InputField
          containerStyle={styles.textInput}
          value={email}
          onChangeText={setEmail}
          placeholder={appText.email}
          autoCapitalize="none"
          icon={{ Family: MaterialIcons, name: 'email' }}
          ref={emailInputRef}
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
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => confirmPasswordInputRef.current.focus()}
        />
        <InputField
          containerStyle={styles.textInput}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder={appText.confirmPassword}
          secureTextEntry={true}
          icon={{ Family: MaterialIcons, name: 'lock' }}
          ref={confirmPasswordInputRef}
        />
      </CustomSafeAreaScrollViewWindow>

      <BottomButtonContainer
        onPress={signUpHandler}
        title={appText.signup}
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
});

export default BusinessSignUpScreen;