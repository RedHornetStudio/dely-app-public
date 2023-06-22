import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Modal } from 'react-native';

import values from '../../constants/values';
import colors from '../../constants/colors';
import { addOpacityToColor } from '../../shared/sharedFunctions';
import RegularText from '../RegularText';
import BoldText from '../BoldText';
import CustomPressableOpacity from '../CustomPressableOpacity';
import InputField from '../InputField';

const overlayColor = addOpacityToColor(colors.thirdColor, values.overlayOpacity);
// const placeholderTextColor = addOpacityToColor(colors.thirdColor, values.textPlaceholderOpacity);

const SendTimeAboveMessage = props => {

  const onConfirmPressHandler = () => {
    if (props.onConfirm) props.onConfirm();
    if (props.setModalVisibility && !props.doNotCloseOnConfirm) props.setModalVisibility(false);
  };

  const onCancelPressHandler = () => {
    if (props.onCancel) props.onCancel();
    if (props.setModalVisibility) props.setModalVisibility(false);
  };

  const onRequestCloseHandler = () => {
    if (props.onRequestClose) props.onRequestClose();
    if (props.setModalVisibility && props.closeOnBackButtonPress) props.setModalVisibility(false);
  };

  const minutesRef = useRef(null);
  useEffect(() => {
    if (props.hours.length > 1) minutesRef.current.focus()
  }, [props.hours]);
  
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
            <RegularText style={[styles.messageText, styles.text]}>{props.appText.orderWillBeReady}</RegularText>
            <View style={styles.timeContainer}>
              <InputField
                style={styles.timeInput}
                containerStyle={[styles.timeInputContainer]}
                bottomLineStyle={styles.bottomLine}
                placeholder={props.appText.hh}
                // placeholderTextColor={placeholderTextColor}
                value={props.hours}
                onChangeText={props.setHours}
                textAlign="center"
                keyboardType="number-pad"
                selectTextOnFocus={true}
                maxLength={2}
                inputType="numbers"
                multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
              />
              <RegularText style={[styles.timeText, styles.timeMarginLeft]}>:</RegularText>
              <InputField
                ref={minutesRef}
                style={styles.timeInput}
                containerStyle={[styles.timeInputContainer, styles.timeMarginLeft]}
                bottomLineStyle={styles.bottomLine}
                placeholder={props.appText.mm}
                // placeholderTextColor={placeholderTextColor}
                value={props.minutes}
                onChangeText={props.setMinutes}
                textAlign="center"
                keyboardType="number-pad"
                selectTextOnFocus={true}
                maxLength={2}
                inputType="numbers"
                multiline={true} // for solving the problem when you tap on text input you can not scroll the screen
              />
            </View>
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
    height: 150,
    paddingHorizontal: 20,
    backgroundColor: colors.thirdColor,
    borderRadius: values.borderRadius,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
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
    // color: colors.thirdColor,
  },
  timeContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeMarginLeft: {
    marginLeft: 3,
  },
  timeInput: {
    // color: colors.thirdColor,
    fontSize: values.regularTextSize * 1.2,
  },
  timeInputContainer: {
    width: values.regularTextSize * 2.6,
  },
  timeText: {
    // color: colors.thirdColor,
  },
  bottomLine: {
    // backgroundColor: colors.thirdColor,
  },
});

export default SendTimeAboveMessage;