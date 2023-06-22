import React from 'react';
import { StyleSheet } from 'react-native';

import colors from '../constants/colors';
import values from '../constants/values';
import BoldText from './BoldText';
import RegularText from './RegularText';
import CustomPressableOpacity from './CustomPressableOpacity';
import { addOpacityToColor } from '../shared/sharedFunctions';

const primaryColorWithOpacity = addOpacityToColor(colors.primaryColor, values.opacity);

const MainButton = props => {
  return (
    <CustomPressableOpacity
      {...props}
      style={[
        styles.button,
        props.style,
        { 
          borderColor: props.disabled ? primaryColorWithOpacity : colors.primaryColor,
          backgroundColor: props.disabled ? props.empty ? colors.thirdColor : primaryColorWithOpacity : props.empty ? colors.thirdColor : colors.primaryColor
        }
      ]}
    >
      {props.useRegularText ?
        <RegularText 
          style={[
            styles.buttonText,
            props.buttonTextStyle,
            {
              color: props.disabled ? props.empty ? primaryColorWithOpacity : colors.thirdColor : props.empty ? colors.primaryColor : colors.thirdColor,
            }
          ]}
          numberOfLines={props.numberOfLines ? props.numberOfLines : 2}
        >{props.children}</RegularText>
        :
        <BoldText 
          style={[
            styles.buttonText,
            props.buttonTextStyle,
            {
              color: props.disabled ? props.empty ? primaryColorWithOpacity : colors.thirdColor : props.empty ? colors.primaryColor : colors.thirdColor,
            }
          ]}
          numberOfLines={props.numberOfLines ? props.numberOfLines : 2}
        >{props.children}</BoldText>
      }
    </CustomPressableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: values.mainButtonHeight,
    paddingHorizontal: 10,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.primaryColor,
    backgroundColor: colors.primaryColor,
  },
  buttonText: {
    fontSize: values.regularTextSize / 1.2,
    textAlign: 'center',
  },
});

export default MainButton;