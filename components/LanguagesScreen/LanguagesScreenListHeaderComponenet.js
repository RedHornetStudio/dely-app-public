import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

import SearchBar from '../../components/SearchBar';
import HeaderBigIcon, { headerBigIconSize, headerBigIconColor } from '../../components/HeaderBigIcon';
import NoItemsAfterSearch from '../NoItemsAfterSearch';

const LanguagesScreenListHeaderComponenet = props => {
  return (
    <View onLayout={evt => props.listHeaderComponentHeightRef.current = evt.nativeEvent.layout.height}>
      <HeaderBigIcon><Fontisto name="world-o" size={headerBigIconSize} color={headerBigIconColor} /></HeaderBigIcon>
      <SearchBar value={props.inputText} onChangeText={inputText => props.setInputText(inputText)} placeholder={props.appText.search} />
      {props.noItemsAfterSearch && 
        <NoItemsAfterSearch text={props.appText.noLanguagesMatchYourSearch} />
      }
    </View>
  );
};

const styles = StyleSheet.create({

});

export default LanguagesScreenListHeaderComponenet;