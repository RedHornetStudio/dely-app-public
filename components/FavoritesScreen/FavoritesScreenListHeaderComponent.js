import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import colors from '../../constants/colors';
import values from '../../constants/values';
import HeaderBigIcon, { headerBigIconSize, headerBigIconColor } from '../../components/HeaderBigIcon';
import HeaderButtons, { headerButtonsStyles, headerButtonsColor } from '../../components/HeaderButtons';
import ShoppingCartIconWithBadge from '../../components/ShoppingCartIconWithBadge';
import CustomPressableOpacity from '../../components/CustomPressableOpacity';
import SearchBar from '../../components/SearchBar';
import LoadingErrorIndicator from '../../components/LoadingErrorIndicator';

const FavoritesScreenListHeaderComponent = props => {
  return ( 
    <View onLayout={evt => props.listHeaderComponentHeightRef.current = evt.nativeEvent.layout.height}>
      <HeaderBigIcon><MaterialIcons name="favorite" size={headerBigIconSize} color={headerBigIconColor} /></HeaderBigIcon>
      <HeaderButtons style={styles.headerButtonsContainer}>
        <CustomPressableOpacity style={headerButtonsStyles.headerButtons}>
          <ShoppingCartIconWithBadge
            badgeNumber={2}
            size={values.headerTextSize}
            color={headerButtonsColor}
            badgeColor={colors.secondaryColor}
            badgeNumberColor={colors.primaryColor}
          />
        </CustomPressableOpacity>
      </HeaderButtons>
      <SearchBar value={props.inputText} onChangeText={inputText => props.setInputText(inputText)} placeholder={props.appText.search} />
      <LoadingErrorIndicator
        loading={props.loadingErrorIndicatorState.loading}
        loadingError={props.loadingErrorIndicatorState.loadingError}
        noItems={props.loadingErrorIndicatorState.noItems}
        noItemsText={ props.appText.noFavorites}
        noItemsAfterSearch={props.filteredShopsData.length === 0}
        noItemsAfterSearchText={props.appText.noCafesMatchYourSearch}
        appText={props.appText}
      />
    </View>
  );
};

const styles = StyleSheet.create({

});

export default FavoritesScreenListHeaderComponent;