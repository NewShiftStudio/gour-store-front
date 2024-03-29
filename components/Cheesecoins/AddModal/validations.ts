import * as yup from 'yup';

import { Translator } from 'types/entities/Translator';

export const MINIMUM_AMOUNT = 1_000;

export const getValidationSchema = (t: Translator) =>
  yup.object().shape({
    count: yup
      .number()
      .min(MINIMUM_AMOUNT, t('minCount'))
      .integer(t('correctDecimal'))
      .typeError(t('countRequired'))
      .required(t('countRequired')),
  });
