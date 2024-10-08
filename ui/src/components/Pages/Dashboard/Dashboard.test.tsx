import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { store } from '../../../state/store';
import { I18nextProvider } from "react-i18next";
import i18n from '../../../i18nTest'
import { Dashboard } from './Dashboard';
import { ContractCount } from '../../Cards/ContractCountCard';
import { UsersCount } from "../../Cards/UserCountCard"
import { getContractCount } from '../../../services/contracts';
import { getUsersCount } from '../../../services/users';
import { setPasswordExpiry, LoginState, initializeLogin } from '../Login/Login.slice';

jest.mock('../../../services/users');
jest.mock('../../../services/contracts');

describe('User Dashboard', () => {
    const mockedGetUsersCount = getUsersCount as jest.Mock<ReturnType<typeof getUsersCount>>
    const mockedGetContractCount = getContractCount as jest.Mock<ReturnType<typeof getContractCount>>

    beforeEach(async () => {
        await act(async () => {
            store.dispatch(setPasswordExpiry())
        });
    })

    it('Should render', async () => {
        render(
            <I18nextProvider i18n={i18n} >
                <Dashboard />
            </I18nextProvider>
        )
    });

    it('Should test whether user count card is displaying count of users', async () => {
        await act(async () => {
            mockedGetUsersCount.mockResolvedValueOnce({
                users: [{
                    "FullName": "Lionel Messi", "Email": "lio@gmail.com", "Phone": "9846913472", "Id": 1,
                    RoleName: "Admin",
                    UserRoles: "",
                    "IsDeleted": false,
                }],
                totalRows: 1
            })
        })
        await act(async () => {
            render(
                <I18nextProvider i18n={i18n} >
                    <UsersCount />
                </I18nextProvider>
            );
        })
        expect(screen.getByTestId("user_count_card_total_rows").textContent).toContain("1");
    });

    it('Should test whether user count card works when no user exists', async () => {
        await act(async () => {
            mockedGetUsersCount.mockResolvedValueOnce({
                users: [],
                totalRows: 0
            })
        })
        await act(async () => {
            render(
                <I18nextProvider i18n={i18n} >
                    <UsersCount />
                </I18nextProvider>
            );
        })
        expect(screen.getByTestId("user_count_card_total_rows").textContent).toContain("Users not found");
    });

    it('Should test whether contract count card is displaying count of contracts', async () => {
        await act(async () => {
            mockedGetContractCount.mockResolvedValueOnce({
                contracts: [{

                    Id: 1,
                    CustomerName: "Customer 3",
                    BaseLocationName: "Kochi",
                    AgreementTypeName: "Abc",
                    BookingTypeName: "Abx",
                    IsDeleted: false
                }],
                totalRows: 1
            })
        })
        await act(async () => {
            render(
                <I18nextProvider i18n={i18n} >
                    <ContractCount />
                </I18nextProvider>
            );
        })
        expect(screen.getByTestId("contract_count_card_total_rows").textContent).toContain("1");
    });

    it('Should test whether it works when no contracts exist', async () => {
        await act(async () => {
            mockedGetContractCount.mockResolvedValueOnce({
                contracts: [],
                totalRows: 0
            })
        })
        await act(async () => {
            render(
                <I18nextProvider i18n={i18n} >
                    <ContractCount />
                </I18nextProvider>
            );
        })
        expect(screen.getByTestId("contract_count_card_total_rows").textContent).toContain("Contracts not found");
    });

});



















