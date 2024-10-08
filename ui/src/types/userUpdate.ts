import { Decoder, nullable, object, string } from 'decoders';

export interface PublicUser {
  FullName: string;
  PassCode: string | null;
  Phone: string | null;
}

export interface User extends PublicUser {
  Email: string;
  token: string;
}

export const userDecoder: Decoder<User> = object({
  Email: string,
  token: string,
  FullName: string,
  PassCode: nullable(string),
  Phone: nullable(string),
});

export interface UserSettings extends PublicUser {
  Email: string;
  PassCode: string | null;
}
