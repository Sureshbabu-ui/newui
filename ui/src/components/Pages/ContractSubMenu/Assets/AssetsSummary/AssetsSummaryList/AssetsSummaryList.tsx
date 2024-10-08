
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../../../state/storeHooks';
import { ContainerPage } from "../../../../../ContainerPage/ContainerPage";
import { store } from '../../../../../../state/store';
import { changePage, loadAssetSummary, initializeAssetSummaryList, setSearch, setVisibleModal } from './AssetSummaryList.slice'
import { Pagination } from "../../../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from '../../../../../Preloader/Preloader.slice';
import { getAssetSummaryList, getSelectedAssetSummary } from "../../../../../../services/assetsSummary";
import { AssetSummaryCreate } from "../AssetsSummaryCreate/AssetsSummaryCreate";
import { updateField } from "../../CreateAssets.slice";
import { useParams } from "react-router-dom";
import { checkForPermission } from "../../../../../../helpers/permissions";
import FeatherIcon from 'feather-icons-react';
import { loadSelectedAssetSummary } from "../AssetsSummaryUpdate/AssetsSummaryUpdate.slice";
import { AssetSummaryUpdate } from "../AssetsSummaryUpdate/AssetsSummaryUpdate";
import { formatCurrency } from "../../../../../../helpers/formats";
import { setActiveTab } from "../../AssetsView/AssetView.slice";
import { updateAssetProductCategory } from "../../AssetFilter/AssetFilter.slice";

const AssetsSummaryList = () => {
    const { t } = useTranslation();
    const {
        assetsummarylist: { assetsSummary, totalRows, perPage, currentPage, search },
    } = useStore(({ assetsummarylist, app }) => ({ assetsummarylist, app }));

    useEffect(() => {
        onLoadData();
    }, []);

    const { ContractId } = useParams<{ ContractId: string }>();

    useEffect(() => {
        onLoad(ContractId);
    }, [ContractId]);

    function onLoad(ContractId: string) {
        store.dispatch(updateField({ name: "ContractId", value: ContractId }));
    }

    const onLoadData = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeAssetSummaryList());
        try {
            const AssetSummary = await getAssetSummaryList(search, currentPage, ContractId);
            store.dispatch(loadAssetSummary(AssetSummary));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const result = await getAssetSummaryList(search, index, ContractId);
        store.dispatch(loadAssetSummary(result));
    }

    const filterAssetSummaryList = async (event: any) => {
        const result = await getAssetSummaryList(store.getState().assetsummarylist.search, store.getState().assetsummarylist.currentPage, ContractId);
        store.dispatch(loadAssetSummary(result));
    }
    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            const result = await getAssetSummaryList(store.getState().assetsummarylist.search, store.getState().assetsummarylist.currentPage, ContractId);
            store.dispatch(loadAssetSummary(result));
        }
    }

    async function loadClickedAssetSummary(Id: number) {
        store.dispatch(setVisibleModal("UpdateAssetSummary"));
        const result = await getSelectedAssetSummary(Id)
        store.dispatch(loadSelectedAssetSummary(result.AssetSummary));
    }
    async function handleClick(AssetProductCategoryId: number) {
        store.dispatch(updateAssetProductCategory(AssetProductCategoryId))
        store.dispatch(setActiveTab(3))
    }

    return (<ContainerPage>
        {assetsSummary.match({
            none: () => <>{t('asset_summary_list_loading_message')}</>,
            some: (Summary) =>
                <div className="ps-1">
                    <div className="row mb-2 p-0">
                        {checkForPermission("CONTRACT_ASSET") && store.getState().generalcontractdetails.singlecontract.ContractStatusCode !== 'CTS_PNDG' &&
                            <div className="col-md-12">
                                <button onClick={() => store.dispatch(setVisibleModal("CreateAssetSummary"))} disabled={store.getState().generalcontractdetails.singlecontract.ContractStatusCode === 'CTS_PNDG'} className="btn app-primary-bg-color text-white float-end " data-bs-toggle='modal' data-bs-target='#CreateAssetSummary'>
                                    {t('asset_summary_list_button_add_new')}
                                </button>
                            </div>
                        }
                    </div>
                    <div className="mb-3 ps-1">
                        <div className="input-group ">
                            <input type='search' className="form-control custom-input" value={search ?? ''} placeholder={'Search With Product Category'} onChange={addData}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        filterAssetSummaryList(e);
                                    }
                                }} />
                            <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterAssetSummaryList}>
                                {t('asset_summary_list_button_search')}
                            </button>
                        </div>
                    </div>
                    <div className="row mt-3 ps-1">
                        {Summary.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            {store.getState().generalcontractdetails.singlecontract.ContractStatusCode !== 'CTS_PNDG' && (
                                                <th aria-disabled={true} scope="col"></th>
                                            )}
                                            <th scope="col">{t('asset_summary_list_th_slno')}</th>
                                            <th scope="col">{t('asset_summary_list_th_product_category')}</th>
                                            <th scope="col">{t('asset_summary_list_th_count')}</th>
                                            <th scope="col">{t('asset_summary_list_th_preamcassetcount')}</th>
                                            <th scope="col">{t('asset_summary_list_th_pendingassetcount')}</th>
                                            <th scope="col">{t('asset_summary_list_th_interimassetcount')}</th>
                                            <th scope="col">{t('asset_summary_list_th_amc_value')}</th>
                                            <th scope="col">{t('asset_summary_list_th_part_not_covered')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Summary.map((field, index) => (
                                            <tr key={index} className="mt-2">
                                                {store.getState().generalcontractdetails.singlecontract.ContractStatusCode !== 'CTS_PNDG' && (
                                                    <td>
                                                        <a
                                                            className='pseudo-href app-primary-color'
                                                            data-toggle="tooltip" data-placement="left" title={'Edit'}
                                                            onClick={() => loadClickedAssetSummary(field.assetSummary.Id)}
                                                            data-bs-toggle='modal'
                                                            data-bs-target='#UpdateAssetSummary'
                                                            data-testid={`asset_summary_button_edit_${field.assetSummary.Id}`}
                                                        >
                                                            <FeatherIcon icon={"edit"} size="16" />
                                                        </a>
                                                    </td>
                                                )}
                                                <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                                <td>{field.assetSummary.CategoryName}</td>
                                                <td><a className='pseudo-href app-primary-color'
                                                    onClick={() => handleClick(field.assetSummary.AssetProductCategoryId)}>{field.assetSummary.ProductCountAtBooking}</a></td>                                                <td>{field.assetSummary.PreAmcAssetCount}</td>
                                                <td>{field.assetSummary.PendingAssetCount}</td>
                                                <td>{field.assetSummary.InterimAssetCount}</td>
                                                <td>{formatCurrency(field.assetSummary.AmcValue)}</td>
                                                <td>{field.assetSummary.PartCategoryNames ?? t('asset_summary_ppartnotcovered_text')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="row m-0">
                                    <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                </div>
                            </div>

                        ) : (
                            <div className="text-muted ps-3">No Data Found...</div>
                        )}
                    </div>
                    <AssetSummaryUpdate />
                    <AssetSummaryCreate />
                </div>
        })}
    </ContainerPage>)
}
export default AssetsSummaryList
