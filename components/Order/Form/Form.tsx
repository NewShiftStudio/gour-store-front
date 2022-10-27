import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';

import { HFPhoneInput } from 'components/HookForm/HFPhoneInput';
import { LinkRef as Link } from 'components/UI/Link/Link';
import { SelectOption } from 'components/UI/Select/Select';

import { Currency } from 'types/entities/Currency';

import { Path } from 'constants/routes';
import { useLocalTranslation } from 'hooks/useLocalTranslation';

import { HFSelect } from '../../HookForm/HFSelect';
import { HFTextField } from '../../HookForm/HFTextField';
import { Box } from '../../UI/Box/Box';
import { Button } from '../../UI/Button/Button';
import { Checkbox } from '../../UI/Checkbox/Checkbox';
import { Typography } from '../../UI/Typography/Typography';
import translations from './Form.i18n.json';
import sx from './Form.styles';
import { OrderFormDocket } from './FormDocket';
import { getValidationSchema } from './validation';

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
  cities: SelectOption[];
  isSubmitError?: boolean;
  isFetching: boolean;
  delivery: number;
  deliveryProfiles: SelectOption[];
  currency?: Currency;
  onSubmit: (data: OrderFormType) => void;
  onSelectDeliveryProfile: (id: number) => void;
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
  isFetching,
  cities,
  currency,
  onSelectDeliveryProfile,
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

  const submit = (data: OrderFormType) => onSubmit(data);

  const changeDeliveryProfile = () => values.setValue('deliveryProfileId', -1);

  const agree = () => setIsAgree(!isAgree);

  const isSubmitBtnDisabled = !values.formState.isValid || !isAgree || isFetching;

  return (
    <FormProvider {...values}>
      <form onSubmit={values.handleSubmit(submit)}>
        <Box sx={sx.form}>
          <Box sx={sx.block}>
            <Typography variant='h6' sx={sx.title}>
              {t('details')}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <HFTextField name='firstName' label={t('firstName')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <HFTextField name='lastName' label={t('lastName')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                {' '}
                <HFPhoneInput name='phone' label={t('phone')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <HFTextField name='email' label={t('email')} type='email' />
              </Grid>
            </Grid>
          </Box>

          <Box sx={sx.block}>
            <Typography variant='h6' sx={sx.title}>
              {t('address')}
            </Typography>

            <Grid container spacing={2}>
              {deliveryProfiles.length !== 0 && (
                <Grid item xs={12}>
                  <HFSelect
                    onChange={value => onSelectDeliveryProfile(+value)}
                    name='deliveryProfileId'
                    options={deliveryProfiles}
                    label={t('profileSelect')}
                  />
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <HFSelect name='cityId' options={cities} label={t('city')} />
              </Grid>

              {addressFields.map(field => (
                <Grid key={field} item xs={12} sm={6}>
                  <HFTextField name={field} label={t(field)} onChange={changeDeliveryProfile} />
                </Grid>
              ))}

              <Grid item xs>
                <HFTextField sx={sx.textarea} multiline rows={3} name='comment' label={t('comment')} />
              </Grid>
            </Grid>

            <OrderFormDocket
              productsCount={productsCount}
              cost={cost}
              discount={discount}
              delivery={delivery}
              currency={currency}
            />

            <Checkbox
              sx={sx.agreement}
              value={isAgree}
              onChange={agree}
              label={
                <span style={sx.agreementLabel}>
                  Даю свое согласие с{' '}
                  <Link href={Path.OFERTA} target='_blank'>
                    условиями обслуживания
                  </Link>
                  , а также с &nbsp;
                  <Link href={Path.PRIVACY} target='_blank'>
                    политикой конфиденциальности и правилами хранения моих персональных данных
                  </Link>
                  .
                </span>
              }
            />

            <Button
              sx={sx.btn}
              type='submit'
              disabled={isSubmitBtnDisabled}
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
