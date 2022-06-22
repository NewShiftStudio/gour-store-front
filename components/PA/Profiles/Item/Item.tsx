import React from 'react';
import { useRouter } from 'next/router';
import { Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';

import LocationIcon from '@mui/icons-material/LocationOnOutlined';
import ExpandIcon from '@mui/icons-material/ExpandMore';

import { PAProfilesForm } from '../Form/Form';
import { Box } from '../../../UI/Box/Box';
import { Typography } from '../../../UI/Typography/Typography';
import { IOrderProfile } from '../../../../@types/entities/IOrderProfile';
import { OrderProfileDto } from '../../../../@types/dto/order/profile.dto';
import { LocalConfig } from 'hooks/useLocalTranslation';
import { defaultTheme as theme } from '../../../../themes';

import sx from './Item.styles';

export type PAProfilesItemProps = {
  isExpanded?: boolean;
  isMain?: boolean;
  cities: {
    value: number;
    label: string;
  }[];
  profile?: IOrderProfile;
  onExpand?: () => void;
  onSave: (data: OrderProfileDto) => void;
  onDelete: () => void;
};

export function PAProfilesItem({
  isExpanded,
  isMain,
  cities,
  profile,
  onExpand,
  onSave,
  onDelete,
}: PAProfilesItemProps) {
  const router = useRouter();

  const locale: keyof LocalConfig = (router?.locale as keyof LocalConfig) || 'ru';

  const address = profile
    ? [
        profile.city.name[locale],
        profile.street,
        profile.house,
        profile.apartment && `${locale === 'ru' ? 'кв.' : 'apt.'} ${profile.apartment}`,
      ]
        .filter(it => !!it)
        .join(', ')
    : '';

  const convertToOrderProfile = (profile: IOrderProfile) =>
    ({
      title: profile.title,
      cityId: profile.city.id,
      street: profile.street,
      house: profile.house,
      apartment: profile.apartment,
      entrance: profile.entrance,
      floor: profile.floor,
      comment: profile.comment,
      isMain,
    } as OrderProfileDto);

  return !!profile ? (
    <Accordion expanded={isExpanded} onChange={onExpand} sx={{ ...sx.profile, ...(isExpanded && sx.expanded) }}>
      <AccordionSummary expandIcon={<ExpandIcon htmlColor={theme.palette.text.muted} />} sx={sx.summary}>
        <Box sx={sx.header}>
          <Box sx={{ ...sx.locationIcon, ...(isMain && sx.mainAddress) }}>
            <LocationIcon />
          </Box>

          <Typography variant="h5" sx={sx.title}>
            {profile?.title}
          </Typography>

          <Typography variant="body1" color="text.muted">
            {address}
          </Typography>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={sx.details}>
        <Divider sx={sx.divider} />
        <PAProfilesForm
          defaultValues={profile && convertToOrderProfile(profile)}
          cities={cities}
          onSave={onSave}
          onDelete={onDelete}
        />
      </AccordionDetails>
    </Accordion>
  ) : (
    <Box sx={{ ...sx.profile, ...sx.expanded }}>
      <PAProfilesForm cities={cities} onSave={onSave} onDelete={onDelete} />
    </Box>
  );
}