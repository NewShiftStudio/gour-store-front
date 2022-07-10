import React from 'react';

import translations from './Modal.i18n.json';
import { useLocalTranslation } from '../../../../hooks/useLocalTranslation';
import { Modal } from '../../../UI/Modal/Modal';
import { Box } from '../../../UI/Box/Box';
import { Typography } from '../../../UI/Typography/Typography';
import { ToggleButton } from '../../../UI/ToggleButton/ToggleButton';
import { ProductFilterMultiselect } from '../Multiselect/Multiselect';
import { Filters } from '../List/List';
import { ICategory } from '../../../../@types/entities/ICategory';
import { Language } from '../../../../@types/entities/Language';
import { CHARACTERISTICS } from '../../../../constants/characteristics';

const sx = {
  title: {
    marginBottom: '10px',
    fontFamily: 'Roboto slab',
    fontWeight: 'bold',
    color: 'text.secondary',
  },
};

export type ProductFilterModalProps = {
  isOpen: boolean;
  categories: ICategory[];
  filters: Filters;
  language: Language;
  onCategoryChange: (key: string) => void;
  onCharacteristicChange: (key: string, selected: string[]) => void;
  onClose(): void;
};

export function ProductFilterModal({
  isOpen,
  categories,
  filters,
  language,
  onCategoryChange,
  onCharacteristicChange,
  onClose,
}: ProductFilterModalProps) {
  const { t } = useLocalTranslation(translations);

  const features = Object.keys(CHARACTERISTICS).filter(
    it =>
      CHARACTERISTICS[it].categoryKey === filters.category ||
      CHARACTERISTICS[it].categoryKey === 'all'
  );

  return (
    <Modal isOpen={isOpen} title={t('title')} onClose={onClose}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box>
          {categories?.map(category => (
            <ToggleButton
              key={category.id}
              selected={filters.category === category.key}
              sx={{ marginRight: '10px' }}
              onChange={() => onCategoryChange(category.key)}
            >
              {category.title[language]}
            </ToggleButton>
          ))}
        </Box>

        <Box
          sx={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}
        >
          <Typography variant="h6" sx={sx.title}>
            {t('filters')}
          </Typography>

          {features.map(feature => (
            <ProductFilterMultiselect
              key={feature}
              title={CHARACTERISTICS[feature].label[language]}
              selected={filters.characteristics[feature] || []}
              options={CHARACTERISTICS[feature].values.map(it => ({
                value: it.key,
                label: it.label[language],
              }))}
              sx={{ marginBottom: '10px' }}
              isMobile
              onChange={selected => onCharacteristicChange(feature, selected)}
            />
          ))}
        </Box>
      </Box>
    </Modal>
  );
}