import React, { useState } from 'react';

import { ComponentStory, Meta } from '@storybook/react';

import { ProductActions, ProductActionsProps } from './Actions';

export default {
  component: ProductActions,
  title: 'Product/Actions',
} as Meta;

const Template: ComponentStory<typeof ProductActions> = args => {
  const [count, setCount] = useState(0);

  const handleAddToCart = () => {
    setCount(count + 1);
  };
  const handleRemoveFromCart = () => {
    if (count === 0) return;
    setCount(count - 1);
  };
  // TODO: исправить логику
  return <ProductActions {...args} onAdd={handleAddToCart} onRemove={handleRemoveFromCart} />;
};
export const DefaultProductPreview = Template.bind({});

const props: Partial<ProductActionsProps> = {
  price: 500,
  discount: 50,
};

DefaultProductPreview.args = props;
