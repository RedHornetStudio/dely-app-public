import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

import values from '../../constants/values';
import colors from '../../constants/colors';
import SearchBar from '../../components/SearchBar';
import HeaderBigIcon from '../../components/HeaderBigIcon';
import NoItemsAfterSearch from '../NoItemsAfterSearch';

const LanguagesScreenListHeaderComponenet = props => {
  return (
    <View style={[styles.headerContainer]} onLayout={evt => props.listHeaderComponentHeightRef.current = evt.nativeEvent.layout.height}>
      <HeaderBigIcon><Fontisto name="world-o" size={values.headerBigIconSize} color={colors.primaryColor} /></HeaderBigIcon>
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