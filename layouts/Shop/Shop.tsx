import { ReactNode, useState } from 'react';

import { useSignOutMutation } from 'store/api/authApi';
import { useGetCityListQuery } from 'store/api/cityApi';
import { useChangeCurrentCityMutation, useGetCurrentUserQuery } from 'store/api/currentUserApi';
import { useBuyCheeseCoinsMutation, useCreateInvoiceMutation } from 'store/api/invoiceApi';
import { useGetCurrentBalanceQuery } from 'store/api/walletApi';
import { selectIsAuth } from 'store/selectors/auth';
import { selectedProductCount, selectedProductDiscount, selectedProductSum } from 'store/slices/orderSlice';

import { CheesecoinsAddModal } from 'components/Cheesecoins/AddModal/AddModal';
import { BuyCheeseCoinsModal } from 'components/Cheesecoins/BuyModal/BuyModal';
import { Footer } from 'components/Footer/Footer';
import { Header } from 'components/Header/Header';
import { useAppNavigation } from 'components/Navigation';
import { Box } from 'components/UI/Box/Box';

import { Currency } from 'types/entities/Currency';
import { Language } from 'types/entities/Language';

import { useAppSelector } from 'hooks/store';

import { contacts } from 'constants/contacts';

import sx from './Shop.styles';

type BuyCheeseCoinState = { isOpenModal: false; price: null } | { isOpenModal: true; price: number };

export interface ShopLayoutProps {
  children?: ReactNode;
}

export function ShopLayout({ children }: ShopLayoutProps) {
  const { currency, language } = useAppNavigation();

  const { data: cities } = useGetCityListQuery();
  const { data: currentUser } = useGetCurrentUserQuery();
  const { data: balance = 0 } = useGetCurrentBalanceQuery();

  const [isCheeseCoinModalOpen, toggleCheeseCoinModalOpen] = useState(false);
  const [buyCheeseCoinState, setBuyCheeseCoinState] = useState<BuyCheeseCoinState>({
    isOpenModal: false,
    price: null,
  });

  const isAuth = useAppSelector(selectIsAuth);

  const [buyCheeseCoins, { isLoading: isPaymentLoading }] = useBuyCheeseCoinsMutation();
  const [createInvoiceMutation, { data: invoiceData }] = useCreateInvoiceMutation();
  const [changeCity] = useChangeCurrentCityMutation();
  const [signOut] = useSignOutMutation();

  const convertedCities =
    cities?.map(city => ({
      id: city.id,
      name: city.name[language],
    })) || [];

  const count = useAppSelector(selectedProductCount);
  const sum = useAppSelector(selectedProductSum);
  const sumDiscount = useAppSelector(selectedProductDiscount);

  const selectedCity = cities?.find(city => city.id === currentUser?.city?.id) || cities?.[0];

  const handleAddCheeseCoinClick = ({ invoicePrice, coinsCount }: { invoicePrice: number; coinsCount: number }) => {
    toggleCheeseCoinModalOpen(false);
    setBuyCheeseCoinState({
      isOpenModal: true,
      price: invoicePrice,
    });
    createInvoiceMutation({
      currency: 'RUB',
      amount: coinsCount,
      value: invoicePrice,
      payerUuid: currentUser?.id ?? '',
    });
  };

  const onCloseBuyModal = () =>
    setBuyCheeseCoinState({
      isOpenModal: false,
      price: null,
    });

  const onOpenCoinsAddModal = () => toggleCheeseCoinModalOpen(true);
  const onCloseCoinsAddModal = () => toggleCheeseCoinModalOpen(false);

  return (
    <Box sx={sx.layout}>
      {isAuth && (
        <Header
          {...contacts}
          selectedCityId={selectedCity?.id || 0}
          cities={convertedCities}
          currency={currency}
          basketProductCount={count}
          basketProductSum={sum - sumDiscount}
          moneyAmount={balance}
          onChangeCity={changeCity}
          onClickAddCoins={onOpenCoinsAddModal}
          onClickSignout={signOut}
        />
      )}

      <Box sx={sx.content}>{children}</Box>

      <Footer {...contacts} sx={sx.footer} />

      <CheesecoinsAddModal
        isOpened={isCheeseCoinModalOpen}
        onClose={onCloseCoinsAddModal}
        onSubmit={handleAddCheeseCoinClick}
      />

      <BuyCheeseCoinsModal
        isOpened={buyCheeseCoinState.isOpenModal}
        userEmail={currentUser?.email}
        userId={currentUser?.id}
        invoiceUuid={invoiceData?.uuid}
        price={buyCheeseCoinState.price}
        isLoading={isPaymentLoading}
        onClose={onCloseBuyModal}
        onSubmit={buyCheeseCoins}
      />
    </Box>
  );
}
