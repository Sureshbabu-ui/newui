import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../state/storeHooks';
import { store } from '../../../../state/store';
import { VendorListState, changePage, initializeVendorsList, loadVendors, setFilter, updateField } from './VendorList.slice'
import { Pagination } from "../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import { deleteVendor, getVendorEditDetails, getVendorList } from "../../../../services/vendor";
import { VendorCreate } from "../VendorCreate/VendorCreate";
import { checkForPermission } from "../../../../helpers/permissions";
import FeatherIcon from 'feather-icons-react';
import { VendorEdit } from "../VendorEdit/VendorEdit";
import SweetAlert from 'react-bootstrap-sweetalert';
import { loadVendorDetails } from "../VendorEdit/VendorEdit.slice";
import toast, { Toaster } from 'react-hot-toast';
import Select from 'react-select';

export const VendorManagement = () => {
    const { t, i18n } = useTranslation();
    const [vendorId, setVendorId] = useState(0);
    const {
        vendorlist: { vendors, totalRows, perPage, currentPage, filters, searchWith },
    } = useStore(({ vendorlist, app }) => ({ vendorlist, app }));

    useEffect(() => {
        if (checkForPermission("VENDOR_LIST")) {
            onLoad();
        }
    }, []);
    const options = [
        { value: 'Name', label: 'Name' },
        { value: 'Location', label: 'Location' },
        { value: 'Code', label: 'Vendor Code' },
        { value: 'VendorType', label: 'Vendor Type' },
    ]


    useEffect(() => {
        store.dispatch(setFilter({ value: options[0].value }));     
    }, []);

    const handleConfirm = (vendorId: number) => {
        setVendorId(vendorId);
    };

    async function handleCancel() {
        setVendorId(0);
    }

    function ConfirmationModal() {
        return (
            <SweetAlert
                warning
                showCancel
                confirmBtnText='Yes, Delete!'
                cancelBtnText='Cancel'
                cancelBtnBsStyle='light'
                confirmBtnBsStyle='warning'
                title='Are you sure?'
                onConfirm={() => deleteVendorDetails(vendorId)}
                onCancel={handleCancel}
                focusCancelBtn
            >
                {t('vendor_deleted_conformation')}
            </SweetAlert>
        );
    }

    const onUpdateField = async (ev: any) => {
        if (ev.target.value == "") {
            try {
                if (checkForPermission("VENDOR_LIST")) {
                    const Vendors = await getVendorList(currentPage, searchWith);
                    store.dispatch(loadVendors(Vendors));
                }
            } catch (error) {
                console.error(error);
            }
        }
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof VendorListState['filters'], value }));
    }

    async function deleteVendorDetails(Id: number) {
        var result = await deleteVendor(Id);
        result.match({
            ok: () => {
                setVendorId(0)
                toast(i18n.t('vendor_deleted_success_message'),
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
                toast(i18n.t('vendor_deleted_failure_message'),
                    {
                        duration: 2100,
                        style: {
                            borderRadius: '0',
                            background: '#F92F60',
                            color: '#fff'
                        }
                    });
                setVendorId(0);
            },
        });
    }
    const searchFilter = async (selectedOption: any) => {
        var value = selectedOption.value?selectedOption:null
        if (value == "IsActive") {
            try {
                if (checkForPermission("VENDOR_LIST")) {
                    const Vendors = await getVendorList(store.getState().vendorlist.currentPage, store.getState().vendorlist.searchWith, { SearchText: "1" });
                    store.dispatch(loadVendors(Vendors));
                }
            } catch (error) {
                console.error(error);
            }
        }
        store.dispatch(setFilter({ value }));
    }

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeVendorsList());
        try {
            if (checkForPermission("VENDOR_LIST")) {
                const Vendors = await getVendorList(store.getState().vendorlist.currentPage, store.getState().vendorlist.searchWith);
                store.dispatch(loadVendors(Vendors));
            }
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const searchKey = store.getState().tenantlist.search;
        if (checkForPermission("VENDOR_LIST")) {
            const result = await getVendorList(index, searchKey);
            store.dispatch(loadVendors(result));
        }
    }

    const filterVendorInfoList = async () => {
        if (checkForPermission("VENDOR_LIST")) {
            const result = await getVendorList(store.getState().vendorlist.currentPage, store.getState().vendorlist.searchWith, filters);
            store.dispatch(loadVendors(result));
        }
    }

    const getSelectedDetails = async (VendorId: number) => {
        try {
            const result = await getVendorEditDetails(VendorId)
            store.dispatch(loadVendorDetails(result))
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="m-4">
            <div className="">
                <div className="row mt-1 mb-3 p-0 ">
                    {checkForPermission("VENDOR_LIST") &&
                        <div className="col-md-9 app-primary-color ">
                            <h5 className="ms-0 ">{t('vendor_list_main_heading')}</h5>
                        </div>
                    }
                    {checkForPermission("VENDOR_CREATE") &&
                        <div className="col-md-3 ">
                            <button className="btn app-primary-bg-color text-white float-end " data-bs-toggle='modal' data-bs-target='#CreateVendor'>
                                {t('vendor_create_button')}
                            </button>
                        </div>
                    }
                </div>
            </div>
            <>
                {checkForPermission("VENDOR_LIST") && vendors.match({
                    none: () => <div className="row m-2">{t('vendor_list_loading')}</div>,
                    some: (vendor) =>
                        <div className="">
                            <div className="row ">
                                <div className="col-md-4" >
                                    <Select
                                        options={options}
                                        onChange={searchFilter}
                                        placeholder="Select Filter"
                                        defaultValue={options ? options[0] : null}
                                        isSearchable
                                        isClearable
                                        classNamePrefix="react-select"
                                    />
                                </div>
                                <div className="col-md-7">
                                    <input type='search' className="form-control custom-input" name="SearchText" placeholder={`Search with ${searchWith ? searchWith : "Vendor Name"}` ?? ''} onChange={onUpdateField}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                filterVendorInfoList();
                                            }
                                        }} />
                                </div>
                                <div className='col-md-1 float-end ' >
                                    <button className="btn app-primary-bg-color h-100 text-white float-end " type="button" onClick={filterVendorInfoList}>
                                        Search
                                    </button>
                                </div>
                            </div>
                            <div className="row mt-3 ">
                                {vendor.length > 0 ? (
                                    <div className=" table-responsive ">
                                        <table className="table table-hover  table-bordered ">
                                            <thead>
                                                <tr>
                                                    <th scope="col"></th>
                                                    <th scope="col">{t('vendor_list_table_th_slno')}</th>
                                                    <th scope="col">{t('vendor_list_table_th_vc')}</th>
                                                    <th scope="col">{t('vendor_list_table_th_name')}</th>
                                                    <th scope="col">{t('vendor_list_table_th_vendortype')}</th>
                                                    <th scope="col">{t('vendor_list_table_th_location')}</th>
                                                    <th scope="col">{t('vendor_list_table_th_city')}</th>
                                                    <th scope="col">{t('vendor_list_table_th_contactname')}</th>
                                                    <th scope="col">{t('vendor_list_table_th_contactnumber')}</th>
                                                    <th scope="col">{t('vendor_list_table_th_status')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {vendor.map(({ vendor }, index) => (
                                                    <tr className="mt-2">
                                                        <td className='pe-0'>
                                                            {checkForPermission("VENDOR_CREATE") && <>
                                                                <a className="pseudo-href app-primary-color ps-2" data-toggle="tooltip" data-placement="left" title={'View'} href={`/config/vendors/view/${vendor.VendorId}?Tab=DETAILS`}>
                                                                    <FeatherIcon icon={"eye"} size="16" />
                                                                </a>
                                                            </>
                                                            }
                                                            {
                                                                checkForPermission("VENDOR_CREATE") &&
                                                                (
                                                                    <a className="pseudo-href app-primary-color ps-2" data-bs-toggle='modal' data-bs-target='#EditVendor' onClick={() => getSelectedDetails(vendor.Id)} data-toggle="tooltip" data-placement="left" title="Edit">
                                                                        <FeatherIcon icon="edit" size="16" />
                                                                    </a>
                                                                )
                                                            }
                                                            <a
                                                                className='pseudo-href app-primary-color ps-2'
                                                                data-toggle="tooltip" data-placement="left" title={'Delete Vendor'}
                                                                onClick={() => handleConfirm(vendor.Id)}
                                                            >
                                                                <FeatherIcon icon={"trash-2"} size="20" />
                                                            </a>
                                                        </td>
                                                        <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                                        <td>  {vendor.VendorCode} </td>
                                                        <td>  {vendor.Name} </td>
                                                        <td>  {vendor.VendorType} </td>
                                                        <td>  {vendor.TenantLocation} </td>
                                                        <td>  {vendor.City} </td>
                                                        <td>  {vendor.ContactName} </td>
                                                        <td>  {vendor.ContactNumberOneCountryCode} {vendor.ContactNumberOne}</td>
                                                        <td> <span className={`badge text-bg-${vendor.IsActive ? "success" : "warning"}`}> {vendor.IsActive ? "Active" : "InActive"}</span> </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className="row m-0">
                                            <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-muted ps-3">{t('vendor_list_no_data')}</div>
                                )}
                            </div>
                            <VendorEdit />
                            {vendorId ? <ConfirmationModal /> : ""}
                            {/* toast */}
                            <Toaster />
                            {/* toast ends */}
                        </div>
                })}
            </>
            <VendorCreate />
        </div>)
}