import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import colors from '../constants/colors';
import values from '../constants/values';
import { addOpacityToColor } from '../shared/sharedFunctions';
import CustomInput from './CustomInput';

const placeholderTextColor = addOpacityToColor(colors.primaryColor, values.textPlaceholderOpacity);

const SearchBar = props => {
  return (
    <View style={[styles.searchBarContainer, props.style]}>
      <Ionicons name="search-sharp" size={values.headerTextSize / 1.5} color={colors.primaryColor} />
      <CustomInput
        {...props}
        style={styles.textInput}
        selectionColor={colors.secondaryColor}
        placeholderTextColor={placeholderTextColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: values.topMargin,
    paddingHorizontal: 5,
    height: values.searchBarHeight,
    backgroundColor: colors.thirdColor,
    borderRadius: values.borderRadius,
  },
  textInput: {
    flex: 1,
    padding: 0,
    marginStart: 10,
    color: colors.primaryColor,
    fontFamily: 'Montserrat-Regular',
    fontSize: values.regularTextSize,
  }
});

export default SearchBar;