import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../../../state/storeHooks';
import { changePage, initializeTenantOfficesInfoList, loadTenantOffices, setFilter, setVisibleModal } from "./TenantOfficeList.slice";
import { deleteTenantOffice, getTenantOfficeDetails, getTenantOfficeEditDetails, getTenantOfficeList } from "../../../../../../services/tenantOfficeInfo";
import { Pagination } from "../../../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from "../../../../../Preloader/Preloader.slice";
import { store } from "../../../../../../state/store";
import SweetAlert from 'react-bootstrap-sweetalert';
import { TenantOfficeCreate } from "../TenantOfficeCreate/TenantOfficeCreate";
import Select from 'react-select';
import { getTenantRegionNames } from "../../../../../../services/tenantRegion";
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from "../../../../../../helpers/formats";
import { loadSelectedLocation } from "../TenantOfficeView/TenantOfficeView.slice";
import FeatherIcon from 'feather-icons-react';
import { TenantOfficeDetails } from "../TenantOfficeView/TenantOfficeView";
import { checkForPermission } from "../../../../../../helpers/permissions";
import toast, { Toaster } from 'react-hot-toast';
import { TenantOfficeEdit } from "../TenantOfficeEdit/TenantOfficeEdit";
import { loadTenantOfficeDetails } from "../TenantOfficeEdit/TenantOfficeEdit.slice";

