import { useEffect, useState } from 'react';
import { store } from '../../../../state/store';
import { getSelectedRoles, getUserLoginHistoryList, getUsersList } from '../../../../services/users';
import { Pagination } from '../../../Pagination/Pagination';
import { loadUsers, changePage } from './UserManagement.slice';
import { useTranslation } from 'react-i18next';
import feather from 'feather-icons';
import { checkForPermission } from '../../../../helpers/permissions';
import BreadCrumb from '../../../BreadCrumbs/BreadCrumb';
import { useStore } from '../../../../state/storeHooks';
import { DeleteUsers } from './DeleteUsers/DeleteUsers';
import { setdeleteUsers } from './DeleteUsers/DeleteUsers.slice';
import { BulkDisableUser } from './BulkUserDisable/BulkUserDisable';
import { setdisableUsers } from './BulkUserDisable/BulkUserDisable.slice';
import { UserProfile } from '../../UserProfile/UserProfile';
import { getClickedProfileDetails, getClickedUserStatus } from '../../../../services/userprofiles';
import { initializeProfile, loadUserProfile, setSelectedRoles } from '../../UserProfile/ProfileInfo.slice';
import { setUserStatus } from '../../UserProfile/UpdateUserPassword.slice';
import { setLoginHistory } from '../../UserProfile/UserLoginHistory/UserLoginHistory.slice';
import { setUserProfile } from '../../UserProfile/UserProfile.slice';
import ClickToCopy from '../../Common/ClickToCopy';
import { IsImageValid } from '../../../../helpers/formats';


const UserManagement = () => {
    const { t, i18n } = useTranslation();
    const { usermanagement: { users, totalRows, perPage, currentPage }, deleteusers: { userIdList } } = useStore(({ usermanagement, deleteusers }) => ({ usermanagement, deleteusers }));

    useEffect(() => {
        if (checkForPermission("USER_VIEW")) {
            onLoad();
        }
        feather.replace();
    }, [null]);

    const [profile, setSelectedProfile] = useState<boolean>();

    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_manage_user' }
    ];

    async function selectUserId(ev: any, UserId: number) {
        if (ev.target.checked) {
            store.dispatch(setdeleteUsers({ UserId: UserId, Action: 'add' }));
            store.dispatch(setdisableUsers({ UserId: UserId, Action: 'add' }));
        } else {
            store.dispatch(setdeleteUsers({ UserId: UserId, Action: 'remove' }));
            store.dispatch(setdisableUsers({ UserId: UserId, Action: 'remove' }))
        }
    }

    async function onLoad() {
        store.dispatch(initializeProfile())
        try {
            const currentPage = store.getState().usermanagement.currentPage;
            const searchKey = store.getState().usermanagement.SearchText;
            const users = await getUsersList(currentPage, searchKey);
            store.dispatch(loadUsers(users));
        } catch (error) {
            console.error(error);
        }
    }

    async function onPageChange(index: number) {
        store.dispatch(changePage(index));
        setSelectedProfile(false)
        const searchKey = store.getState().usermanagement.SearchText;
        const SearchWith = store.getState().usermanagement.SearchWith;
        const result = await getUsersList(index, searchKey, SearchWith);
        store.dispatch(loadUsers(result));
    }

    const viewProfile = async (UserId) => {
        setSelectedProfile(true)
        store.dispatch(initializeProfile())
        const result = await getClickedProfileDetails(UserId);
        store.dispatch(loadUserProfile(result.UserDetails[0]));
        const data = await getSelectedRoles(UserId)
        store.dispatch(setSelectedRoles(data.SelectedUserRoles[0]));
        const result1 = await getClickedUserStatus(UserId);
        store.dispatch(setUserStatus(result1.UserStatus[0].IsActive));
        const history = await getUserLoginHistoryList(UserId);
        store.dispatch(setLoginHistory(history));
    }

    const imageUrl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";
    const [imageValidity, setImageValidity] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        users.forEach(user => {
            const url = user.DocumentUrl;
            if (url) {
                IsImageValid(url).then(isValid => {
                    setImageValidity(prev => ({ ...prev, [user.Id]: isValid }));
                });
            } else {
                setImageValidity(prev => ({ ...prev, [user.Id]: false }));
            }
        });
    }, [users]);


    return (
        <div className='row mx-0 px-0'>
            <BreadCrumb items={breadcrumbItems} />
            {checkForPermission("USER_VIEW") &&
                <div>
                    {users.length > 0 ? (
                        <div className="row">
                            <div className="col-md-5 pe-1 p-0 pt-2">
                                {users.map((field, index) => (
                                    <a className="pseudo-href app-primary-color  text-decoration-none"
                                        data-toggle="tooltip"
                                        key={index}
                                        data-placement="left"
                                        title={'View'}
                                        onClick={() => {
                                            viewProfile(field.Id), store.dispatch(setUserProfile(field))
                                        }}
                                    >
                                        <div className="d-flex border rounded flex-row mb-3" key={index}>
                                            {/* Checkbox and user image */}
                                            <div className="d-flex align-items-center p-1">
                                                {store.getState().app.user.unwrap().user[0].Id !== field.Id ? (
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        checked={userIdList.includes(field.Id)}
                                                        onChange={(ev) => selectUserId(ev, field.Id)}
                                                    />
                                                ) : (
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input custom-checkbox"
                                                        disabled
                                                        checked={userIdList.includes(field.Id)}
                                                        onChange={(ev) => selectUserId(ev, field.Id)}
                                                    />
                                                )}
                                                {imageValidity[field.Id] ? (
                                                    <div className="px-2 col-auto  p-0 d-flex align-items-center ">
                                                        <div className=''>
                                                            <img
                                                                src={field?.DocumentUrl || ''}
                                                                alt="Image not found"
                                                                className='profile-image-sm'
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="px-2 col-auto  p-0 d-flex align-items-center ">
                                                        <div className=''>
                                                            <img
                                                                src={imageUrl}
                                                                alt="Image not found"
                                                                className='profile-image-sm'
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {/* User details */}
                                            <div className="d-flex flex-column p-1 flex-fill">
                                                <div className="fw-bold p-0">{field.FullName}</div>
                                                <div className="text-size-11">{field.Email}</div>
                                            </div>
                                            <div className="d-flex flex-column p-1 flex-fill">
                                                <div className="ms-auto fw-bold p-0">
                                                    <span data-toggle="tooltip" data-placement="left" title="Copy" className="small">
                                                        {field.EmployeeCode} <ClickToCopy ContentToCopy={field.EmployeeCode} />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                    </a>
                                ))}
                                {/* Pagination */}
                                <div className='p-0 mt-1'>
                                    <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                </div>
                            </div>
                            {/* Pagination ends */}
                            {profile &&
                                <div className="col-md-7 mt-2 p-0 border rounded-3">
                                    <UserProfile />
                                </div>
                            }

                        </div>
                    ) : (
                        <div className='text-muted p-0'>{t('userManagement_message_no_users_found')}</div>
                    )}
                    {/* Modals */}
                    <DeleteUsers />
                    <BulkDisableUser />
                    {/* Modals ends */}
                </div >

            }
        </div>
    )
}

export default UserManagement