import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../../state/storeHooks';
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { store } from '../../../../../state/store';
import { changePage, initializeBusinessModuleList, loadBusinessModules, setSearch } from './BusinessModuleList.slice';
import { Pagination } from "../../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { formatDateTime } from "../../../../../helpers/formats";
import { getBusinessModuleList } from "../../../../../services/businessModule";
import { checkForPermission } from "../../../../../helpers/permissions";
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";
export const BusinessModuleList = () => {
    const { t } = useTranslation();
    const {
        businessmodulelist: { businessmodules, totalRows, perPage, currentPage, search },
    } = useStore(({ businessmodulelist, app }) => ({ businessmodulelist, app }));

    useEffect(() => {
        onLoad();
    }, []);

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeBusinessModuleList());
        try {
            const BusinessModule = await getBusinessModuleList(search, currentPage);
            store.dispatch(loadBusinessModules(BusinessModule));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const result = await getBusinessModuleList(search, index);
        store.dispatch(loadBusinessModules(result));
    }

    async function filterBusinessModuleList(e) {
        store.dispatch(changePage(1))
        const result = await getBusinessModuleList(store.getState().businessmodulelist.search, 1)
        store.dispatch(loadBusinessModules(result));
    }
    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            store.dispatch(changePage(1))
            const result = await getBusinessModuleList(store.getState().businessmodulelist.search, store.getState().businessmodulelist.currentPage);
            store.dispatch(loadBusinessModules(result));
        }
    }
    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_masters', Link: '/config/masters' },
        { Text: 'breadcrumbs_masters_business_module' }
    ];

    return (<ContainerPage>
        <>
            <BreadCrumb items={breadcrumbItems} />
            {checkForPermission("BUSINESSMODULE_VIEW") && businessmodules.match({
                none: () => <>{t('businessmodule_list_loading')}</>,
                some: (BusinessModule) => <div className="ps-3 pe-4 ">
                    <div className="row mt-1 mb-3 p-0 ">
                        <div className="col-md-9 app-primary-color ">
                            <h5 className="ms-0 ps-1"> {t('businessmodulelist_title')}</h5>
                        </div>
                    </div>
                    <div className="mb-3 ps-2">
                        <div className="input-group">
                            <input type='search' className="form-control custom-input" value={search} placeholder={t('businessmodulelist_placeholder_search') ?? ''}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        filterBusinessModuleList(e);
                                    }
                                }} onChange={addData} />
                            <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterBusinessModuleList}>
                                Search
                            </button>
                        </div>
                    </div>
                    <div className="row mt-3 mx-2">
                        {BusinessModule.length > 0 ? (
                            <div className=" table-responsive mx-0 px-0">
                                <table className="table table-hover text-nowrap table-bordered ">
                                    <thead>
                                        <tr>
                                            <th scope="col">{t('businessmodulelist_th_sl_no')}</th>
                                            <th scope="col">{t('businessmodulelist_th_name')}</th>
                                            <th scope="col">{t('businessmodulelist_th_description')}</th>
                                            <th scope="col">{t('businessmodulelist_th_createdon')}</th>
                                            <th scope="col">{t('businessmodulelist_th_createdby')}</th>
                                            <th scope="col">{t('businessmodulelist_th_updatedon')}</th>
                                            <th scope='col'>{t('businessmodulelist_th_updatedby')}</th>
                                            <th scope='col'>{t('businessmodulelist_th_status')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {BusinessModule.map((field, index) => (
                                            <tr className="mt-2" key={index}>
                                                <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                                <td>{field.businessmodule.BusinessModuleName} </td>
                                                <td>{field.businessmodule.Description} </td>
                                                <td>{formatDateTime(field.businessmodule.CreatedOn)} </td>
                                                <td>{field.businessmodule.CreatedBy}</td>
                                                <td>{field.businessmodule.UpdatedOn ? formatDateTime(field.businessmodule.UpdatedOn) : "Not yet updated"} </td>
                                                <td>{field.businessmodule.UpdatedBy ?? "Not yet updated"}</td>
                                                <td>{field.businessmodule.IsActive == true ? "ACTIVE" : "INACTIVE"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-muted ps-3">{t('businessmodule_no_data')}</div>
                        )}
                        <div className="row mx-0 pt-1">
                            <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                        </div>
                    </div>
                </div>
            })}
        </>
    </ContainerPage>)
}