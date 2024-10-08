import { store } from '../../../../../../state/store';
import { ContainerPage } from '../../../../../ContainerPage/ContainerPage';
import { useStore } from '../../../../../../state/storeHooks';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../../../../Preloader/Preloader.slice';
import { formatDate } from '../../../../../../helpers/formats';
import BreadCrumb from '../../../../../BreadCrumbs/BreadCrumb';
import { Pagination } from '../../../../../Pagination/Pagination';
import { useEffect } from 'react';
import { checkForPermission } from '../../../../../../helpers/permissions';
import { changeCWHPage, initializePartIndentDemand, loadCWHPartIndentDemand, setCWHSearch } from './PartIndentDemandListCWH.slice';
import { DemandListCWHAttentionNeeded } from '../../../../../../services/partindentdemand';
import { selectParts, setProceed } from './CreateBulkPO/CreateBulkPO.slice';
import { CreateBulkPO } from './CreateBulkPO/CreateBulkPO';

const PartIndentDemandListCWH = () => {
    const { t } = useTranslation();
    const breadcrumbItems = () => {
        return [{ Text: 'breadcrumbs_home', Link: '/' }, { Text: 'breadcrumbs_manage_demandnote_requests_cwh' }];
    }

    const { demandscwhneeded, demandcwhcurrentPage, demandcwhtotalRows, demandcwhperPage, demandcwhsearch } = useStore(
        ({ partindentdemandlistcwh }) => partindentdemandlistcwh
    );

    const { selectedParts } = useStore(({ createbulkpo }) => createbulkpo);

    const onLoad = async () => {
        store.dispatch(startPreloader());
        store.dispatch(initializePartIndentDemand());
        try {
            const cwhattentionneeddemands = await DemandListCWHAttentionNeeded(demandcwhcurrentPage, store.getState().partindentdemandlistcwh.demandcwhsearch);
            store.dispatch(loadCWHPartIndentDemand(cwhattentionneeddemands));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader());
    }

    useEffect(() => {
        if (checkForPermission('PARTINDENTDEMAND_LIST_WAITING_FOR_CWH_ATTENTION')) {
            onLoad()
        }
    }, []);

    async function onPageChangeForCWHDemands(index: number) {
        store.dispatch(changeCWHPage(index));
        const result = await DemandListCWHAttentionNeeded(index, demandcwhsearch);
        store.dispatch(loadCWHPartIndentDemand(result));
    }

    async function addDataForCWHDemands(event: any) {
        store.dispatch(setCWHSearch(event.target.value));
        if (event.target.value == "") {
            store.dispatch(changeCWHPage(1))
            const result = await DemandListCWHAttentionNeeded(store.getState().partindentdemandlistcwh.demandcwhcurrentPage, store.getState().partindentdemandlistcwh.demandcwhsearch);
            store.dispatch(loadCWHPartIndentDemand(result));
        }
    }

    async function filterPartIndentRequestsForCWHDemands(event: any) {
        store.dispatch(changeCWHPage(1))
        const requests = await DemandListCWHAttentionNeeded(1, store.getState().partindentdemandlistcwh.demandcwhsearch);
        store.dispatch(loadCWHPartIndentDemand(requests));
    }

    async function selectPartDemand(ev: any, DemandId: number) {
        if (ev.target.checked) {
            store.dispatch(selectParts({ DemandId: DemandId, Action: 'add' }));
        } else {
            store.dispatch(selectParts({ DemandId: DemandId, Action: 'remove' }));
        }
    }

    return (
        <ContainerPage>
            {/* Demand List That CWH Attention Needed */}
            <BreadCrumb items={breadcrumbItems()} />
            {checkForPermission('PARTINDENTDEMAND_LIST_WAITING_FOR_CWH_ATTENTION') ? (
                <div className='my-2'>
                    {demandscwhneeded.match({
                        none: () => <>{t('partindentdemand_th_loading')}</>,
                        some: (demandscwhneeded) => (
                            <div className="row mt-1 mx-2 ps-0">
                                {selectedParts.length > 0 &&
                                    <div className='mb-2 p-0'>
                                        <button type="button"
                                            data-bs-toggle='modal' data-bs-target='#CreateBulkPO'
                                            onClick={() => store.dispatch(setProceed(true))}
                                            className="btn app-primary-bg-color  float-end text-white mt-2">
                                            {t('partindentdemand_createpo_button')}
                                        </button>
                                    </div>
                                }
                                <div className="input-group m-0 p-0">
                                    <input type='search' className="form-control custom-input" value={demandcwhsearch} placeholder={t('partindentdemand_search_placeholder') ?? ''} onChange={addDataForCWHDemands}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                filterPartIndentRequestsForCWHDemands(e);
                                            }
                                        }} />
                                    <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterPartIndentRequestsForCWHDemands}>
                                        {t('partindentdemand_btn_search')}
                                    </button>
                                </div>
                                {demandscwhneeded.length > 0 ? (
                                    <div className="m-0 p-0">
                                        <div className='mb-3 p-0'>
                                            <div className="table-responsive mt-2">
                                                <table className="table table-hover  table-bordered ">
                                                    <thead>
                                                        <tr>
                                                            <th> </th>
                                                            <th scope='col'></th>
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
                                                        {demandscwhneeded.map((field, index) => (
                                                            <tr className="mt-2">
                                                                <td>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        checked={selectedParts.find(item => item === field.indentdemand.Id) ? true : false}
                                                                        onChange={(ev) => selectPartDemand(ev, field.indentdemand.Id)}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <a className="pseudo-href app-primary-color"
                                                                        href={`/logistics/partindentdemands/detail/${field.indentdemand.Id}`} data-toggle="tooltip" data-placement="left" title={'View'}
                                                                    >
                                                                        <span className="material-symbols-outlined">
                                                                            visibility
                                                                        </span>
                                                                    </a>
                                                                </td>
                                                                <th scope='row'>{(demandcwhcurrentPage - 1) * 10 + (index + 1)}</th>
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
                                                    <Pagination currentPage={demandcwhcurrentPage} count={demandcwhtotalRows} itemsPerPage={demandcwhperPage} onPageChange={onPageChangeForCWHDemands} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-muted mt-1">{t('partindentdemand_th_norecords')}</div>
                                )}
                            </div>
                        ),
                    })}
                    <CreateBulkPO />
                </div>
            ) : (<></>)
            }
        </ContainerPage >
    );
}

export default PartIndentDemandListCWH