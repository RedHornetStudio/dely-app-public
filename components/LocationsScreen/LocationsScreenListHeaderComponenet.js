import React from 'react';
import { StyleSheet, View } from 'react-native';

import colors from '../../constants/colors';
import values from '../../constants/values';
import HeaderButtons, { headerButtonsStyles, headerButtonsColor } from '../../components/HeaderButtons';
import ShoppingCartIconWithBadge from '../../components/ShoppingCartIconWithBadge';
import SearchBar from '../../components/SearchBar';
import ShopImage from '../../components/ShopImage';
import LoadingErrorIndicator from '../../components/LoadingErrorIndicator';
import FavoriteIconButton from '../../components/FavoriteIconButton';

const LocationsScreenListHeaderComponent = props => {

  return (
    <View onLayout={evt => props.listHeaderComponentHeightRef.current = evt.nativeEvent.layout.height}>
      <ShopImage title={props.shopTitle} imageUrl={props.shopImageUrl} />
      <View style={styles.contentStyle}>
        <HeaderButtons style={styles.headerButtonsContainer}>
          <FavoriteIconButton
            style={headerButtonsStyles.headerButtons}
            size={values.headerTextSize}
            color={headerButtonsColor}
            shopId={props.shopId}
          />
          <ShoppingCartIconWithBadge
            style={headerButtonsStyles.headerButtons}
            size={values.headerTextSize}
            color={headerButtonsColor}
            badgeColor={colors.secondaryColor}
            badgeNumberColor={colors.primaryColor}
          />
        </HeaderButtons>
        <SearchBar value={props.inputText} onChangeText={inputText => props.setInputText(inputText)} placeholder={props.appText.search} />
        <LoadingErrorIndicator
          noItems={props.loadingErrorIndicatorState.noItems}
          loading={props.loadingErrorIndicatorState.loading}
          loadingError={props.loadingErrorIndicatorState.loadingError}
          noItemsText={props.appText.noLocations}
          noItemsAfterSearch={props.filteredShopLocationsData.length === 0}
          noItemsAfterSearchText={props.appText.noLocationsMatchYourSearch}
          appText={props.appText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentStyle: {
    paddingHorizontal: values.windowHorizontalPadding,
  },
});

export default LocationsScreenListHeaderComponent;

