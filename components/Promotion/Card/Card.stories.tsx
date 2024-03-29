import React from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { PromotionCard } from './Card';

export default {
  title: 'Promotion/Card',
  component: PromotionCard,
} as ComponentMeta<typeof PromotionCard>;

const Template: ComponentStory<typeof PromotionCard> = args => <PromotionCard {...args} />;

export const DefaultState = Template.bind({});
DefaultState.args = {
  image:
    'https://images.unsplash.com/photo-1641642399335-6867075ee7db?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
};
