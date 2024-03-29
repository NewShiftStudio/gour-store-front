import Image from 'next/image';
import React, { useState } from 'react';

import { AppBar, Badge, Collapse, Container, Grid, SxProps, useMediaQuery } from '@mui/material';

import { selectIsAuth } from 'store/selectors/auth';

import { Box } from 'components/UI/Box/Box';
import { IconButton } from 'components/UI/IconButton/IconButton';
import { LinkRef as Link } from 'components/UI/Link/Link';
import { Typography } from 'components/UI/Typography/Typography';

import { Path } from 'constants/routes';
import { useAppSelector } from 'hooks/store';
import { getCurrencySymbol } from 'utils/currencyUtil';

import { MobileMenu } from '../Mobile/Menu/Menu';
import { CitySelect } from './CitySelect';

import headerSx from './Header.styles';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CatalogIcon from 'assets/icons/catalog.svg';
import GamepadIcon from 'assets/icons/gamepad.svg';
import Logo from 'assets/images/common-logo.svg';
import { DesktopMenu } from './DesktopMenu/DesktopMenu';

export type HeaderProps = {
  isGame?: boolean;
  firstPhone: string;
  secondPhone: string;
  email: string;
  tg: string;
  inst: string;
  vk: string;
  selectedCityId: number;
  cities: {
    id: number;
    name: string;
  }[];
  basketProductCount: number;
  basketProductSum: number;
  moneyAmount: number;
  sx?: SxProps;
  onChangeCity(id: number): void;
  onClickAddCoins(): void;
  onClickSignout(): void;
};

export function Header({
  isGame,
  firstPhone,
  secondPhone,
  email,
  tg,
  inst,
  vk,
  selectedCityId,
  cities,
  basketProductCount,
  basketProductSum,
  moneyAmount,
  sx,
  onChangeCity,
  onClickAddCoins,
  onClickSignout,
}: HeaderProps) {
  const [isCitiesModalOpen, setIsCitiesModalOpen] = useState<boolean>(false);
  const [isMenuDeployed, setIsMenuDeployed] = useState(false);

  const isDesktop = useMediaQuery('(min-width: 600px)');

  const isAuth = useAppSelector(selectIsAuth);

  const currencySymbol = getCurrencySymbol();

  const currentCity = cities.find(it => it?.id === selectedCityId);

  const deployMenu = () => setIsMenuDeployed(!isMenuDeployed);

  const openCityModal = () => setIsCitiesModalOpen(true);

  const closeCityModal = () => setIsCitiesModalOpen(false);

  const selectCity = (id: number) => {
    onChangeCity(id);
    closeCityModal();
  };

  const onClickBasket = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ym(92190821,'reachGoal','went-to-basket')
  }

  return (
    <>
      <AppBar sx={{ ...headerSx.container, ...sx } as SxProps}>
        <Container sx={{ height: '100%', position: 'relative' }} maxWidth='lg'>
          <Grid container direction='row' justifyContent='center' alignItems='center' sx={{ height: '100%' }}>

            <Grid item xs={0} md={3} lg={5} container direction='row' alignItems='center' justifyContent='flex-start'>
              {!isGame && isDesktop && (
                  <IconButton sx={headerSx.menuBtn} color='inherit' onClick={deployMenu}>
                    {!isMenuDeployed ? <MenuIcon sx={headerSx.menuIcon} /> : <CloseIcon sx={headerSx.menuIcon} />}
                  </IconButton>
              )}
              <Collapse in={isMenuDeployed && isDesktop} timeout='auto' unmountOnExit>
                <DesktopMenu/>
              </Collapse>
              <Link href={`tel:${firstPhone}`} variant='body1' color='inherit' sx={headerSx.phone}>
                {firstPhone}
              </Link>
              <Box sx={headerSx.city} onClick={openCityModal}>
                <PlaceOutlinedIcon />
                <Typography sx={headerSx.cityTitle} variant='body1'>
                  {currentCity?.name}
                </Typography>
                <KeyboardArrowDownIcon />
              </Box>
            </Grid>

            <Grid item xs={2} md={2} lg={3} container direction='row' alignItems='flex-start' justifyContent='center'>
              <Box sx={headerSx.logo}>
                <Link href='/'>
                  <Image src={Logo} height='49px' width='58px' alt='' />
                </Link>
              </Box>
            </Grid>

            <Grid
              item
              xs={10}
              md={7}
              lg={4}
              container
              direction='row'
              alignItems='center'
              justifyContent='flex-end'
              sx={{ gap: '20px' }}
            >
              <Box
                sx={{
                  ...headerSx.money,
                  display: 'none',
                  // display: {
                  //   xs: isGame ? 'flex' : 'none',
                  //   sm: 'flex',
                  // },
                }}
              >
                <Typography variant='body2' sx={headerSx.moneyAmount}>
                  {moneyAmount}
                  &nbsp;
                  {currencySymbol}
                </Typography>

                <IconButton onClick={onClickAddCoins} color='inherit' sx={headerSx.replenishment}>
                  <AddIcon color='primary' />
                </IconButton>
              </Box>

              {isGame ? (
                <Link href='/' color='inherit' sx={headerSx.icon}>
                  <Image src={CatalogIcon} height={24} width={24} alt='' />
                </Link>
              ) : (
                <Link href={`/${Path.GAME}`} color='inherit' sx={headerSx.icon}>
                  <Image src={GamepadIcon} height={24} width={24} alt='' />
                </Link>
              )}

              <Link href={isAuth ? `/${Path.FAVORITES}` : `/${Path.AUTH}`} color='inherit' sx={headerSx.icon}>
                <FavoriteBorderIcon />
              </Link>

              <Link href={isAuth ? `/${Path.PERSONAL_AREA}` : `/${Path.AUTH}`} color='inherit' sx={headerSx.icon}>
                <PersonIcon />
              </Link>

              <Link href={`/${Path.BASKET}`} onClick={onClickBasket} sx={headerSx.cart}>
                <Badge sx={headerSx.cartBadge} badgeContent={basketProductCount} color='primary'>
                  <ShoppingCartOutlinedIcon color='primary' />
                </Badge>
                {basketProductSum}
                &nbsp;
                {currencySymbol}
              </Link>

              {isAuth && (
                <IconButton onClick={onClickSignout} color='inherit' sx={headerSx.icon}>
                  <LogoutIcon />
                </IconButton>
              )}

              {!isGame && !isDesktop && (
                <IconButton sx={headerSx.menuBtn} color='inherit' onClick={deployMenu}>
                  {!isMenuDeployed ? <MenuIcon sx={headerSx.menuIcon} /> : <CloseIcon sx={headerSx.menuIcon} />}
                </IconButton>
              )}
            </Grid>
          </Grid>
        </Container>

        <Collapse in={isMenuDeployed && !isDesktop} timeout='auto' unmountOnExit>
          <MobileMenu
            selectedCityId={selectedCityId}
            cities={cities}
            firstPhone={firstPhone}
            secondPhone={secondPhone}
            email={email}
            tg={tg}
            inst={inst}
            vk={vk}
            onChangeCity={onChangeCity}
            onClickSignout={onClickSignout}
          />
        </Collapse>
      </AppBar>

      <CitySelect
        isOpen={isCitiesModalOpen}
        selected={selectedCityId}
        cities={cities}
        onSelect={selectCity}
        onClose={closeCityModal}
      />
    </>
  );
}
