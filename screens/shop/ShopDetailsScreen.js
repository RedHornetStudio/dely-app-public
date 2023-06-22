import React, { useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSelector } from 'react-redux';

import colors from '../../constants/colors';
import values from '../../constants/values';
import RegularText from '../../components/RegularText';
import BoldText from '../../components/BoldText';
import CustomImageBackground from '../../components/CustomImageBackground';
import CustomSafeAreaScrollViewWindow from '../../components/CustomSafeAreaScrollViewWindow';
import ShopImage from '../../components/ShopImage';
import BottomLine from '../../components/BottomLine';
import getLocalizedText from '../../constants/getLocalizedText';

const ShopDetailsScreen = props => {
  console.log('----Shop Details Screen rerendered----');

  // ### Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // ### Formating working hours
  const formatedWorkingHours = useMemo(() => {
    const oldworkingHours = JSON.parse(props.route.params.workingHours);
    const newWorkingHours = [];
    newWorkingHours.push({ day: 'monday', time: oldworkingHours['1'] });
    newWorkingHours.push({ day: 'tuesday', time: oldworkingHours['2'] });
    newWorkingHours.push({ day: 'wednesday', time: oldworkingHours['3'] });
    newWorkingHours.push({ day: 'thursday', time: oldworkingHours['4'] });
    newWorkingHours.push({ day: 'friday', time: oldworkingHours['5'] });
    newWorkingHours.push({ day: 'saturday', time: oldworkingHours['6'] });
    newWorkingHours.push({ day: 'sunday', time: oldworkingHours['0'] });
    return newWorkingHours;
  }, [props.route.params.workingHours]);

  // ### Formated delivery methods
  const formatedDeliveryMethods = useMemo(() => {
    let deliveryMethods = '';
    let deliveryMethodCount = 0;
    for (const [key, value] of Object.entries(props.route.params.deliveryMethods)) {
      if (value === 1) deliveryMethodCount++;
    }
    let  i = 1;
    for (const [key, value] of Object.entries(props.route.params.deliveryMethods)) {
      if (value === 1) {
        deliveryMethods += appText[key].toLowerCase();
        if (key === 'delivery' && props.route.params.deliveryPrice !== '0.00') deliveryMethods += ` (${props.route.params.currency} ${props.route.params.deliveryPrice})`;
        if (i < deliveryMethodCount) deliveryMethods += ', ';
        i++;
      }
    }
    return deliveryMethods;
  }, [props.route.params.deliveryMethods]);

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
      <CustomSafeAreaScrollViewWindow
        contentContainerStyle={styles.contentContainerStyle}
      >
        <ShopImage
          title={props.route.params.shopTitle}
          imageUrl={props.route.params.imageUrl}
          shopAddress={`${props.route.params.locationCity}, ${props.route.params.locationAddress}`}
        />
        <View style={styles.contentStyle}>
          {props.route.params.shopDescription.length > 0 &&
            <View style={styles.itemContainer}>
              <Text><BoldText>{`${appText.description}: `}</BoldText><RegularText>{props.route.params.shopDescription}</RegularText></Text>
              <BottomLine style={styles.line} />
            </View>
          }
          <View style={styles.itemContainer}>
            <Text><BoldText>{`${appText.address}: `}</BoldText><RegularText>{`${props.route.params.locationCity}, ${props.route.params.locationAddress}`}</RegularText></Text>
            <BottomLine style={styles.line} />
          </View>
          <View style={styles.itemContainer}>
            <BoldText>{`${appText.workingHours}: `}</BoldText>
            <View style={styles.listContainer}>
              {formatedWorkingHours.map(workingHours => {
                return (
                  <Text key={workingHours.day} style={styles.listItem}><RegularText>{`${appText[workingHours.day]}: `}</RegularText><RegularText>{workingHours.time === 'closed' ? appText.closed.toLowerCase() : workingHours.time}</RegularText></Text>
                );
              })}
            </View>
            <BottomLine style={styles.line} />
          </View>
          <View style={styles.itemContainer}>
            <Text><BoldText>{`${appText.deliveryMethods}: `}</BoldText><RegularText>{formatedDeliveryMethods}</RegularText></Text>
            <BottomLine style={styles.line} />
          </View>
          <View style={styles.itemContainer}>
            <Text><BoldText>{`${appText.phoneNumber}: `}</BoldText><RegularText>{props.route.params.phoneNumber}</RegularText></Text>
            <BottomLine style={styles.line} />
          </View>
        </View>
      </CustomSafeAreaScrollViewWindow>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentContainerStyle: {
    paddingBottom: values.topMargin,
  },
  contentStyle: {
    paddingHorizontal: values.windowHorizontalPadding,
  },
  itemContainer: {
    marginTop: values.topMargin,
  },
  line: {
    marginTop: values.topMargin,
  },
  listContainer: {
    marginTop: 5,
    marginLeft: 20,
  },
  listItem: {
    marginTop: 2,
  },
});

export default ShopDetailsScreen;