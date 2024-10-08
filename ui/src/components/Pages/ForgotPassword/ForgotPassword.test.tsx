import { Err, Ok } from '@hqoss/monads';
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { store } from '../../../state/store';
import { PasswordReset } from '../../../services/login';
import { ForgotPassword } from "./ForgotPassword";
import {
    formSubmitted,
    initializeForgot,
    updateCode,
    updateErrors,
    updateField,
} from './ForgotPassword.slice';
import { I18nextProvider } from "react-i18next";
import i18n from '../../../i18nTest'

jest.mock('../../../services/login');

describe('forgotPassword slice', () => {

    const initialState = {
        credentials: {
            email: "",
        },
        errors: {},
        submitted: false,
        response: {
            IsCodeGenerated: false,
        },
    };

    it('should return the initial state', () => {
        expect(store.getState().forgotPassword).toEqual(initialState);
    });

    it('should initialize the store', async () => {
        await act(async () => {
            store.dispatch(initializeForgot())
        })
        expect(store.getState().forgotPassword).toEqual(initialState);
    });

    it('should update email field', async () => {
        await act(async () => {
            store.dispatch(updateField({ name: "email", value: "ds@dsa.ad" }))
        })
        expect(store.getState().forgotPassword.credentials.email).toEqual("ds@dsa.ad");
    });

    it('should update errors', async () => {
        await act(async () => {
            store.dispatch(updateErrors({ Email: ["Email is not in valid format"] }))
        })
        expect(store.getState().forgotPassword.errors["Email"]).toEqual(["Email is not in valid format"]);
    });

    it('should update code', async () => {
        await act(async () => {
            store.dispatch(updateCode({ isCodeGenerated: true }))
        })
        expect(store.getState().forgotPassword.response.isCodeGenerated).toEqual(true);
    });

    it('should submit form', async () => {
        await act(async () => {
            store.dispatch(formSubmitted())
        })
        expect(store.getState().forgotPassword.submitted).toEqual(true);
    });
});

describe('ForgotPassword', () => {

    beforeEach(async () => {
        await act(async () => {
            store.dispatch(initializeForgot());
        })
    });

    it('Should render', () => {
        render(<ForgotPassword />);
    });

    it('Should change email', async () => {
        const { getByTestId } = render(<ForgotPassword />);
        await act(async () => {
            fireEvent.change(getByTestId('forgot_password_input_email'), { target: { value: 'test@test.com' } });
        });
        expect(store.getState().forgotPassword.credentials.email).toMatch('test@test.com');
    });

    it('should update the email input field', async () => {
        render(
            <ForgotPassword />
        );
        await act(async () => {
            store.dispatch(updateField({ name: "email", value: "ds@dsa.ad" }))
        });
        expect(screen.getByTestId('forgot_password_input_email')).toHaveValue('ds@dsa.ad');
    });

    it('should render proceed if email is set', async () => {
        await act(async () => {
            const mockedPasswordReset = PasswordReset as jest.Mock<ReturnType<typeof PasswordReset>>
            mockedPasswordReset.mockResolvedValueOnce(
                Ok({ isCodeGenerated: true })
            )
        });
        render(<I18nextProvider i18n={i18n} >
            <ForgotPassword />
        </I18nextProvider>);
        await act(async () => {
            store.dispatch(updateField({ name: "email", value: "ds@dsa.ad" }))
            fireEvent.click(screen.getByRole('button'))
        });
        expect(screen.getByText('Proceed')).toBeInTheDocument();
    });

    it('Should load Proceed when clicking Submit button', async () => {
        const mockedPasswordReset = PasswordReset as jest.Mock<ReturnType<typeof PasswordReset>>
        mockedPasswordReset.mockResolvedValueOnce(
            Ok({ isCodeGenerated: true })
        )
        render(<ForgotPassword />);
        await act(async () => {
            fireEvent.click(screen.getByRole('button'))
        })
        expect(mockedPasswordReset.mock.calls.length).toBe(1);
        expect(screen.getByText('Proceed')).toBeInTheDocument();
    });

    it('Should load Error when entering wrong invalid email id', async () => {
        const mockedPasswordReset = PasswordReset as jest.Mock<ReturnType<typeof PasswordReset>>
        mockedPasswordReset.mockResolvedValueOnce(
            Err({ "Email": ["Email is not in valid format"] })
        )
        render(<ForgotPassword />);
        await act(async () => {
            fireEvent.click(screen.getByRole('button'))
        })
        expect(mockedPasswordReset.mock.calls.length).toBe(1);
        expect(screen.getByText('Email is not in valid format')).toBeInTheDocument();
    });

    it('Shouldnot submit form twice', async () => {
        const mockedPasswordReset = PasswordReset as jest.Mock<ReturnType<typeof PasswordReset>>
        mockedPasswordReset.mockResolvedValueOnce(
            Ok({ isCodeGenerated: true })
        )
        await act(async () => {
            store.dispatch(updateField({ name: "email", value: "ds@dsa.ad" }))
        })
        render(<ForgotPassword />);
        await act(async () => {
            fireEvent.click(screen.getByRole('button'))
            fireEvent.click(screen.getByRole('button'))
        })
        expect(mockedPasswordReset.mock.calls.length).toBe(1);
        expect(screen.getByText('Proceed')).toBeInTheDocument();
    });
})



