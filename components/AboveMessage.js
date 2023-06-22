import React from 'react';
import { StyleSheet, View, Modal } from 'react-native';

import values from '../constants/values';
import colors from '../constants/colors';
import { addOpacityToColor } from '../shared/sharedFunctions';
import RegularText from './RegularText';
import BoldText from './BoldText';
import CustomPressableOpacity from './CustomPressableOpacity';

const overlayColor = addOpacityToColor(colors.thirdColor, values.overlayOpacity);

const AboveMessage = props => {

  const onConfirmPressHandler = () => {
    if (props.onConfirm) props.onConfirm();
    if (props.setModalVisibility && !props.doNotHideOnConfirm) props.setModalVisibility(false);
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
            <RegularText style={[styles.messageText, styles.text]}>{props.messageText}</RegularText>
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
    backgroundColor: colors.primaryColor,
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
    color: colors.thirdColor,
  },
});

export default AboveMessage;