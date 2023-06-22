import { createSlice } from "@reduxjs/toolkit";

const shoppingCartSlice = createSlice({
  name: 'shoppingCart',
  initialState: {
    shoppingCart: '{ "shopDetails": null, "items": [] }',
  },
  reducers: {
    itemAddedToShoppingCart: (state, action) => {
      const newShoppingCartParsed = JSON.parse(state.shoppingCart);
      let newShoppingCartItem = action.payload;
      if (!newShoppingCartParsed.shopDetails) {
        newShoppingCartParsed.shopDetails = {
          locationId: newShoppingCartItem.locationId,
          locationCity: newShoppingCartItem.locationCity,
          locationAddress: newShoppingCartItem.locationAddress,
          shopId: newShoppingCartItem.shopId,
          shopTitle: newShoppingCartItem.shopTitle,
          deliveryMethods: newShoppingCartItem.deliveryMethods,
          deliveryPrice: newShoppingCartItem.deliveryPrice,
          currency: newShoppingCartItem.currency,
          eMail: newShoppingCartItem.eMail
        };
        newShoppingCartParsed.items.push({
          id: newShoppingCartItem.id,
          productId: newShoppingCartItem.productId,
          title: newShoppingCartItem.title,
          price: newShoppingCartItem.price,
          noteForKitchen: newShoppingCartItem.noteForKitchen,
          count: newShoppingCartItem.count,
          options: newShoppingCartItem.options
        });
        state.shoppingCart = JSON.stringify(newShoppingCartParsed);
      } else {
        newShoppingCartItem = {
          id: newShoppingCartItem.id,
          productId: newShoppingCartItem.productId,
          title: newShoppingCartItem.title,
          price: newShoppingCartItem.price,
          noteForKitchen: newShoppingCartItem.noteForKitchen,
          count: newShoppingCartItem.count,
          options: newShoppingCartItem.options
        }
        let alreadyExists = false;
        let alreadyExistsIndex;
        newShoppingCartParsed.items.forEach((elem, index) => {
          if (elem.productId === newShoppingCartItem.productId) {
            const oldElemForComparision = {...elem};
            const newElemForComparision = {...newShoppingCartItem}
            oldElemForComparision.count = 0;
            oldElemForComparision.id = 0;
            newElemForComparision.count = 0;
            newElemForComparision.id = 0;
            if (JSON.stringify(oldElemForComparision) === JSON.stringify(newElemForComparision)) {
              alreadyExists = true;
              alreadyExistsIndex = index;
              newShoppingCartItem.count = elem.count + newShoppingCartItem.count;
              newShoppingCartItem.id = elem.id;
            }
          }
        });
        if (alreadyExists) {
          newShoppingCartParsed.items[alreadyExistsIndex] = newShoppingCartItem;
        } else {
          newShoppingCartParsed.items.push(newShoppingCartItem);
        }
        state.shoppingCart = JSON.stringify(newShoppingCartParsed);
      }
    },
    itemsDeletedFromShoppingCart: (state) => {
      state.shoppingCart = '{ "shopDetails": null, "items": [] }';
    },
    itemCountIncreased: (state, action) => {
      const newShoppingCartParsed = JSON.parse(state.shoppingCart);
      newShoppingCartParsed.items[action.payload].count += 1;
      state.shoppingCart = JSON.stringify(newShoppingCartParsed);
    },
    itemCountDecrased: (state, action) => {
      const newShoppingCartParsed = JSON.parse(state.shoppingCart);
      if (newShoppingCartParsed.items[action.payload].count > 1) newShoppingCartParsed.items[action.payload].count -= 1;
      state.shoppingCart = JSON.stringify(newShoppingCartParsed);
    },
    itemDeleted: (state, action) => {
      const shoppingCartParsed = JSON.parse(state.shoppingCart);
      shoppingCartParsed.items = shoppingCartParsed.items.filter((elem, index) => index != action.payload);
      if (shoppingCartParsed.items.length === 0) shoppingCartParsed.shopDetails = null;
      state.shoppingCart = JSON.stringify(shoppingCartParsed);
    }
  },
});

export const { itemAddedToShoppingCart, itemsDeletedFromShoppingCart, itemCountIncreased, itemCountDecrased, itemDeleted } = shoppingCartSlice.actions;
export default shoppingCartSlice;