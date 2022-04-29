import React from 'react';

import { Box } from '../../UI/Box/Box';
import { Typography } from '../../UI/Typography/Typography';
import { defaultTheme as t } from '../../../themes';

import StarIcon from '@mui/icons-material/Star';

const sx = {
  box: {
    display: 'flex',
    justifyContent: 'space-between',
    color: t.palette.text.muted,
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
  },
  star: {
    marginRight: '6px',
  },
};

type Props = {
  rating: number;
  price: number;
  isWeightGood: boolean;
};

export function ProductCardRate({ rating, price, isWeightGood }: Props) {
  return (
    <Box sx={sx.box}>
      <Box sx={sx.rating}>
        <StarIcon fontSize="small" sx={sx.star} />
        <Typography variant="body2">{rating}</Typography>
      </Box>

      <Typography variant="body2">
        {price}/{isWeightGood ? 'кг' : 'шт'}
      </Typography>
    </Box>
  );
}
