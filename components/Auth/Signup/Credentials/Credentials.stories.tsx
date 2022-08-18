import React from 'react';
import { ComponentStory, Meta } from '@storybook/react';

import { SignUpFormDto } from 'types/dto/signup-form.dto';
import { Box } from 'components/UI/Box/Box';
import { SignupCredentials, SignupCredentialsProps } from './Credentials';

export default {
  component: SignupCredentials,
  title: 'Signup/Credentials',
} as Meta;

const boxSx = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: 'gray',
};

const Template: ComponentStory<typeof SignupCredentials> = function (args: SignupCredentialsProps) {
  return (
    <Box sx={boxSx}>
      <SignupCredentials {...args} />
    </Box>
  );
};
export const DefaultSignupCredentials = Template.bind({});

const props: Partial<SignupCredentialsProps> = {
  defaultValues: {
    role: 'CLIENT',
    phone: '',
    firstName: '',
    lastName: '',
    sms: '',
    password: '',
    passwordConfirm: '',
  },
  onSubmit: (data: SignUpFormDto) => console.log(data),
};

DefaultSignupCredentials.args = props;
