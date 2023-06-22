import React from 'react';
import { StyleSheet, View } from 'react-native';

import values from '../../constants/values';
import HeaderButtons, { headerButtonsStyles } from '../../components/HeaderButtons';
import ShoppingCartIconWithBadge from '../../components/ShoppingCartIconWithBadge';
import ShopImage from '../../components/ShopImage';
import LoadingErrorIndicator from '../../components/LoadingErrorIndicator';
import FavoriteIconButton from '../../components/FavoriteIconButton';
import InfoIconButton from '../InfoIconButton';
import PlusIconButton from '../PlusIconButton';

const ProductsScreenListHeaderComponent = props => {

  const onPressAddProductHandler = () => {
    props.navigation.navigate('AddProduct', { currency: props.currency });
  };

  return (
    <View style={[styles.headerContainer]} onLayout={evt => props.listHeaderComponentHeightRef.current = evt.nativeEvent.layout.height}>
      {props.manageProducts
        ? <ShopImage
          title={props.shopTitle}
          imageUrl={props.imageUrl}
        />
        : <ShopImage
          title={props.shopTitle}
          imageUrl={props.imageUrl}
          shopAddress={`${props.locationCity}, ${props.locationAddress}`}
          opened={props.opened}
          closedText={props.appText.closed}
        />
      }
      <View style={styles.contentStyle}>
        {props.manageProducts
          ? <HeaderButtons style={styles.headerButtonsContainer}>
            <PlusIconButton style={headerButtonsStyles.headerButtons} onPress={onPressAddProductHandler} />
          </HeaderButtons>
          : <HeaderButtons style={styles.headerButtonsContainer}>
            <InfoIconButton
              style={headerButtonsStyles.headerButtons}
              shopId={props.shopId}
              locationId={props.locationId}
              shopTitle={props.shopTitle}
              shopDescription={props.shopDescription}
              imageUrl={props.imageUrl}
              locationCity={props.locationCity}
              locationAddress={props.locationAddress}
              deliveryMethods={props.deliveryMethods}
              deliveryPrice={props.deliveryPrice}
              phoneNumber={props.phoneNumber}
              workingHours={props.workingHours}
              navigation={props.navigation}
              currency={props.currency}
            />
            <FavoriteIconButton style={headerButtonsStyles.headerButtons} shopId={props.shopId} />
            <ShoppingCartIconWithBadge style={headerButtonsStyles.headerButtons} navigation={props.navigation} />
          </HeaderButtons>
        }
        <LoadingErrorIndicator
          noItems={props.loadingErrorIndicatorState.noItems}
          loading={props.loadingErrorIndicatorState.loading}
          loadingError={props.loadingErrorIndicatorState.loadingError}
          noItemsText={props.appText.noProducts}
          somethingWentWrongText={props.appText.somethingWentWrong}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingBottom: values.topMargin,
  },
  contentStyle: {
    paddingHorizontal: values.windowHorizontalPadding,
  },
});

export default ProductsScreenListHeaderComponent;