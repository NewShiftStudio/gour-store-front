import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';

import { useGetInvoicePriceQuery } from 'store/api/invoiceApi';

import { HFTextField } from 'components/HookForm/HFTextField';
import { Box } from 'components/UI/Box/Box';
import Loader from 'components/UI/Loader/Loader';
import { Modal } from 'components/UI/Modal/Modal';
import { Typography } from 'components/UI/Typography/Typography';

import { useDebounce } from 'hooks/useDebounce';
import { useLocalTranslation } from 'hooks/useLocalTranslation';
import { getCurrencySymbol } from 'utils/currencyUtil';

import regexp from 'constants/regex';

import translations from './AddModal.i18n.json';
import { sx } from './AddModal.styles';
import { getValidationSchema } from './validations';

type FormState = {
  count: number;
};

type Props = {
  isOpened: boolean;
  onClose: () => void;
  onSubmit: (price: number) => void;
};

export function CheesecoinsAddModal({ isOpened, onClose, onSubmit }: Props) {
  const [lastCoinCount, setLastCoinCount] = useState(0);

  const debouncedValue = useDebounce(lastCoinCount, 500);

  const { t } = useLocalTranslation(translations);

  const schema = getValidationSchema(t);
  const values = useForm<FormState>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  useEffect(() => {
    values.resetField('count');
  }, [isOpened]);

  const isValidCoinsCount = values.formState.isValid || !!debouncedValue;
  const {
    data: invoicePrice,
    isFetching,
    isError,
  } = useGetInvoicePriceQuery({ count: debouncedValue, currency: 'rub' }, { skip: !isValidCoinsCount });

  const handleSubmit = ({ count }: FormState) => onSubmit(count);

  const currencySymbol = getCurrencySymbol('rub');

  const showPrice = !isFetching && !isError && !!debouncedValue;

  const formId = 'add-coins-modal';

  return (
    <Modal
      title='Покупка чизкоинов'
      isOpen={isOpened}
      showRefuseButton
      acceptText='Пополнить'
      refuseText='Отменить'
      acceptIsDisabled={isFetching}
      closeIsDisabled={isFetching}
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
            inputProps={{ maxLength: 12 }}
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
              Стоимость пополнения:&ensp;
              <Typography variant='caption' sx={sx.priceValue}>
                {invoicePrice}&nbsp;{currencySymbol}
              </Typography>
            </Typography>
          )}
        </form>
      </FormProvider>
    </Modal>
  );
}
