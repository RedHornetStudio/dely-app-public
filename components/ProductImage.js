import React, { useMemo } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import colors from '../constants/colors';
import values from '../constants/values';
import { addOpacityToColor } from '../shared/sharedFunctions';
import CustomPressableOpacity from './CustomPressableOpacity';

const backgroundColor = addOpacityToColor(colors.thirdColor, values.titleOnImageOpacity);

const ProductImage = props => {

  const imageUrl = useMemo(() => {
    return props.imageUrl && props.imageUrl.length > 0 ? { uri: props.imageUrl } : require('../assets/dely-product-placeholder.png');
  }, [props.imageUrl]);

  return (
    <View style={styles.productImageContainer}>
      <Image style={styles.image} source={imageUrl} />
      {props.showAddPhotoIcon
        ? <View style={styles.titleContainer}>
          {props.showAddPhotoIcon
            ? <CustomPressableOpacity style={styles.iconContainer} onPress={() => props.addPhotoIconPressHandler()}>
              <MaterialIcons name="add-a-photo" size={values.headerTextSize * 1.2} color={colors.primaryColor} />
            </CustomPressableOpacity>
            : null
          }
        </View>
        : null
      }
    </View>
  );
};

const styles = StyleSheet.create({
  productImageContainer: {
    height: values.headerBigIconSize + values.topMargin,
    overflow: 'hidden',
    backgroundColor: colors.imageBackgroundColor
  },
  image: {
    width: '100%',
    height: '100%'
  },
  titleContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 10,
    backgroundColor: backgroundColor,
  },
  iconContainer: {
    marginLeft: 10,
  },
});

export default ProductImage;