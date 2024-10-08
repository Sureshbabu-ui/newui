import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { store } from '../../../../state/store';
import { useStore } from '../../../../state/storeHooks';
import Select from 'react-select';
import { ContainerPage } from "../../../ContainerPage/ContainerPage";
import { useTranslation } from "react-i18next";
import { changePage, initializeAllUsersLoginHistoryList, loadLoginHistory, loadUsers, setExcelFilterValues, setFilterDateFrom, setFilterDateTo, setFilterUsers, setIntialDateFromDateTo } from "./UsersLoginHistory.slice";
import { downloadUserLoginHistoryList, getAllUsersLoginHistoryList, getUsersNames } from "../../../../services/users";
import { formatDateTime, formatDocumentName, formatSelectInput } from '../../../../helpers/formats';
import BreadCrumb from '../../../BreadCrumbs/BreadCrumb';
import { Pagination } from '../../../Pagination/Pagination';
import FileSaver from 'file-saver';
import { t } from 'i18next';

export const UsersLoginHistory = () => {
    const { t, i18n } = useTranslation();
    const { loginHistoryDetails, UsersList, exceldateFrom, exceldateTo, exceluserId, userId, dateFrom, dateTo, currentPage, perPage, totalRows } = useStore(({ allusersloginhistory }) => allusersloginhistory);
    const { UserId } = useParams<{ UserId: string }>();
    useEffect(() => {
        onLoad();
    }, []);

    const [selectUsers, setUsersList] = useState<any>(null);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    useEffect(() => {
        setUsersList(formatSelectInput(UsersList, "FullName", "Id"));
    }, [UsersList]);

    const today = new Date();
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    const DateTo = endOfDay.toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const DateFrom = thirtyDaysAgo.toISOString().split('T')[0];

    const dateRange = {
        DateTo,
        DateFrom
    };

    async function onLoad() {
        store.dispatch(initializeAllUsersLoginHistoryList());
        store.dispatch(setIntialDateFromDateTo(dateRange))
        try {
            const history = await getAllUsersLoginHistoryList(currentPage);
            store.dispatch(loadLoginHistory(history));
            const users = await getUsersNames();
            store.dispatch(loadUsers(users));
        } catch (error) {
            return error
        }
    }

    const filterLoginHistory = async (event?: any) => {
        store.dispatch(setExcelFilterValues())
        store.dispatch(changePage(1))
        const result = await getAllUsersLoginHistoryList(1, userId, dateFrom, dateTo);
        store.dispatch(loadLoginHistory(result));
    }

    const userFilter = async (selectedOption: any) => {
        store.dispatch(setFilterUsers({ Value: selectedOption.value, Name: "userId" }));
    };

    const onUpdateDateFromField = async (selectedOption: any) => {
        store.dispatch(setFilterDateFrom({ Value: selectedOption.target.value, Name: "dateFrom" }));
    };

    const onUpdateDateToField = async (selectedOption: any) => {
        store.dispatch(setFilterDateTo({ Value: selectedOption.target.value, Name: "dateTo" }));
    };

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const history = await getAllUsersLoginHistoryList(index, userId, dateFrom, dateTo);
        store.dispatch(loadLoginHistory(history));
    }

    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_login_history' }
    ];

    const onDownloadClick = async (e: any) => {
        const response = await downloadUserLoginHistoryList(exceluserId, exceldateFrom, exceldateTo)
        const url = window.URL.createObjectURL(response.data);
        FileSaver.saveAs(url, formatDocumentName())
    }

    const handleViewMoreClick = (user: any) => {
        setSelectedUser(user);
    }

    return (
        <div className='container-fluid page mt-4 row'>
            <BreadCrumb items={breadcrumbItems} />
            <div className='mx-2'>
                <button className="btn app-light float-end app-primary-color fw-bold btn-sm border" onClick={onDownloadClick}>
                    <span className="material-symbols-outlined align-middle me-1">
                        download
                    </span>
                    {t('userloginhistory_button_download')}
                </button>
                <h5 className='mt-1 mb-0 app-primary-color'>{t('user_login_history_main_heading')}</h5>
                <div className='container-fluid page mt-4'>
                    <div className="row pt-0 pe-0 mb-2">
                        <div className="col-md-4 p-0">
                            <Select
                                options={selectUsers}
                                onChange={userFilter}
                                placeholder={t('userloginhistory_selectuser_placeholder')}
                                isSearchable
                                classNamePrefix="react-select"
                            />
                        </div>
                        <div className='col-md-7'>
                            <div className="row m-0">
                                <div className='col-md-6'>
                                    <input
                                        name='dateFrom'
                                        type='date'
                                        className='form-control'
                                        value={dateFrom ? dateFrom : ""}
                                        onChange={onUpdateDateFromField}
                                    />
                                </div>
                                <div className='col-md-6'>
                                    <input
                                        name='dateTo'
                                        type='date'
                                        className='form-control'
                                        value={dateTo ? dateTo : ""}
                                        onChange={onUpdateDateToField}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='col-md-1 float-end px-1'>
                            <button className="btn app-primary-bg-color h-100 float-end text-white" type="button" onClick={filterLoginHistory}>
                                {t('userloginhistory_search')}
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    {loginHistoryDetails.length > 0 ? (
                        <table className='table table-bordered mt-1 me-5 pe-4'>
                            <thead>
                                <tr>
                                    <th scope='col'>{t('userloginhistory_table_sl_no')}</th>
                                    <th scope='col'>{t('userloginhistory_table_employee_name')}</th>
                                    <th scope='col'>{t('userloginhistory_table_employee_code')}</th>
                                    <th scope='col'>{t('userloginhistory_table_designation')}</th>
                                    <th scope='col'>{t('userloginhistory_table_location')}</th>
                                    <th scope='col'>{t('userloginhistory_table_login_date')}</th>
                                    <th scope='col'>{t('userloginhistory_table_logout_date')}</th>
                                    <th scope='col' className='text-center'>{t('userloginhistory_table_action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loginHistoryDetails.map((data, index) => (
                                    <tr key={index}>
                                        <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                        <td>{data.EmployeeName}</td>
                                        <td>{data.EmployeeCode}</td>
                                        <td>{data.Designation}</td>
                                        <td>{data.Location}</td>
                                        <td>{formatDateTime(data.LoginDate)}</td>
                                        <td>{formatDateTime(data.LoggedOutOn)}</td>
                                        <td className='text-center'>
                                            <a className="text-primary " data-bs-toggle="offcanvas" role='button'
                                                data-bs-target="#ClientInfo" onClick={() => handleViewMoreClick(data.ClientInfo)}>
                                                <span className="material-symbols-outlined app-primary-color  cursor-pointer ">
                                                    visibility
                                                </span>
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className='text-muted px-3'>{t('userloginhistory_message_no_users_found')}</div>
                    )}
                </div>
                <div className='row m-0'>
                    <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                </div>
            </div>
            <OffCanvas user={selectedUser} />
        </div>
    );
}

const OffCanvas = ({ user }) => {
    const DATA = JSON.parse(user)
    return (
        <div className="offcanvas offcanvas-end" id="ClientInfo">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title app-primary-color fw-bold">{t("userloginhistory_offcanvas_title")}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
            </div>
            <div className="offcanvas-body bg-light">
                {DATA ? (
                    <div>
                        {Object.entries(DATA).map(([key, value]) => (
                            <div className='py-2' key={key}>
                                <strong>{key}:</strong> {value}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>{t("userloginhistory_offcanvas_nodata_available")}</p>
                )}
            </div>
        </div>
    );
}
