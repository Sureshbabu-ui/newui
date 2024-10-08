import * as yup from 'yup';

export const createGstNumberValidation = (requiredMessage: string, patternMessage: string) => {
    return yup.string().required(requiredMessage).matches(/^[0-9]{2}[A-Z]{3}[PHAFCT]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[0-9]{1}Z[a-zA-Z0-9]{1}$/,patternMessage);
};