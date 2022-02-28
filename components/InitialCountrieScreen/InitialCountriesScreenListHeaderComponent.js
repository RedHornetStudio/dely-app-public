import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

import values from '../../constants/values';
import RegularText from '../../components/RegularText'
import SearchBar from '../../components/SearchBar';
import HeaderBigIcon, { headerBigIconSize, headerBigIconColor } from '../../components/HeaderBigIcon';
import NoItemsAfterSearch from '../NoItemsAfterSearch';

const InitialCountriesScreenListHeaderComponent = props => {
  return (
    <View onLayout={evt => props.listHeaderComponentHeightRef.current = evt.nativeEvent.layout.height}>
      <HeaderBigIcon><Fontisto name="world-o" size={headerBigIconSize} color={headerBigIconColor} /></HeaderBigIcon>
      <RegularText style={styles.chooseCountry}>{props.appText.chooseCountry}</RegularText>
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
  },
});

export default InitialCountriesScreenListHeaderComponent;