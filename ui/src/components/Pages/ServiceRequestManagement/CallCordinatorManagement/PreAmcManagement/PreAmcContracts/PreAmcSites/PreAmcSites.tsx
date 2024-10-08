import { useEffect } from 'react';
import { store } from '../../../../../../../state/store';
import { useStore } from '../../../../../../../state/storeHooks';
import { Pagination } from '../../../../../../Pagination/Pagination';
import { useTranslation } from 'react-i18next';
import { getAllPreAmcSiteWiseList } from '../../../../../../../services/assets';
import { PreAmcSiteListState, changePage, loadPreAmcSites, setSearch, siteUpdateField } from './PreAmcSites.slice';
import { ContainerPage } from '../../../../../../ContainerPage/ContainerPage';
import Select from 'react-select';
import { useParams } from 'react-router-dom';
import BreadCrumb from '../../../../../../BreadCrumbs/BreadCrumb';

const PreAmcSites = () => {
    const { t, i18n } = useTranslation();
    const {
        preamcsitewiselist: { PreAmcSites, TotalRows, perPage, Search, CurrentPage, filterDetails, AssetSelectDetails },
    } = useStore(({ preamcsitewiselist }) => ({ preamcsitewiselist }));
    const { ContractId } = useParams<{ ContractId: string }>();
    useEffect(() => {
        if (filterDetails.CustomerSiteId != 0) {
            getPreAmcPendingAssetDetails()
        }
    }, [filterDetails.CustomerSiteId])

    const getPreAmcPendingAssetDetails = async () => {
        const Assets = await getAllPreAmcSiteWiseList(Search, 1, filterDetails.ContractId ?? ContractId, filterDetails.CustomerSiteId);
        store.dispatch(loadPreAmcSites(Assets));
    }

    async function OnPageChange(index: number) {
        store.dispatch(changePage(index));
        const Assets = await getAllPreAmcSiteWiseList(Search, index, filterDetails.ContractId ?? ContractId, filterDetails.CustomerSiteId);
        store.dispatch(loadPreAmcSites(Assets));
    }

    const preAmcContractAddData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            const Assets = await getAllPreAmcSiteWiseList(event.target.value, 1, filterDetails.ContractId ?? ContractId, filterDetails.CustomerSiteId);
            store.dispatch(loadPreAmcSites(Assets));
        }
    }

    async function preAmcContractFilterAssetsList(event: any) {
        store.dispatch(setSearch(event.target.value));
        const Assets = await getAllPreAmcSiteWiseList(event.target.value, 1, filterDetails.ContractId ?? ContractId, filterDetails.CustomerSiteId);
        store.dispatch(loadPreAmcSites(Assets));
    }

    const onSelectChange = (selectedOption: any, actionMeta: any) => {
        var value = selectedOption.value
        var name = actionMeta.name
        store.dispatch(siteUpdateField({ name: name as keyof PreAmcSiteListState['filterDetails'], value }));
    }

    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_calls', Link: '/calls/callcoordinator' },
        { Text: 'breadcrumbs_preamcpendingasset', Link: '/calls/callcoordinator/preamcpending' },
        { Text: 'preamcpending_assetlist_title' },
    ]

    return (
        <>
            <ContainerPage>
                <>
                    {ContractId && (
                        <>
                            <BreadCrumb items={breadcrumbItems} />
                        </>
                    )}
                </>
                {PreAmcSites.match({
                    none: () => <div className="row m-1">{t('assetslist_loading_assets')}</div>,
                    some: (preAmcSite) => (
                        <div>
                            {/* preAmc Done Asset list Starts */}
                            {(preAmcSite.length > 0 || Search != null) ? (
                                <>
                                    <div className="row m-1 mt-3 me-0">
                                        <div className='ps-0 table-responsive overflow-auto pe-0'>
                                            <table className="table table-bordered text-nowrap">
                                                <thead>
                                                    <tr>
                                                        <th className='text-center' scope="col">{t('preamcsitewiselist_header_th_sl_no')}</th>
                                                        <th scope="col">{t('preamcsitewiselist_header_th_sitename')}</th>
                                                        <th scope="col">{t('preamcsitewiselist_header_th_assetcount')}</th>
                                                        <th scope="col">{t('preamcsitewiselist_header_th_preamcdone_assets')}</th>
                                                        <th scope="col">{t('preamcsitewiselist_header_th_preamcpending_assets')}</th>                                                </tr>
                                                </thead>
                                                <tbody>
                                                    {preAmcSite.map(({ PreAmcSites }, index) => (
                                                        <tr key={index}>
                                                            <th className="text-center" scope="row">{(CurrentPage - 1) * 10 + (index + 1)}</th>
                                                            <td>{PreAmcSites.SiteName}</td>
                                                            <td>{PreAmcSites.TotalAsset}</td>
                                                            <td>{PreAmcSites.PreAmcCompletedAssets}</td>
                                                            <td>{PreAmcSites.PreAmcPendingAssets}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <Pagination currentPage={CurrentPage} count={TotalRows} itemsPerPage={perPage} onPageChange={OnPageChange} />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="p-3 text-muted p-0">{t('preamcpending_assetlist_nodata_found')}</div>
                            )}
                            {/* preAmc Done Asset list Ends */}
                        </div>
                    )
                })}
            </ContainerPage>
        </>
    );
}
export default PreAmcSites 
