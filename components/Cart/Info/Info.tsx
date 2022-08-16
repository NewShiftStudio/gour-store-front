import React from 'react';
import { Paper } from '@mui/material';

import { Box } from '../../UI/Box/Box';
import { Typography } from '../../UI/Typography/Typography';
import { getDeclensionWordByCount } from '../../../utils/wordHelper';
import { defaultTheme as t } from '../../../themes';
import { getCurrencySymbol } from '../../../helpers/currencyHelper';
import { useLocalTranslation } from '../../../hooks/useLocalTranslation';
import translations from './Info.i18n.json';
import { Currency } from '../../../@types/entities/Currency';

const sx = {
  paper: {
    width: '100%',
    padding: '16px',
    boxShadow: 'none',
    '*': {
      display: 'flex',
      justifyContent: 'space-between',
    },
  },

  total: {
    fontWeight: 700,
    color: t.palette.text.secondary,
  },

  footnote: {
    marginTop: '10px',

    color: t.palette.text.muted,
  },
};

type CartInfoProps = {
  count: number;
  weight: number;
  price: number;
  delivery: number;
  discount: number;
  currency?: Currency;
};

export function CartInfo({ count, weight, price, delivery, discount, currency = 'cheeseCoin' }: CartInfoProps) {
  const { t } = useLocalTranslation(translations);

  const productsCountText = getDeclensionWordByCount(count, [t('manyProducts'), t('oneProduct'), t('someProducts')]);

  const currencySymbol = getCurrencySymbol(currency);

  return (
    <Paper sx={sx.paper}>
      <Box sx={sx.total}>
        <Typography variant="h6">{t('total')}</Typography>
        <Typography variant="h6">
          {price + delivery - discount}&nbsp;
          {currencySymbol}
        </Typography>
      </Box>
      <Box sx={sx.footnote}>
        <Typography variant="body1">
          {t('all')}: {count} {productsCountText} {weight ? `• ${weight} ${t('kg')}` : ''}
        </Typography>
        <Typography variant="body1">
          {price}&nbsp;
          {currencySymbol}
        </Typography>
      </Box>
      <Box sx={sx.footnote}>
        <Typography variant="body1">{t('delivery')}</Typography>
        <Typography variant="body1">
          {delivery ? (
            <>
              {delivery}&nbsp;{currencySymbol}
            </>
          ) : (
            t('free')
          )}
        </Typography>
      </Box>
      <Box sx={sx.footnote}>
        <Typography variant="body1">{t('discount')}</Typography>
        <Typography variant="body1" color="error">
          {discount}&nbsp;
          {currencySymbol}
        </Typography>
      </Box>
    </Paper>
  );
}
