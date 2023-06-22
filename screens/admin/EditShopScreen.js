import React, { useState, useRef, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { Entypo } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import colors from '../../constants/colors';
import values from '../../constants/values';
import RegularText from '../../components/RegularText';
import CustomImageBackground from '../../components/CustomImageBackground';
import CustomSafeAreaScrollViewWindowWithInsets from '../../components/CustomSafeAreaScrollViewWindowWithInsets';
import HeaderBigIcon from '../../components/HeaderBigIcon';
import getLocalizedText, { availableCountries, availableCurrencies } from '../../constants/getLocalizedText';
import InputField from '../../components/InputField';
import LoadingModal from '../../components/LoadingModal';
import AboveMessage from '../../components/AboveMessage';
import { getNewAccessTokenAsync } from '../../shared/sharedFunctions';
import BottomButtonContainer from '../../components/BottomButtonContainer';
import { concatErrors } from '../../shared/sharedFunctions';

const EditShopScreen = props => {
  console.log('----Edit Shop Screen rerendered----');

  // ### Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // ### On first render sort available countries and make array of currencies for picker
  const sortedLocalizedAvailableCountries = useMemo(() => {
    const localizedAvailableCountries = availableCountries.map(availableCountry => ({ value: availableCountry, title: appText.countries[availableCountry] }));
    const collator = new Intl.Collator(appLanguage);
    return localizedAvailableCountries.sort((a, b) => collator.compare(a.title, b.title));
  }, []);
  const currencies = useMemo(() => {
    return availableCurrencies.map(currency => ({ value: currency, title: currency }));
  }, []);

  // ### Input field values
  const [country, setCountry] = useState(props.route.params.country);
  const [currency, setCurrency] = useState(props.route.params.currency);
  const [businessName, setBusinessName] = useState(props.route.params.businessName);
  const [description, setDescription] = useState(props.route.params.description);

  // Going to next input field by pressing return key
  const descriptionInputRef = useRef();

  // ### Updating data and checking if user is authenticated
  const dispatch = useDispatch();
  const auth = useSelector(state => state.authSlice);

  // modals
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [aboveMessageVisible, setAboveMessageVisible] = useState(false);
  const [aboveMessageText, setAboveMessageText] = useState('');

  // handlers
  const onPressEditHandler = async () => {
    try {
      setLoadingModalVisible(true);
      let res = (await axios.post(`${values.requestUrl}admin/postEditShop`, { accessToken: auth.accessToken, country: country, currency: currency, businessName: businessName, description: description })).data;
      if (res.status === 'FAILED' && res.errors[0].msg === 'Unauthorized') {
        const { success, newAccessToken } = await getNewAccessTokenAsync(auth.refreshToken, dispatch);
        if (success) {
          res = (await axios.post(`${values.requestUrl}admin/postEditShop`, { accessToken: newAccessToken, country: country, currency: currency, businessName: businessName, description: description })).data;
        } else {
          props.navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'BusinessSignIn' }] });
          return;
        }
      }
      if (res.status === 'FAILED' && res.errors[0].msg === 'Permission denied') {
        setAboveMessageText(appText.permissionDenied);
        setAboveMessageVisible(true);
        setLoadingModalVisible(false);
        return;
      }
      if (res.status === 'FAILED' && res.errors[0].param) {
        setAboveMessageVisible(true);
        setLoadingModalVisible(false);
        switch (`${res.errors[0].msg} ${res.errors[0].param}`) {
          case 'Empty value country':
            setAboveMessageText(appText.emptyInputCountry);
            break;
          case 'Invalid value country':
            setAboveMessageText(appText.invalidInputCountry);
            break;
          case 'Empty value currency':
            setAboveMessageText(appText.emptyInputCurrency);
            break;
          case 'Empty value businessName':
            setAboveMessageText(appText.emptyInputBusinessName);
            break;
          case 'Invalid value businessName':
            setAboveMessageText(appText.invalidInputBusinessName);
            break;
        }
        return; 
      }
      if (res.status === 'FAILED') throw new Error (concatErrors(res.errors));
      props.navigation.navigate({
        name: 'Admin',
        params: { editedData: { country: country.trim(), currency: currency.trim(), businessName: businessName.trim(), description: description.trim() } },
        merge: true,
      });
    } catch (error) {
      console.log(`Error while updating shop data in database: ${error.message}`);
      setAboveMessageVisible(true);
      setLoadingModalVisible(false);
      setAboveMessageText(appText.somethingWentWrongAndTryLater);
    }
  };
  // ######################

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
      <CustomSafeAreaScrollViewWindowWithInsets
        contentContainerStyle={styles.contentContainerStyle}
        contentMinHeight={{ value: values.headerBigIconSize - values.mainButtonHeight - values.topMargin, useWindowHeight: true, useInsetsTop: true }}
        doNotUseInsetsBottom={true}
      >
        <HeaderBigIcon><FontAwesome name="edit" size={values.headerBigIconSize} color={colors.primaryColor} /></HeaderBigIcon>
        <RegularText style={styles.settingsGroup}>{appText.editBusinessInfo}</RegularText>
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
          onSubmitEditing={() => descriptionInputRef.current.focus()}
        />
        <InputField
          ref={descriptionInputRef}
          containerStyle={styles.textInput}
          value={description}
          onChangeText={setDescription}
          placeholder={appText.description}
          icon={{ Family: Foundation, name: 'shopping-bag' }}
        />
      </CustomSafeAreaScrollViewWindowWithInsets>

      <BottomButtonContainer
        onPress={onPressEditHandler}
        title={appText.edit}
      />

      <AboveMessage
        visible={aboveMessageVisible}
        closeOnBackButtonPress={true}
        messageText={aboveMessageText}
        onConfirm={() => setAboveMessageText('')}
        setModalVisibility={setAboveMessageVisible}
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

export default EditShopScreen;