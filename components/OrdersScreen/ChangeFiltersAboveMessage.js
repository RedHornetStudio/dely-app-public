import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, View, Modal } from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import values from '../../constants/values';
import colors from '../../constants/colors';
import { addOpacityToColor } from '../../shared/sharedFunctions';
import RegularText from '../RegularText';
import BoldText from '../BoldText';
import CustomPressableOpacity from '../CustomPressableOpacity';
import MainSwitch from '../MainSwitch';
import { ordresFiltersChanged } from '../../features/ordersFiltersSlice';

const overlayColor = addOpacityToColor(colors.thirdColor, values.overlayOpacity);

const ChangeFiltersAboveMessage = props => {

  const dispatch = useDispatch();

  const [switchValues, setSwitchValues] = useState([false, false, false]);

  useLayoutEffect(() => {
    const newSwitchValues = [false, false, false];
    props.filters.indexOf('preparing') >= 0 ? newSwitchValues.splice(0, 1, true) : null;
    props.filters.indexOf('ready') >= 0 ? newSwitchValues.splice(1, 1, true) : null;
    props.filters.indexOf('closed') >= 0 ? newSwitchValues.splice(2, 1, true) : null;
    setSwitchValues(newSwitchValues);
  }, [props.visible, props.filters]);

  const onConfirmPressHandler = async () => {
    const newFilters = [];
    switchValues[0] ? newFilters.push('preparing') : null;
    switchValues[1] ? newFilters.push('ready') : null;
    switchValues[2] ? newFilters.push('closed') : null;
    if (props.onConfirm) props.onConfirm();
    await AsyncStorage.setItem('@ordersFilters', JSON.stringify(newFilters));
    dispatch(ordresFiltersChanged(JSON.stringify(newFilters)));
    if (props.setModalVisibility) props.setModalVisibility(false);
  };

  const onCancelPressHandler = () => {
    if (props.onCancel) props.onCancel();
    if (props.setModalVisibility) props.setModalVisibility(false);
  };

  const onRequestCloseHandler = () => {
    if (props.onRequestClose) props.onRequestClose();
    if (props.setModalVisibility && props.closeOnBackButtonPress) props.setModalVisibility(false);
  };

  return (
    <Modal
      animationType="fade"
      onRequestClose={onRequestCloseHandler}
      statusBarTranslucent={true}
      transparent={true}
      visible={props.visible}
    >
      <View style={styles.container}>
        <View style={styles.boxContainer}>
          <View style={styles.messageContainer}>
          <RegularText style={[styles.messageHeader, styles.text]}>{props.headerText}</RegularText>
            {switchValues.map((switchValue, index) => {
              let switchText = '';
              switch (index) {
                case 0:
                  switchText = `${props.appText.preparing[0].toUpperCase()}${props.appText.preparing.substring(1)}`;
                  break;
                case 1:
                  switchText = `${props.appText.ready[0].toUpperCase()}${props.appText.ready.substring(1)}`;
                  break;
                case 2:
                  switchText = `${props.appText.closed[0].toUpperCase()}${props.appText.closed.substring(1)}`;
                  break;

              }
              return (
                <View key={index} style={styles.switchContainer}>
                  <RegularText style={styles.switchText}>{switchText}</RegularText>
                  <MainSwitch
                    key={index}
                    style={styles.switch}
                    index={index}
                    switchValues={switchValues}
                    setSwitchValues={setSwitchValues}
                    multiple={true}
                    darkTheme={true}
                  />
                </View>
              );
            })}
          </View>
          <View style={styles.buttonContainer}>
            {props.cancelButtonText &&
              <CustomPressableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancelPressHandler}><BoldText style={styles.text}>{props.cancelButtonText.toUpperCase()}</BoldText></CustomPressableOpacity>
            }
            {props.confirmButtonText &&
              <CustomPressableOpacity style={styles.button} onPress={onConfirmPressHandler}><BoldText style={styles.text}>{props.confirmButtonText.toUpperCase()}</BoldText></CustomPressableOpacity>
            }
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    paddingHorizontal: 40,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: overlayColor,
  },
  boxContainer: {
    height: 200,
    paddingHorizontal: 20,
    backgroundColor: colors.primaryColor,
    borderRadius: values.borderRadius,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  messageHeader: {
    marginLeft: 20,
    fontSize: values.regularTextSize * 1.5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  cancelButton: {
    marginRight: 20,
  },
  text: {
    color: colors.thirdColor,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  switchText: {
    color: colors.thirdColor,
  },
  switch: {
    marginRight: 10,
  },
});

export default ChangeFiltersAboveMessage;