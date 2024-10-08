import { useEffect } from 'react';
import { store } from '../../../../state/store';
import {  getUserPendingList, getUsersList } from '../../../../services/users';
import { loadUsers, changePage, setFilter, setActiveTab, setSearch } from './UserManagement.slice';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { checkForPermission } from '../../../../helpers/permissions';
import BreadCrumb from '../../../BreadCrumbs/BreadCrumb';
import { Link } from 'react-router-dom';
import { useStore } from '../../../../state/storeHooks';
import { UserPending } from '../UserPendingList/UserPendingList';
import { initializeProfile } from '../../UserProfile/ProfileInfo.slice';
import { loadPendingUsers, setUserPendingFilter, setUserPendingSearch, UserPendingchangePage } from '../UserPendingList/UserPendingList.slice';
import UserManagement from './UserManagement';

const UserManagementHome = () => {
    const { t, i18n } = useTranslation();
    const { usermanagement: { SearchWith, activeTab,currentPage,SearchText }, deleteusers: { userIdList }, } = useStore(({ usermanagement, deleteusers }) => ({ usermanagement, deleteusers }));

    useEffect(() => {
        if (checkForPermission("USER_VIEW")) {
            onLoad();
        }
    }, [activeTab]);

    const options = [
        { value: 'Department', label: 'Department' },
        { value: 'UserCategory', label: 'User Category' },
        { value: 'TenantOfficeInfo', label: 'Location' },
        { value: 'Email', label: 'Email' },
        { value: 'Phone', label: 'Phone' }
    ]

    const UsersList = async (event: any) => {
        store.dispatch(changePage(1))
        if (checkForPermission("USER_VIEW")) {
            if (activeTab == "nav-approved") {
                const result = await getUsersList(currentPage, SearchText, SearchWith)
                store.dispatch(loadUsers(result));
            } else if (activeTab == "nav-pending") {
                const result = await getUserPendingList(currentPage, SearchText,SearchWith);
                store.dispatch(loadPendingUsers(result));
            }
        }
    }

    const searchFilter = async (selectedOption: any) => {
        if (selectedOption && selectedOption.value !== null && selectedOption.value !== undefined) {
            store.dispatch(setFilter({ value: selectedOption.value }));
            store.dispatch(setUserPendingFilter({ value: selectedOption.value }));
        } else {
            store.dispatch(setFilter({ value: "" }));// Handle the case when the dropdown search is cleared
            store.dispatch(setUserPendingFilter({ value: "" }));
            if (activeTab == "nav-approved") {
                const result = await getUsersList(currentPage, SearchText, SearchWith)
                store.dispatch(loadUsers(result));
            } else if (activeTab == "nav-pending") {
                const result = await getUserPendingList(currentPage, SearchText, SearchWith);
                store.dispatch(loadPendingUsers(result));
            }
        }
    };

    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_manage_user' }
    ];

    async function onLoad() {
        store.dispatch(initializeProfile())
        try {
            const users = await getUsersList(currentPage,SearchWith);
            store.dispatch(loadUsers(users));
        } catch (error) {
            console.error(error);
        }
    }

    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        store.dispatch(setUserPendingSearch(event.target.value))
        if (event.target.value == "") {
            store.dispatch(changePage(1))
            store.dispatch(UserPendingchangePage(1))
            if (activeTab == "nav-approved") {
                const result = await getUsersList(currentPage, SearchText, SearchWith)
                store.dispatch(loadUsers(result));
            } else if (activeTab == "nav-pending") {
                const result = await getUserPendingList(currentPage, SearchText, SearchWith);
                store.dispatch(loadPendingUsers(result));
            }
        }
    }

    return (
        <div className='row mx-3 mt-2 p-1'>
            <BreadCrumb items={breadcrumbItems} />
            {checkForPermission("USER_VIEW") &&
                <>
                    {/* Tabs start */}
                    <div className="row mx-0 p-0 mt-2">
                        <label className="p-0 pt-2">{t('usermanagement_label_filterby')}</label>
                        <div className="col-md-5 p-0">
                            <div className="row input-group py-0">
                                <div className="col-4 text-size-14" >
                                    <Select
                                        options={options}
                                        onChange={searchFilter}
                                        isSearchable
                                        value={options && options.find(option => option.value == SearchWith) || null}
                                        classNamePrefix="react-select"
                                        className='text-size-14'
                                    />
                                </div>
                                <div className="col-8 d-flex p-0">
                                    <input
                                        type='search'
                                        className="form-control custom-input"
                                        onChange={addData}
                                        style={{ fontSize: '14px' }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                UsersList(e);
                                            }
                                        }}
                                        name='SearchText'
                                        value={store.getState().usermanagement.SearchText??''}
                                        placeholder='Search...'
                                    />
                                    <button
                                        className="btn app-primary-bg-color text-white float-end py-1"
                                        style={{ fontSize: '14px' }}
                                        type="button"
                                        onClick={UsersList}
                                    >
                                        {t('callcordinator_management_button_search')}
                                    </button>
                                </div>

                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="row d-flex">
                                <div
                                    className={`col-md-3 col-12 border ${activeTab == "nav-approved" && "border-4"} text-size-14 text-center me-md-2 me-0 mb-2 mb-md-0 p-1`}
                                    onClick={() => store.dispatch(setActiveTab('nav-approved'))}
                                    role="button"
                                >
                                    <div className="text-center mt-1">{t('user_management_title_approved_customers_list')}</div>
                                </div>
                                <div
                                    className={`col-md-3 col-12 border ${activeTab == "nav-pending" && "border-4"} text-size-14 text-center me-md-1 me-0 p-1`}
                                    onClick={() => store.dispatch(setActiveTab('nav-pending'))}
                                    role="button"
                                >
                                    <div className="text-center mt-1">{t('user_management_title_pending_requests')}</div>
                                </div>
                            </div>

                        </div>
                        <div className="col-md-2 p-0 d-flex flex-row justify-content-end">
                            {/* New user button */}
                            {checkForPermission("USER_MANAGE") && (
                                <Link to='/config/users/create'>
                                    <button className='btn app-primary-bg-color py-2 text-white mt-0 ' style={{ fontSize: '14px' }}>
                                        {t('usermanagement_button_new_user')}
                                    </button>
                                </Link>
                            )}
                            {/* New user button ends */}
                        </div>
                    </div>
                    {/* Other Options */}
                    <div className='row mx-0 p-0 mt-2'>
                        <div className="col-md-6 text-muted text-size-14 p-0">
                            <div className='bd-highlight'>
                                {userIdList.length > 0 && (
                                    <div className="dropdown ps-0">
                                        <span>{t('usermanagement_other_option_help_text_1')}{userIdList.length}{t('usermanagement_other_option_help_text_2')}{userIdList.length > 1 && 's'}. </span>
                                        <span className=" app-primary-color pseudo-href" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            {t('usermanagement_other_option_button')}
                                        </span>{t('usermanagement_other_option_help_text_3')}
                                        <ul className="dropdown-menu">
                                            <li>
                                                <button className="dropdown-item" type='button' data-bs-toggle='modal' data-bs-target='#DeleteUsers'>Bulk User Delete</button>
                                            </li>
                                            <li>
                                                <button className="dropdown-item" type='button' data-bs-toggle='modal' data-bs-target='#DisableUsers'>Bulk User Disable</button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Other Options End */}

                    {/* Tabs Ends */}
                    <div className='row mx-0 p-0'>
                        {activeTab === 'nav-approved' ? (<UserManagement />) : activeTab === 'nav-pending' && (<UserPending />)}
                    </div>
                </>
            }
        </div>
    )
}

export default UserManagementHome