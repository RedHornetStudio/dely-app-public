import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

import values from '../constants/values';
import colors from '../constants/colors';
import CustomPressableOpacity from './CustomPressableOpacity';
import { favoriteShopsChanged } from '../features/favoriteShopsSlice';

const FavoriteIconButton = props => {

  const dispatch = useDispatch();

  // Getting favorite shop from global state and checking if shop is favorite
  const favoriteShopsString = useSelector(state => state.favoriteShopsSlice.favoriteShops);
  const favoriteShops = useMemo(() => {
    return JSON.parse(favoriteShopsString);
  }, [favoriteShopsString]);
  const isFavorite = useMemo(() => {
    return favoriteShops.includes(props.shopId);
  }, [favoriteShops]);

  const favoriteIconButtonHandler = async () => {
    try {
      const favoriteShopsString = await AsyncStorage.getItem('@favoriteShops');
      const favoriteShops = favoriteShopsString ? JSON.parse(favoriteShopsString) : []; 
      if (favoriteShops.includes(props.shopId)) {
        const newFavoriteShopsString = JSON.stringify(favoriteShops.filter(favoriteShop => favoriteShop !== props.shopId));
        await AsyncStorage.setItem('@favoriteShops', newFavoriteShopsString);
        dispatch(favoriteShopsChanged(newFavoriteShopsString));
      } else {
        favoriteShops.push(props.shopId);
        const newFavoriteShopsString = JSON.stringify(favoriteShops);
        await AsyncStorage.setItem('@favoriteShops', newFavoriteShopsString);
        dispatch(favoriteShopsChanged(newFavoriteShopsString));
      }
    } catch (error) {
      console.log(`Error while saving favorite shops to favorites: ${error}`);
    }
  };

  return (
    <CustomPressableOpacity style={props.style} onPress={favoriteIconButtonHandler}>
      {isFavorite ? <MaterialIcons name="favorite" size={values.headerTextSize} color={colors.primaryColor} /> : <MaterialIcons name="favorite-outline" size={values.headerTextSize} color={colors.primaryColor} /> }
    </CustomPressableOpacity>
  );
};

export default FavoriteIconButton;