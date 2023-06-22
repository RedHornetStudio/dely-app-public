import React, { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { InterstitialAd, TestIds, AdEventType } from 'react-native-google-mobile-ads';
import * as FileSystem from 'expo-file-system';
import mime from 'mime';
import * as SecureStore from 'expo-secure-store';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

import colors from '../../constants/colors';
import values from '../../constants/values';
import getLocalizedText from '../../constants/getLocalizedText';
import CustomSafeAreaScrollViewWindow from '../../components/CustomSafeAreaScrollViewWindow';
import CustomImageBackground from '../../components/CustomImageBackground';
import LoadingModal from '../../components/LoadingModal';
import AboveMessage from '../../components/AboveMessage';
import { getNewAccessTokenAsync } from '../../shared/sharedFunctions';
import AdminScreenLoadableContent from '../../components/AdminScreen/AdminScreenLoadableContent';
import { businessUserSignOut } from '../../features/authSlice';

const AdminScreen = props => {
  console.log('----Admin Screen rerendered----');

  const dispatch = useDispatch();

  // auth tokens
  const auth = useSelector(state => state.authSlice);

  // ### Interstitial ad loading and showing
  const interstitialRef = useRef(InterstitialAd.createForAdRequest(values.adminScreenInterstitial));
  const adIsInitialized = useSelector(state => state.googleMobileAdsSlice.adIsInitialized);
  // Loading interstitial (ad) when ads are initialized
  useEffect(() => {
    if (!adIsInitialized) return;
    const unsubscribe = interstitialRef.current.addAdEventListener(AdEventType.LOADED, () => {
      interstitialRef.current.show();
    });
    // Start loading the interstitial straight away
    interstitialRef.current.load();
    // Unsubscribe from events on unmount
    return unsubscribe;
  }, [adIsInitialized]);
  // ###########################################

  // setting shop data when going back from edit screen
  useEffect(() => {
    if (props.route.params?.editedData) {
      setShopData(shopData => {
        const newShopData = {...shopData};
        newShopData.country = props.route.params.editedData.country;
        newShopData.currency = props.route.params.editedData.currency;
        newShopData.title = props.route.params.editedData.businessName;
        newShopData.description = props.route.params.editedData.description;
        return newShopData;
      });
    }
  }, [props.route.params?.editedData]);

  const [shopData, setShopData] = useState(null);

  // Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // ### handlers
  const aboveMessageHandler = () => {
    props.navigation.goBack();
  };

  const loadingModalRequestCloseHandler = () => {
    props.navigation.goBack();
  };

  const onPressManageLocationsHandler = () => {
    props.navigation.navigate('Locations', {
      shopId: shopData.shopId,
      shopTitle: shopData.title,
      shopImageUrl: shopData.image_url,
      currency: shopData.currency,
      manageLocations: true,
    });
  };

  const onPressManageProductsHandler = () => {
    props.navigation.navigate('Products', {
      shopId: shopData.shopId,
      shopTitle: shopData.title,
      shopImageUrl: shopData.image_url,
      currency: shopData.currency,
      manageProducts: true,
    });
  };

  const onPressEditHandler = () => {
    props.navigation.navigate('EditShop', { country: shopData.country, currency: shopData.currency, businessName: shopData.title, description: shopData.description });
  };

  const onSettingsHandler = () => {
    props.navigation.navigate('BusinessSettings', { email: shopData.email, role: shopData.role });
  };

  const [logoutMessage, setLogoutMessage] = useState(false);
  const onLogoutHandler = async () => {
    setImageUploadModalVisible(true);
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

  const onPressManageOrdersHandler = () => {
    props.navigation.navigate('Locations', {
      shopId: shopData.shopId,
      shopTitle: shopData.title,
      shopImageUrl: shopData.image_url,
      currency: shopData.currency,
      manageOrders: true
    });
  };

  const onPressManageNotificationsHandler = () => {
    props.navigation.navigate('Locations', {
      shopId: shopData.shopId,
      shopTitle: shopData.title,
      shopImageUrl: shopData.image_url,
      currency: shopData.currency,
      manageNotifications: true
    });
  };
  // ###################

  const onPressManageUsersHandler = () => {
    props.navigation.navigate('Users', { shopTitle: shopData.title, shopImageUrl: shopData.image_url, });
  };

  // ### adding a photo
  const [imageUploadModalVisible, setImageUploadModalVisible] = useState(false);
  const [imageUploadAboveMessageVisible, setImageUploadAboveMessageVisible] = useState(false);
  const [imageUploadAboveMessageText, setImageUploadAboveMessageText] = useState('');

  const addImageHandler = () => {
    (async () => {
      try {
        setImageUploadModalVisible(true);
        // No permissions request is necessary for launching the image library
        // Launching image picker and reducing image size
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.1,
        });
        if (result.canceled) return setImageUploadModalVisible(false);;

        let uri = result.assets[0].uri;
        const imageExt = result.assets[0].uri.split('.').pop();

        // Convert to jpg and compress image if image extension is png
        if (imageExt === 'png') {
          const manipResult = await manipulateAsync(
            result.assets[0].uri,
            [],
            { compress: 0.9, format: SaveFormat.JPEG }
          );
          uri = manipResult.uri;
        }
        
        // Uploading image to database manipResult.uri 
        let uploadTask = FileSystem.createUploadTask(`${values.requestUrl}admin/postShopImage`, uri, {
          headers: {
            authorization: `Bearer ${auth.accessToken}`
          },
          fieldName: 'image',
          httpMethod: 'POST',
          mimeType: mime.getType(uri),
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        });
        let res = JSON.parse((await uploadTask.uploadAsync()).body);
        if (res.status === 'FAILED' && res.errors[0].msg === 'Unauthorized') {
          const { success, newAccessToken } = await getNewAccessTokenAsync(auth.refreshToken, dispatch);
          if (success) {
            uploadTask = FileSystem.createUploadTask(`${values.requestUrl}admin/postShopImage`, uri, {
              headers: {
                authorization: `Bearer ${newAccessToken}`
              },
              fieldName: 'image',
              httpMethod: 'POST',
              mimeType: mime.getType(uri),
              uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            });
            res = JSON.parse((await uploadTask.uploadAsync()).body);
          } else {
            props.navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'BusinessSignIn' }] });
            return;
          }
        }
        if (res.status === 'FAILED' && res.errors[0].msg === 'Permission denied') {
          setImageUploadAboveMessageText(appText.permissionDenied);
          setImageUploadModalVisible(false);
          setImageUploadAboveMessageVisible(true);
          return;
        }
        if (res.status === 'FAILED') throw new Error(res.errors[0].msg);
        setImageUploadModalVisible(false);
        setShopData(shopData => {
          const newShopData = {...shopData};
          newShopData.image_url = res.data.imageUrl;
          return newShopData;
        });
      } catch (error) {
        console.log(`Error while uploading shop image to database: ${error.message}`);
        if (error.message === 'Image size is to big') {
          setImageUploadAboveMessageText(`${appText.imageSizeIsToBig} ${values.maxImageSize / 1024 / 1024} ${appText.mb}`);
          setImageUploadAboveMessageVisible(true);
          setImageUploadModalVisible(false);
          return;
        }
        if (error.message === 'Invalid image type') {
          setImageUploadAboveMessageText(appText.supportedImageTypes);
          setImageUploadAboveMessageVisible(true);
          setImageUploadModalVisible(false);
          return;
        }
        setImageUploadAboveMessageText(appText.somethingWentWrongAndTryLater);
        setImageUploadAboveMessageVisible(true);
        setImageUploadModalVisible(false);
      }
    })();
  };
  // #################################

  // ### Loading data and checking if user is authenticated
  // Modals
  const [loadingModalVisible, setLoadingModalVisible] = useState(true);
  const [aboveMessageVisible, setAboveMessageVisible] = useState(false);

  useEffect(() => {
    let controller = new AbortController();
    (async () => {
      try {
        let res = (await axios.post(`${values.requestUrl}admin/getAdminShop`, { accessToken: auth.accessToken }, { signal: controller.signal })).data;
        if (res.status === 'FAILED' && res.errors[0].msg === 'Unauthorized') {
          const { success, newAccessToken } = await getNewAccessTokenAsync(auth.refreshToken, dispatch, controller);
          if (success) {
            res = (await axios.post(`${values.requestUrl}admin/getAdminShop`, { accessToken: newAccessToken }, { signal: controller.signal })).data
          } else {
            props.navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'BusinessSignIn' }] });
            return;
          }
        }
        if (res.status === 'FAILED') throw new Error(res.errors[0].msg);
        setLoadingModalVisible(false);
        setShopData(res.data);
      } catch (error) {
        console.log(`Error while loading shop data from database: ${error.message}`);
        if (error.message !== 'canceled') {
          setAboveMessageVisible(true);
          setLoadingModalVisible(false);
        }
      }
    })();

    return () => controller.abort();
  }, []);
  // ##################################

  // Returning from ChangeEmailScreen with new email
  useLayoutEffect(() => {
    if (!props.route.params?.newEmail) return;
    setShopData(shopData => {
      const newShopData = {...shopData};
      newShopData.email = props.route.params?.newEmail;
      return newShopData;
    });
  }, [props.route.params?.newEmail]);

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
      <CustomSafeAreaScrollViewWindow contentContainerStyle={styles.customSafeAreaScrollViewWindowContentContainerStyle}>
        {shopData &&
          <AdminScreenLoadableContent
            appText={appText}
            shopData={shopData}
            addImageHandler={addImageHandler}
            onPressEditHandler={onPressEditHandler}
            onSettingsHandler={onSettingsHandler}
            onPressManageLocationsHandler={onPressManageLocationsHandler}
            onPressManageProductsHandler={onPressManageProductsHandler}
            onPressManageOrdersHandler={onPressManageOrdersHandler}
            onPressManageNotificationsHandler={onPressManageNotificationsHandler}
            onPressManageUsersHandler={onPressManageUsersHandler}
            setLogoutMessage={setLogoutMessage}
          />
        }
      </CustomSafeAreaScrollViewWindow>

      <LoadingModal
        visible={loadingModalVisible}
        onRequestClose={loadingModalRequestCloseHandler}
      />
      <LoadingModal
        visible={imageUploadModalVisible}
      />
      <AboveMessage
        visible={aboveMessageVisible}
        messageText={appText.somethingWentWrongAndTryLater}
        confirmButtonText={appText.confirm}
        onConfirm={aboveMessageHandler}
        onRequestClose={aboveMessageHandler}
      />
      <AboveMessage
        visible={imageUploadAboveMessageVisible}
        messageText={imageUploadAboveMessageText}
        confirmButtonText={appText.confirm}
        setModalVisibility={setImageUploadAboveMessageVisible}
        closeOnBackButtonPress={true}
      />
      <AboveMessage
        visible={logoutMessage}
        setModalVisibility={setLogoutMessage}
        messageText={appText.areYourSureSignout}
        cancelButtonText={appText.cancel}
        confirmButtonText={appText.confirm}
        doNotHideOnConfirm={true}
        onConfirm={onLogoutHandler}
        closeOnBackButtonPress={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  customSafeAreaScrollViewWindowContentContainerStyle: {
    paddingBottom: values.topMargin,
  },
});

export default AdminScreen;
