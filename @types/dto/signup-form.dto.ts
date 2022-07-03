import { Role } from '../../@types/entities/Role';

export type SignUpFormDto = Readonly<{
  role: Role;
  phone: string;
  sms: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirm: string;
}>;
