import { ReactNode, useState } from 'react';

import {  getCurrentUserCity} from 'store/slices/authSlice';
import {  setCurrentCity } from 'store/slices/citySlice';

import { useSignOutMutation } from 'store/api/authApi';
import { useGetCityListQuery } from 'store/api/cityApi';
import { useChangeCurrentCityMutation, useGetCurrentUserQuery } from 'store/api/currentUserApi';
import { useBuyCheeseCoinsMutation, useCreateInvoiceMutation } from 'store/api/invoiceApi';
import { useGetCurrentBalanceQuery } from 'store/api/walletApi';
import { selectIsAuth } from 'store/selectors/auth';
import {selectedProductCount, selectedProductSum} from 'store/slices/orderSlice';

import { CheesecoinsAddModal } from 'components/Cheesecoins/AddModal/AddModal';
import { BuyCheeseCoinsModal } from 'components/Cheesecoins/BuyModal/BuyModal';
import { Footer } from 'components/Footer/Footer';
import { Header } from 'components/Header/Header';
import { useAppNavigation } from 'components/Navigation';
import { Box } from 'components/UI/Box/Box';

import { PayInvoiceDto } from 'types/dto/invoice/payInvoice.dto';
import { InvoiceStatus } from 'types/entities/IInvoice';
import { NotificationType } from 'types/entities/Notification';

import { contacts } from 'constants/contacts';
import { useAppDispatch, useAppSelector } from 'hooks/store';
import { dispatchNotification } from 'packages/EventBus';
import { getErrorMessage } from 'utils/errorUtil';

import sx from './Shop.styles';

type BalanceCoinState = { isOpen: false } | { isOpen: true; coins?: number };
type BuyCoinsState = { isOpen: false } | { isOpen: true; price: number };

export interface ShopLayoutProps {
  children?: ReactNode;
}

export function ShopLayout({ children }: ShopLayoutProps) {
  const { language, goToSuccessPayment, goToFailurePayment } = useAppNavigation();

  const isAuth = useAppSelector(selectIsAuth);

  const { data: cities } = useGetCityListQuery();
  const { data: currentUser } = useGetCurrentUserQuery(undefined,{skip: !isAuth});
  const { data: balance = 0 } = useGetCurrentBalanceQuery(undefined,{skip: !isAuth});

  const [balanceCoinsState, setBalanceCoinsState] = useState<BalanceCoinState>({
    isOpen: false,
  });
  const [payCoinsState, setPayCoinsState] = useState<BuyCoinsState>({
    isOpen: false,
  });

  const [buyCheeseCoins, { isLoading: isPaymentLoading }] = useBuyCheeseCoinsMutation();
  const [createInvoiceMutation, { data: invoiceData }] = useCreateInvoiceMutation();
  const [changeCity] = useChangeCurrentCityMutation();
  const [signOut] = useSignOutMutation();

  const dispatch = useAppDispatch();
  const updateCity = (cityId:any) => {
    const city = cities?.find((city) => city.id === cityId);
    if (city) {
      if (isAuth) {
        changeCity(cityId);
      }

      dispatch(setCurrentCity(city));
    }
  }

  const convertedCities =
    cities?.map(city => ({
      id: city.id,
      name: city.name[language],
    })) || [];

  const count = useAppSelector(selectedProductCount);
  const totalProductSum = useAppSelector((state) => selectedProductSum(state,currentUser));

  const selectedCity = useAppSelector(getCurrentUserCity) || cities?.[0];

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

  const handleBuyCheeseCoins = async (buyData: PayInvoiceDto) => {
    try {
      const result = await buyCheeseCoins(buyData).unwrap();
      if (result.status === InvoiceStatus.PAID) goToSuccessPayment(buyData.price);
      if (result.status === InvoiceStatus.FAILED) goToFailurePayment();
    } catch (e) {
      const mayBeError = getErrorMessage(e);
      if (mayBeError) {
        dispatchNotification(mayBeError, { type: NotificationType.DANGER });
      } else {
        goToFailurePayment();
      }
    }
  };

  const handleOpenCoinsAddModal = () =>
    setBalanceCoinsState({
      isOpen: true,
      coins: undefined,
    });
  const handleCloseCoinsAddModal = () => setBalanceCoinsState({ isOpen: false });

  return (
    <Box sx={sx.layout}>
      {
        <Header
          {...contacts}
          selectedCityId={selectedCity?.id || 0}
          cities={convertedCities}
          basketProductCount={count}
          basketProductSum={totalProductSum}
          moneyAmount={balance}
          onChangeCity={updateCity}
          onClickAddCoins={handleOpenCoinsAddModal}
          onClickSignout={signOut}
        />
      }

      <Box sx={sx.content}>{children}</Box>

      <Footer {...contacts} sx={sx.footer} />

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
        fullName={[currentUser?.firstName, currentUser?.lastName].join(' ')}
        code={currentUser?.referralCode?.code || ''}
        price={payCoinsState.isOpen ? payCoinsState.price : undefined}
        isLoading={isPaymentLoading}
        onClose={handleCloseBuyModal}
        onSubmit={handleBuyCheeseCoins}
      />
    </Box>
  );
}
