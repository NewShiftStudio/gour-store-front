import Image from 'next/image';
import React, { Fragment, useState } from 'react';

import { Box, Collapse, Divider, List, ListItemButton } from '@mui/material';

import { ListItemLink } from 'components/UI/List/List';
import { Typography } from 'components/UI/Typography/Typography';


import { Path } from 'constants/routes';
import { useLocalTranslation } from 'hooks/useLocalTranslation';

import translations from './Menu.i18n.json';
import { MobileMenuContacts } from './MenuContacts';

import sx from './Menu.styles';

import arrowIcon from 'assets/icons/mobile/arrow.svg';
import lightArrowIcon from 'assets/icons/mobile/light-arrow.svg';
import locationIcon from 'assets/icons/mobile/location.svg';

export type MobileMenuProps = {
  selectedCityId: number;
  cities: {
    name: string;
    id: number;
  }[];
  firstPhone: string;
  secondPhone: string;
  email: string;
  tg: string;
  inst: string;
  vk: string;
  onChangeCity(id: number): void;
  onClickSignout(): void;
};

export function MobileMenu({
  selectedCityId,
  cities,
  firstPhone,
  secondPhone,
  email,
  tg,
  inst,
  vk,
  onChangeCity,
  onClickSignout,
}: MobileMenuProps) {
  const [citiesIsOpened, setCitiesIsOpened] = useState(false);

  const { t } = useLocalTranslation(translations);

  const currentCity = cities.find(city => city?.id === selectedCityId);

  const selectCity = (id: number) => {
    onChangeCity(id);
    setCitiesIsOpened(false);
  };

  return (
    <List sx={sx.list} disablePadding>
      {/* <Box sx={sx.money}>
        <Typography variant='body2' sx={sx.moneyAmount}>
          {moneyAmount}
          &nbsp;
          {currencySymbol}
        </Typography>

        <IconButton onClick={onClickAddCoins} color='inherit' sx={sx.replenishment}>
          <AddIcon color='primary' />
        </IconButton>
      </Box> */}

      <Divider sx={sx.divider} />

      <ListItemButton sx={sx.listItem} onClick={() => setCitiesIsOpened(!citiesIsOpened)}>
        <Box sx={sx.city}>
          <Box sx={sx.locationIcon}>
            <Image src={locationIcon} layout='fill' alt='' />
          </Box>

          <Typography sx={sx.title}>{currentCity?.name}</Typography>
        </Box>

        <Box sx={Object.assign([sx.arrowIcon, citiesIsOpened && sx.invertedArrow])}>
          <Image src={arrowIcon} layout='fill' alt='' />
        </Box>
      </ListItemButton>

      <Divider sx={sx.divider} />

      <Collapse in={citiesIsOpened} timeout='auto' unmountOnExit>
        <List component='div' disablePadding>
          {cities.map(city => (
            <Fragment key={city.name}>
              <ListItemButton sx={sx.listItem} onClick={() => selectCity(city.id)}>
                <Typography sx={Object.assign([sx.title, sx.cityTitle, city.id === currentCity?.id && sx.accent])}>
                  {city.name}
                </Typography>
              </ListItemButton>
              <Divider sx={sx.divider} />
            </Fragment>
          ))}
        </List>
      </Collapse>
        <Divider sx={sx.divider} />

      <ListItemLink sx={{ ...sx.listItem, ...sx.bigItem }} href={`/${Path.GAME}`}>
        <Typography sx={sx.title}>{t('game')}</Typography>

        <Box sx={{ ...sx.arrowIcon, ...sx.grayArrow }}>
          <Image src={lightArrowIcon} layout='fill' alt='' />
        </Box>
      </ListItemLink>
        <Divider sx={sx.divider} />

      <ListItemLink sx={{ ...sx.listItem, ...sx.bigItem }} href={`/${Path.HOME}`}>
        <Typography sx={sx.title}>Каталог товаров</Typography>

        <Box sx={{ ...sx.arrowIcon, ...sx.grayArrow }}>
          <Image src={lightArrowIcon} layout='fill' alt='' />
        </Box>
      </ListItemLink>
        <Divider sx={sx.divider} />

      <ListItemLink sx={{ ...sx.listItem, ...sx.bigItem }} href={`/${Path.ABOUTUS}`}>
        <Typography sx={sx.title}>О компании</Typography>

        <Box sx={{ ...sx.arrowIcon, ...sx.grayArrow }}>
          <Image src={lightArrowIcon} layout='fill' alt='' />
        </Box>
      </ListItemLink>
        <Divider sx={sx.divider} />

      <ListItemLink sx={{ ...sx.listItem, ...sx.bigItem }} href={`/${Path.DELIVERY}`}>
        <Typography sx={sx.title}>Доставка</Typography>

        <Box sx={{ ...sx.arrowIcon, ...sx.grayArrow }}>
          <Image src={lightArrowIcon} layout='fill' alt='' />
        </Box>
      </ListItemLink>
        <Divider sx={sx.divider} />

      <ListItemLink sx={{ ...sx.listItem, ...sx.bigItem }} href={`/${Path.PROMOTIONS}`}>
        <Typography sx={sx.title}>Акции</Typography>

        <Box sx={{ ...sx.arrowIcon, ...sx.grayArrow }}>
          <Image src={lightArrowIcon} layout='fill' alt='' />
        </Box>
      </ListItemLink>

      <Divider sx={sx.divider} />

      <ListItemLink sx={{ ...sx.listItem, ...sx.bigItem }} href={`/${Path.PERSONAL_AREA}`}>
        <Typography sx={sx.title}>{t('personalArea')}</Typography>

        <Box sx={{ ...sx.arrowIcon, ...sx.grayArrow }}>
          <Image src={lightArrowIcon} layout='fill' alt='' />
        </Box>
      </ListItemLink>

      <Divider sx={sx.divider} />

      <ListItemLink sx={{ ...sx.listItem, ...sx.bigItem }} href={`/${Path.FAVORITES}`}>
        <Typography sx={sx.title}>{t('favorites')}</Typography>

        <Box sx={{ ...sx.arrowIcon, ...sx.grayArrow }}>
          <Image src={lightArrowIcon} layout='fill' alt='' />
        </Box>
      </ListItemLink>

      <Divider sx={sx.divider} />

      <ListItemButton sx={sx.bigItem} onClick={onClickSignout}>
        <Typography sx={sx.title}>{t('signOut')}</Typography>
      </ListItemButton>

      <Divider sx={sx.divider} />

      <MobileMenuContacts firstPhone={firstPhone} secondPhone={secondPhone} email={email} tg={tg} inst={inst} vk={vk} />
    </List>
  );
}
