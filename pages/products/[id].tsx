import React, {useEffect, useMemo, useRef, useState} from 'react';

import {Breadcrumbs, LinearProgress, SxProps} from '@mui/material';
import { isProductFavorite } from 'pages/favorites/favoritesHelper';

import { useGetCategoryListQuery } from 'store/api/categoryApi';
import { useGetCurrentUserQuery } from 'store/api/currentUserApi';
import {
  useCreateFavoriteProductsMutation,
  useDeleteFavoriteProductMutation,
  useGetFavoriteProductsQuery,
} from 'store/api/favoriteApi';
import { useGetProductQuery } from 'store/api/productApi';
import { useCreateProductGradeMutation, useGetProductGradeListQuery } from 'store/api/productGradeApi';
import { addBasketProduct, subtractBasketProduct } from 'store/slices/orderSlice';

import { PrivateLayout } from 'layouts/Private/Private';
import { ShopLayout } from 'layouts/Shop/Shop';

import { CommentCreateBlock } from 'components/Comment/CreateBlock/CreateBlock';
import { useAppNavigation } from 'components/Navigation';
import { ProductActions } from 'components/Product/Actions/Actions';
import { ProductInformation } from 'components/Product/Information/Information';
import { ReviewModal } from 'components/Product/ReviewModal/ReviewModal';
import { ProductReviews, Review } from 'components/Product/Reviews/Reviews';
import { ProductSlider } from 'components/Product/Slider/Slider';
import { Box } from 'components/UI/Box/Box';
import { ImageSlider } from 'components/UI/ImageSlider/ImageSlider';
import { LinkRef as Link } from 'components/UI/Link/Link';
import { Typography } from 'components/UI/Typography/Typography';

import { CommentDto } from 'types/dto/comment.dto';
import { IProduct } from 'types/entities/IProduct';
import { NotificationType } from 'types/entities/Notification';

import { noExistingId } from 'constants/default';
import { useAppDispatch, useAppSelector } from 'hooks/store';
import { useLocalTranslation } from 'hooks/useLocalTranslation';
import { dispatchNotification } from 'packages/EventBus';
import { computeProductsWithCategories, getDefaultGramByProductType } from 'utils/catalogUtil';
import { getProductBackground, getProductTypeLabel } from 'utils/categoryUtil';
import { getErrorMessage } from 'utils/errorUtil';

import translations from './Product.i18n.json';

import styles from './Product.module.css';
import sx from './Product.styles';

import HeartIcon from '@mui/icons-material/Favorite';
import { getPriceByRole } from '../../types/entities/IPrice';
import { selectIsAuth } from '../../store/selectors/auth';
import { getProductReviews } from '../../utils/reviewUtil';
import { getProductForDataLayer } from '../../utils/metricaUtil';

