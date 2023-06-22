import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import colors from '../../constants/colors';
import values from '../../constants/values';
import HeaderBigIcon from '../../components/HeaderBigIcon';
import HeaderButtons, { headerButtonsStyles } from '../../components/HeaderButtons';
import ShoppingCartIconWithBadge from '../../components/ShoppingCartIconWithBadge';
import SearchBar from '../../components/SearchBar';
import LoadingErrorIndicator from '../../components/LoadingErrorIndicator';

const ShopsScreenListHeaderComponent = props => {
  return (
    <View style={[styles.headerContainer]} onLayout={evt => props.listHeaderComponentHeightRef.current = evt.nativeEvent.layout.height}>
      {props.filterFavorites
        ? <HeaderBigIcon><MaterialIcons name="favorite" size={values.headerBigIconSize} color={colors.primaryColor} /></HeaderBigIcon>
        : <HeaderBigIcon><Fontisto name="shopping-store" size={values.headerBigIconSize} color={colors.primaryColor} /></HeaderBigIcon>
      }
      <HeaderButtons style={styles.headerButtonsContainer}>
        <ShoppingCartIconWithBadge style={headerButtonsStyles.headerButtons} navigation={props.navigation} />
      </HeaderButtons>
      <SearchBar value={props.inputText} onChangeText={inputText => props.setInputText(inputText)} placeholder={props.appText.search} />
      <LoadingErrorIndicator
        loading={props.loadingErrorIndicatorState.loading}
        loadingError={props.loadingErrorIndicatorState.loadingError}
        noItems={props.loadingErrorIndicatorState.noItems}
        noItemsText={props.filterFavorites ? props.appText.noFavorites : props.appText.noShops}
        noItemsAfterSearch={props.filteredShopsData.length === 0}
        noItemsAfterSearchText={props.appText.noCafesMatchYourSearch}
        somethingWentWrongText={props.appText.somethingWentWrong}
      />
    </View>
  );
}

const styles = StyleSheet.create({

});

export default ShopsScreenListHeaderComponent;