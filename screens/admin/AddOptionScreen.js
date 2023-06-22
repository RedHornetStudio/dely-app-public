import React, { useState, useRef, useEffect, createRef, useMemo } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import bigDecimal from 'js-big-decimal';

import colors from '../../constants/colors';
import values from '../../constants/values';
import getLocalizedText from '../../constants/getLocalizedText';
import RegularText from '../../components/RegularText';
import CustomImageBackground from '../../components/CustomImageBackground';
import CustomSafeAreaScrollViewWindowWithInsets from '../../components/CustomSafeAreaScrollViewWindowWithInsets';
import HeaderBigIcon from '../../components/HeaderBigIcon';
import CustomSwitch from '../../components/CustomSwitch';
import InputField from '../../components/InputField';
import AnimatedContainer from '../../components/AddOptionScreen/AnimatedContainer';
import AboveMessage from '../../components/AboveMessage';
import BottomButtonContainer from '../../components/BottomButtonContainer';

const AddOptionScreen = props => {
  console.log('----Add Option Screen rerendered----');

  // ## Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // ## Setting ScrollView minHeight
  const insets = useSafeAreaInsets();
  const windowHeight = useMemo(() => {
    let windowHeight = Dimensions.get('window').height;
    if (Platform.OS === 'android') windowHeight += insets.top;
    return windowHeight;
  }, [insets]);

  // ## On first render show option inputs without fade in
  const firstRender = useRef(true);
  useEffect(() => {
    firstRender.current = false;
  }, []);

  // ## Input field values
  const [title, setTitle] = useState((() => props.route.params?.optionToEdit ? props.route.params.optionToEdit.title : '')());
  const [required, setRequired] = useState((() => props.route.params?.optionToEdit ? props.route.params.optionToEdit.required : false)());
  const [multiple, setMultiple] = useState((() => props.route.params?.optionToEdit ? props.route.params.optionToEdit.multiple : false)());
  const [additionalPrice, setAdditionalPrice] = useState((() => {
    let additionalPrice = false;
    if (props.route.params?.optionToEdit) {
      for (let i = 0; i < props.route.params.optionToEdit.options.length; i++) {
        if (props.route.params.optionToEdit.options[i].price.length > 0) {
          additionalPrice = true;
          break;
        }
      }
    }
    if (additionalPrice) return true;
  })());
  const [options, setOptions] = useState((() => {
    if (props.route.params?.optionToEdit) {
      const newOptions = [...props.route.params.optionToEdit.options];
      if (newOptions.length === 1) newOptions.push({ title: '', price: '' });
      newOptions.push({ title: '', price: '' });
      return newOptions;
    } else {
      return [{ title: '', price: '' }, { title: '', price: '' }, { title: '', price: '' }];
    }
  })());

  // ## Input refs
  const inputRefs = useRef([]);

  // ## Above message
  const [aboveMessageVisible, setAboveMessageVisible] = useState(false);
  const [aboveMessageText, setAboveMessageText] = useState('');

  // ## Handlers
  const onPressAddHandler = () => {
    const filteredOptions = [];
    options.forEach(option => {
      if (option.title.length > 0) filteredOptions.push({...option});
    });
    if (title.length === 0 || filteredOptions.length === 0) {
      setAboveMessageVisible(true);
      setAboveMessageText(appText.enterTitleAndOption);
      return;
    }
    let invalidPrice = false;
    for (let i = 0; i < filteredOptions.length; i++) {
      if(additionalPrice) {
        if (!/^[0-9]+(\.[0-9]+)?$/.test(filteredOptions[i].price)) {
          invalidPrice = true;
        } else {
          filteredOptions[i].price = new bigDecimal(filteredOptions[i].price).round(2).getValue();
        }
      }
    }
    if (invalidPrice) {
      setAboveMessageVisible(true);
      setAboveMessageText(appText.invalidPriceFormat);
      return;
    }; 
    const option = {
      title: title,
      required: required,
      multiple: multiple,
      options: filteredOptions
    };
    
    if (props.route.params?.optionToEdit && typeof props.route.params?.optionToEditIndex === 'number') {
      props.navigation.navigate({
        name: 'AddProduct',
        params: { editedOption: option, editedOptionIndex: props.route.params?.optionToEditIndex },
        merge: true,
      });
    } else {
      props.navigation.navigate({
        name: 'AddProduct',
        params: { newOption: option },
        merge: true,
      });
    }
  };

  const additionalPriceSwitchHandler = () => {
    setOptions(prevOptions => prevOptions.map(option => ({ title: option.title, price: '' })));
    setAdditionalPrice(previousState => !previousState);
  };
  // #######################################

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
      <CustomSafeAreaScrollViewWindowWithInsets
        contentContainerStyle={styles.contentContainerStyle}
        doNotUseInsetsBottom={true}
      >
        <HeaderBigIcon><Ionicons name="fast-food" size={values.headerBigIconSize} color={colors.primaryColor} /></HeaderBigIcon>
        <RegularText style={styles.addOptionText} numberOfLines={2}>{appText.addOption}</RegularText>
        <View style={styles.switchContainer}>
          <RegularText style={styles.switchText} numberOfLines={1}>{appText.required}</RegularText>
          <CustomSwitch
            value={required}
            onValueChange={() => setRequired(previousState => !previousState)}
          />
        </View>
        <View style={styles.switchContainer}>
          <RegularText style={styles.switchText} numberOfLines={1}>{appText.multiple}</RegularText>
          <CustomSwitch
            value={multiple}
            onValueChange={() => setMultiple(previousState => !previousState)}
          />
        </View>
        <View style={styles.switchContainer}>
          <RegularText style={styles.switchText} numberOfLines={1}>{appText.additionalPrice}</RegularText>
          <CustomSwitch
            value={additionalPrice}
            onValueChange={additionalPriceSwitchHandler}
          />
        </View>
        <InputField
          containerStyle={styles.inputField}
          value={title}
          onChangeText={setTitle}
          placeholder={appText.title}
          icon={{ Family: Ionicons, name: 'fast-food' }}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => inputRefs.current[0].option.current.focus()}
        />
        <View style={[styles.optionsContainer, { marginBottom: windowHeight / 2 }]}>
          {options.map((option, index) => {
            if (additionalPrice) {
              inputRefs.current[index] = { option: createRef(), price: createRef() }
              return (
                <AnimatedContainer style={styles.animatedContainer} key={index} additionalPrice={additionalPrice} firstRender={firstRender}>
                  <InputField
                    ref={inputRefs.current[index].option}
                    containerStyle={styles.optionTitle}
                    style={styles.optionTitleAndPriceInput}
                    value={options[index].title}
                    onChangeText={value => setOptions(previousOptions => {
                      const newOptions = [...previousOptions];
                      if (newOptions.length === index + 1 && value.length > 0) {
                        newOptions[index + 1] = { title: '', price: '' }; 
                      }
                      newOptions[index].title = value;
                      return newOptions;
                    })}
                    placeholder={`${appText.option}-${index + 1}`}
                    icon={{ Family: Entypo, name: 'dot-single' }}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => inputRefs.current[index].price.current.focus()}
                  />
                  <InputField
                    ref={inputRefs.current[index].price}
                    containerStyle={styles.optionPrice}
                    style={styles.optionTitleAndPriceInput}
                    value={options[index].price}
                    onChangeText={value => setOptions(previousOptions => {
                      const newOptions = [...previousOptions];
                      if (newOptions.length === index + 1 && value.length > 0) {
                        newOptions[index + 1] = { title: '', price: '' }; 
                      }
                      newOptions[index].price = value;
                      return newOptions;
                    })}
                    placeholder={`${appText.price}-${index + 1}`}
                    icon={{ Family: Ionicons, name: 'pricetags' }}
                    keyboardType="decimal-pad"
                    inputType="decimal"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => {
                      if (index < inputRefs.current.length - 1) inputRefs.current[index + 1].option.current.focus();
                    }}
                  />
                </AnimatedContainer>
              )
            } else {
              inputRefs.current[index] = { option: createRef(), price: createRef() }
              return (
                <AnimatedContainer style={styles.animatedContainer} key={index} additionalPrice={additionalPrice} firstRender={firstRender}>
                  <InputField
                    ref={inputRefs.current[index].option}
                    containerStyle={styles.optionTitle}
                    style={styles.optionTitleAndPriceInput}
                    value={options[index].title}
                    onChangeText={value => setOptions(previousOptions => {
                      const newOptions = [...previousOptions];
                      if (newOptions.length === index + 1 && value.length > 0) {
                        newOptions[index + 1] = { title: '', price: 0 }; 
                      }
                      newOptions[index].title = value;
                      return newOptions;
                    })}
                    placeholder={`${appText.option}-${index + 1}`}
                    icon={{ Family: Entypo, name: 'dot-single' }}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => {
                      if (index < inputRefs.current.length - 1) inputRefs.current[index + 1].option.current.focus();
                    }}
                  />
                </AnimatedContainer>
              )
            }
          })}
        </View>
      </CustomSafeAreaScrollViewWindowWithInsets>
      
      <BottomButtonContainer onPress={onPressAddHandler} title={props.route.params?.optionToEdit ? appText.edit : appText.add}/>

      <AboveMessage
        visible={aboveMessageVisible}
        closeOnBackButtonPress={true}
        messageText={aboveMessageText}
        onConfirm={() => setAboveMessageText('')}
        setModalVisibility={setAboveMessageVisible}
        confirmButtonText={appText.confirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentContainerStyle: {
    paddingHorizontal: values.windowHorizontalPadding
  },
  addOptionText: {
    marginTop: values.topMargin,
    marginLeft: values.windowHorizontalPadding,
    fontSize: values.headerTextSize,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: values.topMargin,
  },
  switchText: {
    flex: 1,
  },
  inputField: {
    marginTop: values.topMargin,
  },
  optionsContainer: {
    marginLeft: values.windowHorizontalPadding,
  },
  animatedContainer: {
    marginTop: values.topMargin,
    flexDirection: 'row',
  },
  optionTitle: {
    flex: 2,
  },
  optionPrice: {
    flex: 1,
    marginLeft: 20,
  },
  optionTitleAndPriceInput: {
    height: values.headerTextSize * 1.3,
  },
});

export default AddOptionScreen;