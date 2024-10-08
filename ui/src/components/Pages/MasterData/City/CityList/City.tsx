import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";
import { getAllStates, getFilteredStatesByCountry } from "../../../../../services/state";
import Select from 'react-select';
import { deleteCity, getAllCities } from "../../../../../services/city";
import { store } from "../../../../../state/store";
import { changePage, initializeCityInfoList, loadCities, setFilter, setSearch } from "./City.slice";
import { useStore, useStoreWithInitializer } from "../../../../../state/storeHooks";
import { Pagination } from "../../../../Pagination/Pagination";
import { checkForPermission } from "../../../../../helpers/permissions";
import { formatSelectInput } from "../../../../../helpers/formats";
import { CityCreate } from "../CityCreate/CityCreate";
import { loadCityDetails } from "../CityEdit/CityEdit.slice";
import { CityEdit } from "../CityEdit/CityEdit";
import SweetAlert from "react-bootstrap-sweetalert";
import toast, { Toaster } from 'react-hot-toast';

export const CityList = () => {
    const { t, i18n } = useTranslation();
    const [stateList, setStateList] = useState<{ value: any, label: any }[]>([])
    useEffect(() => {
        onLoad();
    }, []);

    const onLoad = async () => {
        store.dispatch(initializeCityInfoList());
        try {
            getList()
            const { States } = await getFilteredStatesByCountry("1");
            setStateList(formatSelectInput(States, "Name", "Id"))
            setStateList((prevStateNames) => [{ label: "All States", value: "" }, ...prevStateNames]);
        } catch (error) {
            console.error(error);
        }
    };
    const { citieslist: { city, totalRows, perPage, currentPage, searchWith,search } } = useStoreWithInitializer(({ citieslist, app }) => ({ citieslist, app }), onLoad);

    const getList = async () => {
        const result = await getAllCities(store.getState().citieslist.searchWith, store.getState().citieslist.currentPage,store.getState().citieslist.search);
        store.dispatch(loadCities(result));
    }

    const updateSearch = async (ev:any) => {        
        store.dispatch(setSearch(ev.target.value));
    }

    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_masters', Link: '/config/masters' },
        { Text: 'breadcrumbs_masters_city' },
    ];
    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        if (checkForPermission("CITY_VIEW")) {
            getList()
        }
    }
   
    const searchFilter = async (selectedOption: any) => {
        store.dispatch(setFilter({ value: selectedOption.value }));
        var value = selectedOption.value
        if (value == "") {
            store.dispatch(setFilter({ value: "" }));
        }
        getList()
    };

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
                confirmBtnText={t('city_delete_confirm_btn')}
                confirmBtnBsStyle="danger"
                title={t('city_delete_title')}
                onConfirm={() => handleDelete(Id)}
                onCancel={handleCancel}
                focusCancelBtn
            >
                {t('city_delete_question')}
            </SweetAlert>
        );
    }

    async function handleDelete(Id: number) {
        var result = await deleteCity(Id);
        result.match({
            ok: () => {
                setId(0);
                toast(i18n.t('city_message_success_delete'), {
                    duration: 3000,
                    style: {
                        borderRadius: '0',
                        background: '#00D26A',
                        color: '#fff',
                    },
                });
                onLoad();
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
        <ContainerPage>
            <>
                <BreadCrumb items={breadcrumbItems} />

                <div className="ps-3 pe-4 ">
                    <div className="row mt-1 mb-3 p-0 ">
                        <div className="col-md-9 app-primary-color ">
                            <h5 className="ms-0 ps-1"> {t('cityinfo_list')}</h5>
                        </div>
                        {checkForPermission("CITY_MANAGE") &&
                            <div className="col-md-3 ">
                                <button className="btn app-primary-bg-color text-white float-end " data-bs-toggle='modal' data-bs-target='#CreateCity'>
                                    {t('city_create_title')}
                                </button>
                            </div>
                        }
                    </div>

                    <div className="row mt-2 ps-2 pe-0">
                        <label className="">{t('cityinfo_list_filter_by_state')}</label>
                        <div className="row p-0 m-0">
                                <div className="col-md-4" >
                                    <Select
                                        options={stateList}
                                        onChange={searchFilter}
                                        placeholder={t('city_list_select_state_placeholder')}
                                        defaultValue={stateList && stateList.find(option => option.value == searchWith) || null}
                                        isSearchable
                                        classNamePrefix="react-select"
                                    />
                                </div>
                                <div className="col-md-7 me-0">
                                    <input type='search' className="form-control custom-input" name="search" 
                                    placeholder={`Search with ${search ? search : t('city_list_search_city_search_placeholder')}` ?? ''}
                                     onChange={(ev)=>updateSearch(ev)}
                                     onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            getList();
                                        }
                                    }}/>
                                </div>
                                <div className='col-md-1 float-end' >
                                    <button className="btn app-primary-bg-color h-100 text-white float-end " type="button"
                                     onClick={getList}>
                                        {t('city_list_search_button')}
                                    </button>
                                </div>
                            </div>
                    </div>
                    <>
                        {checkForPermission("CITY_VIEW") && city.match({
                            none: () => <div className="ms-1">{t('cityinfo_list_loading')}</div>,
                            some: (Cities) =>

                                <div className="">
                                    <div className="row m-0 ps-2 mt-3">
                                        {Cities.length > 0 ? (
                                            <div className='ps-0 table-responsive overflow-auto pe-0'>
                                                <table className="table table-bordered text-nowrap">
                                                    <thead>
                                                        <tr>
                                                            {checkForPermission("CITY_MANAGE") &&
                                                                <th className="col-1"></th>
                                                            }
                                                            <th scope="col">{t("city_info_list_slno")}</th>
                                                            <th scope="col">{t("city_info_list_name")}</th>
                                                            <th scope="col">{t("city_info_list_code")}</th>
                                                            <th scope="col">{t("city_info_list_state")}</th>
                                                            <th scope="col">{t("city_info_list_tenantoffice")}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Cities.map((field, index) => (
                                                            <tr className="mt-2" key={index}>
                                                                {checkForPermission("CITY_MANAGE") &&
                                                                    <td>
                                                                        <>
                                                                            <a
                                                                                className="pseudo-href app-primary-color"
                                                                                onClick={() => store.dispatch(loadCityDetails(field.city))}
                                                                                data-bs-toggle="modal"
                                                                                data-toggle="tooltip" data-placement="left" title={'Edit'}
                                                                                data-bs-target="#EditCity"
                                                                            >
                                                                                <span className="material-symbols-outlined ">
                                                                                    edit_note
                                                                                </span>
                                                                            </a>
                                                                            <span className="custom-pointer-cursor material-symbols-outlined text-size-20 app-primary-color" onClick={() => handleConfirm(field.city.Id)}>
                                                                                Delete
                                                                            </span>
                                                                        </>
                                                                    </td>
                                                                }
                                                                <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                                <td>{field.city.Name} </td>
                                                                <td>{field.city.Code} </td>
                                                                <td>{field.city.StateName} </td>
                                                                <td>{field.city.OfficeName} </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <div className="row m-0 ">
                                                    <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-muted ps-3">{t('city_info_list_no_data')}</div>
                                        )}
                                    </div>
                                </div>
                        })}
                    </>
                    {Id ? <DeleteConfirmationModal /> : ""}
                    <Toaster />
                    <CityCreate />
                    <CityEdit />
                </div>
            </>
            {/* Modal */}
        </ContainerPage>
    );
};
