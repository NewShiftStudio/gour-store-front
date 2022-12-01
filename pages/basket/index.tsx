/* eslint-disable react/no-array-index-key */
import React, { Fragment, useCallback, useMemo } from 'react';

import { Divider, Grid } from '@mui/material';

import { useGetCategoryListQuery } from 'store/api/categoryApi';
import {
  useCreateFavoriteProductsMutation,
  useDeleteFavoriteProductMutation,
  useGetFavoriteProductsQuery,
} from 'store/api/favoriteApi';
import { useGetSimilarProductsByIdQuery } from 'store/api/productApi';
import {
  addBasketProduct,
  removeProduct,
  selectBasketProducts,
  selectProductsIdInOrder,
  selectedProductCount,
  selectedProductDiscount,
  selectedProductSum,
  subtractBasketProduct,
} from 'store/slices/orderSlice';

import { PrivateLayout } from 'layouts/Private/Private';
import { ShopLayout } from 'layouts/Shop/Shop';

import { CartCard } from 'components/Cart/Card/Card';
import { CartEmpty } from 'components/Cart/Empty/Empty';
import { CartInfo } from 'components/Cart/Info/Info';
import { useAppNavigation } from 'components/Navigation';
import { ProductSlider } from 'components/Product/Slider/Slider';
import { Button } from 'components/UI/Button/Button';
import { InfoBlock } from 'components/UI/Info/Block/Block';
import { Typography } from 'components/UI/Typography/Typography';

import { IProduct } from 'types/entities/IProduct';
import { NotificationType } from 'types/entities/Notification';

import { Path } from 'constants/routes';
import { useAppDispatch, useAppSelector } from 'hooks/store';
import { useLocalTranslation } from 'hooks/useLocalTranslation';
import { dispatchNotification } from 'packages/EventBus';
import { computeProductsWithCategories } from 'utils/catalogUtil';
import { getProductBackground } from 'utils/categoryUtil';
import { getPriceByGrams } from 'utils/currencyUtil';
import { getErrorMessage } from 'utils/errorUtil';

import translation from './Basket.i18n.json';

import sx from './Basket.styles';

export function Basket() {
  const { language, currency, goToHome, goToOrder } = useAppNavigation();

  const dispatch = useAppDispatch();

  const { t } = useLocalTranslation(translation);

  const { data: favoriteProducts = [] } = useGetFavoriteProductsQuery();
  const { data: categories = [] } = useGetCategoryListQuery();

  const productsInOrder = useAppSelector(selectBasketProducts);
  const count = useAppSelector(selectedProductCount);
  const productTotalSum = useAppSelector(selectedProductSum);
  const sumDiscount = useAppSelector(selectedProductDiscount);
  const productIds = useAppSelector(selectProductsIdInOrder);

  const { data: similarProducts = [] } = useGetSimilarProductsByIdQuery({ productIds });

  const formattedSimilarProducts = useMemo(
    () => computeProductsWithCategories(similarProducts, categories, favoriteProducts),
    [similarProducts, categories, favoriteProducts],
  );

  // TODO: вынести логику стоимости доставки на бек
  const delivery = 500;
  const minCostForFreeDelivery = 2990;
  const sumToFreeDelivery = minCostForFreeDelivery - productTotalSum;
  const isDeliveryFree = sumToFreeDelivery <= 0;

  const [removeFavorite] = useDeleteFavoriteProductMutation();
  const [addFavorite] = useCreateFavoriteProductsMutation();

  const deleteProduct = useCallback(
    (product: IProduct, gram: number) => dispatch(removeProduct({ product, gram })),
    [dispatch],
  );
  const addProduct = useCallback(
    (product: IProduct, gram: number) => dispatch(addBasketProduct({ product, gram })),
    [dispatch],
  );
  const subtractProduct = useCallback(
    (product: IProduct, gram: number) => dispatch(subtractBasketProduct({ product, gram })),
    [dispatch],
  );

  const electProduct = async (id: number, isElect: boolean) => {
    try {
      if (isElect) {
        await removeFavorite(id);
      } else {
        await addFavorite(id);
      }
    } catch (error) {
      const message = getErrorMessage(error);

      dispatchNotification(message, { type: NotificationType.DANGER });
    }
  };

  const freeDeliveryBlockTitle = `${t('freeDeliveryText.part1')} ${sumToFreeDelivery}\xa0₽ ${t(
    'freeDeliveryText.part2',
  )}`;

  return (
    <PrivateLayout>
      <ShopLayout>
        <Typography variant='h3' sx={sx.title}>
          {t('cart')}
        </Typography>
        {productsInOrder.length === 0 && (
          <CartEmpty title={t('emptyTitle')} actionText={t('emptyButton')} onClick={goToHome}>
            <Typography variant='body1'>{t('emptyText')}</Typography>
          </CartEmpty>
        )}
        {!!productsInOrder.length && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              {productsInOrder.map(it => (
                <Fragment key={it.product.id + it.gram}>
                  <CartCard
                    {...it}
                    price={getPriceByGrams(it.product.price[currency] || 0, it.gram)}
                    productImg={it.product.images[0]?.small}
                    backgroundImg={getProductBackground(categories, it.product.categories || [])}
                    onDelete={deleteProduct}
                    onAdd={addProduct}
                    onSubtract={subtractProduct}
                  />

                  <Divider sx={sx.divider} />
                </Fragment>
              ))}
            </Grid>

            <Grid container item xs={12} md={4} spacing={1}>
              <Grid item xs={12} sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Button fullWidth onClick={goToOrder}>
                  {t('orderButton')}
                </Button>
              </Grid>

              <Grid item xs={12}>
                <CartInfo
                  count={count}
                  discount={sumDiscount}
                  delivery={isDeliveryFree ? 0 : delivery}
                  price={productTotalSum}
                  currency={currency}
                />
              </Grid>

              {!isDeliveryFree && (
                <Grid item xs={12}>
                  <InfoBlock title={freeDeliveryBlockTitle} actionText={t('continueShopping')} href={`${Path.HOME}`} />
                </Grid>
              )}

              <Grid item xs={12}>
                <InfoBlock title={t('aboutDelivery')} actionText={t('detailed')} href={`${Path.RULES}`} />
              </Grid>
            </Grid>

            {!!similarProducts?.length && (
              <Grid item xs={12}>
                <ProductSlider
                  title={t('similar')}
                  products={formattedSimilarProducts}
                  language={language}
                  currency={currency}
                  onAdd={addProduct}
                  onRemove={subtractProduct}
                  onElect={electProduct}
                />
              </Grid>
            )}

            <Grid item xs={12} sx={{ display: { md: 'none' } }}>
              <Button fullWidth onClick={goToOrder}>
                {t('orderButton')}
              </Button>
            </Grid>
          </Grid>
        )}
      </ShopLayout>
    </PrivateLayout>
  );
}

export default Basket;
