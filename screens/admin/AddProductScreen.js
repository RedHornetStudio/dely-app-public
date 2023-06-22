import React, { useState, useRef, useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import mime from 'mime';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

import colors from '../../constants/colors';
import values from '../../constants/values';
import RegularText from '../../components/RegularText';
import CustomImageBackground from '../../components/CustomImageBackground';
import CustomSafeAreaScrollViewWindowWithInsets from '../../components/CustomSafeAreaScrollViewWindowWithInsets';
import ProductImage from '../../components/ProductImage';
import InputField from '../../components/InputField';
import LoadingModal from '../../components/LoadingModal';
import AboveMessage from '../../components/AboveMessage';
import getLocalizedText from '../../constants/getLocalizedText';
import { getNewAccessTokenAsync } from '../../shared/sharedFunctions';
import BottomButtonContainer from '../../components/BottomButtonContainer';
import OptionItem from '../../components/AddProductScreen/OptionItem';
import PlusIconButton from '../../components/PlusIconButton';
import CustomPressableOpacity from '../../components/CustomPressableOpacity';
import { concatErrors } from '../../shared/sharedFunctions';

const AddProductScreen = props => {
  console.log('----Add Product Screen rerendered----');
  
  const dispatch = useDispatch();

  // ### Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // ### Auth tokens
  const auth = useSelector(state => state.authSlice);

  // ### Loading modal
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [editingLoadingModalVisible, setEditingLoadingModalVisible] = useState(props.route.params?.editingMode ? true : false);

  // ### Above message
  const [aboveMessageVisible, setAboveMessageVisible] = useState(false);
  const [aboveMessageText, setAboveMessageText] = useState('');

  // ### Above message
  const [errorWhileLoadingDetailsAboveMessageVisible, setErrorWhileLoadingDetailsAboveMessageVisible] = useState(false);
  const [errorWhileLoadingDetailsAboveMessageText, setErrorWhileLoadingDetailsAboveMessageText] = useState('');

  // ### Input field values
  const [pickerResult, setPickerResult] = useState(null);
  const [category, setCategory] = useState(props.route.params?.editingMode ? props.route.params.category : '');
  const [title, setTitle] = useState(props.route.params?.editingMode ? props.route.params.title : '');
  const [price, setPrice] = useState(props.route.params?.editingMode ? props.route.params.price : '');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState([]);

  // ### Going to next input field by pressing return key
  const titleInputRef = useRef(null);
  const priceInputRef = useRef(null);
  const descriptionInputRef = useRef(null);

  // ### Editing mode
  useEffect(() => {
    let controller = new AbortController();
    if (props.route.params?.editingMode) {
      // Getting product details
      (async () => {
        try {
          const { data: res } = await axios.post(`${values.requestUrl}getProductDetails`, { productId: props.route.params.id }, { signal: controller.signal });
          if (res.status === 'FAILED' && res.errors[0].msg === 'Product do not exist or where been deleted') {
            setErrorWhileLoadingDetailsAboveMessageText(appText.productDoNotExist);
            setErrorWhileLoadingDetailsAboveMessageVisible(true);
            setEditingLoadingModalVisible(false);
            return;
          }
          if (res.status === 'FAILED') throw new Error (concatErrors(res.errors));
          const loadedOptions = [];
          res.data.options.forEach((option) => {
            let allPricesAreZeros = true;
            for (let i = 0; i < option.variants.length; i++) {
              if (Number(option.variants[i].price) !== 0) {
                allPricesAreZeros = false;
                break;
              }
            }
            let options;
            if (allPricesAreZeros) {
              options = option.variants.map(option => ({ title: option.title, price: '' }));
            } else {
              options = option.variants;
            }
            loadedOptions.push({ title: option.title, required: option.required ? true : false, multiple: option.multiple ? true : false, options: options });
          });
          setDescription(res.data.description);
          setOptions(loadedOptions);
          setEditingLoadingModalVisible(false);
        } catch (error) {
          console.log(`Error while loading product details from database: ${error.message}`);
          if (error.message !== 'canceled') {
            setErrorWhileLoadingDetailsAboveMessageText(appText.somethingWentWrongAndTryLater);
            setErrorWhileLoadingDetailsAboveMessageVisible(true);
            setEditingLoadingModalVisible(false);
          }
        }
      })();
    }

    return () => {
      if (controller) controller.abort();
    };
  }, []);

  // ### Add image handler
  const addImageHandler = async () => {
    try {
      // No permissions request is necessary for launching the image library
      // Launching image picker and reducing image size
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.1,
      });
      if (result.canceled) return;

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

      setPickerResult(uri);
    } catch (error) {
      console.dir(`Error while luanching image library: ${error}`);
    }
  };

  // ### Add option handler
  const onPressAddOptionHandler = () => {
    props.navigation.navigate('AddOption');
  };

  // ### Receiving options from AddOptionScreen
  const optionsEdited = useRef(false);
  useEffect(() => {
    if (props.route.params?.newOption) {
      optionsEdited.current = true;
      setOptions(prevState => [...prevState, props.route.params?.newOption])
    };
  }, [props.route.params?.newOption]);

  // ### Receiving edited option from AddOptionScreen
  useEffect(() => {
    if (props.route.params?.editedOption && typeof props.route.params?.editedOptionIndex === 'number') {
      optionsEdited.current = true;
      setOptions(prevState => {
        const newState = [...prevState];
        newState.splice(props.route.params.editedOptionIndex, 1, {...props.route.params.editedOption})
        return newState;
      });
    }
  }, [props.route.params?.editedOption, props.route.params?.editedOptionIndex]);

  // ### Delete message
  const [itemToDeleteIndex, setItemToDeleteIndex] = useState(null);
  const [deleteModalVisibility, setDeleteModalVisibility] = useState(false);
  const onConfirmDeleteHandler = () => {
    optionsEdited.current = true;
    setOptions(prevOptions => {
      const newOptions = [...prevOptions];
      newOptions.splice(itemToDeleteIndex, 1);
      return newOptions;
    })
  };

  // ### Add and edit product handler
  const addOrEditProductHandler = async (postText) => {
    setLoadingModalVisible(true);
    if (pickerResult) {
      try {
        let uploadTask = FileSystem.createUploadTask(`${values.requestUrl}admin/${postText}`, pickerResult, {
          headers: {
            authorization: `Bearer ${auth.accessToken}`
          },
          fieldName: 'image',
          httpMethod: 'POST',
          mimeType: mime.getType(pickerResult),
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          parameters: postText === 'postEditProduct'
            ? {
              optionsEdited: optionsEdited.current,
              id: props.route.params.id,
              category: category,
              title: title,
              price: price,
              description: description,
              options: JSON.stringify(options),
            }
            : {
              category: category,
              title: title,
              price: price,
              description: description,
              options: JSON.stringify(options),
            }
        });
        let res = JSON.parse((await uploadTask.uploadAsync()).body);
        if (res.status === 'FAILED' && res.errors[0].msg === 'Unauthorized') {
          const { success, newAccessToken } = await getNewAccessTokenAsync(auth.refreshToken, dispatch);
          if (success) {
            uploadTask = FileSystem.createUploadTask(`${values.requestUrl}admin/${postText}`, pickerResult, {
              headers: {
                authorization: `Bearer ${newAccessToken}`
              },
              fieldName: 'image',
              httpMethod: 'POST',
              mimeType: mime.getType(pickerResult),
              uploadType: FileSystem.FileSystemUploadType.MULTIPART,
              parameters: postText === 'postEditProduct'
                ? {
                  optionsEdited: optionsEdited.current,
                  id: props.route.params.id,
                  category: category,
                  title: title,
                  price: price,
                  description: description,
                  options: JSON.stringify(options),
                }
                : {
                  category: category,
                  title: title,
                  price: price,
                  description: description,
                  options: JSON.stringify(options),
                }
            });
            res = JSON.parse((await uploadTask.uploadAsync()).body);
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
        if (res.status === 'FAILED' && res.errors[0].msg === 'Product do not exist') {
          setAboveMessageText(appText.productDoNotExist);
          setAboveMessageVisible(true);
          setLoadingModalVisible(false);
          return;
        }
        if (res.status === 'FAILED' && res.errors[0].param) {
          setAboveMessageVisible(true);
          setLoadingModalVisible(false);
          switch (`${res.errors[0].msg} ${res.errors[0].param}`) {
            case 'Empty value category':
              setAboveMessageText(appText.emptyInputCategory);
              break;
            case 'Empty value title':
              setAboveMessageText(appText.emptyInputTitle);
              break;
            case 'Empty value price':
              setAboveMessageText(appText.emptyInputPrice);
              break;
            case 'Invalid value price':
              setAboveMessageText(appText.invalidInputPrice);
              break;
            case 'Invalid value options':
              setAboveMessageText(appText.invalidIOptionsFormat);
              break;
          }
          return; 
        }
        if (res.status === 'FAILED') throw new Error(res.errors[0].msg);
        props.navigation.navigate({
          name: 'Products',
          params: { needUpdate: {} },
          merge: true,
        });
      } catch (error) {
        console.log(`Error while ${postText} in database: ${error.message}`);
        if (error.message === 'Image size is to big') {
          setAboveMessageText(`${appText.imageSizeIsToBig} ${values.maxImageSize / 1024 / 1024} ${appText.mb}`);
          setAboveMessageVisible(true);
          setLoadingModalVisible(false);
          return;
        }
        if (error.message === 'Invalid image type') {
          setAboveMessageText(appText.supportedImageTypes);
          setAboveMessageVisible(true);
          setLoadingModalVisible(false);
          return;
        }
        setAboveMessageText(appText.somethingWentWrongAndTryLater);
        setAboveMessageVisible(true);
        setLoadingModalVisible(false);
      }
      return;
    }
    try {
      const formData = new FormData();
      postText === 'postEditProduct' ? formData.append('optionsEdited', optionsEdited.current) : null;
      postText === 'postEditProduct' ? formData.append('id', props.route.params.id) : null;
      formData.append('category', category);
      formData.append('title', title);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('options', JSON.stringify(options));

      let res = (await axios.post(`${values.requestUrl}admin/${postText}`, formData, {
        headers: {
          'content-type': 'multipart/form-data',
          authorization: `Bearer ${auth.accessToken}`,
        }
      })).data;
      if (res.status === 'FAILED' && res.errors[0].msg === 'Unauthorized') {
        const { success, newAccessToken } = await getNewAccessTokenAsync(auth.refreshToken, dispatch);
        if (success) {
          res = (await axios.post(`${values.requestUrl}admin/${postText}`, formData, {
            headers: {
              'content-type': 'multipart/form-data',
              authorization: `Bearer ${newAccessToken}`,
            }
          })).data;
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
      if (res.status === 'FAILED' && res.errors[0].msg === 'Product do not exist') {
        setAboveMessageText(appText.productDoNotExist);
        setAboveMessageVisible(true);
        setLoadingModalVisible(false);
        return;
      }
      if (res.status === 'FAILED' && res.errors[0].param) {
        setAboveMessageVisible(true);
        setLoadingModalVisible(false);
        switch (`${res.errors[0].msg} ${res.errors[0].param}`) {
          case 'Empty value category':
            setAboveMessageText(appText.emptyInputCategory);
            break;
          case 'Empty value title':
            setAboveMessageText(appText.emptyInputTitle);
            break;
          case 'Empty value price':
            setAboveMessageText(appText.emptyInputPrice);
            break;
          case 'Invalid value price':
            setAboveMessageText(appText.invalidInputPrice);
            break;
          case 'Invalid value options':
            setAboveMessageText(appText.invalidIOptionsFormat);
            break;
        }
        return; 
      }
      if (res.status === 'FAILED') throw new Error(res.errors[0].msg);
      props.navigation.navigate({
        name: 'Products',
        params: { needUpdate: {} },
        merge: true,
      });
    } catch (error) {
      console.log(`Error while ${postText} in database: ${error.message}`);
      setAboveMessageText(appText.somethingWentWrongAndTryLater);
      setAboveMessageVisible(true);
      setLoadingModalVisible(false);
    }
  }; 

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
      <CustomSafeAreaScrollViewWindowWithInsets
        contentMinHeight={{ value: values.headerBigIconSize - values.mainButtonHeight - values.topMargin, useWindowHeight: true, useInsetsTop: true }}
        doNotUseInsetsBottom={true}
      >
        <ProductImage
          imageUrl={pickerResult ? pickerResult : props.route.params?.editingMode && props.route.params?.imageUrl ? props.route.params.imageUrl : ''}
          showAddPhotoIcon={true}
          addPhotoIconPressHandler={addImageHandler}
        />
        <View style={styles.contentContainer}>
          <RegularText style={styles.addProductText} numberOfLines={2}>{props.route.params?.editingMode ? appText.editProduct : appText.addNewProduct}</RegularText>
          <InputField
            containerStyle={styles.textInput}
            value={category}
            onChangeText={setCategory}
            placeholder={appText.category}
            icon={{ Family: MaterialIcons, name: 'category' }}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => titleInputRef.current.focus()}
          />
          <InputField
            ref={titleInputRef}
            containerStyle={styles.textInput}
            value={title}
            onChangeText={setTitle}
            placeholder={appText.title}
            icon={{ Family: Ionicons, name: 'fast-food' }}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => priceInputRef.current.focus()}
          />
          <InputField
            ref={priceInputRef}
            containerStyle={styles.textInput}
            value={price}
            onChangeText={setPrice}
            placeholder={appText.price}
            keyboardType="decimal-pad"
            inputType="decimal"
            icon={{ Family: Ionicons, name: 'pricetags' }}
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
            icon={{ Family: MaterialIcons, name: 'description' }}
          />

          <CustomPressableOpacity onPress={onPressAddOptionHandler} style={styles.addOptionsPressable}>
            <RegularText style={styles.addOptionsText}>{appText.addOption}</RegularText>
            <PlusIconButton disabled={true} />
          </CustomPressableOpacity>

          {options.map((option, index) => {
            return (
              <OptionItem
                key={JSON.stringify(option)}
                index={index}
                option={option}
                appText={appText}
                setDeleteModalVisibility={setDeleteModalVisibility}
                setItemToDeleteIndex={setItemToDeleteIndex}
                navigation={props.navigation}
                currency={props.route.params.currency}
              />
            );
          })}
        </View>

      </CustomSafeAreaScrollViewWindowWithInsets>

      <BottomButtonContainer
        onPress={props.route.params?.editingMode ? () => addOrEditProductHandler('postEditProduct') : () => addOrEditProductHandler('postAddProduct')}
        title={props.route.params?.editingMode ? appText.edit : appText.add}      
      />

      <AboveMessage
        visible={aboveMessageVisible}
        closeOnBackButtonPress={true}
        messageText={aboveMessageText}
        onConfirm={() => setAboveMessageText('')}
        setModalVisibility={setAboveMessageVisible}
        confirmButtonText={appText.confirm}
      />

      <AboveMessage
        visible={deleteModalVisibility}
        setModalVisibility={setDeleteModalVisibility}
        closeOnBackButtonPress={true}
        messageText={appText.areYouSureDeleteItem}
        confirmButtonText={appText.confirm}
        onConfirm={onConfirmDeleteHandler}
        cancelButtonText={appText.cancel}
      />

      <AboveMessage
        visible={errorWhileLoadingDetailsAboveMessageVisible}
        messageText={errorWhileLoadingDetailsAboveMessageText}
        onConfirm={props.navigation.goBack}
        confirmButtonText={appText.confirm}
        onRequestClose={props.navigation.goBack}
      />

      <LoadingModal visible={loadingModalVisible} />
      <LoadingModal
        visible={editingLoadingModalVisible}
        onRequestClose={() => props.navigation.goBack()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: values.windowHorizontalPadding,
  },
  addProductText: {
    marginTop: values.topMargin,
    marginLeft: values.windowHorizontalPadding,
    fontSize: values.headerTextSize,
  },
  textInput: {
    marginTop: values.topMargin,
  },
  addOptionsPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: values.windowHorizontalPadding,
    marginTop: values.topMargin,
  },
  addOptionsText: {
    flex: 1,
    marginRight: 10,
    fontSize: values.headerTextSize / 1.5,
    textAlign: 'right',
  },
});

export default AddProductScreen;