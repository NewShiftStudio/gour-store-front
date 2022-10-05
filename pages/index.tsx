import type { NextPage } from 'next';
import Image from 'next/image';
import React from 'react';

import { useGetCategoryListQuery } from 'store/api/categoryApi';
import {
  useCreateFavoriteProductsMutation,
  useDeleteFavoriteProductMutation,
  useGetFavoriteProductsQuery,
} from 'store/api/favoriteApi';
import { useGetPageQuery } from 'store/api/pageApi';
import { useGetNoveltiesProductListQuery, useGetProductListQuery } from 'store/api/productApi';
import { useGetPromotionListQuery } from 'store/api/promotionApi';
import { addBasketProduct, subtractBasketProduct } from 'store/slices/orderSlice';

import { PrivateLayout } from 'layouts/Private/Private';
import { ShopLayout } from 'layouts/Shop/Shop';

import { CardSlider } from 'components/CardSlider/CardSlider';
import { useAppNavigation } from 'components/Navigation';
import { ProductCatalog } from 'components/Product/Catalog/Catalog';
import { PromotionCard } from 'components/Promotion/Card/Card';
import { Box } from 'components/UI/Box/Box';
import { ProgressLinear } from 'components/UI/ProgressLinear/ProgressLinear';
import { Typography } from 'components/UI/Typography/Typography';

import { Currency } from 'types/entities/Currency';
import { IProduct } from 'types/entities/IProduct';
import { NotificationType } from 'types/entities/Notification';

import { useAppDispatch, useAppSelector } from 'hooks/store';
import { useLocalTranslation } from 'hooks/useLocalTranslation';
import { dispatchNotification } from 'packages/EventBus';
import { getErrorMessage } from 'utils/errorUtil';

import bannerImg from 'assets/images/banner.jpeg';

import translations from './Main.i18n.json';
import sx from './Main.styles';

const NOW = new Date();

// eslint-disable-next-line react/function-component-definition
const Home: NextPage = () => {
  const { t } = useLocalTranslation(translations);

  const { goToPromotionPage, goToProductPage, language } = useAppNavigation();

  const basket = useAppSelector(state => state.order);

  const { data: favoriteProducts = [] } = useGetFavoriteProductsQuery();

  const dispatch = useAppDispatch();

  const { data: categories = [], isLoading: categoriesIsLoading } = useGetCategoryListQuery();
  const { data: products = [], isLoading: productsIsLoading } = useGetProductListQuery({
    withDiscount: true,
    withCategories: true,
  });
  const { data: novelties = [], isLoading: noveltiesIsLoading } = useGetNoveltiesProductListQuery({
    withDiscount: true,
    withCategories: true,
  });
  const { data: promotions, isLoading: promotionsIsLoading } = useGetPromotionListQuery();

  const { data: page, isLoading: mainPageIsLoading } = useGetPageQuery('MAIN');

  const isLoading =
    categoriesIsLoading || productsIsLoading || noveltiesIsLoading || promotionsIsLoading || mainPageIsLoading;

  const currency: Currency = 'cheeseCoin';

  const addToBasket = (product: IProduct) => dispatch(addBasketProduct(product));
  const removeFromBasket = (product: IProduct) => dispatch(subtractBasketProduct(product));

  const [removeFavorite] = useDeleteFavoriteProductMutation();
  const [addFavorite] = useCreateFavoriteProductsMutation();

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

  const filteredPromotions = promotions?.filter(it => new Date(it.end) > NOW);

  return (
    <PrivateLayout>
      <ShopLayout currency={currency} language={language}>
        {isLoading && <ProgressLinear />}
        {!!filteredPromotions?.length && (
          <CardSlider
            title={t('promotions')}
            cardsList={filteredPromotions.map(promotion => (
              <PromotionCard
                key={promotion.id}
                image={promotion.cardImage.small}
                onClickMore={() => goToPromotionPage(promotion.id)}
              />
            ))}
          />
        )}
        {!!novelties?.length && (
          <ProductCatalog
            title={t('novelties')}
            products={novelties}
            favoritesList={favoriteProducts}
            basket={basket.products}
            categories={categories}
            language={language}
            currency={currency}
            rows={1}
            sx={sx.productList}
            onAdd={addToBasket}
            onRemove={removeFromBasket}
            onElect={electProduct}
            onDetail={goToProductPage}
          />
        )}

        {!!products.length && (
          <ProductCatalog
            withFilters
            title={t('catalog')}
            favoritesList={favoriteProducts}
            products={products}
            basket={basket.products}
            categories={categories}
            language={language}
            currency={currency}
            sx={sx.productList}
            onAdd={addToBasket}
            onRemove={removeFromBasket}
            onElect={electProduct}
            onDetail={goToProductPage}
          />
        )}

        {!!page && (
          <Box>
            <Box sx={sx.banner}>
              {!!bannerImg && (
                <Image
                  loader={() =>
                    'https://i.pinimg.com/736x/ca/f2/48/caf24896f739c464073ee31edfebead2--images-for-website-website-designs.jpg'
                  }
                  src={
                    bannerImg ||
                    'https://i.pinimg.com/736x/ca/f2/48/caf24896f739c464073ee31edfebead2--images-for-website-website-designs.jpg'
                  }
                  objectFit='cover'
                  layout='fill'
                  alt=''
                />
              )}
            </Box>

            <Typography variant='h4' sx={sx.title}>
              {page.info?.title?.[language]}
            </Typography>

            <Typography variant='body1' sx={sx.pageInfoDescription}>
              {page.info?.description?.[language]}
            </Typography>
          </Box>
        )}
      </ShopLayout>
    </PrivateLayout>
  );
};

export default Home;
