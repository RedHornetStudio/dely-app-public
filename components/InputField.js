import React, { memo, useState, useLayoutEffect, useRef, useEffect, forwardRef, useMemo } from 'react';
import { StyleSheet, View, Modal, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import colors from '../constants/colors';
import values from '../constants/values';
import BottomLine from './BottomLine';
import { addOpacityToColor } from '../shared/sharedFunctions';
import CustomInput from './CustomInput';
import CustomPressableOpacity from './CustomPressableOpacity';
import RegularText from './RegularText';
import SearchBar from './SearchBar';

const placeholderTextColor = addOpacityToColor(colors.primaryColor, values.textPlaceholderOpacity);
const overlayColor = addOpacityToColor(colors.thirdColor, values.overlayOpacity);
const itemContainerHeight = 50;

const Item = memo(props => {

  // Fading in
  const animatedOpacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
    }
  });
  useLayoutEffect(() => {
    if (props.firstRender.current) return;
    animatedOpacity.value = 0;
    animatedOpacity.value = withTiming(1, { duration: values.animationDuration });
  }, [props.index])
  // #######################################

  const onPressItemHandler = () => {
    props.setPickerVisible(false);
    props.setPickerValue(props.value);
  };

  return (
    <Animated.View style={[styles.itemContainer, animatedStyle]}>
      <View />
      <CustomPressableOpacity onPress={onPressItemHandler}>
        <RegularText style={styles.itemText} numberOfLines={2}>{props.title}</RegularText>
      </CustomPressableOpacity>
      <BottomLine style={styles.itemBottomLine} />
    </Animated.View>
  );
});

const NoItemsAfterSearchTextAnimated = props => {
  // Fading in
  const animatedOpacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
    }
  });
  useLayoutEffect(() => {
    animatedOpacity.value = 0;
    animatedOpacity.value = withTiming(1, { duration: values.animationDuration });
  }, [])
  // #######################################

  return (
    <Animated.View style={[styles.noItemsAfterSearchTextContainer, animatedStyle]}>
      <RegularText style={styles.noItemsAfterSearchText}>{props.noItemsAfterSearchText}</RegularText>
    </Animated.View>
  );
};

const PickerModal = props => {

  // ### Filter data by search term
  const [inputText, setInputText] = useState('');

  // ### On first render show country without fade in
  const firstRender = useRef(true);
  useEffect(() => {
    if (props.visible) {
      firstRender.current = false;
      return;
    }
    setInputText('');
    firstRender.current = true;
  }, [props.visible]);

  // ### Handlers
  const onRequestCloseHandler = () => {
    props.setPickerVisible(false);
  };

  // ### FlatList
  const renderItem = itemData => {
    return (
      <Item
        title={itemData.item.title}
        value={itemData.item.value}
        index={itemData.index}
        firstRender={firstRender}
        setPickerVisible={props.setPickerVisible}
        setPickerValue={props.setPickerValue}
      />
    );
  };

  const getItemLayout = (data, index) => {
    if (index < 0) return { length: 0, offset: 0, index };
    return { length: itemContainerHeight, offset: itemContainerHeight * index, index };
  };

  const keyExtractor = item => item.value;

  const filteredData = useMemo(() => {
    return inputText.trim().length > 0
      ? props.data.filter(item => item.title.toLowerCase().includes(inputText.toLowerCase().trim()))
      : props.data;
  }, [inputText]);

  return (
    <Modal
      animationType="fade"
      onRequestClose={onRequestCloseHandler}
      statusBarTranslucent={true}
      transparent={true}
      visible={props.visible}
    >
      <View style={styles.pickerContainer}>
        <View style={styles.contentContainer}>
          <SearchBar
            style={styles.searchBar} 
            value={inputText} 
            onChangeText={inputText => setInputText(inputText)} 
            placeholder={props.searchBarPlaceholder} 
          />
          {filteredData.length === 0 &&
            <NoItemsAfterSearchTextAnimated noItemsAfterSearchText={props.noItemsAfterSearchText} />
          }
          <FlatList
            contentContainerStyle={styles.listContentContainerStyle}
            data={filteredData}
            renderItem={renderItem}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={21}
            getItemLayout={getItemLayout}
            keyExtractor={keyExtractor}
          />
        </View>
      </View>
    </Modal>
  );
}

const InputField = forwardRef((props, ref) => {

  const [pickerVisible, setPickerVisible] = useState(false);

  const onPressPickerHandler = () => {
    setPickerVisible(true);
  };
  
  return (
    <View style={[styles.container, props.containerStyle]}>
      {props.picker
        ? <CustomPressableOpacity onPress={(onPressPickerHandler)}>
          <View style={styles.iconAndTextContainer}>
            {props.icon
              ? <View style={styles.iconContainer}><props.icon.Family name={props.icon.name} size={values.headerTextSize * 1.2} color={colors.primaryColor} /></View>
              : null
            }
            <View style={styles.pickerTextContainer}>
              {props.pickerValue.length > 0
                ? <RegularText>{props.data.find(item => item.value === props.pickerValue)?.title}</RegularText>
                : <RegularText style={{ color: placeholderTextColor }}>{props.placeholder}</RegularText>
              }
            </View>
            <MaterialIcons name="keyboard-arrow-right" size={values.headerTextSize} color={colors.primaryColor} />
          </View>
        </CustomPressableOpacity>
        : <View style={styles.iconAndTextContainer}>
          {props.icon
            ? <View style={styles.iconContainer}><props.icon.Family name={props.icon.name} size={values.headerTextSize * 1.2} color={colors.primaryColor} /></View>
            : null
          }
          <CustomInput
            {...props}
            ref={ref}
            style={[styles.textInput, props.style]}
            selectionColor={colors.secondaryColor}
            placeholderTextColor={props.placeholderTextColor? props.placeholderTextColor : placeholderTextColor}
          />
        </View>
      }
      <BottomLine style={[styles.bottomLine, props.bottomLineStyle]} />
      {props.picker
        ? <PickerModal 
          visible={pickerVisible}
          setPickerVisible={setPickerVisible}
          setPickerValue={props.setPickerValue}
          data={props.data}
          noItemsAfterSearchText={props.noItemsAfterSearchText}
          searchBarPlaceholder={props.searchBarPlaceholder}
        />
        : null
      }
    </View>
  );
});

const styles = StyleSheet.create({
  iconAndTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    width: values.headerTextSize * 1.4, 
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: colors.primaryColor,
    fontFamily: 'Montserrat-Regular',
    fontSize: values.regularTextSize,
  },
  pickerTextContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  bottomLine: {
    backgroundColor: colors.primaryColor,
  },
  // Picker Modal
  pickerContainer: {
    position: 'absolute',
    paddingHorizontal: 60,
    paddingVertical: 200,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: overlayColor,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.primaryColor,
    paddingHorizontal: 10,
    paddingTop: 10,
    borderRadius: values.borderRadius,
  },
  searchBar: {
    marginTop: 0,
  },
  noItemsAfterSearchTextContainer :{
    marginTop: 10,
  },
  noItemsAfterSearchText: {
    color: colors.thirdColor,
    textAlign: 'center',
  },
  // FlatList
  listContentContainerStyle: {
    paddingBottom: 5,
  },
  itemContainer: {
    height: itemContainerHeight,
    justifyContent: 'space-between',
  },
  itemText: {
    color: colors.thirdColor,
  },
  itemBottomLine: {
    backgroundColor: colors.thirdColor,
  }
});

export default InputField;