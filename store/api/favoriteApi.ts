import { Path } from 'constants/routes';

import { IProduct } from 'types/entities/IProduct';

import { commonApi } from './commonApi';

export const favoriteApi = commonApi.injectEndpoints({
  endpoints(builder) {
    return {
      getFavoriteProducts: builder.query<IProduct[], void>({
        query() {
          return {
            method: 'GET',
            url: `${Path.CLIENT_AUTH}/${Path.CURRENT_USER}/${Path.FAVORITES}`,
          };
        },
        providesTags: result =>
          result
            ? [...result.map(({ id }) => ({ type: 'Favorite', id } as const)), { type: 'Favorite', id: 'LIST' }]
            : [{ type: 'Favorite', id: 'LIST' }],
      }),
      createFavoriteProducts: builder.mutation<void, number>({
        query(productId) {
          return {
            method: 'POST',
            url: `${Path.CLIENT_AUTH}/${Path.CURRENT_USER}/${Path.FAVORITES}`,
            body: { productId },
          };
        },
        invalidatesTags: [{ type: 'Favorite', id: 'LIST' }],
      }),
      deleteFavoriteProduct: builder.mutation<void, number>({
        query(id) {
          return {
            method: 'DELETE',
            url: `${Path.CLIENT_AUTH}/${Path.CURRENT_USER}/${Path.FAVORITES}/${id}`,
          };
        },
        invalidatesTags: [{ type: 'Favorite', id: 'LIST' }],
      }),
    };
  },
});

export const { useGetFavoriteProductsQuery, useCreateFavoriteProductsMutation, useDeleteFavoriteProductMutation } =
  favoriteApi;
