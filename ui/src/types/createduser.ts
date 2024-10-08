import {boolean, Decoder,number, object,string } from 'decoders';

export interface UserCreated {
    FullName: string;
    Email: string;
    Phone: string;
    PassCode: string | null;
    UserRoles:string;
}
export const userDecoder: Decoder<UserCreated> = object({
  FullName: string,
  Email: string,
  Phone: string,
  PassCode: string,
  UserRoles:string,
});

export interface UserData {
  IsUserCreated: boolean; 
  IsApproved:boolean;
}

export const userCreateResponseDecoder: Decoder<UserData> = object({
  IsUserCreated: boolean,
  IsApproved:boolean
});
