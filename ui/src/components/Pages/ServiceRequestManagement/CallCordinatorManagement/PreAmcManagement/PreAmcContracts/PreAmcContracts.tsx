import { useEffect } from 'react';
import { store } from '../../../../../../state/store';
import { useStoreWithInitializer } from '../../../../../../state/storeHooks';
import { Pagination } from '../../../../../Pagination/Pagination';
import { useTranslation } from 'react-i18next';
import { getAllPreAmcContractsList, getAllPreAmcSiteWiseList } from '../../../../../../services/assets';
import { formatSelectInput } from '../../../../../../helpers/formats';
import { getContractCustomerSites, getCustomersList } from '../../../../../../services/customer';
import { startPreloader, stopPreloader } from '../../../../../Preloader/Preloader.slice';
import { PreAmcListState, changePage, initializePreAmcList, loadAssetSelectDetails, loadPreAmcContracts, setSearch, updateField } from './PreAmcContracts.slice';
import { getFilteredContractsByCustomer } from '../../../../../../services/serviceRequest';
import Select from 'react-select';
import BreadCrumb from '../../../../../BreadCrumbs/BreadCrumb';
import { loadPreAmcSites, loadSiteWiseAssetSelectDetails, siteUpdateField } from './PreAmcSites/PreAmcSites.slice';
import PreAmcSites from './PreAmcSites/PreAmcSites';

