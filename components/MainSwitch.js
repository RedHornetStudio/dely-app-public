import React from 'react';
import { StyleSheet } from 'react-native';
import CustomSwitch from './CustomSwitch';

const MainSwitch = props => {
  return (
    <CustomSwitch
      {...props}
      value={props.switchValues ? props.switchValues[props.index] : props.switchValue}
      onValueChange={value => {
        if (props.multiple) {
          props.setSwitchValues(switchValues => {
            const newSwitchValues = [...switchValues]
            newSwitchValues.splice(props.index, 1, value);
            return newSwitchValues;
          });
        } else {
          props.setSwitchValues(switchValues => {
            const newSwitchValues = switchValues.map(() => false);
            newSwitchValues.splice(props.index, 1, value);
            return newSwitchValues;
          });
        }
      }}
    />
  );
};

const styles = StyleSheet.create({

});

export default MainSwitch;