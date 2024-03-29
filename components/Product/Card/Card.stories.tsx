import React, { useState } from 'react';

import { ComponentStory, Meta } from '@storybook/react';

import { imageByCountry } from 'constants/countries';

import { ProductCard, ProductCardProps } from './Card';

import cheeseBackground from 'assets/images/categories/cheese-background.png';

export default {
  component: ProductCard,
  title: 'Product/Card',
} as Meta;

const Template: ComponentStory<typeof ProductCard> = args => {
  const [isElected, setIsElected] = useState(false);
  const [amount, setWeight] = useState(0);

  const changeIsElect = () => setIsElected(!isElected);

  const increaseWeight = (_gram: number) => setWeight(amount + 1);
  const decreaseWeight = (_gram: number) => setWeight(amount - 1);

  return (
    <ProductCard {...args} productType='Сыр' onElect={changeIsElect} onAdd={increaseWeight} onRemove={decreaseWeight} />
  );
};

export const DefaultProductInformation = Template.bind({});

const props: Partial<ProductCardProps> = {
  title: 'Русский сыр',
  rating: 4.93,
  price: 350,
  discount: 10,
  previewImg: '',
  countryImg: imageByCountry.Russia,
  backgroundImg: cheeseBackground,
  isElected: false,
};

DefaultProductInformation.args = props;
