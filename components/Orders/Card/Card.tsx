import React, { useMemo } from 'react';

import { Divider, Grid, Typography } from '@mui/material';
import { format } from 'date-fns';

import { Accordion, AccordionDetails, AccordionSummary } from 'components/UI/Accordion/Accordion';
import { Box } from 'components/UI/Box/Box';

import { OrderCrmInfoStatus } from 'types/entities/IOrder';

import { useLocalTranslation } from 'hooks/useLocalTranslation';
import { getCurrencySymbol } from 'utils/currencyUtil';
import { getDeclensionWordByCount } from 'utils/wordUtil';

import translations from './Card.i18n.json';
import { OrderCardInfo } from './CardInfo';
import { OrderCardProduct, OrderProductType } from './CardProduct';

import sx from './Card.styles';

type Promotion = {
  title: string;
  amount: number;
};

export type FullOrder = {
  title: string;
  status: OrderCrmInfoStatus;
  createdAt: Date;
  address: string;
  client: string;
  products: OrderProductType[];
  promotions: Promotion[];
  deliveryCost: number;
  totalSum: number;
};

export type OrdersCardProps = {
  order: FullOrder;
};

export function OrdersCard({ order }: OrdersCardProps) {
  const { title, status, createdAt, address,  client, products, promotions, deliveryCost, totalSum } = order;

  const { t } = useLocalTranslation(translations);

  const productCount = products.length;

  const productsCountText = getDeclensionWordByCount(productCount, [
    t('manyProducts'),
    t('oneProduct'),
    t('someProducts'),
  ]);

  const createdDate = format(createdAt, 'dd.MM.yyyy');
  const createdTime = format(createdAt, 'HH:mm');

  const summaryDiscount = promotions.reduce((acc, currentDiscount) => acc + currentDiscount.amount, 0);

  const currencySymbol = getCurrencySymbol();

  return (
    <Accordion>
      <AccordionSummary>
        <Grid container sx={sx.header}>
          <Grid item sm={3} xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='h6'>{`Заказ ${title}`}</Typography>

            <Box sx={{ ...sx.total, display: { xs: 'flex', sm: 'none' } }}>
              <Typography variant='h6' sx={sx.totalText}>
                {totalSum} {currencySymbol}
              </Typography>
            </Box>
          </Grid>

          <Grid item sm={5} xs={12} sx={{ display: 'flex', alignItems: 'center', margin: { xs: '5px 0' } }}>
            <Typography sx={{ ...sx.status, backgroundColor: status?.color || 'secondary.main' }}>
              {status.name || 'ожидание'}
            </Typography>

            <Typography variant='body1' sx={sx.muted}>
              {t('from')} {createdDate} {t('at')} {createdTime}
            </Typography>
          </Grid>

          <Grid item sm={2} xs={12}>
            <Typography variant='body1' sx={{ ...sx.muted, ...sx.count }}>
              {productCount} {productsCountText}
            </Typography>
          </Grid>

          <Grid item sm={2} xs={12} sx={{ ...sx.total, display: { xs: 'none', sm: 'flex' } }}>
            <Typography variant='h6' sx={sx.totalText}>
              {totalSum} {currencySymbol}
            </Typography>
          </Grid>
        </Grid>
      </AccordionSummary>

      <Divider variant='fullWidth' sx={{ margin: '20px 0 0 0' }} />

      <AccordionDetails>
        <Box sx={sx.contacts}>
          <Typography sx={sx.muted} variant='body1'>
            {t('deliveryAddress')}:&nbsp;
          </Typography>

          <Typography variant='body1'>{address}</Typography>
        </Box>

        <Box sx={sx.contacts}>
          <Typography sx={sx.muted} variant='body1'>
            {t('receiver')}:&nbsp;
          </Typography>
          <Typography variant='body1'>{client}</Typography>
        </Box>

        <Divider variant='fullWidth' sx={{ margin: '20px 0 0 0' }} />

        {products.map(product => (
          <OrderCardProduct key={`${product.amount}_${product.photo}`} product={product}  />
        ))}

        {!!products.length && <Divider variant='fullWidth' />}

        <OrderCardInfo
          totalSum={totalSum}
          summaryDiscount={summaryDiscount}
          promotions={promotions}
        />
      </AccordionDetails>
    </Accordion>
  );
}
