import React from 'react';
import { StyleSheet, View } from 'react-native';

import colors from '../../constants/colors';
import values from '../../constants/values';
import HeaderButtons, { headerButtonsStyles, headerButtonsColor } from '../../components/HeaderButtons';
import ShoppingCartIconWithBadge from '../../components/ShoppingCartIconWithBadge';
import ShopImage from '../../components/ShopImage';
import LoadingErrorIndicator from '../../components/LoadingErrorIndicator';
import FavoriteIconButton from '../../components/FavoriteIconButton';
import InfoIconButton from '../InfoIconButton';

const ProductsScreenListHeaderComponent = props => {
  return (
    <View style={styles.listHeaderComponent} onLayout={evt => props.listHeaderComponentHeightRef.current = evt.nativeEvent.layout.height}>
      <ShopImage
        title={props.shopTitle}
        imageUrl={props.shopImageUrl}
        shopAddress={`${props.locationCity}, ${props.locationAddress}`}
      />
      <View style={styles.contentStyle}>
        <HeaderButtons style={styles.headerButtonsContainer}>
          <InfoIconButton
            style={headerButtonsStyles.headerButtons}
            size={values.headerTextSize}
            color={headerButtonsColor}
            shopId={props.shopId}
            navigation={props.navigation}
          />
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
        <LoadingErrorIndicator
          noItems={props.loadingErrorIndicatorState.noItems}
          loading={props.loadingErrorIndicatorState.loading}
          loadingError={props.loadingErrorIndicatorState.loadingError}
          noItemsText={props.appText.noProducts}
          appText={props.appText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listHeaderComponent: {
    paddingBottom: values.topMargin,
  },
  contentStyle: {
    paddingHorizontal: values.windowHorizontalPadding,
  },
});

export default ProductsScreenListHeaderComponent;