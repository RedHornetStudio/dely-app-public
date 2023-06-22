import React from 'react';
import { StyleSheet, View, Modal } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import values from '../../constants/values';
import colors from '../../constants/colors';
import MainButton from '../MainButton';
import { addOpacityToColor } from '../../shared/sharedFunctions';
import BoldText from '../BoldText';

const overlayColor = addOpacityToColor(colors.thirdColor, values.overlayOpacity);

const GoToCartModal = props => {

  const insets = useSafeAreaInsets();

  const goToCartHandler = () => {
    props.navigation.replace('Cart');
  };

  const continueShoppingHandler = () => {
    props.navigation.goBack();
  };

  const onRequestCloseHandler = () => {
    props.navigation.goBack();
  };

  return (
    <Modal
      animationType="fade"
      onRequestClose={onRequestCloseHandler}
      statusBarTranslucent={true}
      transparent={true}
      visible={props.visible}
    >
      <View style={[styles.container]}>
        <View style={styles.messageContainer}>
          <Entypo name="shopping-cart" size={values.headerTextSize * 2} color={colors.primaryColor} />
          <BoldText style={styles.text}>{props.appText.itemAddedSuccessfully}</BoldText>
        </View>
        <View style={[styles.buttonContainer, { paddingTop: values.topMargin / 2, paddingBottom: values.topMargin / 2 + insets.bottom }]}>
          <MainButton onPress={continueShoppingHandler} empty={true}>{props.appText.continueShopping}</MainButton>
          <MainButton onPress={goToCartHandler}>{props.appText.goToCart}</MainButton>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: overlayColor,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: values.windowHorizontalPadding,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: values.topMargin,
    backgroundColor: colors.thirdColor,
  },
});

export default GoToCartModal;