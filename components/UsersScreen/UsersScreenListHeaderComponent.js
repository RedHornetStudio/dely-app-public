import React from 'react';
import { StyleSheet, View } from 'react-native';

import values from '../../constants/values';
import HeaderButtons, { headerButtonsStyles } from '../../components/HeaderButtons';
import ShopImage from '../../components/ShopImage';
import LoadingErrorIndicator from '../../components/LoadingErrorIndicator';
import PlusIconButton from '../PlusIconButton';
import SearchBar from '../SearchBar';
import RegularText from '../RegularText';

const UsersScreenListHeaderComponent = props => {

  const onPressAddUserHandler = () => {
    props.navigation.navigate('AddUser');
  };

  return (
    <View style={[styles.headerContainer]} onLayout={evt => props.listHeaderComponentHeightRef.current = evt.nativeEvent.layout.height}>
      <ShopImage title={props.shopTitle} imageUrl={props.imageUrl} />
      <View style={styles.contentStyle}>
        <RegularText style={styles.infoText}>{props.appText.createUserPermissionOrderManaging}</RegularText>
        <HeaderButtons style={styles.headerButtonsContainer}>
          <PlusIconButton style={headerButtonsStyles.headerButtons} onPress={onPressAddUserHandler} />
        </HeaderButtons>
        <SearchBar value={props.inputText} onChangeText={inputText => props.setInputText(inputText)} placeholder={props.appText.search} autoCapitalize="none" />
        <LoadingErrorIndicator
          noItems={props.loadingErrorIndicatorState.noItems}
          loading={props.loadingErrorIndicatorState.loading}
          loadingError={props.loadingErrorIndicatorState.loadingError}
          noItemsText={props.appText.noUsers}
          noItemsAfterSearch={props.filteredUsersData.length === 0}
          noItemsAfterSearchText={props.appText.noUsersMatchYourSearch}
          somethingWentWrongText={props.appText.somethingWentWrong}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentStyle: {
    paddingHorizontal: values.windowHorizontalPadding,
  },
  infoText: {
    marginTop: values.topMargin,
  },
});

export default UsersScreenListHeaderComponent;