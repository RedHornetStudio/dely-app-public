import React from 'react';
import { StyleSheet, Modal, View, ActivityIndicator } from 'react-native';

import colors from '../constants/colors';
import values from '../constants/values';
import { addOpacityToColor } from '../shared/sharedFunctions';

const overlayColor = addOpacityToColor(colors.thirdColor, values.overlayOpacity);

const LoadingModal = props => {

  const onRequestCloseHandler = () => {
    if (props.onRequestClose) props.onRequestClose();
    if (props.setModalVisibility && props.closeOnBackButtonPress) props.setModalVisibility(false);
  };

  return (
    <Modal
      animationType="fade"
      statusBarTranslucent={true}
      transparent={true}
      visible={props.visible}
      onRequestClose={onRequestCloseHandler}
    >
      <View style={styles.container}>
        <ActivityIndicator size={'large'} color={colors.primaryColor} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: overlayColor,
    paddingHorizontal: values.windowHorizontalPadding,
  },
});

export default LoadingModal;