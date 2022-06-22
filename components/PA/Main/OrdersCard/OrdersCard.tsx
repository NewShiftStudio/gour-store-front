import React from 'react';
import { format } from 'date-fns';

import translations from './OrdersCard.i18n.json';
import { useLocalTranslation } from '../../../../hooks/useLocalTranslation';
import { getCurrencySymbol } from '../../../../helpers/currencyHelper';
import { Box } from '../../../UI/Box/Box';
import { Typography } from '../../../UI/Typography/Typography';
import { InfoCard } from '../../../UI/Info/Card/Card';
import { Currency } from '../../../../@types/entities/Currency';

const sx = {
  order: {
    marginBottom: '18px',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  orderTitle: {
    display: 'flex',
    flexDirection: {
      sm: 'row',
      xs: 'column',
    },
  },
  orderId: {
    marginRight: '12px',
  },
};

export type PAOrdersCardProps = {
  orders?: {
    id: string;
    date: Date;
    status: string;
    sum: number;
    currency: Currency;
  }[];
  onClickMore(): void;
};

export function PAOrdersCard({ orders, onClickMore }: PAOrdersCardProps) {
  const { t } = useLocalTranslation(translations);

  return (
    <InfoCard title={t('title')} footerText={t('footerText')} onClickMore={onClickMore}>
      {orders ? (
        orders.map(order => (
          <Box key={order.id} sx={sx.order}>
            <Box sx={sx.orderHeader}>
              <Box sx={sx.orderTitle}>
                <Typography variant="body1" sx={sx.orderId}>
                  {t('order')} {order.id}
                </Typography>
                <Typography variant="body1" color="text.muted">
                  {t('from')} {format(order.date, 'dd.MM.yyyy')}
                </Typography>
              </Box>

              <Typography variant="body1">
                {order.sum}
                {getCurrencySymbol(order.currency)}
              </Typography>
            </Box>

            <Typography variant="body2" color="text.muted">
              {order.status}
            </Typography>
          </Box>
        ))
      ) : (
        <Typography variant="body1" color="text.muted">
          {t('emptyOrders')}
        </Typography>
      )}
    </InfoCard>
  );
}