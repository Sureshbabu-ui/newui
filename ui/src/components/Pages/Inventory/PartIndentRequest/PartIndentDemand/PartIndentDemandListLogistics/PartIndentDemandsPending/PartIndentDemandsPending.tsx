import { store } from '../../../../../../../state/store';
import { ContainerPage } from '../../../../../../ContainerPage/ContainerPage';
import { useStore } from '../../../../../../../state/storeHooks';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../../../../../Preloader/Preloader.slice';
import { formatDate } from '../../../../../../../helpers/formats';
import BreadCrumb from '../../../../../../BreadCrumbs/BreadCrumb';
import { Pagination } from '../../../../../../Pagination/Pagination';
import { useEffect } from 'react';
import { checkForPermission } from '../../../../../../../helpers/permissions';
import { changePage, initializePartIndentDemand, loadPartIndentDemand, setSearch } from './PartIndentDemandsPending.slice';
import { DemandListCWHAttentionNotNeeded } from '../../../../../../../services/partindentdemand';

const PartIndentDemandsPending = () => {
    const { t } = useTranslation();
    const breadcrumbItems = () => {
        return [{ Text: 'breadcrumbs_home', Link: '/' }, { Text: 'breadcrumbs_manage_demandnote_requests' }];
    }

    const { demandscwhnotneeded, currentPage, search, totalRows, perPage } = useStore(
        ({ partindentdemandlogisticsallocated }) => partindentdemandlogisticsallocated
    );

    const onLoad = async () => {
        store.dispatch(startPreloader());
        store.dispatch(initializePartIndentDemand());
        try {
            const result = await DemandListCWHAttentionNotNeeded(currentPage, store.getState().partindentdemandlogisticsallocated.search, true);
            store.dispatch(loadPartIndentDemand(result));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader());
    }

    useEffect(() => {
        if (checkForPermission('PARTINDENTDEMAND_LIST_FOR_LOGISTICS')) {
            onLoad()
        }
    }, []);

    async function onPageChange(index: number) {
        store.dispatch(changePage(index));
        const result = await DemandListCWHAttentionNotNeeded(index, search, true);
        store.dispatch(loadPartIndentDemand(result));
    }

    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            store.dispatch(changePage(1))
            const result = await DemandListCWHAttentionNotNeeded(store.getState().partindentrequestlist.currentPage, store.getState().partindentrequestlist.search, true);
            store.dispatch(loadPartIndentDemand(result));
        }
    }

    async function filterPartIndentRequests(event: any) {
        store.dispatch(changePage(1))
        const requests = await DemandListCWHAttentionNotNeeded(1, search, true);
        store.dispatch(loadPartIndentDemand(requests));
    }

    return (
        <ContainerPage>
            <BreadCrumb items={breadcrumbItems()} />
            {/* Demand List That Not Needed CWH Attention*/}
            {checkForPermission('PARTINDENTDEMAND_LIST_FOR_LOGISTICS') ? (
                <div className='my-2'>
                    {demandscwhnotneeded.match({
                        none: () => <>{t('partindentdemand_th_loading')}</>,
                        some: (demandscwhnotneeded) => (
                            <div className="row mx-2 ps-0">
                                <div className="input-group m-0 p-0">
                                    <input type='search' className="form-control custom-input" value={search} placeholder={t('partindentdemand_search_placeholder') ?? ''} onChange={addData}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                filterPartIndentRequests(e);
                                            }
                                        }} />
                                    <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterPartIndentRequests}>
                                        {t('partindentdemand_btn_search')}
                                    </button>
                                </div>
                                {demandscwhnotneeded.length > 0 ? (
                                    <div className="mt-2  p-0">
                                        <div className='mb-3 p-0'>
                                            <div className='ps-0 table-responsive overflow-auto pe-0'>
                                                <table className="table table-bordered text-nowrap">
                                                    <thead>
                                                        <tr>
                                                            <th scope='col'> </th>
                                                            <th scope="col">{t('partindentdemand_label_sl_no')}</th>
                                                            <th scope="col">{t('partindentdemand_label_partname')}</th>
                                                            <th scope="col">{t('partindentdemand_label_quantity')}</th>
                                                            <th scope="col">{t('partindentdemand_label_uom')}</th>
                                                            <th scope="col">{t('partindentdemand_label_demanddate')}</th>
                                                            <th scope='col'>{t('partindentdemand_label_demandno')}</th>
                                                            <th scope='col'>{t('partindentdemand_label_location')}</th>
                                                            <th scope='col'>{t('partindentdemand_label_workorderno')}</th>
                                                            <th scope='col'>{t('partindentdemand_label_createdby')}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {demandscwhnotneeded.map((field, index) => (
                                                            <tr className="mt-2" key={index}>
                                                                <td>
                                                                    <a className="pseudo-href app-primary-color" href={`/logistics/partindentdemands/allocated/detail/${field.indentdemand.Id}`} data-toggle="tooltip" data-placement="left" title={'View'} >
                                                                        <span className="material-symbols-outlined">
                                                                            visibility
                                                                        </span>
                                                                    </a>
                                                                </td>
                                                                <th scope='row'>{(currentPage - 1) * 10 + (index + 1)}</th>
                                                                <td>{field.indentdemand.PartName}</td>
                                                                <td>{field.indentdemand.Quantity}</td>
                                                                <td>{field.indentdemand.UnitOfMeasurement}</td>
                                                                <td>{formatDate(field.indentdemand.DemandDate)}</td>
                                                                <td>{field.indentdemand.DemandNumber}</td>
                                                                <td>{field.indentdemand.TenantOfficeName}</td>
                                                                <td>{field.indentdemand.WorkOrderNumber}</td>
                                                                <td>{field.indentdemand.CreatedBy}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <div className="row m-0">
                                                    <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-muted ps-2 mt-1">{t('partindentdemand_th_norecords')}</div>
                                )}
                            </div>
                        ),
                    })}
                </div>
            ) : (<></>)
            }
        </ContainerPage >
    );
}

export default PartIndentDemandsPending