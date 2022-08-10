import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';

import translations from './Form.i18n.json';
import { useLocalTranslation } from '../../../hooks/useLocalTranslation';
import { getValidationSchema } from './validation';
import { Box } from '../../UI/Box/Box';
import { Typography } from '../../UI/Typography/Typography';
import { Button } from '../../UI/Button/Button';
import { Checkbox } from '../../UI/Checkbox/Checkbox';
import { HFTextField } from '../../HookForm/HFTextField';
import { HFSelect } from '../../HookForm/HFSelect';
import { OrderFormDocket } from './FormDocket';
import { Currency } from '../../../@types/entities/Currency';

import sx from './Form.styles';

const contactsFields = ['firstName', 'lastName', 'phone', 'email'];

const addressFields = ['street', 'house', 'apartment', 'entrance', 'floor'];

export type OrderFormType = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  deliveryProfileId: number;
  cityId: number;
  street: string;
  house: string;
  apartment: string;
  entrance: string;
  floor: string;
  comment?: string;
};

export type PersonalFields = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

export type DeliveryFields = {
  deliveryProfileId: number;
  cityId: number;
  street: string;
  house: string;
  apartment: string;
  entrance: string;
  floor: string;
  comment?: string;
};

export type OrderFormProps = {
  defaultPersonalFields: PersonalFields;
  defaultDeliveryFields: DeliveryFields;
  productsCount: number;
  cost: number;
  discount?: number;
  citiesList: {
    value: number;
    label: string;
  }[];
  isSubmitError?: boolean;
  delivery: number;
  deliveryProfiles: {
    value: number;
    label: string;
  }[];
  currency?: Currency;
  onSubmit: (data: OrderFormType) => void;
  onChangeDeliveryProfile: (profileId: number) => void;
};

export function OrderForm({
  defaultPersonalFields,
  defaultDeliveryFields,
  productsCount,
  cost,
  discount,
  delivery,
  deliveryProfiles,
  isSubmitError,
  onChangeDeliveryProfile,
  citiesList,
  currency,
  onSubmit,
}: OrderFormProps) {
  const { t } = useLocalTranslation(translations);

  const schema = getValidationSchema(t);

  const [isAgree, setIsAgree] = useState(false);

  const values = useForm<OrderFormType>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      ...defaultPersonalFields,
      ...defaultDeliveryFields,
    },
  });

  useEffect(() => {
    values.reset({
      ...values.getValues(),
      ...defaultDeliveryFields,
    });
  }, [defaultDeliveryFields]);

  useEffect(() => {
    values.reset({
      ...values.getValues(),
      ...defaultPersonalFields,
    });
  }, [defaultPersonalFields]);

  const submitHandler = (data: OrderFormType) => onSubmit(data);

  const changeDeliveryHandler = () => values.setValue('deliveryProfileId', 0);

  const agree = () => setIsAgree(!isAgree);

  return (
    <FormProvider {...values}>
      <form onSubmit={values.handleSubmit(submitHandler)}>
        <Box sx={sx.form}>
          <Box sx={sx.block}>
            <Typography variant="h6" sx={sx.title}>
              {t('details')}
            </Typography>

            <Grid container spacing={1}>
              {contactsFields.map(field => (
                <Grid key={field} item xs={12} sm={6}>
                  <HFTextField name={field} label={t(field)} />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={sx.block}>
            <Typography variant="h6" sx={sx.title}>
              {t('address')}
            </Typography>

            {deliveryProfiles.length !== 0 && (
              <HFSelect
                onChange={() => onChangeDeliveryProfile(values.getValues('deliveryProfileId'))}
                name="deliveryProfileId"
                options={deliveryProfiles}
                placeholder={t('profileSelect')}
                sx={sx.select}
              />
            )}

            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <HFSelect name="cityId" options={citiesList} placeholder={t('city')} sx={sx.select} />
              </Grid>

              {addressFields.map(field => (
                <Grid key={field} item xs={12} sm={6}>
                  <HFTextField name={field} label={t(field)} onChange={changeDeliveryHandler} />
                </Grid>
              ))}

              <Grid item xs>
                <HFTextField sx={sx.textarea} multiline rows={3} name="comment" label={t('comment')} />
              </Grid>
            </Grid>

            <OrderFormDocket
              productsCount={productsCount}
              cost={cost}
              discount={discount}
              delivery={delivery}
              currency={currency}
            />

            <Checkbox sx={sx.agreement} label={t('agreement')} value={isAgree} onChange={agree} />

            <Button
              sx={sx.btn}
              type="submit"
              disabled={!values.formState.isValid || !isAgree}
              color={!isSubmitError ? 'primary' : 'error'}
            >
              {!isSubmitError ? t('toPay') : t('orderError')}
            </Button>
          </Box>
        </Box>
      </form>
    </FormProvider>
  );
}