export default function Product() {
  const { t } = useLocalTranslation(translations);
  const {
    language,
    query: { id: queryId },
  } = useAppNavigation();

  const dispatch = useAppDispatch();

  const commentBlockRef = useRef<HTMLDivElement>(null);

  const { data: favoriteProducts = [] } = useGetFavoriteProductsQuery();
  const { data: categories = [], isLoading: isCategoriesLoading } = useGetCategoryListQuery();
  const isAuth = useAppSelector(selectIsAuth);
  const { data: currentUser } = useGetCurrentUserQuery(undefined,{skip: !isAuth});

  const addToBasket = (product: IProduct, gram: number) => dispatch(addBasketProduct({ gram, product }));

  const removeFromBasket = (product: IProduct, gram: number) => dispatch(subtractBasketProduct({ product, gram }));

  const productId = Number(queryId) || 0;

  const {
    data: product,
    isFetching: isProductFetching,
    isError,
  } = useGetProductQuery(
    {
      id: productId,
      withSimilarProducts: true,
      withMetrics: true,
      withDiscount: true,
      withCategories: true,
    },
    { skip: !productId },
  );

  const isLoading = isProductFetching || isCategoriesLoading;

  const productType = useMemo(
    () => product?.categories && categories && getProductTypeLabel(categories, product.categories),
    [product, categories],
  );

  const [reviewForModal, setReviewForModal] = useState<Review>({
    id: noExistingId,
    productId: noExistingId,
    clientName: '',
    value: 0,
    comment: '',
    date: new Date(),
  });
  const [reviewModalIsOpen, setReviewModalIsOpen] = useState(false);

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

  const [fetchCreateProductGrade] = useCreateProductGradeMutation();

  const { data: grades = [], isSuccess: isGradesSuccessfully } = useGetProductGradeListQuery(
    { productId, withComments: true, isApproved: true },
    { skip: !productId },
  );
  const reviews = getProductReviews(grades);

  const formattedSimilarProducts = useMemo(
    () =>
      product?.similarProducts && computeProductsWithCategories(product?.similarProducts, categories, favoriteProducts),
    [product, categories, favoriteProducts],
  );

  useEffect(() => {
    if (!product || !productType) {
        return;
    }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.dataLayer.push({
          'ecommerce': {
              'currencyCode': 'RUB',
              'detail': {
                  'products': [
                      getProductForDataLayer(
                          getDefaultGramByProductType(productType),
                          product,
                          currentUser,
                          1
                      )
                  ]
              }
          }
      });
  },[product]);

  const onCreateComment = (comment: CommentDto) => fetchCreateProductGrade({ productId, ...comment }).unwrap();

  const onClickComments = () => commentBlockRef.current?.scrollIntoView({ behavior: 'smooth' });

  const openReviewModal = (review: Review) => {
    setReviewForModal(review);
    setReviewModalIsOpen(true);
  };
  const closeReviewModal = () => {
    setReviewModalIsOpen(false);
  };

  const canCreateReview = useMemo(() => {
    if (!isGradesSuccessfully || !currentUser) return false;
    return !grades.find(grade => grade.client?.id === currentUser.id);
  }, [grades, currentUser, isGradesSuccessfully]);

  const productCategories =
    product?.categories?.map(lowCategory => ({
      label: lowCategory.parentCategories?.[0]?.title.ru || 'Тип товара',
      value: lowCategory.title.ru,
    })) || [];

  const productDescription = product?.description[language] || '';

  const isCurrentProductElected = isProductFavorite(productId, favoriteProducts);

  const price = Math.round(getPriceByRole(product?.price, currentUser?.role));

  const hasSimilar = !!formattedSimilarProducts?.length;
  const hasComments = !!reviews.length;

  return (
    <PrivateLayout>
      <ShopLayout>
        {isLoading && <LinearProgress />}

        {isError && <Typography variant='h5'>Произошла ошибка</Typography>}

        {!isLoading && !isError && !product && <Typography variant='h5'>Продукт не найден</Typography>}

        {!isLoading && product && (
          <>
          <Breadcrumbs sx={{marginBottom: '20px'}} separator=">" aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/">
              Главная
            </Link>
            <Link underline="hover" color="inherit" href={`/?productType=${productType === 'Сыр' ? 130 : 131}`}>
              {productType}
            </Link>
            <Typography variant='h6' sx={{fontWeight: 700}}>{product.title[language] || ''}</Typography>
          </Breadcrumbs>

            <Box sx={sx.top}>
              <Box sx={sx.preview}>
                <ImageSlider
                  images={product.images}
                  backgroundSrc={categories && getProductBackground(categories, product.categories || [])}
                  sx={sx.imageSlider}
                />

                <HeartIcon
                  sx={{ ...sx.heart, ...(isCurrentProductElected && sx.elected) } as SxProps}
                  onClick={() => electProduct(product.id, isCurrentProductElected)}
                />
              </Box>

              <Box sx={sx.info}>
                <Typography variant='h3' sx={sx.title}>
                  {product.title[language] || ''}
                </Typography>
                <ProductInformation
                  rating={product.grade || 0}
                  gradesCount={product.gradesCount || 0}
                  commentsCount={product.commentsCount || 0}
                  categories={productCategories}
                  onClickComments={onClickComments}
                />

                <ProductActions
                  id={product.id}
                  weight={product.weight}
                  moyskladId={product.moyskladId}
                  currentUserCity={currentUser?.city?.name.ru}
                  price={price}
                  discount={product.discount}
                  productType={productType!}
                  sx={sx.actions}
                  onAdd={(gram: number) => addToBasket(product, gram)}
                  onRemove={(gram: number) => removeFromBasket(product, gram)}
                  onElect={() => electProduct(product.id, isCurrentProductElected)}
                  isElect={isCurrentProductElected}
                  defaultStock={product.defaultStock}
                />
              </Box>
            </Box>
            {productDescription && (
              <Box sx={sx.description}>
                <Typography sx={sx.title} variant='h5'>
                  {t('description')}
                </Typography>

                <div dangerouslySetInnerHTML={{ __html: productDescription }} className={styles.productDescription} />
              </Box>
            )}
            {hasSimilar && (
              <ProductSlider
                title={t('similar')}
                products={formattedSimilarProducts}
                language={language}
                sx={sx.similar}
                onAdd={addToBasket}
                onRemove={removeFromBasket}
                onElect={electProduct}
              />
            )}
            {hasComments && (
              <ProductReviews sx={sx.reviews} reviews={reviews} ref={commentBlockRef} onReviewClick={openReviewModal} />
            )}
            {canCreateReview && <CommentCreateBlock onCreate={onCreateComment} />}
          </>
        )}

        <ReviewModal isOpen={reviewModalIsOpen} review={reviewForModal} onClose={closeReviewModal} />
      </ShopLayout>
    </PrivateLayout>
  );
}
