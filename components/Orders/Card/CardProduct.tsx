import { Card, CardContent, CardMedia, Divider } from '@mui/material';
import { Box } from '@mui/system';
import { Typography } from '../../UI/Typography/Typography';
import React from 'react';
import sx from './CardProduct.styles';
import { Currency } from '../../../@types/entities/Currency';
import { getCurrencySymbol } from '../../../helpers/currencyHelper';
import translations from './Card.i18n.json';
import { useLocalTranslation } from '../../../hooks/useLocalTranslation';

export type OrderProductType = {
  photo: string;
  title: string;
  weight: number;
  amount: number;
  cost: number;
  isWeightGood: boolean;
};

type OrderCardProductProps = {
  product: OrderProductType;
  currency: Currency;
};

export const OrderCardProduct = ({
  currency,
  product,
}: OrderCardProductProps) => {
  const { t } = useLocalTranslation(translations);
  const { photo, title, weight, amount, cost, isWeightGood } = product;
  return (
    <Card sx={sx.card}>
      <CardMedia sx={sx.image} component="img" image={photo} />
      <Box sx={sx.info}>
        <CardContent sx={sx.content}>
          <Typography variant="body1" sx={sx.title}>
            {title}
          </Typography>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="body1" sx={sx.count}>
              {!isWeightGood ? `${amount}${t('pc')}.` : `${weight}${t('g')}.`}
            </Typography>
            <Typography variant="body1" sx={sx.productPrice}>
              {cost} {getCurrencySymbol(currency)}
            </Typography>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};