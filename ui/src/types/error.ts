import { array, dict, string } from 'decoders';

export type GenericErrors = Record<string, string[]>;

export const genericErrorsDecoder = dict(array(string));

export type ValidationErrors = {
    [key: string]: string;
}