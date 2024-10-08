import { Ok } from '@hqoss/monads';
import { fireEvent, render, screen } from '@testing-library/react';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import { store } from '../../../../state/store';
import { UserManagement } from '../UserManagement';
import { initializeUsersList } from './UserManagement.slice';
import { I18nextProvider } from "react-i18next";
import i18n from '../../../../i18nTest'
import { loadUser } from '../../../App/App.slice';
import { toggleUserStatus } from '../../../../services/users';
import { createUser } from '../../../services/signup';
import { getUsersList, getUsersRolesList } from '../../../../services/users';

jest.mock('../../../services/users');
jest.mock('../../../services/signup');
jest.mock('axios');

describe('User Management', () => {
    const mockedGetUsersList = getUsersList as jest.Mock<ReturnType<typeof getUsersList>>
    const mockedGetUsersRolesList = getUsersRolesList as jest.Mock<ReturnType<typeof getUsersRolesList>>
    const mockedToggleUserStatus = toggleUserStatus as jest.Mock<ReturnType<typeof toggleUserStatus>>
    const mockedCreateUser = createUser as jest.Mock<ReturnType<typeof createUser>>

    it('Should render', async () => {
        await act(async () => {
            store.dispatch(initializeUsersList());
            render(<UserManagement />);

        });
    });

    it('Should test whether user list is displayed', async () => {
        await act(async () => {
            mockedGetUsersList.mockResolvedValueOnce(
                {
                    users: [{
                        "FullName": "Lionel Messi", "Email": "lio@gmail.com", "Phone": "9846913472", "Id": 1,
                        RoleName: "Admin",
                        UserRoles: "",
                        "IsDeleted": false,
                    }],
                    totalRows: 1
                }
            )
            render(
                <I18nextProvider i18n={i18n} >
                    <UserManagement />
                </I18nextProvider>
            );
        });
        expect(screen.getByText('Manage Users')).toBeInTheDocument();
    });

    it('Should test when user list is empty', async () => {
        await act(async () => {
            mockedGetUsersList.mockResolvedValueOnce(
                {
                    users: [],
                    totalRows: 0
                }
            )
            render(
                <I18nextProvider i18n={i18n} >
                    <UserManagement />
                </I18nextProvider>
            );
        });
        expect(screen.getByTestId('NoUser')).toBeInTheDocument();
    });

    it('Should test whether user edit modal is loading on click', async () => {
        await act(async () => {
            mockedGetUsersList.mockResolvedValueOnce(
                {
                    users: [{
                        "FullName": "Lionel Messi", "Email": "lio@gmail.com", "Phone": "9846913472", "Id": 1,
                        RoleName: "Admin",
                        UserRoles: "",
                        "IsDeleted": false,
                    }],
                    totalRows: 1
                }
            )
            mockedGetUsersRolesList.mockResolvedValueOnce({
                roles: [{ "Id": 1, "RoleName": "Admin" }]
            })
            render(
                <I18nextProvider i18n={i18n} >
                    <UserManagement />
                </I18nextProvider>
            );
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId("user_management_button_edit_1"));
        });
        expect(screen.getByDisplayValue('9846913472')).toBeInTheDocument()
    });

    it('Should test whether Enable button is shown if user isDeleted is true', async () => {
        await act(async () => {
            mockedGetUsersList.mockResolvedValueOnce(
                {
                    users: [{
                        "FullName": "Lionel Messi", "Email": "lio@gmail.com", "Phone": "9846913472", "Id": 1,
                        RoleName: "Admin",
                        UserRoles: "",
                        "IsDeleted": true,
                    }],
                    totalRows: 1
                }
            )
            mockedGetUsersRolesList.mockResolvedValueOnce({
                roles: [{ "Id": 1, "RoleName": "Admin" }]
            })
            localStorage.setItem('token', "token");
            axios.defaults.headers.Authorization = `Bearer token`;
            store.dispatch(loadUser({ user: [{ FullName: "sdfx", Email: "Ds", Id: 2, Phone: "XC", CreatedOn: "" }] }));
            render(
                <I18nextProvider i18n={i18n} >
                    <UserManagement />
                </I18nextProvider>
            );
        });
        expect(screen.getByTestId('user_management_button_disable_1')).toHaveTextContent("Enable")
    });

    it('Should test whether Disable button is shown if user isDeleted is false', async () => {
        await act(async () => {
            mockedGetUsersList.mockResolvedValueOnce(
                {
                    users: [{
                        "FullName": "Lionel Messi", "Email": "lio@gmail.com", "Phone": "9846913472", "Id": 1,
                        RoleName: "Admin",
                        UserRoles: "",
                        "IsDeleted": false,
                    }],
                    totalRows: 1
                }
            )
            mockedGetUsersRolesList.mockResolvedValueOnce({
                roles: [{ "Id": 1, "RoleName": "Admin" }]
            })
            localStorage.setItem('token', "token");
            axios.defaults.headers.Authorization = `Bearer token`;
            store.dispatch(loadUser({ user: [{ FullName: "sdfx", Email: "Ds", Id: 2, Phone: "XC", CreatedOn: "" }] }));
            render(
                <I18nextProvider i18n={i18n} >
                    <UserManagement />
                </I18nextProvider>
            );
        });
        expect(screen.getByTestId('user_management_button_disable_1')).toHaveTextContent("Disable")
    });

    it('Should test Disable button is not visible for loggedin user', async () => {
        await act(async () => {
            mockedGetUsersList.mockResolvedValueOnce(
                {
                    users: [{
                        "FullName": "Lionel Messi", "Email": "lio@gmail.com", "Phone": "9846913472", "Id": 1,
                        RoleName: "Admin",
                        UserRoles: "",
                        "IsDeleted": false,
                    }],
                    totalRows: 1
                }
            )
            mockedGetUsersRolesList.mockResolvedValueOnce({
                roles: [{ "Id": 1, "RoleName": "Admin" }]
            })
            localStorage.setItem('token', "token");
            axios.defaults.headers.Authorization = `Bearer token`;
            store.dispatch(loadUser({ user: [{ FullName: "Lionel Messi", Email: "lio@gmail.com", Id: 1, Phone: "XC", CreatedOn: "" }] }));
            render(
                <I18nextProvider i18n={i18n} >
                    <UserManagement />
                </I18nextProvider>
            );
        });
        expect(screen.queryByTestId('user_management_button_disable_1')).not.toBeInTheDocument()
    });

    it('Should test whether Enable button is working', async () => {
        await act(async () => {
            mockedGetUsersList.mockResolvedValueOnce(
                {
                    users: [{
                        "FullName": "Lionel Messi", "Email": "lio@gmail.com", "Phone": "9846913472", "Id": 1,
                        RoleName: "Admin",
                        UserRoles: "",
                        "IsDeleted": true,
                    }],
                    totalRows: 1
                }
            )
            mockedGetUsersRolesList.mockResolvedValueOnce({
                roles: [{ "Id": 1, "RoleName": "Admin" }]
            })

            localStorage.setItem('token', "token");
            axios.defaults.headers.Authorization = `Bearer token`;
            store.dispatch(loadUser({ user: [{ FullName: "sdfx", Email: "Ds", Id: 2, Phone: "XC", CreatedOn: "" }] }));
            render(
                <I18nextProvider i18n={i18n} >
                    <UserManagement />
                </I18nextProvider>
            );
        });
        await act(async () => {
            fireEvent.click(screen.getByTestId("user_management_button_disable_1"));
        });
        expect(screen.getByTestId('toggle_user_status_button_confirm')).toHaveTextContent("Enable User")
    });

    it('Should test whether User is Disabled when enters CONFIRM & click Disable user', async () => {
        await act(async () => {
            mockedGetUsersList.mockResolvedValueOnce(
                {
                    users: [{
                        "FullName": "Lionel Messi", "Email": "lio@gmail.com", "Phone": "9846913472", "Id": 1,
                        RoleName: "Admin",
                        UserRoles: "Admin",
                        "IsDeleted": true,
                    }],
                    totalRows: 1
                }
            )
            mockedGetUsersRolesList.mockResolvedValueOnce({
                roles: [{ "Id": 1, "RoleName": "Admin" }]
            })
            mockedToggleUserStatus.mockResolvedValueOnce({ IsUpdated: true })
            localStorage.setItem('token', "token");
            axios.defaults.headers.Authorization = `Bearer token`;
            store.dispatch(loadUser({ user: [{ FullName: "sdfx", Email: "Ds", Id: 2, Phone: "XC", CreatedOn: "" }] }));
        });
        await act(async () => {
            render(
                <I18nextProvider i18n={i18n} >
                    <UserManagement />
                </I18nextProvider>
            );
        });
        await act(async () => {
            fireEvent.click(screen.getByTestId("user_management_button_disable_1"));
        });
        await act(async () => {
            fireEvent.change(screen.getByPlaceholderText('CONFIRM'), { target: { value: 'CONFIRM' } });
        });
        await act(async () => {
            fireEvent.click(screen.getByTestId("toggle_user_status_button_confirm"));
        });
        expect(store.getState().userStatus.displayInformationModal).toBeTruthy()
    });

    it('Should test whether user is created', async () => {
        await act(async () => {
            mockedGetUsersList.mockResolvedValueOnce(
                {
                    users: [],
                    totalRows: 0
                }
            )
            mockedGetUsersRolesList.mockResolvedValueOnce({
                roles: [{ "Id": 1, "RoleName": "Admin" }]
            })
            mockedCreateUser.mockResolvedValue(Ok({
                "Count": 1,
                "users": {
                    "FullName": "string",
                    "Email": "user4@example.com",
                    "Phone": "9878765342",
                    "PassCode": "Asdf@1234",
                    "UserRoles": "1"
                },
                "isInserted": false
            }))
            await act(async () => {
            });
        })
        await act(async () => {
            render(
                <I18nextProvider i18n={i18n} >
                    <UserManagement />
                </I18nextProvider>
            );
        })

        await act(async () => {
            fireEvent.change(screen.getByTestId('create_user_input_fullname'), { target: { value: 'Shagina K' } });
            fireEvent.change(screen.getByTestId('create_user_input_email'), { target: { value: 'Shagina@gmail.in' } });
            fireEvent.change(screen.getByTestId('create_user_input_password'), { target: { value: 'Shagina@123' } });
            fireEvent.change(screen.getByTestId('create_user_input_phone'), { target: { value: '9656632202' } });
        });
        await act(async () => {
            fireEvent.click(screen.getByTestId('create_user_button_create'));
        });
        expect(mockedCreateUser.mock.calls.length).toBe(1);
        expect(store.getState().usercreate.displayInformationModal).toBeTruthy()
    });

    it('should redirect to a new page on button click', async () => {
        await act(async () => {
            mockedGetUsersList.mockResolvedValueOnce(
                {
                    users: [],
                    totalRows: 0
                }
            )
            mockedGetUsersRolesList.mockResolvedValueOnce({
                roles: [{ "Id": 1, "RoleName": "Admin" }]
            })
            mockedCreateUser.mockResolvedValue(Ok({
                "Count": 1,
                "users": {
                    "FullName": "string",
                    "Email": "user4@example.com",
                    "Phone": "9878765342",
                    "PassCode": "Asdf@1234",
                    "UserRoles": "1"
                },
                "isInserted": false
            }))
            await act(async () => {
            });
        })
        await act(async () => {
            render(
                <I18nextProvider i18n={i18n} >
                    <UserManagement />
                </I18nextProvider>
            );
        })
        expect(screen.getByTestId('user_management_modal_create_user_close')).toBeInTheDocument()
    });

    it('Should check for pagination', async () => {
        await act(async () => {
            mockedGetUsersList.mockResolvedValueOnce(
                {
                    users: [
                        {
                            "FullName": "Lionel Messi", "Email": "lio@gmail.com", "Phone": "9846913472", "Id": 1,
                            RoleName: "Admin",
                            UserRoles: "",
                            "IsDeleted": false,
                        }],
                    totalRows: 100
                }
            )
            mockedGetUsersRolesList.mockResolvedValueOnce({
                roles: [{ "Id": 1, "RoleName": "Admin" }]
            })
            localStorage.setItem('token', "token");
            axios.defaults.headers.Authorization = `Bearer token`;
            store.dispatch(loadUser({ user: [{ FullName: "sdfx", Email: "Ds", Id: 2, Phone: "XC", CreatedOn: "" }] }));

            render(
                <I18nextProvider i18n={i18n} >
                    <UserManagement />
                </I18nextProvider>
            );
        });
        await act(async () => {
            mockedGetUsersList.mockResolvedValueOnce(
                {
                    users: [{
                        "FullName": "Lionel Messi", "Email": "lio@gmail.com", "Phone": "9846913472", "Id": 1,
                        RoleName: "Admin",
                        UserRoles: "",
                        "IsDeleted": false,
                    }],
                    totalRows: 100
                }
            )
        })

        await act(async () => {
            fireEvent.click(screen.getByLabelText(/Go to page number 2/));
        });
        expect(store.getState().usermanagement.currentPage).toBe(2);
    });

    it('Should test whether user search is working', async () => {
        await act(async () => {
            mockedGetUsersList.mockResolvedValueOnce(
                {
                    users: [
                        {
                            "FullName": "Sredha Honor", "Email": "lio@gmail.com", "Phone": "9846913472", "Id": 1,
                            RoleName: "Admin",
                            UserRoles: "",
                            "IsDeleted": false,
                        }],
                    totalRows: 100
                }
            )
            mockedGetUsersRolesList.mockResolvedValueOnce({
                roles: [{ "Id": 1, "RoleName": "Admin" }]
            })
            localStorage.setItem('token', "token");
            axios.defaults.headers.Authorization = `Bearer token`;
            store.dispatch(loadUser({ user: [{ FullName: "sdfx", Email: "Ds", Id: 2, Phone: "XC", CreatedOn: "" }] }));
            render(
                <I18nextProvider i18n={i18n} >
                    <UserManagement />
                </I18nextProvider>
            );
        });
        await act(async () => {
            mockedGetUsersList.mockResolvedValueOnce(
                {
                    users: [{
                        "FullName": "Lionel Messi", "Email": "lio@gmail.com", "Phone": "9846913472", "Id": 1,
                        RoleName: "Admin",
                        UserRoles: "",
                        "IsDeleted": false,
                    }],
                    totalRows: 100
                }
            )
        })
        await act(async () => {
            fireEvent.change(screen.getByPlaceholderText("Search users"), { target: { value: 'Lionel Messi' } });
        });
        expect(screen.getByText(/Lionel Messi/)).toBeInTheDocument();
    });

});







