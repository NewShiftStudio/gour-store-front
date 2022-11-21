import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

import { PayInvoiceDto, PayServerInvoiceDto } from 'types/dto/invoice/payInvoice.dto';
import { CreateOrderDto } from 'types/dto/order/create.dto';
import { IInvoice } from 'types/entities/IInvoice';
import { IOrder } from 'types/entities/IOrder';

import { Path } from 'constants/routes';
import { CardValidationError } from 'errors/CardValidationError';

import { commonApi } from './commonApi';

export const orderApi = commonApi.injectEndpoints({
  endpoints(builder) {
    return {
      getOrdersList: builder.query<IOrder[], void>({
        query() {
          return {
            method: 'GET',
            url: Path.ORDERS,
          };
        },
        providesTags: ['Wallet'],
      }),
      createOrder: builder.mutation<IOrder, CreateOrderDto>({
        query(product) {
          return {
            method: 'POST',
            url: Path.ORDERS,
            body: product,
          };
        },
        invalidatesTags: ['Wallet'],
      }),

      payOrder: builder.mutation<IInvoice, PayInvoiceDto>({
        async queryFn(args, _queryApi, _extraOptions, fetchWithBQ) {
          const { cardNumber, expDateMonth, expDateYear, cvv, email, invoiceUuid, payerUuid } = args;
          const checkoutValues = {
            cvv,
            cardNumber,
            expDateMonth,
            expDateYear,
          };

          let signature: string;
          try {
            const checkout = new cp.Checkout({ publicId: process.env.NEXT_PUBLIC_PAYMENT_PUBLIC_ID as string });
            signature = await checkout.createPaymentCryptogram(checkoutValues);
          } catch (e) {
            if (typeof e === 'object' && 'cardNumber' in (e as object)) {
              return {
                error: {
                  data: new CardValidationError('Неправильный номер карты'),
                  originalStatus: 400,
                } as any,
              };
            }

            return {
              error: {
                data: new CardValidationError('Ошибка валидации карты'),
                originalStatus: 400,
              } as any,
            };
          }

          const paymentDto: PayServerInvoiceDto = {
            signature,
            email,
            ipAddress: '5.18.144.32',
            payerUuid,
            currency: 'RUB',
            invoiceUuid,
          };

          const paymentResult = await fetchWithBQ({
            url: '/orders/pay-order', // TODO: вынести в константы пути
            body: paymentDto,
            method: 'POST',
          });

          if (paymentResult.data) {
            const redirectUri = (paymentResult.data as { redirect: string }).redirect;
            if (redirectUri) window.open(redirectUri, '_self');
          }

          return paymentResult.data
            ? { data: paymentResult.data as IInvoice }
            : { error: paymentResult.error as FetchBaseQueryError };
        },
        invalidatesTags: ['Wallet', 'Invoice'],
      }),
    };
  },
});

export const { useGetOrdersListQuery, useCreateOrderMutation, usePayOrderMutation } = orderApi;
