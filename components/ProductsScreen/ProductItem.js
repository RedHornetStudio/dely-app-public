import React, { memo, useLayoutEffect, useMemo } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

import colors from '../../constants/colors';
import values from '../../constants/values';
import RegularText from '../RegularText';
import BoldText from '../BoldText';
import CustomPressableOpacity from '../CustomPressableOpacity';
import BottomLine from '../BottomLine';

const ProductItem = props => {

  // ### Fading in
  const animatedOpacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
    }
  });
  useLayoutEffect(() => {
      animatedOpacity.value = 0;
      animatedOpacity.value = withTiming(1, { duration: values.animationDuration });
    }, [props.index, props.stringifiedData]);
  // ###################################

  // ### Handlers
  const onItemPressHandler = () => {
    props.navigation.navigate('ProductDetails', 
      {
        productId: props.productId,
        title: props.title,
        price: props.price,
        currency: props.currency,
        imageUrl: props.imageUrl,
        shopId: props.shopId,
        shopTitle: props.shopTitle,
        locationId: props.locationId,
        locationCity: props.locationCity,
        locationAddress: props.locationAddress,
        deliveryMethods: JSON.parse(props.deliveryMethods),
        deliveryPrice: props.deliveryPrice,
        opened: props.opened,
      }
    );
  }

  const onDeletePressHandler = () => {
    props.setDeleteModalVisibility(true);
    props.setItemToDeleteId(props.productId);
  };

  const onEditPressHandler = () => {
    props.navigation.navigate('AddProduct', {
      editingMode: true,
      id: props.productId,
      imageUrl: props.imageUrl,
      category: props.category,
      title: props.title,
      price: props.price,
      currency: props.currency,
    });
  };
  // ##################################

  const imageUrl = useMemo(() => {
    return props.imageUrl && props.imageUrl.length > 0 ? { uri: props.imageUrl } : require('../../assets/dely-product-placeholder.png');
  }, [props.imageUrl])

  return (
    <Animated.View style={[
        styles.productContainer,
        props.style,
        animatedStyle]}>
      <View />
      <CustomPressableOpacity disabled={props.disabled} onPress={onItemPressHandler}>
        <View style={styles.row}>
          <Image style={styles.image} source={imageUrl} resizeMode='cover' />
          <View style={styles.titleContainer}>
            <BoldText style={styles.titleText} numberOfLines={2}>{props.title}</BoldText>
            <RegularText>{`${props.currency} ${props.price}`}</RegularText>
          </View>
        </View>
      </CustomPressableOpacity>
      {props.manageProducts &&
        <View style={styles.buttonsContainer}>
          <CustomPressableOpacity style={styles.buttons} onPress={onDeletePressHandler}>
            <MaterialIcons name="delete" size={values.headerTextSize} color={colors.primaryColor} />
          </CustomPressableOpacity>
          <CustomPressableOpacity style={styles.editButton} onPress={onEditPressHandler}>
            <Feather name="edit-3" size={values.headerTextSize} color={colors.primaryColor} />
          </CustomPressableOpacity>
        </View>
      }
      <BottomLine style={styles.bottomLine} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    justifyContent: 'space-between',
    height: values.listItemHeight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 140,
    height: 70,
    marginRight: 5,
    borderRadius: values.borderRadius,
    backgroundColor: colors.imageBackgroundColor
  },
  titleContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },
  buttonsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    right: 0,
    bottom: 0,
    marginBottom: values.listItemHeight / 7,
  },
  editButton: {
    marginLeft: 10,
  },
});

export default memo(ProductItem);