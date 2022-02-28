import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import colors from '../constants/colors';
import values from '../constants/values';

const primaryColorSplitedArray = colors.primaryColor.split(' ');
const primaryColorWithOpacity = `${primaryColorSplitedArray[0]} ${primaryColorSplitedArray[1]} ${primaryColorSplitedArray[2]} 0.7)`;

const SearchBar = props => {
  return (
    <View style={styles.searchBarContainer}>
      <Ionicons name="search-sharp" size={values.headerTextSize / 1.5} color={colors.primaryColor} />
      <TextInput
        {...props}
        style={styles.textInput}
        selectionColor={colors.secondaryColor}
        placeholder={props.placeholder}
        placeholderTextColor={primaryColorWithOpacity} />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 5,
    backgroundColor: colors.thirdColor,
    borderRadius: 10,
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