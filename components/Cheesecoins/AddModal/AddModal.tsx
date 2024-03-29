import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';

import { useGetInvoicePriceQuery } from 'store/api/invoiceApi';

import { HFTextField } from 'components/HookForm/HFTextField';
import { Box } from 'components/UI/Box/Box';
import Loader from 'components/UI/Loader/Loader';
import { Modal } from 'components/UI/Modal/Modal';
import { Typography } from 'components/UI/Typography/Typography';

import regexp from 'constants/regex';
import { useDebounce } from 'hooks/useDebounce';
import { useLocalTranslation } from 'hooks/useLocalTranslation';
import { getCurrencySymbol, getFormattedPrice } from 'utils/currencyUtil';

import translations from './AddModal.i18n.json';
import { MINIMUM_AMOUNT, getValidationSchema } from './validations';

import { sx } from './AddModal.styles';

type FormState = {
  count: number;
};

type Props = {
  initCoins?: number;
  isOpened: boolean;
  onClose: () => void;
  onSubmit: (invoiceData: { invoicePrice: number; coinsCount: number }) => void;
};

export function CheesecoinsAddModal({ initCoins, isOpened, onClose, onSubmit }: Props) {
  const [lastCoinCount, setLastCoinCount] = useState(0);
  const debouncedValue = useDebounce(lastCoinCount, 500);

  const { t } = useLocalTranslation(translations);
  const schema = getValidationSchema(t);

  const values = useForm<FormState>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (initCoins) {
      setLastCoinCount(initCoins);
      values.setValue('count', initCoins);
    } else {
      setLastCoinCount(0);
      values.resetField('count');
    }
  }, [initCoins]);

  const isValidCoinsCount = debouncedValue >= MINIMUM_AMOUNT;

  const {
    data: invoicePrice,
    isFetching,
    isError,
  } = useGetInvoicePriceQuery({ count: debouncedValue, currency: 'RUB' }, { skip: !isValidCoinsCount });

  const handleSubmit = ({ count }: FormState) => onSubmit({ coinsCount: count, invoicePrice: invoicePrice! });

  const showPrice = !isFetching && isValidCoinsCount && invoicePrice;
  const isDisabledPayBtn = !showPrice;

  const formId = 'add-coins-modal';

  const rubCurrencySymbol = getCurrencySymbol();

  return (
    <Modal
      title='Покупка чизкоинов'
      isOpen={isOpened}
      showRefuseButton
      acceptText='Пополнить'
      refuseText='Отменить'
      acceptIsDisabled={isDisabledPayBtn}
      formId={formId}
      onClose={onClose}
    >
      <FormProvider {...values}>
        <form id={formId} onSubmit={values.handleSubmit(handleSubmit)}>
          <HFTextField
            name='count'
            label='Количество чизкоинов'
            regexp={regexp.onlyDigits}
            onChange={e => setLastCoinCount(+e.currentTarget.value)}
            inputProps={{ inputMode: 'numeric', maxLength: 10 }}
          />

          {isError && (
            <Typography variant='body2' color='error' sx={sx.error}>
              Server error.
            </Typography>
          )}

          {isFetching && (
            <Box sx={sx.loader}>
              <Loader width='58px' height='10px' />
            </Box>
          )}

          {showPrice && (
            <Typography variant='body1' sx={sx.price}>
              К оплате: &nbsp;
              <Typography variant='caption' sx={sx.priceValue}>
                {getFormattedPrice(invoicePrice)}&nbsp;{rubCurrencySymbol}
              </Typography>
            </Typography>
          )}
        </form>
      </FormProvider>
    </Modal>
  );
}
