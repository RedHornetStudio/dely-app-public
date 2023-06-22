import React from 'react';
import { StyleSheet, View } from 'react-native';

import colors from '../../constants/colors';
import values from '../../constants/values';
import BoldText from '../BoldText';
import RegularText from '../RegularText';
import CustomPressableOpacity from '../CustomPressableOpacity';
import { addOpacityToColor } from '../../shared/sharedFunctions';

const primaryColorWithOpacity = addOpacityToColor(colors.primaryColor, values.opacity);

const DeliveryMethodSwitch = props => {
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
        <View>
          <View>
            <RegularText 
              style={[
                styles.buttonText,
                props.buttonTextStyle, 
                {
                  color: props.disabled ? props.empty ? primaryColorWithOpacity : colors.thirdColor : props.empty ? colors.primaryColor : colors.thirdColor,
                }
              ]}
              numberOfLines={1}
            >{props.firstLine}</RegularText>
          </View>
          {props.secondLine && props.secondLine.length > 0 &&
            <View>
              <RegularText 
                style={[
                  styles.buttonText,
                  props.buttonTextStyle, 
                  {
                    color: props.disabled ? props.empty ? primaryColorWithOpacity : colors.thirdColor : props.empty ? colors.primaryColor : colors.thirdColor,
                  }
                ]}
                numberOfLines={1}
              >{props.secondLine}</RegularText>
            </View>
          }
        </View>
        :
        <View>
          <View>
            <BoldText 
              style={[
                styles.buttonText,
                props.buttonTextStyle, 
                {
                  color: props.disabled ? props.empty ? primaryColorWithOpacity : colors.thirdColor : props.empty ? colors.primaryColor : colors.thirdColor,
                }
              ]}
              numberOfLines={1}
            >{props.firstLine}</BoldText>
          </View>
          {props.secondLine && props.secondLine.length > 0 &&
            <View>
              <BoldText 
                style={[
                  styles.buttonText,
                  props.buttonTextStyle, 
                  {
                    color: props.disabled ? props.empty ? primaryColorWithOpacity : colors.thirdColor : props.empty ? colors.primaryColor : colors.thirdColor,
                  }
                ]}
                numberOfLines={1}
              >{props.secondLine}</BoldText>
            </View>
          }
        </View>
      }
    </CustomPressableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.primaryColor,
    backgroundColor: colors.primaryColor,
  },
  buttonText: {
    fontSize: values.regularTextSize,
    textAlign: 'center',
  },
});

export default DeliveryMethodSwitch;