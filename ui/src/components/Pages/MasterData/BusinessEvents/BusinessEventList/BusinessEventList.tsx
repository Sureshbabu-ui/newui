import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../../state/storeHooks';
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { store } from '../../../../../state/store';
import { changePage, initializeBusinessEventList, loadBusinessEvents, setSearch } from './BusinessEventList.slice';
import { Pagination } from "../../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { formatDateTime } from "../../../../../helpers/formats";
import { getBusinessEventList } from "../../../../../services/businessEvents";
import { checkForPermission } from "../../../../../helpers/permissions";
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";

export const BusinessEventList = () => {
    const { t } = useTranslation();
    const {
        businesseventlist: { businessevents, totalRows, currentPage, perPage, search },
    } = useStore(({ businesseventlist, app }) => ({ businesseventlist, app }));

    useEffect(() => {
        if(checkForPermission('BUSINESSEVENT_VIEW'))
        onLoad();
    }, []);

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeBusinessEventList());
        try {
            const BusinessEvent = await getBusinessEventList(search, currentPage);
            store.dispatch(loadBusinessEvents(BusinessEvent));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const result = await getBusinessEventList(search, index);
        store.dispatch(loadBusinessEvents(result));
    }

    async function filterBusinessEventList(e) {
        store.dispatch(changePage(1))
        const result = await getBusinessEventList(store.getState().businesseventlist.search,1)
        store.dispatch(loadBusinessEvents(result));
      }
      const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            store.dispatch(changePage(1))
          const result = await getBusinessEventList(store.getState().businesseventlist.search, store.getState().businesseventlist.currentPage);
          store.dispatch(loadBusinessEvents(result));
        }
      }
    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_masters', Link: '/config/masters' },  
        { Text: 'breadcrumbs_masters_business_event' }
    ];

    return (<ContainerPage>
        <>
        <BreadCrumb items={breadcrumbItems} />
        {checkForPermission("BUSINESSEVENT_VIEW") && businessevents.match({
            none: () => <>{t('businessevent_list_loading')}</>,
            some: (BusinessEvent) => <div className="ps-3 pe-4  ">
                <div className="row mt-1 mb-3 p-0 ">
                    <div className="col-md-9 app-primary-color ">
                        <h5 className="ms-0 ps-1"> {t('businessevent_list_title')}</h5>
                    </div>
                </div>
                <div className="mb-3 ps-2">
                    <div className="input-group">
                        <input type='search' className="form-control custom-input" value={search} placeholder={t('businessevent_list_placeholder_search') ?? ''}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    filterBusinessEventList(e);
                                }
                            }} onChange={addData} />
                        <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterBusinessEventList}>
                            Search
                        </button>
                    </div>
                </div>
                <div className="row mt-3 ps-1">
                    {BusinessEvent.length > 0 ? (
                        <div className=" table-responsive ">
                            <table className="table table-hover  table-bordered ">
                                <thead>
                                    <tr>
                                        <th scope="col">{t('businessevent_list_th_slno')}</th>  
                                        <th scope="col">{t('businessevent_list_th_code')}</th>
                                        <th scope="col">{t('businessevent_list_th_name')}</th>
                                        <th scope="col">{t('businessevent_list_th_createdon')}</th>
                                        <th scope="col">{t('businessevent_list_th_createdby')}</th>
                                        <th scope="col">{t('businessevent_list_th_updatedon')}</th>
                                        <th scope='col'>{t('businessevent_list_th_updatedby')}</th>
                                        <th scope='col'>{t('businessevent_list_th_status')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {BusinessEvent.map((field, index) => (
                                        <tr className="mt-2">
                                            <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                            <td>{field.businessevent.Code} </td>
                                            <td>{field.businessevent.Name} </td>
                                            <td>{formatDateTime(field.businessevent.CreatedOn)} </td>
                                            <td>{field.businessevent.CreatedBy}</td>
                                            <td>{field.businessevent.UpdatedOn ? formatDateTime(field.businessevent.UpdatedOn) : "Not yet updated"} </td>
                                            <td>{field.businessevent.UpdatedBy ?? "Not yet updated"}</td>
                                            <td>{field.businessevent.IsActive == true ? "ACTIVE" : "INACTIVE"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                    
                            <div className="row m-0">
                                <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                            </div>
                        </div>
                    ) : (
                        <div className="text-muted ps-3">{t('businessevent_no_data')}</div>
                    )}
                </div>
            </div>
        })}
        </>
    </ContainerPage>)
}