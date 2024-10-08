import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../../state/storeHooks';
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { store } from '../../../../../state/store';
import { changePage, initializeBusinessFunctionList, loadBusinessFunctions, setSearch } from './BusinessFunctionList.slice';
import { Pagination } from "../../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { formatDateTime } from "../../../../../helpers/formats";
import { getBusinessFunctionList } from "../../../../../services/businessFunction";
import { checkForPermission } from "../../../../../helpers/permissions";
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";

export const BusinessFunctionList = () => {
    const { t } = useTranslation();
    const {
        businessfunctionlist: { businessfunctions, totalRows, perPage, currentPage, search },
    } = useStore(({ businessfunctionlist, app }) => ({ businessfunctionlist, app }));

    useEffect(() => {
        onLoad();
    }, []);

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeBusinessFunctionList());
        try {
            const BusinessFunction = await getBusinessFunctionList(search, currentPage);
            store.dispatch(loadBusinessFunctions(BusinessFunction));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const result = await getBusinessFunctionList(search, index);
        store.dispatch(loadBusinessFunctions(result));
    }

    async function filterBusinessFunctionList(e) {
        store.dispatch(changePage(1))
        const result = await getBusinessFunctionList(store.getState().businessfunctionlist.search, 1)
        store.dispatch(loadBusinessFunctions(result));
    }
    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            store.dispatch(changePage(1))
            const result = await getBusinessFunctionList(store.getState().businessfunctionlist.search, store.getState().businessfunctionlist.currentPage);
            store.dispatch(loadBusinessFunctions(result));
        }
    }
    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_masters', Link: '/config/masters' },
        { Text: 'breadcrumbs_masters_business_function' }
    ];

    return (<ContainerPage>
        <>
            <BreadCrumb items={breadcrumbItems} />
            {checkForPermission("BUSINESSFUNCTION_VIEW") && businessfunctions.match({
                none: () => <>{t('businessfunction_list_loading')}</>,
                some: (BusinessFunction) => <div className="ps-3 pe-4    mt-3">
                    <div className="row mt-1 mb-3 p-0 ">
                        <div className="col-md-9 app-primary-color ">
                            <h5 className="ms-0 ps-1"> {t('businessfunctionlist_title')}</h5>
                        </div>
                    </div>
                    <div className="mb-3 ps-2">
                        <div className="input-group">
                            <input type='search' className="form-control custom-input" value={search} placeholder={t('businessfunctionlist_placeholder_search') ?? ''}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        filterBusinessFunctionList(e);
                                    }
                                }} onChange={addData} />
                            <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterBusinessFunctionList}>
                                Search
                            </button>
                        </div>
                    </div>
                    <div className="row mt-3 mx-2">
                        {BusinessFunction.length > 0 ? (
                            <div className=" table-responsive mx-0 px-0 ">
                                <table className="table table-hover text-nowrap table-bordered ">
                                    <thead>
                                        <tr>
                                            <th scope="col">{t('businessfunctionlist_th_sl_no')}</th>
                                            <th scope="col">{t('businessfunctionlist_th_code')}</th>
                                            <th scope="col">{t('businessfunctionlist_th_name')}</th>
                                            <th scope="col">{t('businessfunctionlist_th_businessmodule')}</th>
                                            <th scope="col">{t('businessfunctionlist_th_createdon')}</th>
                                            <th scope="col">{t('businessfunctionlist_th_createdby')}</th>
                                            <th scope="col">{t('businessfunctionlist_th_updatedon')}</th>
                                            <th scope='col'>{t('businessfunctionlist_th_updatedby')}</th>
                                            <th scope='col'>{t('businessfunctionlist_th_status')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {BusinessFunction.map((field, index) => (
                                            <tr className="mt-2" key={index}>
                                                <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                                <td>{field.businessfunction.BusinessFunctionCode} </td>
                                                <td>{field.businessfunction.BusinessFunctionName} </td>
                                                <td>{field.businessfunction.BusinessModuleName} </td>
                                                <td>{formatDateTime(field.businessfunction.CreatedOn)} </td>
                                                <td>{field.businessfunction.CreatedBy}</td>
                                                <td>{field.businessfunction.UpdatedOn ? formatDateTime(field.businessfunction.UpdatedOn) : "Not yet updated"} </td>
                                                <td>{field.businessfunction.UpdatedBy ?? "Not yet updated"}</td>
                                                <td>{field.businessfunction.IsActive == true ? "ACTIVE" : "INACTIVE"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="row m-0">
                                    <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                </div>
                            </div>
                        ) : (
                            <div className="text-muted ps-3">{t('businessfunction_no_data')}</div>
                        )}
                    </div>
                </div>
            })}
        </>
    </ContainerPage>)
}