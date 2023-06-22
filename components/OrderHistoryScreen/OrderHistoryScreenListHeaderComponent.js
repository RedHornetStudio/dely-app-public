import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import colors from '../../constants/colors';
import values from '../../constants/values';
import HeaderBigIcon from '../../components/HeaderBigIcon';
import HeaderButtons, { headerButtonsStyles } from '../../components/HeaderButtons';
import ShoppingCartIconWithBadge from '../../components/ShoppingCartIconWithBadge';
import SearchBar from '../../components/SearchBar';
import LoadingErrorIndicator from '../../components/LoadingErrorIndicator';

const OrderHistoryScreenListHeaderComponent = props => {
  return (
    <View style={[styles.headerContainer]} onLayout={evt => props.listHeaderComponentHeightRef.current = evt.nativeEvent.layout.height}>
      <HeaderBigIcon><FontAwesome name="history" size={values.headerBigIconSize} color={colors.primaryColor} /></HeaderBigIcon>
      <HeaderButtons style={styles.headerButtonsContainer}>
        <ShoppingCartIconWithBadge style={headerButtonsStyles.headerButtons} navigation={props.navigation} />
      </HeaderButtons>
      <SearchBar value={props.inputText} onChangeText={inputText => props.setInputText(inputText)} placeholder={props.appText.search} keyboardType="number-pad" inputType="numbers" />
      <LoadingErrorIndicator
        loading={props.loadingErrorIndicatorState.loading}
        loadingError={props.loadingErrorIndicatorState.loadingError}
        noItems={props.loadingErrorIndicatorState.noItems}
        noItemsText={props.appText.noOrdersInHistory}
        noItemsAfterSearch={props.filteredOrdersData.length === 0}
        noItemsAfterSearchText={props.appText.noOrdersInHistoryMatchYourSearch}
        somethingWentWrongText={props.appText.somethingWentWrong}
      />
    </View>
  );
}

const styles = StyleSheet.create({

});

export default OrderHistoryScreenListHeaderComponent;