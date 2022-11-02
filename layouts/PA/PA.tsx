import React, { ReactNode, useState } from 'react';

import { useSignOutMutation } from 'store/api/authApi';
import { useGetCityListQuery } from 'store/api/cityApi';
import { useChangeCurrentCityMutation, useGetCurrentUserQuery } from 'store/api/currentUserApi';
import { useBuyCheeseCoinsMutation, useCreateInvoiceMutation } from 'store/api/invoiceApi';
import { useGetCurrentBalanceQuery } from 'store/api/walletApi';
import { selectedProductCount, selectedProductDiscount, selectedProductSum } from 'store/slices/orderSlice';

import { PrivateLayout } from 'layouts/Private/Private';

import { CheesecoinsAddModal } from 'components/Cheesecoins/AddModal/AddModal';
import { BuyCheeseCoinsModal } from 'components/Cheesecoins/BuyModal/BuyModal';
import { Header } from 'components/Header/Header';
import { useAppNavigation } from 'components/Navigation';
import { PAMenu } from 'components/PA/Menu/Menu';
import { Box } from 'components/UI/Box/Box';

import { Currency } from 'types/entities/Currency';

import { useAppSelector } from 'hooks/store';
import { useLocalTranslation } from 'hooks/useLocalTranslation';

import { contacts } from 'constants/contacts';
import { Path } from 'constants/routes';

import translations from './PA.i18n.json';
import sx from './PA.styles';

type BalanceCoinState = { isOpen: false } | { isOpen: true; coins?: number };
type BuyCoinsState = { isOpen: false } | { isOpen: true; price: number };

export interface PALayoutProps {
  children?: ReactNode;
}

export function PALayout({ children }: PALayoutProps) {
  const { language, pathname, currency } = useAppNavigation();

  const { data: cities } = useGetCityListQuery();
  const { data: currentUser } = useGetCurrentUserQuery();
  const { data: balance = 0 } = useGetCurrentBalanceQuery();

  const [signOut] = useSignOutMutation();
  const [changeCity] = useChangeCurrentCityMutation();
  const [createInvoiceMutation, { data: invoiceData }] = useCreateInvoiceMutation();
  const [buyCheeseCoins, { isLoading: isPaymentLoading }] = useBuyCheeseCoinsMutation();

  const { t } = useLocalTranslation(translations);

  const convertedCities =
    cities?.map(city => ({
      id: city.id,
      name: city.name[language],
    })) || [];

  const count = useAppSelector(selectedProductCount);
  const sum = useAppSelector(selectedProductSum);
  const sumDiscount = useAppSelector(selectedProductDiscount);

  const [balanceCoinsState, setBalanceCoinsState] = useState<BalanceCoinState>({
    isOpen: false,
  });
  const [payCoinsState, setPayCoinsState] = useState<BuyCoinsState>({
    isOpen: false,
  });

  const selectedCity = cities?.find(city => city.id === currentUser?.city?.id) || cities?.[0];

  const menuList = [
    {
      label: t('main'),
      value: `/${Path.PERSONAL_AREA}`,
    },
    {
      label: t('credentials'),
      value: `/${Path.PERSONAL_AREA}/${Path.CREDENTIALS}`,
    },
    {
      label: t('addresses'),
      value: `/${Path.PERSONAL_AREA}/${Path.ADDRESSES}`,
    },
    {
      label: t('orders'),
      value: `/${Path.PERSONAL_AREA}/${Path.ORDERS}`,
    },
    {
      label: t('discounts'),
      value: `/${Path.PERSONAL_AREA}/${Path.DISCOUNTS}`,
    },
    {
      label: t('payments'),
      value: `/${Path.PERSONAL_AREA}/${Path.PAYMENTS}`,
    },
  ];

  const handleAddCheeseCoinClick = ({ invoicePrice, coinsCount }: { invoicePrice: number; coinsCount: number }) => {
    setBalanceCoinsState({ isOpen: false });
    setPayCoinsState({
      isOpen: true,
      price: invoicePrice,
    });
    createInvoiceMutation({
      currency: 'RUB',
      amount: coinsCount,
      value: invoicePrice,
      payerUuid: currentUser?.id ?? '',
    });
  };

  const handleCloseBuyModal = () => {
    if (payCoinsState.isOpen) {
      const { price } = payCoinsState;
      setBalanceCoinsState({ isOpen: true, coins: price });
      setPayCoinsState({ isOpen: false });
    }
  };

  const handleOpenCoinsAddModal = () =>
    setBalanceCoinsState({
      isOpen: true,
      coins: undefined,
    });
  const handleCloseCoinsAddModal = () => setBalanceCoinsState({ isOpen: false });

  return (
    <PrivateLayout>
      <Box sx={sx.layout}>
        <Header
          {...contacts}
          selectedCityId={selectedCity?.id || 0}
          cities={convertedCities}
          currency={currency}
          basketProductCount={count}
          basketProductSum={sum - sumDiscount}
          moneyAmount={balance}
          onChangeCity={changeCity}
          onClickAddCoins={handleOpenCoinsAddModal}
          onClickSignout={signOut}
        />

        <Box sx={sx.content}>
          <PAMenu active={pathname} options={menuList} />
          {children}
        </Box>

        <CheesecoinsAddModal
          initCoins={balanceCoinsState.isOpen ? balanceCoinsState.coins : undefined}
          isOpened={balanceCoinsState.isOpen}
          onClose={handleCloseCoinsAddModal}
          onSubmit={handleAddCheeseCoinClick}
        />

        <BuyCheeseCoinsModal
          isOpened={payCoinsState.isOpen}
          invoiceUuid={invoiceData?.uuid}
          userId={currentUser?.id}
          userEmail={currentUser?.email}
          price={payCoinsState.isOpen ? payCoinsState.price : undefined}
          isLoading={isPaymentLoading}
          onClose={handleCloseBuyModal}
          onSubmit={buyCheeseCoins}
        />
      </Box>
    </PrivateLayout>
  );
}
