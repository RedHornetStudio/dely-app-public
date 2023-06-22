import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

import values from '../../constants/values';
import colors from '../../constants/colors';
import RegularText from '../../components/RegularText'
import SearchBar from '../../components/SearchBar';
import HeaderBigIcon from '../../components/HeaderBigIcon';
import NoItemsAfterSearch from '../NoItemsAfterSearch';

const CountriesScreenListHeaderComponent = props => {
  return (
    <View style={[styles.headerContainer]} onLayout={evt => props.listHeaderComponentHeightRef.current = evt.nativeEvent.layout.height}>
      <HeaderBigIcon><Fontisto name="world-o" size={values.headerBigIconSize} color={colors.primaryColor} /></HeaderBigIcon>
      {props.settingsPicker 
        ? null
        : <RegularText style={styles.chooseCountry} numberOfLines={1}>{props.appText.chooseCountry}</RegularText>
      }
      <SearchBar value={props.inputText} onChangeText={inputText => props.setInputText(inputText)} placeholder={props.appText.search} />
      {props.noItemsAfterSearch && 
        <NoItemsAfterSearch text={props.appText.noCountriesMatchYourSearch} />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  chooseCountry: {
    marginTop: values.topMargin,
    fontSize: values.headerTextSize,
    textAlign: 'center',
  },
});

export default CountriesScreenListHeaderComponent;