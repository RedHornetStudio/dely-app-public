import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import colors from '../../constants/colors';
import values from '../../constants/values';
import ShopImage from '../ShopImage';
import SearchBar from '../SearchBar';
import HeaderButtons from '../HeaderButtons';
import CustomPressableOpacity from '../CustomPressableOpacity';
import LoadingErrorIndicator from '../LoadingErrorIndicator';

const OrdersScreenListHeaderComponent = props => {

  // ### Handlers
  const onFilterPressHandler =() => {
    props.setChangeFiltersAboveMessage(true);
  };

  return (
    <View style={styles.headerContainer} onLayout={evt => props.listHeaderComponentHeightRef.current = evt.nativeEvent.layout.height}>
      <ShopImage title={props.shopTitle} imageUrl={props.shopImageUrl} shopAddress={`${props.locationCity}, ${props.locationAddress}`} />
      <View style={styles.contentStyle}>
        <HeaderButtons style={styles.headerButtonsContainer}>
          <CustomPressableOpacity onPress={onFilterPressHandler}>
            <FontAwesome name="filter" size={values.headerTextSize} color={colors.primaryColor} />
          </CustomPressableOpacity>
        </HeaderButtons>
        <SearchBar
          value={props.inputText}
          onChangeText={inputText => props.setInputText(inputText)}
          placeholder={props.appText.searchByOrderNumber}
          keyboardType="number-pad"
          inputType="numbers"
        />
        <LoadingErrorIndicator
          noItems={props.loadingErrorIndicatorState.noItems}
          loading={props.loadingErrorIndicatorState.loading}
          loadingError={props.loadingErrorIndicatorState.loadingError}
          noItemsText={props.appText.noOrders}
          noItemsAfterSearch={props.filteredOrdersData.length === 0}
          noItemsAfterSearchText={props.appText.noOrdersMatchYourSearch}
          somethingWentWrongText={props.appText.somethingWentWrong}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentStyle: {
    paddingHorizontal: values.windowHorizontalPadding,
  },
})

export default OrdersScreenListHeaderComponent;