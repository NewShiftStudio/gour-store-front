import React, { useState } from 'react';

import { ComponentStory, Meta } from '@storybook/react';
import { FilterMultiselect, FilterMultiselectProps } from './Multiselect';

export default {
  component: FilterMultiselect,
  title: 'Catalog/Multiselect',
} as Meta;

const Template: ComponentStory<typeof FilterMultiselect> = (args: FilterMultiselectProps) => {
  const [selectedList, setSelectedList] = useState<string[]>([]);
  return <FilterMultiselect {...args} selected={selectedList} onChange={setSelectedList} />;
};
export const DefaultFilterMultiselect = Template.bind({});
const props: Partial<FilterMultiselectProps> = {
  title: 'Категории сыра',
  options: [
    {
      label: 'Мягкий',
      value: 'test1',
    },
    {
      label: 'Полутвердый',
      value: 'test2',
    },
    {
      label: 'Твёрдый',
      value: 'test3 ',
    },
  ],
  selected: [],
  onChange: selected => console.log(selected),
};

DefaultFilterMultiselect.args = props;