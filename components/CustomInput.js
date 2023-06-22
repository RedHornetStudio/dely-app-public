import React, { forwardRef, useMemo } from 'react';
import { StyleSheet, TextInput } from 'react-native';

const CustomInput = forwardRef((props, ref) => {

  const result = useMemo(() => {
    if(props.inputType !== undefined) {
      if(!props.onChangeText) {
        throw new Error('inputType must be used in combination with onChangeText');
      } else if(typeof props.inputType !== 'string') {
        throw new Error('inpuType must be a string');
      } else if(props.inputType === '') {
        throw new Error('inputType must be a non empty string');
      } else if(props.inputType !== 'numbers' &&
          props.inputType !== 'phone-number' &&
          props.inputType !== 'decimal' && 
          props.inputType !== 'upercase-letters' && 
          props.inputType !== 'lowercase-letters' && 
          props.inputType !== 'letters') {
            throw new Error(`no such inputType: ${props.inputType}`);
      }
    }
  }, [props.inputType, props.onChangeText]);

  const onChageTextHandler = (text) => {
    if(!props.onChangeText) return;
    switch (props.inputType) {
      case 'numbers':
        text = text.replace(/[^0-9]/g, '');
        break;
      case 'phone-number':
        text = text.replace(/[^0-9+]/g, '');
        break;
      case 'decimal':
        text = text.replace(/[^0-9.]/g, '');
        break;
      case 'upercase-letters':
        text = text.replace(/[^A-Z]/g, '');
        break;
      case 'lowercase-letters':
        text = text.replace(/[^a-z]/g, '');
        break;
      case 'letters':
        text = text.replace(/[^A-z]/g, '');
        break;
    }
    props.onChangeText(text);
  };

  return (
    <TextInput {...props} ref={ref} style={[styles.textInput, props.style]} onChangeText={onChageTextHandler} />
  );
});

const styles = StyleSheet.create({
  textInput: {

  }
});

export default CustomInput;