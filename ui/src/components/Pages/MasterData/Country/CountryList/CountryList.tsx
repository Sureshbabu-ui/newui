import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";
import { store } from "../../../../../state/store";
import { changePage, initializeCountryInfoList, loadCountryList, setFilter } from "./CountryList.slice";
import { useStore } from "../../../../../state/storeHooks";
import { Pagination } from "../../../../Pagination/Pagination";
import { checkForPermission } from "../../../../../helpers/permissions";
import { deleteCountry, getCountryList } from "../../../../../services/country";
import { loadCountryDetails } from "../CountryEdit/CountryEdit.slice";
import { CountryCreate } from "../CountryCreate/CountryCreate";
import { CountryEdit } from "../CountryEdit/CountryEdit";
import SweetAlert from "react-bootstrap-sweetalert";
import toast, { Toaster } from 'react-hot-toast';
import he from 'he'; // Import the he library

export const CountryList = () => {
    const { t, i18n } = useTranslation();
    const { countrylist: { country, totalRows, perPage, currentPage, searchWith } } = useStore(({ countrylist }) => ({ countrylist }));

    useEffect(() => {
        store.dispatch(initializeCountryInfoList());
        if (checkForPermission("COUNTRY_VIEW")) {
            getList()
        }
    }, []);

    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_masters', Link: '/config/masters' },
        { Text: 'breadcrumbs_masters_country' },
    ];

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        if (checkForPermission("COUNTRY_VIEW")) {
            getList()
        }
    }

    const filterList = async () => {
        await store.dispatch(changePage(1));
        if (checkForPermission("COUNTRY_VIEW"))
            getList()
    }

    const getList = async () => {
        const result = await getCountryList(store.getState().countrylist.searchWith, store.getState().countrylist.currentPage);
        store.dispatch(loadCountryList(result));
    }

    const addData = async (event: any) => {
        store.dispatch(setFilter(event.target.value));
    }


    const [Id, setId] = useState(0);

    const handleConfirm = (Id: number) => {
        setId(Id);
    };

    const handleCancel = () => {
        setId(0);
    };

    function DeleteConfirmationModal() {
        return (
            <SweetAlert
                danger
                showCancel
                confirmBtnText={t('country_delete_confirm_btn')}
                confirmBtnBsStyle="danger"
                title={t('country_delete_title')}
                onConfirm={() => handleDelete(Id)}
                onCancel={handleCancel}
                focusCancelBtn
            >
                {t('country_delete_question')}
            </SweetAlert>
        );
    }

    async function handleDelete(Id: number) {
        var result = await deleteCountry(Id);
        result.match({
            ok: () => {
                setId(0);
                toast(i18n.t('country_message_success_delete'), {
                    duration: 3000,
                    style: {
                        borderRadius: '0',
                        background: '#00D26A',
                        color: '#fff',
                    },
                });
                getList();
            },
            err: (err) => {
                toast(i18n.t(err.Message), {
                    duration: 3600,
                    style: {
                        borderRadius: '0',
                        background: '#F92F60',
                        color: '#fff',
                    },
                });
                setId(0);
            },
        });
    }

    return (
        <div className="mx-2 mt-4">
            <>
                <div className="">
                    <BreadCrumb items={breadcrumbItems} />
                </div>
                
                {/* create country button */}
                <div className="d-flex flex-row-reverse p-0 mb-2">
                    {
                        checkForPermission("COUNTRY_MANAGE") &&
                        <button className="btn app-primary-bg-color text-white" data-bs-toggle='modal' data-bs-target='#CreateCountry'>
                            {t('country_create_title')}
                        </button>
                    }
                </div>
                {/* create country button ends */}
                {/* search  */}
                <div className="row m-0">
                    <div className="col-md-11">
                        <input type='search' className="form-control custom-input" value={searchWith ?? ''} placeholder={'Search' ?? ''} onChange={addData}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                filterList();
                            }
                        }} />
                    </div>
                    <div className="col-md-1 border d-flex flex-row-reverse p-0">
                        <button className="btn app-primary-bg-color text-white" type="button" onClick={filterList}>
                            {t('bankcollectionlist_button_search')}
                        </button>
                    </div>
                </div>
                {/* search ends  */}

                <div className="">
                    <>
                        {checkForPermission("COUNTRY_VIEW") &&
                            country.match({
                                none: () => <div className="ms-1">{t('country_list_loading')}</div>,
                                some: (countrylist) =>
                                    <div className="row m-0 mt-3">
                                        {countrylist.length > 0 ? (
                                            <div className='ps-0 table-responsive overflow-auto pe-0'>
                                                {
                                                    checkForPermission("COUNTRY_MANAGE") &&  
                                                    <div className="m-0 px-2">
                                                        {
                                                            countrylist.map((field, index) => (
                                                                <div className="bg-light row m-0 my-1 p-2">
                                                                    {/* alpha 2 code */}
                                                                    <div className="col-md-1">
                                                                        <div className="text-size-11 text-muted">{t("country_list_isotwocode")}</div>
                                                                        <div>{field.country.IsoTwoCode}</div>
                                                                    </div>
                                                                    {/* alpha 2 code ends */}
                                                                    {/* alpha 3 code */}
                                                                    <div className="col-md-1">
                                                                        <div className="text-size-11 text-muted">{t("country_list_isothreecode")}</div>
                                                                        <div>{field.country.IsoThreeCode}</div>
                                                                    </div>
                                                                    {/* alpha 3 code ends */}
                                                                    {/* calling code */}
                                                                    <div className="col-md-1">
                                                                        <div className="text-size-11 text-muted">{t("country_list_callingcode")}</div>
                                                                        <div>{field.country.CallingCode}</div>
                                                                    </div>
                                                                    {/* calling code ends */}
                                                                    {/* country code */}
                                                                    <div className="col-md-3">
                                                                        <div className="text-size-11 text-muted">{t("country_list_name")}</div>
                                                                        <div>{field.country.Name}</div>
                                                                    </div>
                                                                    {/* country code ends */}
                                                                    {/* currency code */}
                                                                    <div className="col-md-2">
                                                                        <div className="text-size-11 text-muted">{t("country_list_currencycode")}</div>
                                                                        <div>{field.country.CurrencyCode}</div>
                                                                    </div>
                                                                    {/* currency code ends */}
                                                                    {/* currency name */}
                                                                    <div className="col-md-2">
                                                                        <div className="text-size-11 text-muted">{t("country_list_currencyname")}</div>
                                                                        <div>{field.country.CurrencyName}</div>
                                                                    </div>
                                                                    {/* currency name ends */}
                                                                    {/* currency symbol */}
                                                                    <div className="col-md-1">
                                                                        <div className="text-size-11 text-muted">{t("country_list_currencysymbol")}</div>
                                                                        <div>{he.decode(field.country.CurrencySymbol)}</div>
                                                                    </div>
                                                                    {/* currency symbol ends */}
                                                                    {/* action buttons */}
                                                                    <div className="col">
                                                                        {
                                                                            checkForPermission("COUNTRY_MANAGE") &&
                                                                            <div>
                                                                                <span>
                                                                                    <a className="pseudo-href app-primary-color"
                                                                                        onClick={() => store.dispatch(loadCountryDetails(field.country))}
                                                                                        data-bs-toggle="modal"
                                                                                        data-toggle="tooltip" data-placement="left" title={'Edit'}
                                                                                        data-bs-target="#EditCountry"
                                                                                    ><span className="material-symbols-outlined ">edit_note</span></a>
                                                                                </span>
                                                                                <span className="custom-pointer-cursor material-symbols-outlined app-primary-color" onClick={() => handleConfirm(field.country.Id)}>
                                                                                    Delete
                                                                                </span>
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                    {/* action buttons ends */}
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                }
                                                <div className="row m-0 ">
                                                    <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-muted ps-3">{t('country_list_no_data')}</div>
                                        )}
                                    </div>
                            })}
                        {Id ? <DeleteConfirmationModal /> : ""}
                        <Toaster />
                    </>
                </div>
            </>
            {/* Modal */}
            <CountryCreate />
            <CountryEdit />
        </div>
    );
};