const PreAmcContracts = () => {
    const { t, i18n } = useTranslation();
    const onLoad = async () => {
        store.dispatch(initializePreAmcList());
        store.dispatch(startPreloader())
        try {
            const Assets = await getAllPreAmcContractsList(null, CurrentPage);
            store.dispatch(loadPreAmcContracts(Assets));
            const { CustomersList } = await getCustomersList();
            const Customers = await formatSelectInput(CustomersList, "Name", "Id")
            store.dispatch(loadAssetSelectDetails({ name: "CustomerNames", value: { Select: Customers } }));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }
    const {
        preamccontractlist: { PreAmcContracts, TotalRows, perPage, Search, CurrentPage, filterDetails, AssetSelectDetails },
    } = useStoreWithInitializer(({ preamccontractlist }) => ({ preamccontractlist }), onLoad);

    useEffect(() => {
        if (filterDetails.CustomerId != 0) {
            getFilteredContracts()
        }
    }, [filterDetails.CustomerId])

    const getFilteredContracts = async () => {
        if (filterDetails.CustomerId != null) {
            const { Contracts } = await getFilteredContractsByCustomer(filterDetails.CustomerId);
            const FormatedContracts = await formatSelectInput(Contracts, "ContractNumber", "Id")
            store.dispatch(loadAssetSelectDetails({ name: "ContractNumbers", value: { Select: FormatedContracts } }));
        }
        const Assets = await getAllPreAmcContractsList(Search, 1, filterDetails.CustomerId, filterDetails.ContractId);
        store.dispatch(loadPreAmcContracts(Assets));
    }

    useEffect(() => {
        if (filterDetails.ContractId != 0) {
            getPreAmcPendingAssetDetails()
        }
    }, [filterDetails.ContractId])

    const getPreAmcPendingAssetDetails = async () => {
        const Assets = await getAllPreAmcContractsList(Search, 1, filterDetails.CustomerId, filterDetails.ContractId);
        store.dispatch(loadPreAmcContracts(Assets));
    }

    async function OnPageChange(index: number) {
        store.dispatch(changePage(index));
        const Assets = await getAllPreAmcContractsList(Search, index, filterDetails.CustomerId, filterDetails.ContractId);
        store.dispatch(loadPreAmcContracts(Assets));
    }

    const preAmcContractAddData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            const Assets = await getAllPreAmcContractsList(event.target.value, 1, filterDetails.CustomerId, filterDetails.ContractId);
            store.dispatch(loadPreAmcContracts(Assets));
        }
    }

    async function preAmcContractFilterAssetsList(event: any) {
        store.dispatch(setSearch(event.target.value));
        const Assets = await getAllPreAmcContractsList(event.target.value, 1, filterDetails.CustomerId, filterDetails.ContractId);
        store.dispatch(loadPreAmcContracts(Assets));
    }

    const onSelectChange = (selectedOption: any, actionMeta: any) => {
        var name = actionMeta.name
        store.dispatch(updateField({ name: name as keyof PreAmcListState['filterDetails'], value: selectedOption ? selectedOption.value : null }));
    }
    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_calls', Link: '/calls/callcoordinator' },
        { Text: 'breadcrumbs_preamcpendingcontract' },
    ]

    const getSiteWisePreAmcList = async (ContractId: number) => {
        try {
            const Assets = await getAllPreAmcSiteWiseList(null, 1, ContractId);
            store.dispatch(loadPreAmcSites(Assets));
            const { ContractCustomerSites } = await getContractCustomerSites(ContractId);
            store.dispatch(siteUpdateField({ name: "ContractId", value: ContractId }))
            const SiteNames = formatSelectInput(ContractCustomerSites, "SiteName", "Id")
            store.dispatch(loadSiteWiseAssetSelectDetails({ name: "CustomerSiteNames", value: { Select: SiteNames } }));
        } catch (error) {
            return
        }
    }

    return (
        <div className='container-fluid'>
            <BreadCrumb items={breadcrumbItems} />
            {PreAmcContracts.match({
                none: () => <div className="row m-1">{t('assetslist_loading_assets')}</div>,
                some: (contracts) => (
                    <div>
                        <div>
                            <div className='row ps-2'>
                                <div className='row pe-0'>
                                    <div className="col-md-6">
                                        <label >{t('preamcpending_assetlist_label_customername')}</label>
                                        <Select
                                            value={AssetSelectDetails.CustomerNames && AssetSelectDetails.CustomerNames.find(option => option.value == filterDetails.CustomerId) || null}
                                            options={AssetSelectDetails.CustomerNames}
                                            onChange={onSelectChange}
                                            isSearchable
                                            isClearable
                                            placeholder={t('preamcpending_assetlist_placeholder_select')}
                                            name="CustomerId"
                                        />
                                    </div>
                                    <div className="col-md-6 pe-0">
                                        <label >{t('preamcpending_assetlist_label_contractnumber')}</label>
                                        <Select
                                            options={AssetSelectDetails.ContractNumbers}
                                            value={AssetSelectDetails.ContractNumbers && AssetSelectDetails.ContractNumbers.find(option => option.value == filterDetails.ContractId) || null}
                                            onChange={onSelectChange}
                                            isSearchable
                                            isClearable
                                            placeholder={t('preamcpending_assetlist_placeholder_select')}
                                            classNamePrefix="react-select"
                                            name="ContractId"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3 mt-3 ms-2 p-0">
                                <div className="input-group">
                                    <input type='search' className="form-control custom-input" value={Search ?? ''} placeholder={t('preamcpending_assetlist_search_placeholder_select') ?? ''} onChange={preAmcContractAddData}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                preAmcContractFilterAssetsList(e);
                                            }
                                        }} />
                                    <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={preAmcContractFilterAssetsList}>
                                        {t('preamcpending_assetlist_button_search')}
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* preAmc Done Asset list Starts */}
                        {(contracts.length > 0) ? (
                            <>
                                <div className="row ms-2 mt-3 me-0">
                                    <div className='ps-0 table-responsive overflow-auto pe-0'>
                                        <table className="table table-bordered text-nowrap">
                                            <thead>
                                                <tr>
                                                    <th className="text-center" scope="col">{t('preamccontractlist_header_th_sl_no')}</th>
                                                    <th scope="col">{t('preamccontractlist_header_th_contract_no')}</th>
                                                    <th scope="col">{t('preamccontractlist_header_th_customername')}</th>
                                                    <th scope="col">{t('preamccontractlist_header_th_sitecount')}</th>
                                                    <th scope="col">{t('preamccontractlist_header_th_assetcount')}</th>
                                                    <th scope="col">{t('preamccontractlist_header_th_preamcdone_assets')}</th>
                                                    <th scope="col">{t('preamccontractlist_header_th_preamcpending_assets')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {contracts.map(({ PreAmcContracts }, index) => (
                                                    <tr key={index}>
                                                        <th className="text-center" scope="row">{(CurrentPage - 1) * 10 + (index + 1)}</th>
                                                        <td ><a href="#" onClick={() => getSiteWisePreAmcList(PreAmcContracts.ContractId)} role='button' data-bs-toggle='modal' data-bs-target="#PreAmcSite">{PreAmcContracts.ContractNumber}</a></td>
                                                        <td>{PreAmcContracts.CustomerName}</td>
                                                        <td>{PreAmcContracts.TotalSite}</td>
                                                        <td>{PreAmcContracts.TotalAsset}</td>
                                                        <td>{PreAmcContracts.PreAmcCompletedAssets}</td>
                                                        <td>{PreAmcContracts.PreAmcPendingAssets}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <Pagination currentPage={CurrentPage} count={TotalRows} itemsPerPage={perPage} onPageChange={OnPageChange} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="p-3 text-muted p-0">{t('preamcpending_contract_nodata_found')}</div>
                        )}
                        {/* preAmc Done Asset list Ends */}
                    </div>
                )
            })}
            <PreAmcCustomerSites />
        </div >
    );
}

function PreAmcCustomerSites() {
    const { t, i18n } = useTranslation();
    return (
        <div
            className="modal fade"
            id='PreAmcSite'
            data-bs-backdrop='static'
            data-bs-keyboard='false'
            aria-hidden='true'
        >
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header mx-2">
                        <h5 className="modal-title">{t('preamcpending_assetlist_title')}</h5>
                        <button
                            type='button'
                            className="btn-close"
                            data-bs-dismiss='modal'
                            id='closePreAmcSiteModal'
                            aria-label='Close'
                        ></button>
                    </div>
                    <div className="modal-body">
                        <PreAmcSites />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default PreAmcContracts 