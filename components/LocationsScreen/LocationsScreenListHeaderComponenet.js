import React from 'react';
import { StyleSheet, View } from 'react-native';

import values from '../../constants/values';
import HeaderButtons, { headerButtonsStyles } from '../../components/HeaderButtons';
import ShoppingCartIconWithBadge from '../../components/ShoppingCartIconWithBadge';
import SearchBar from '../../components/SearchBar';
import ShopImage from '../../components/ShopImage';
import LoadingErrorIndicator from '../../components/LoadingErrorIndicator';
import FavoriteIconButton from '../../components/FavoriteIconButton';
import PlusIconButton from '../PlusIconButton';
import RegularText from '../RegularText';

const LocationsScreenListHeaderComponent = props => {

  const onPressAddLocationHandler = () => {
    props.navigation.navigate('AddLocation');
  };

  return (
    <View style={[styles.headerContainer]} onLayout={evt => props.listHeaderComponentHeightRef.current = evt.nativeEvent.layout.height}>
      <ShopImage title={props.shopTitle} imageUrl={props.shopImageUrl} />
      <View style={styles.contentStyle}>
        {props.manageLocations &&
          <HeaderButtons style={styles.headerButtonsContainer}>
            <PlusIconButton style={headerButtonsStyles.headerButtons} onPress={onPressAddLocationHandler} />
          </HeaderButtons>
        }
        {props.fromShopsScreen &&
          <HeaderButtons style={styles.headerButtonsContainer}>
            <FavoriteIconButton style={headerButtonsStyles.headerButtons} shopId={props.shopId} />
            <ShoppingCartIconWithBadge style={headerButtonsStyles.headerButtons} navigation={props.navigation} />
          </HeaderButtons>
        }
        {props.manageOrders &&
          <RegularText style={styles.infoText}>{props.appText.chooseFromWichLocationsOrders}</RegularText>
        }
        {props.manageNotifications
          ? <RegularText style={styles.infoText}>{props.appText.chooseFromWichLocationsNotifications}</RegularText>
          : <SearchBar value={props.inputText} onChangeText={inputText => props.setInputText(inputText)} placeholder={props.appText.search} />
        }
        <LoadingErrorIndicator
          noItems={props.loadingErrorIndicatorState.noItems}
          loading={props.loadingErrorIndicatorState.loading}
          loadingError={props.loadingErrorIndicatorState.loadingError}
          noItemsText={props.appText.noLocations}
          noItemsAfterSearch={props.filteredShopLocationsData.length === 0}
          noItemsAfterSearchText={props.appText.noLocationsMatchYourSearch}
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
  infoText: {
    marginTop: values.topMargin,
  },
});

export default LocationsScreenListHeaderComponent;

