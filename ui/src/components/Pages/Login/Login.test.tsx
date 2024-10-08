import { Err, Ok } from '@hqoss/monads';
import { fireEvent, render, screen } from '@testing-library/react';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import { login, passwordValidityCheck } from '../../../services/login';
import { store } from '../../../state/store';
import { Login } from './Login';
import { startLoginIn, updateField } from './Login.slice';
import { I18nextProvider } from "react-i18next";
import i18n from '../../../i18nTest'

jest.mock('../../../services/login');
jest.mock('axios');

const mockedLogin = login as jest.Mock<ReturnType<typeof login>>;

it('Should render', () => {
  render(<Login />);
});

it('Should test i18n is working', () => {
  render(<I18nextProvider i18n={i18n} ><Login />
  </I18nextProvider>);
  expect(screen.getByText('Email')).toBeInTheDocument();
});

it('Should test i18n language change is working', () => {
  act(() => {
    i18n.changeLanguage('ta');
  });
  render(<I18nextProvider i18n={i18n} ><Login />
  </I18nextProvider>);
  expect(screen.getByText('மின்னஞ்சலை உள்ளிடவும்')).toBeInTheDocument();
  act(() => {
    i18n.changeLanguage('en');
  });
});

it('Should test i18n language change is working', async () => {
  render(<I18nextProvider i18n={i18n} ><Login />
  </I18nextProvider>);
  await act(async () => {
    fireEvent.click(screen.getByText('தமிழ்'))
  })
  expect(screen.getByText('மின்னஞ்சலை உள்ளிடவும்')).toBeInTheDocument();
  act(() => {
    i18n.changeLanguage('en');
  });
});

it('Should change email', () => {
  const { getByTestId } = render(<Login />);
  fireEvent.change(getByTestId('login_input_email'), { target: { value: 'sha@gmail.com' } });
  expect(store.getState().login.credentials.email).toMatch('sha@gmail.com');
});

it('Should change password', async () => {
  render(<Login />);
  fireEvent.change(screen.getByTestId('login_input_password'), { target: { value: 'test pass' } });
  expect(store.getState().login.credentials.passcode).toMatch('test pass');
});

it('Should have email and password values from store', async () => {
  render(<Login />);
  await act(async () => {
    store.dispatch(updateField({ name: 'email', value: 'sha@gmail.com' }));
    store.dispatch(updateField({ name: 'passcode', value: '5678' }));
  });
  expect(screen.getByTestId('login_input_email')).toHaveValue('sha@gmail.com');
  expect(screen.getByTestId('login_input_password')).toHaveValue('5678');
});

it('Should initialize on first render', async () => {
  await act(async () => {
    store.dispatch(updateField({ name: 'email', value: 'sha@gmail.com' }));
    store.dispatch(updateField({ name: 'passcode', value: '34145' }));
    render(<Login />);
  });

  expect(store.getState().login.credentials.email.length).toBe(0);
  expect(store.getState().login.credentials.passcode.length).toBe(0);
});

it('Should show errors if login fails and stop disabling the fields', async () => {
  mockedLogin.mockResolvedValueOnce(Err({ 'Credentials': ['are invalid'] }));
  mockedLogin.mockResolvedValueOnce(Err({ 'Email': ['is not in valid format'] }));
  render(<Login />);
  await act(async () => {
    fireEvent.click(screen.getByRole('button'));
    expect(store.getState().login.loginIn).toBe(true);
  });
  expect(screen.getByText('Please fix the following error(s)')).toBeInTheDocument();
  expect(screen.getByTestId('login_input_email')).not.toBeDisabled();
  expect(screen.getByTestId('login_input_password')).not.toBeDisabled();
});

it('Should disable fields during login', async () => {
  render(<Login />);
  await act(async () => {
    await store.dispatch(startLoginIn());
  });
  expect(screen.getByTestId('login_input_email')).toBeDisabled();
  expect(screen.getByTestId('login_input_password')).toBeDisabled();
});

it('Should not try to login if it is already loging in', async () => {
  mockedLogin.mockResolvedValueOnce(
    Ok({
      isLoggedIn: true,
      token: 'jwt.token.here',
    })
  );
  localStorage.clear();
  render(<Login />);
  await act(async () => {
    store.dispatch(startLoginIn());
    fireEvent.click(screen.getByRole('button'));
  });
  expect(screen.getByTestId('login_input_email')).toBeInTheDocument();
  expect(mockedLogin.mock.calls.length).toBe(0);
  mockedLogin.mockClear();
});

it('Should redirect to home if login is successful and setup auth', async () => {
  mockedLogin.mockResolvedValueOnce(
    Ok({
      isLoggedIn: true,
      token: 'jwt.token.here',
    })
  );
  const mockedPasswordValidityCheck = passwordValidityCheck as jest.Mock<ReturnType<typeof PasswordValidityExpire>>
  mockedPasswordValidityCheck.mockResolvedValueOnce(
    Ok({
      isSecured: true
    })
  )
  render(<Login />);
  await act(async () => {
    fireEvent.click(screen.getByRole('button'));
  });
  expect(location.pathname).toMatch('/home');
  expect(localStorage.getItem('token')).toMatch('jwt.token.here');
  expect(axios.defaults.headers.Authorization).toMatch('Bearer jwt.token.here');
});

it('Should check whether the password is expired', async () => {
  mockedLogin.mockResolvedValueOnce(
    Ok({
      isLoggedIn: true,
      token: 'jwt.token.here',
    })
  );
  const mockedPasswordValidityCheck = passwordValidityCheck as jest.Mock<ReturnType<typeof passwordValidityCheck>>
  mockedPasswordValidityCheck.mockResolvedValueOnce(
    {
      isSecured: true
    }
  )
  render(<Login />);
  await act(async () => {
    fireEvent.click(screen.getByRole('button'));
  });
  expect(location.pathname).toMatch('/home');
  expect(store.getState().login.passwordExpired).toBe(true);
});