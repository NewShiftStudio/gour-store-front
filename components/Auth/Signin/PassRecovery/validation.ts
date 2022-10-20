import * as yup from 'yup';

import { Translator } from 'types/entities/Translator';

const passRegExp = /^(?=.*?[0-9]).{8,}$/;

export const getSchema = (t: Translator) =>
  yup.object().shape({
    email: yup.string().required(t('emailEmpty')),
    password: yup.string().matches(passRegExp, t('passwordError')),
    passwordConfirm: yup.string().oneOf([yup.ref('password'), null], t('passwordsDoNotMatch')),
  });
