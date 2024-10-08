import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStoreWithInitializer } from '../../../../../../state/storeHooks';
import { store } from '../../../../../../state/store';
import { Pagination } from '../../../../../Pagination/Pagination';
import { PreAmcSiteListState, changePage, initializePreAmcPendingSites, loadPreAmcSites, loadSiteSelectDetails, setSearch, siteUpdateField } from './PreAmcPendingSites.slice';
import { getAllPreAmcPendingSiteList } from '../../../../../../services/contractPreAmc';
import Select from 'react-select';
import BreadCrumb from '../../../../../BreadCrumbs/BreadCrumb';
import { startPreloader, stopPreloader } from '../../../../../Preloader/Preloader.slice';
import { getCustomersList } from '../../../../../../services/customer';
import { formatSelectInput } from '../../../../../../helpers/formats';
import { getFilteredContractsByCustomer } from '../../../../../../services/serviceRequest';

const PreAmcPendingSites = () => {
    const { t } = useTranslation();

    const onLoad = async () => {
        store.dispatch(initializePreAmcPendingSites());
        store.dispatch(startPreloader())
        try {
            const Sites = await getAllPreAmcPendingSiteList(null, 1, filterDetails.CustomerId, filterDetails.ContractId);
            store.dispatch(loadPreAmcSites(Sites));

            const { CustomersList } = await getCustomersList();
            const Customers = await formatSelectInput(CustomersList, "Name", "Id")
            store.dispatch(loadSiteSelectDetails({ name: "CustomerNames", value: { Select: Customers } }));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const {
        preamcpendingsitelist: { PreAmcSites, TotalRows, perPage, Search, CurrentPage, filterDetails, SelectDetails },
    } = useStoreWithInitializer(({ preamcpendingsitelist }) => ({ preamcpendingsitelist }), onLoad);

    useEffect(() => {
        if (filterDetails.CustomerId != 0) {
            getFilteredSites()
        }
    }, [filterDetails.CustomerId])

    const getFilteredSites = async () => {
        if (filterDetails.CustomerId != null) {
            const { Contracts } = await getFilteredContractsByCustomer(filterDetails.CustomerId);
            const FormatedContracts = await formatSelectInput(Contracts, "ContractNumber", "Id")
            store.dispatch(loadSiteSelectDetails({ name: "ContractNumbers", value: { Select: FormatedContracts } }));
        }
        const Sites = await getAllPreAmcPendingSiteList(Search, 1, filterDetails.CustomerId, filterDetails.ContractId);
        store.dispatch(loadPreAmcSites(Sites));
    }

    useEffect(() => {
        if (filterDetails.ContractId != 0) {
            getPreAmcPendingSiteDetails()
        }
    }, [filterDetails.ContractId])

    const getPreAmcPendingSiteDetails = async () => {
        const Assets = await getAllPreAmcPendingSiteList(Search, 1, filterDetails.CustomerId, filterDetails.ContractId);
        store.dispatch(loadPreAmcSites(Assets));
    }

    async function OnPageChange(index: number) {
        store.dispatch(changePage(index));
        const Assets = await getAllPreAmcPendingSiteList(Search, index, filterDetails.CustomerId, filterDetails.ContractId);
        store.dispatch(loadPreAmcSites(Assets));
    }

    const preAmcContractAddData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            const Assets = await getAllPreAmcPendingSiteList(event.target.value, 1, filterDetails.CustomerId, filterDetails.ContractId);
            store.dispatch(loadPreAmcSites(Assets));
        }
    }

    async function preAmcContractFilterAssetsList(event: any) {
        store.dispatch(setSearch(event.target.value));
        const Assets = await getAllPreAmcPendingSiteList(event.target.value, 1, filterDetails.CustomerId, filterDetails.ContractId);
        store.dispatch(loadPreAmcSites(Assets));
    }

    const onSelectChange = (selectedOption: any, actionMeta: any) => {
        var name = actionMeta.name
        store.dispatch(siteUpdateField({ name: name as keyof PreAmcSiteListState['filterDetails'], value: selectedOption ? selectedOption.value : null }));
    }

    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_calls', Link: '/calls/callcoordinator' },
        { Text: 'preamcpending_sitelist_title' },
    ]

    return (
        <>
            <div className='container-fluid mt-0'>
                <BreadCrumb items={breadcrumbItems} />
                {PreAmcSites.match({
                    none: () => <div className="row m-1">{t('preamcpending_sitelist_loading_assets')}</div>,
                    some: (preAmcSite) => (
                        <div>
                            <div>
                                <div className='row ps-2'>
                                    <div className='row pe-0'>
                                        <div className="col-md-6">
                                            <label >{t('preamcpending_assetlist_label_customername')}</label>
                                            <Select
                                                value={SelectDetails.CustomerNames && SelectDetails.CustomerNames.find(option => option.value == filterDetails.CustomerId) || null}
                                                options={SelectDetails.CustomerNames}
                                                onChange={onSelectChange}
                                                isSearchable
                                                placeholder={t('preamcpending_assetlist_placeholder_select')}
                                                name="CustomerId"
                                                isClearable
                                            />
                                        </div>
                                        <div className="col-md-6 pe-0">
                                            <label >{t('preamcpending_assetlist_label_contractnumber')}</label>
                                            <Select
                                                options={SelectDetails.ContractNumbers}
                                                value={SelectDetails.ContractNumbers && SelectDetails.ContractNumbers.find(option => option.value == filterDetails.ContractId) || null}
                                                onChange={onSelectChange}
                                                isSearchable
                                                placeholder={t('preamcpending_assetlist_placeholder_select')}
                                                classNamePrefix="react-select"
                                                name="ContractId"
                                                isClearable
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3 mt-2 ms-2 p-0">
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

                            {(preAmcSite.length > 0) ? (
                                <>
                                    <div className="row ms-2 mt-3 me-0">
                                        <div className='ps-0 table-responsive overflow-auto pe-0'>
                                            <table className="table table-bordered text-nowrap">
                                                <thead>
                                                    <tr>
                                                        <th className='text-center' scope="col">{t('preamcsitelist_header_th_sl_no')}</th>
                                                        <th scope="col">{t('preamcsitelist_header_th_sitename')}</th>
                                                        <th scope="col">{t('preamcsitelist_header_th_customername')}</th>
                                                        <th scope="col">{t('preamcsitelist_header_th_contractnbr')}</th>
                                                        <th scope="col">{t('preamcsitelist_header_th_address')}</th>
                                                        <th scope="col">{t('preamcsitelist_header_th_primarycontactname')}</th>
                                                        <th scope="col">{t('preamcsitelist_header_th_primarycontactphone')}</th>                                                </tr>
                                                </thead>
                                                <tbody>
                                                    {preAmcSite.map(({ PreAmcSites }, index) => (
                                                        <tr key={index}>
                                                            <th className="text-center" scope="row">{(CurrentPage - 1) * 10 + (index + 1)}</th>
                                                            <td>{PreAmcSites.SiteName}</td>
                                                            <td>{PreAmcSites.CustomerName}</td>
                                                            <td>{PreAmcSites.ContractNumber}</td>
                                                            <td>{PreAmcSites.Address}</td>
                                                            <td>{PreAmcSites.PrimaryContactName}</td>
                                                            <td>{PreAmcSites.PrimaryContactPhone}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <Pagination currentPage={CurrentPage} count={TotalRows} itemsPerPage={perPage} onPageChange={OnPageChange} />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="p-3 text-muted p-0">{t('preamcpending_sitelist_nodata_found')}</div>
                            )}
                        </div>
                    )
                })}
            </div>
        </>
    );
}
export default PreAmcPendingSites 
