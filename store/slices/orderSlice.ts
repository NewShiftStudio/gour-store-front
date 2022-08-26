import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import { IProduct } from 'types/entities/IProduct';
import { IOrderProduct } from 'types/entities/IOrderProduct';

interface OrderFormContacts {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface OrderFormAddress {
  city: string;
  street: string;
  homeNumber: number;
  apartmentNumber: number;
  entrance: number;
  floor: number;
}

export interface BasketState {
  products: IOrderProduct[];
  contacts?: OrderFormContacts;
  address?: OrderFormAddress;
}

const initialState: BasketState = {
  products: [],
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addBasketProduct: (state, action: PayloadAction<IProduct>) => {
      const product = action.payload;
      const foundIndex = state.products.findIndex(it => it.product.id === product.id);

      if (foundIndex > -1) {
        const foundOrderProduct = state.products[foundIndex];

        if (product.isWeightGood) {
          state.products.splice(foundIndex, 1, {
            ...foundOrderProduct,
            weight: foundOrderProduct.weight + 100,
          });
        } else {
          state.products.splice(foundIndex, 1, {
            ...foundOrderProduct,
            amount: foundOrderProduct.amount + 1,
          });
        }
      } else {
        state.products.push({
          product,
          amount: 1,
          weight: 0,
        });
      }
    },

    subtractBasketProduct: (state, action: PayloadAction<IProduct>) => {
      const product = action.payload;
      const foundIndex = state.products.findIndex(it => it.product.id === product.id);
      const foundOrderProduct = state.products[foundIndex];

      if (!foundOrderProduct) return;

      if (product.isWeightGood) {
        if (foundOrderProduct.weight! > 100) {
          state.products.splice(foundIndex, 1, {
            ...foundOrderProduct,
            weight: foundOrderProduct.weight! - 100,
          });
        } else {
          state.products.splice(foundIndex, 1);
        }
      } else if (foundOrderProduct.amount! > 1) {
        state.products.splice(foundIndex, 1, {
          ...foundOrderProduct,
          amount: foundOrderProduct.amount! - 1,
        });
      } else {
        state.products.splice(foundIndex, 1);
      }
    },

    removeProduct: (state, action: PayloadAction<IProduct>) => {
      const product = action.payload;
      const foundIndex = state.products.findIndex(it => it.product.id === product.id);
      if (foundIndex === -1) return;
      state.products.splice(foundIndex, 1);
    },
    setContacts(state, action: PayloadAction<OrderFormContacts>) {
      state.contacts = action.payload;
    },
    setAddress(state, action: PayloadAction<OrderFormAddress>) {
      state.address = action.payload;
    },
  },
});

export const selectedProductCount = (state: RootState) =>
  state.order.products.reduce((acc, item) => {
    if (!item.product.isWeightGood) {
      acc += item.amount;
    } else {
      acc++;
    }

    return acc;
  }, 0);

export const selectedProductWeight = (state: RootState) =>
  state.order.products.reduce((acc, item) => acc + item.weight, 0);

export const selectedProductSum = (state: RootState) =>
  state.order.products.reduce((acc, it) => {
    if (it.product.isWeightGood) {
      return acc + (it.product.price.cheeseCoin / 1000) * it.weight;
    }
    return acc + it.product.price.cheeseCoin * it.amount;
  }, 0);

export const selectedProductDiscount = (state: RootState) =>
  state.order.products.reduce((acc, it) => {
    const discount = it.product.discount || 0;
    return acc + (it.product.price.cheeseCoin / 100) * discount * it.amount;
  }, 0);

export const checkProductInBasket = (state: RootState, productId: number): boolean =>
  state.order.products.some(it => it.product.id === productId);

export const productsInBasketCount = (state: RootState, productId: number, isWeightGood: boolean): number => {
  const currentProduct = state.order.products.find(it => it.product.id === productId);
  if (!currentProduct) return 0;
  if (isWeightGood) {
    return currentProduct.weight;
  }
  return currentProduct.amount;
};

export const selectProductsInOrder = (state: RootState): IOrderProduct[] => state.order.products;

export const selectProductsIdInOrder = (state: RootState): number[] =>
  state.order.products.reduce((acc, item) => [...acc, item.product.id], [] as number[]);

export const { addBasketProduct, subtractBasketProduct, removeProduct } = orderSlice.actions;

export default orderSlice.reducer;