const TenantOfficeList = () => {
    const { t, i18n } = useTranslation();
    const {
        tenantofficelist: { tenantoffice, totalRows, perPage, currentPage, searchWith },
    } = useStore(({ tenantofficelist }) => ({ tenantofficelist }));
    const [tenantOfficeId, setTenantOfficeId] = useState(0);

    useEffect(() => {
        if (checkForPermission("ACCEL_MANAGE")) {
            onLoad();
        }
    }, []);

    const { selectedTabName } = useStore(({ tenantview }) => tenantview);

    const [selectRegionNames, setRegionNames] = useState<{ value: any, label: any }[]>([])

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeTenantOfficesInfoList());
        try {
            const { RegionNames } = await getTenantRegionNames()
            setRegionNames(formatSelectInput(RegionNames, "RegionName", "Id"))
            setRegionNames((prevRegionNames) => [{ label: "All Region", value: "" }, ...prevRegionNames]);
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const searchFilter = async (selectedOption: any) => {
        store.dispatch(setFilter({ value: selectedOption.value }));
        var value = selectedOption.value
        if (value == "") {
            store.dispatch(setFilter({ value: "" }));
        }
        getList()
    };

    useEffect(() => {
        if (selectedTabName == 'AREAOFFICES') {
            if (checkForPermission("ACCEL_MANAGE")) {
                getList()
            }
            else {
                store.dispatch(setFilter({ value: null }))
            }
        }
    }, [selectedTabName])

    const getList = async () => {
        const result = await getTenantOfficeList(store.getState().tenantofficelist.searchWith, store.getState().tenantofficelist.currentPage);
        store.dispatch(loadTenantOffices(result));
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        if (checkForPermission("ACCEL_MANAGE")) {
            getList()
        }
    }

    const redirectToViewDetails = async (Id: number) => {
        try {
            const result = await getTenantOfficeDetails(Id.toString());
            store.dispatch(loadSelectedLocation(result));
        } catch (error) {
            console.error(error);
        }
    }
    const handleConfirm = (TenantOfficeId: number) => {
        setTenantOfficeId(TenantOfficeId);
    };

    async function handleCancel() {
        setTenantOfficeId(0);
    }

    function ConfirmationModal() {
        return (
            <SweetAlert
                danger
                showCancel
                confirmBtnText={t('tenantoffice_delete_confirm_btn')}
                confirmBtnBsStyle="danger"
                title={t('tenantoffice_delete_title')}
                onConfirm={() => deleteTenantLocation(tenantOfficeId)}
                onCancel={handleCancel}
                focusCancelBtn
            >
                {t('tenantoffice_delete_question')}
            </SweetAlert>
        );
    }

    async function deleteTenantLocation(Id: number) {
        var result = await deleteTenantOffice(Id);
        result.match({
            ok: () => {
                setTenantOfficeId(0)
                toast(i18n.t('tenantoffice_deleted_success_message'),
                    {
                        duration: 2100,
                        style: {
                            borderRadius: '0',
                            background: '#00D26A',
                            color: '#fff',
                        }
                    });
                onLoad()
            },
            err: (err) => {
                toast(i18n.t(err.Message),
                    {
                        duration: 2100,
                        style: {
                            borderRadius: '0',
                            background: '#F92F60',
                            color: '#fff'
                        }
                    });
                setTenantOfficeId(0);
            },
        });
    }

    const getSelectedDetails = async (tenantOfficeId: number) => {
        store.dispatch(setVisibleModal("EditTenantOffice"))
        try {
            const result = await getTenantOfficeEditDetails(tenantOfficeId)
            store.dispatch(loadTenantOfficeDetails(result))
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <div>
                {checkForPermission("ACCEL_MANAGE") && <>
                    <div className="row mt-1 mb-3 p-0 ">
                        <div className="col-md-4  app-primary-color ">
                            <h5 className="ms-0 ps-1"> {t('tenant_officeinfo_list_title')}</h5>
                        </div>
                        {checkForPermission("ACCEL_MANAGE") && <>
                            <div className="col-md-8">
                                <button onClick={() => store.dispatch(setVisibleModal("CreateTenantOffice"))} className="btn app-primary-bg-color text-white float-end " data-bs-toggle='modal' data-bs-target='#CreateTenantOffice'>
                                    {t('tenant_officeinfo_list_button_create')}
                                </button>
                            </div>
                        </>}
                    </div>
                    <div className="row mt-2 ps-2 pe-0">
                        <label className="">{t('tenant_officeinfo_list_helptext_filterby')}</label>
                        <div className="input-group">
                            <div className="me-2 col-12" >
                                <Select
                                    options={selectRegionNames}
                                    value={selectRegionNames && selectRegionNames.find(option => option.value == searchWith) || null}
                                    onChange={searchFilter}
                                    isSearchable
                                    placeholder={t('tenant_officeinfo_list_placeholder_search_select_filter')}
                                    classNamePrefix="react-select"
                                    name="searchWith"
                                />
                            </div>
                        </div>
                    </div>
                </>}
            </div>
            <>
                {checkForPermission("ACCEL_MANAGE") && tenantoffice.match({
                    none: () => <div className="ms-1">{t('tenant_officeinfo_list_loading')}</div>,
                    some: (TenantOffices) =>
                        <div className="">
                            {checkForPermission("ACCEL_MANAGE") && <>
                                <div className="row m-0 ps-2 mt-3">
                                    {TenantOffices.length > 0 ? (
                                        <div className='ps-0 table-responsive overflow-auto pe-0'>
                                            <table className="table table-bordered text-nowrap">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">{t('tenant_officeinfo_list_th_action')}</th>
                                                        <th scope="col">{t('tenant_officeinfo_list_th_sl_no')}</th>
                                                        <th scope="col">{t('tenant_officeinfo_list_th_name')}</th>
                                                        <th scope="col">{t('tenant_officeinfo_list_th_address')}</th>
                                                        <th scope="col">{t('tenant_officeinfo_list_th_regionname')}</th>
                                                        <th scope="col">{t('tenant_officeinfo_list_th_city')}</th>
                                                        <th scope='col'>{t('tenant_officeinfo_list_th_state')}</th>
                                                        <th scope="col">{t('tenant_officeinfo_list_th_pincode')}</th>
                                                        <th scope="col">{t('tenant_officeinfo_list_th_manager')}</th>
                                                        <th scope='col'>{t('tenant_officeinfo_list_th_isverified')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {TenantOffices.map((field, index) => (
                                                        <tr className="mt-2" key={index}>
                                                            <td className="text-center">
                                                                <a className="pseudo-href app-primary-color" onClick={() => redirectToViewDetails(field.tenantoffice.Id)}
                                                                    data-bs-toggle='modal' data-bs-target='#ViewLocationDetails'>
                                                                    <span className="material-symbols-outlined fs-5">
                                                                        visibility
                                                                    </span>
                                                                </a>
                                                                <a
                                                                    className="pseudo-href app-primary-color ms-1"
                                                                    onClick={() => getSelectedDetails(field.tenantoffice.Id)}
                                                                    data-bs-toggle="modal"
                                                                    data-toggle="tooltip" data-placement="left" title={'Edit'}
                                                                    data-bs-target="#EditTenantOffice"
                                                                >
                                                                    <span className="material-symbols-outlined ">
                                                                        edit_note
                                                                    </span>
                                                                </a>
                                                                <span className=" ms-1 mb-2 custom-pointer-cursor material-symbols-outlined text-size-20 app-primary-color" onClick={() => handleConfirm(field.tenantoffice.Id)}>
                                                                    Delete
                                                                </span>
                                                            </td>
                                                            <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                            <td>{field.tenantoffice.OfficeName} </td>
                                                            <td>{field.tenantoffice.Address} </td>
                                                            <td>{field.tenantoffice.RegionName} </td>
                                                            <td>{field.tenantoffice.CityName} </td>
                                                            <td>{field.tenantoffice.StateName} </td>
                                                            <td>{field.tenantoffice.Pincode} </td>
                                                            <td>{field.tenantoffice.ManagerName} </td>
                                                            <td>{field.tenantoffice.IsVerified == false ? <span className="badge text-bg-secondary">{t('tenant_officeinfo_list_th_notverified')}</span> : <span className="badge text-bg-success">{t('tenant_officeinfo_list_th_verified')}</span>} </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div className="row">
                                                <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-muted ps-3">{t('tenant_officeinfo_list_no_data')}</div>
                                    )}
                                </div>
                                <TenantOfficeCreate />
                                <TenantOfficeEdit />
                                <TenantOfficeDetails />
                                {tenantOfficeId ? <ConfirmationModal /> : ""}
                                {/* toast */}
                                <Toaster />
                            </>}
                        </div>
                })}
            </>
        </div>
    )
}
export default TenantOfficeList