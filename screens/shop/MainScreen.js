import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Fontisto } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

import colors from '../../constants/colors';
import getLocalizedText from '../../constants/getLocalizedText';
import RegularText from '../../components/RegularText';
import BoldText from '../../components/BoldText';
import CustomImageBackground from '../../components/CustomImageBackground';
import HeaderBigIcon, { headerBigIconSize, headerBigIconColor } from '../../components/HeaderBigIcon';
import HeaderButtons, { headerButtonsStyles, headerButtonsColor } from '../../components/HeaderButtons';
import ShoppingCartIconWithBadge from '../../components/ShoppingCartIconWithBadge';
import CustomPressableOpacity from '../../components/CustomPressableOpacity';
import CustomSafeAreaViewWindow from '../../components/CustomSafeAreaViewWindow';
import values from '../../constants/values';

const MainScreen = props => {
  console.log('----Main Screen rerendered----')
  
  // Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = getLocalizedText(appLanguage);

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor="rgba(0, 0, 0, 0.5)" />
      <CustomSafeAreaViewWindow
        windowStyle={styles.customSafeAreaViewWindow}
      >
        <HeaderBigIcon><Fontisto name="shopping-bag-1" size={headerBigIconSize} color={headerBigIconColor} /></HeaderBigIcon>
        <HeaderButtons style={styles.headerButtonsContainer}>
          <ShoppingCartIconWithBadge
            style={headerButtonsStyles.headerButtons}
            size={values.headerTextSize}
            color={headerButtonsColor}
            badgeColor={colors.secondaryColor}
            badgeNumberColor={colors.primaryColor}
          />
        </HeaderButtons>
        <View style={styles.list}>
          <CustomPressableOpacity style={styles.listItem} onPress={() => props.navigation.navigate('Shops')}>
            <BoldText style={styles.listItemMainText}>{appText.cafes}</BoldText>
            <RegularText style={styles.listItemSecondaryText}>{appText.belowCafesText}</RegularText>
          </CustomPressableOpacity>
          <CustomPressableOpacity style={styles.listItem} onPress={() => props.navigation.navigate('Favorites')}>
            <BoldText style={styles.listItemMainText}>{appText.favorites}</BoldText>
            <RegularText style={styles.listItemSecondaryText}>{appText.belowFavoritesText}</RegularText>
          </CustomPressableOpacity>
        </View>
      </CustomSafeAreaViewWindow>
      <SafeAreaView style={styles.menuSafeAreaContainer}>
        <CustomPressableOpacity style={styles.menu} onPress={() => props.navigation.navigate('Settings')}>
          <Entypo name="dots-three-horizontal" size={values.headerTextSize} color={colors.primaryColor} />
        </CustomPressableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  // ----Screen----
  screen: {
    flex: 1,
    backgroundColor: 'black',
  },
  customSafeAreaViewWindow: {
    paddingHorizontal: values.windowHorizontalPadding,
  },
  // ----List----
  listItem: {
    marginTop: values.topMargin,
  },
  listItemMainText: {
    fontSize: values.headerTextSize,
  },
  // ----Menu----
  menuSafeAreaContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  menu: {
    marginBottom: 10,
    marginRight: values.windowHorizontalPadding,
  },
});

export default MainScreen;