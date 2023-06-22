import React, { useMemo } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import colors from '../constants/colors';
import BoldText from './BoldText';
import RegularText from './RegularText';
import values from '../constants/values';
import { addOpacityToColor } from '../shared/sharedFunctions';
import CustomPressableOpacity from './CustomPressableOpacity';

const backgroundColor = addOpacityToColor(colors.thirdColor, values.titleOnImageOpacity);

const ShopImage = props => {

  const imageUrl = useMemo(() => {
    return props.imageUrl && props.imageUrl.length > 0 ? { uri: props.imageUrl } : require('../assets/dely-placeholder.png');
  }, [props.imageUrl]);

  return (
    <View style={styles.shopImageContainer}>
      <Image style={styles.image} source={imageUrl} />
      {props.title || props.shopAddress || props.showAddPhoteIcon
        ? <View style={styles.titleContainer}>
          <View style={styles.titleAndAddressContainer}>
            {props.title 
              ? <BoldText style={styles.titleText} numberOfLines={1}>{props.title}</BoldText>
              : null
            }
            {props.shopAddress
              ? <View style={styles.addressContainer}>
                <Entypo name="location-pin" size={values.regularTextSize} color={colors.primaryColor} />
                <RegularText style={styles.addressText} numberOfLines={1}>{props.shopAddress}</RegularText>
              </View>
              : null
            }
          </View>
          {props.showAddPhoteIcon
            ? <CustomPressableOpacity style={styles.iconContainer} onPress={() => props.addPhoteIconPressHandler()}>
              <MaterialIcons name="add-a-photo" size={values.headerTextSize * 1.2} color={colors.primaryColor} />
            </CustomPressableOpacity>
            : null
          }
        </View>
        : null
      }
      {props.opened === false &&
        <View style={styles.shopClosedContainer}>
          <BoldText style={styles.shopClosedText}>{props.closedText}</BoldText>
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  shopImageContainer: {
    height: values.headerBigIconSize + values.topMargin,
    overflow: 'hidden',
    backgroundColor: colors.imageBackgroundColor
  },
  image: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 10,
    backgroundColor: backgroundColor,
  },
  titleAndAddressContainer: {
    flex: 1,
  },
  iconContainer: {
    marginLeft: 10,
  },
  titleText: {
    fontSize: values.headerTextSize,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  addressText: {
    flex: 1,
    fontSize: values.regularTextSize / 1.5,
  },
  shopClosedContainer: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: backgroundColor,
  },
  shopClosedText: {
    fontSize: values.regularTextSize * 2,
    textAlign: 'center',
    paddingVertical: 10,
    backgroundColor: colors.secondaryColor,
  },
});

export default ShopImage;