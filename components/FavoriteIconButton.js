import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

import CustomPressableOpacity from './CustomPressableOpacity';
import { favoriteShopsChanged } from '../features/favoriteShopsSlice';

const FavoriteIconButton = props => {

  const dispatch = useDispatch();

  // Getting favorite shop from global state and checking if shop is favorite
  const favoriteShopsString = useSelector(state => state.favoriteShopsSlice.favoriteShops);
  const favoriteShops = JSON.parse(favoriteShopsString);
  const isFavorite = favoriteShops.includes(props.shopId)

  const favoriteIconButtonHandler = useCallback(async () => {
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
  }, [props.shopId]);

  return (
    <CustomPressableOpacity style={props.style} onPress={favoriteIconButtonHandler}>
      {isFavorite ? <MaterialIcons name="favorite" size={props.size} color={props.color} /> : <MaterialIcons name="favorite-outline" size={props.size} color={props.color} /> }
    </CustomPressableOpacity>
  );
};

export default FavoriteIconButton;