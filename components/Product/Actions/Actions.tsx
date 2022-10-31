import React, { useEffect, useState } from 'react';

import { Grid, SxProps } from '@mui/material';

import { useGetStockQuery } from 'store/api/warehouseApi';

import { IconButton } from 'components/UI/IconButton/IconButton';

import { Currency } from 'types/entities/Currency';
import { IOption } from 'types/entities/IOption';
import { IOrderProduct } from 'types/entities/IOrderProduct';
import { ProductTypeLabel } from 'types/entities/IProduct';
import { NotificationType } from 'types/entities/Notification';

import { useAppSelector } from 'hooks/store';
import { dispatchNotification } from 'packages/EventBus';
import { getDefaultGramByProductType } from 'utils/catalogUtil';
import { getPriceByGrams } from 'utils/currencyUtil';
import { getErrorMessage } from 'utils/errorUtil';

import FavoriteIcon from '@mui/icons-material/Favorite';
import { productGramList } from 'constants/gramList';
import { getProductKeyInBasket } from 'pages/personal-area/orders/ordersHelper';

import { getStockLabel } from '../Card/Card';
import { ProductCardCart } from '../Card/Cart/Cart';
import { ProductCardGramSelect } from '../Card/GramSelect/GramSelect';
import { ProductPrice } from '../Price/Price';
import { ProductStock } from '../Stock/Stock';
import sxActions from './Actions.styles';

export type ProductActionsProps = {
  id: number;
  moyskladId: string | null;
  currentUserCity?: string;
  price: number;
  discount?: number;
  productType: ProductTypeLabel;
  currency: Currency;
  sx?: SxProps;
  isElect: boolean;
  onAdd: (gram: number) => void;
  onRemove: (gram: number) => void;
  onElect: () => void;
};

export function ProductActions({
  id,
  moyskladId,
  currentUserCity,
  price,
  discount,
  currency,
  productType,
  sx = {},
  isElect,
  onAdd,
  onRemove,
  onElect,
}: ProductActionsProps) {
  const [productGramValue, selectProductGramValue] = useState(() => getDefaultGramByProductType(productType));

  const {
    data: stock,
    isFetching: isStockFetching,
    isError: isStockError,
    error: stockError,
  } = useGetStockQuery(
    {
      city: 'Санкт-Петербург' ?? currentUserCity, // TODO: в будущем отправлять currentUserCity
      gram: String(productGramValue),
      warehouseId: String(moyskladId),
    },
    {
      skip: !productGramValue || !moyskladId,
      selectFromResult: ({ error, ...rest }) => ({ ...rest, error: getErrorMessage(error) }),
    },
  );

  const basketProductsKey = getProductKeyInBasket(id, productGramValue);
  const basketProduct = useAppSelector(state => state.order.products[basketProductsKey]) as IOrderProduct | undefined;
  const [productGramOptions] = useState<IOption[]>(() =>
    productGramList[productType]?.map(
      gram =>
        ({
          label: `${gram}\u00A0г`,
          value: String(gram),
        } || []),
    ),
  );

  const onSelectGram = (value: string | number) => selectProductGramValue(+value);

  const isAmountMoreThanCost = !isStockFetching && (basketProduct?.amount || 0) >= Number(stock?.value);
  const isAddDisabled = isStockFetching || isStockError || isAmountMoreThanCost;

  const stockLabel = isStockError ? stockError : getStockLabel(isStockFetching, isStockError, moyskladId, stock?.value);
  const priceByGrams = getPriceByGrams(price, productGramValue);

  const handleAddClick = () => {
    if (!isAddDisabled) onAdd(productGramValue);
  };

  const handleRemoveClick = () => {
    onRemove(productGramValue);
  };

  return (
    <Grid container spacing={1} sx={{ ...sx, ...sxActions.container } as SxProps}>
      <Grid item md={12}>
        <ProductPrice price={priceByGrams} discount={discount} currency={currency} />
      </Grid>

      <Grid item>
        <ProductCardGramSelect
          showLabelOnTablets
          gram={productGramValue}
          onChange={onSelectGram}
          options={productGramOptions}
          sx={{ height: '42px' }}
        />
      </Grid>

      <Grid item xs>
        <ProductCardCart
          isDisabled={isAddDisabled}
          amount={basketProduct?.amount}
          gram={productGramValue}
          onAdd={handleAddClick}
          onRemove={handleRemoveClick}
        />
      </Grid>

      <Grid
        item
        sx={{
          display: {
            xs: 'none',
            sm: 'flex',
          },
        }}
      >
        <IconButton sx={{ ...sxActions.favoriteBtn, ...(isElect && sxActions.favoriteBtnElected) }} onClick={onElect}>
          <FavoriteIcon sx={sxActions.icon} />
        </IconButton>
      </Grid>

      <Grid item xs={12}>
        <ProductStock label={stockLabel} fullWidth multiLine />
      </Grid>
    </Grid>
  );
}
