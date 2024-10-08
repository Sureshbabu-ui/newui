import { useEffect } from 'react';
import { store } from '../../../../../../state/store';
import { useStoreWithInitializer } from '../../../../../../state/storeHooks';
import { Pagination } from '../../../../../Pagination/Pagination';
import { useTranslation } from 'react-i18next';
import { getAllPreAmcPendingAssetList, getClickedAssetDetails } from '../../../../../../services/assets';
import { formatDate, formatSelectInput } from '../../../../../../helpers/formats';
import { getContractCustomerSites, getCustomersList } from '../../../../../../services/customer';
import { startPreloader, stopPreloader } from '../../../../../Preloader/Preloader.slice';
import { AssetsListState, changePreAmcPendingAssetPage, initializeAssetsList, loadAssetSelectDetails, loadPreAmcPendingAssets, setPreAmcPendingSearch, toggleInformationModalStatus, updateErrors, updateField } from './PreAmcPendingAssets.slice';
import { getFilteredContractsByCustomer } from '../../../../../../services/serviceRequest';
import Select from 'react-select';
import BreadCrumb from '../../../../../BreadCrumbs/BreadCrumb';
import { PreAmcUpdate } from './PreAmcUpdate/PreAmcUpdate';
import { loadAssetDetails } from './PreAmcUpdate/PreAmcUpdate.slice';
import { getPreAMCPendingCount } from '../../../../../../services/contractPreAmc';
import SweetAlert from 'react-bootstrap-sweetalert';
import { setPreAMCPendingCount } from '../PreAmcManagement.slice';
import { PreAmcBulkUpdate } from './PreAmcBulkUpdate/PreAmcBulkUpdate';
import { assetsSelected, assetsUnSelected, selectAllAssets } from './PreAmcBulkUpdate/PreAmcBulkUpdate.slice';

const PreAmcPendingAssets = () => {
    const { t, i18n } = useTranslation();
    const onLoad = async () => {
        store.dispatch(initializeAssetsList());
        store.dispatch(startPreloader())
        try {
            const Assets = await getAllPreAmcPendingAssetList(null, CurrentPage);
            store.dispatch(loadPreAmcPendingAssets(Assets));
            const { CustomersList } = await getCustomersList();
            const Customers = await formatSelectInput(CustomersList, "Name", "Id")
            store.dispatch(loadAssetSelectDetails({ name: "CustomerNames", value: { Select: Customers } }));

            const result = await getPreAMCPendingCount();
            store.dispatch(setPreAMCPendingCount(result));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }
    const {
        preamcpendingassetlist: { preAmcPendingAsset, TotalRows, perPage, Search, CurrentPage, filterDetails, AssetSelectDetails, displayInformationModal },
    } = useStoreWithInitializer(({ preamcpendingassetlist }) => ({ preamcpendingassetlist }), onLoad);

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
        const Assets = await getAllPreAmcPendingAssetList(Search, 1, filterDetails.CustomerId, filterDetails.ContractId, filterDetails.CustomerSiteId);
        store.dispatch(loadPreAmcPendingAssets(Assets));
    }

    useEffect(() => {
        if (filterDetails.ContractId != 0) {
            getFilteredSiteNameByContract()
        }
    }, [filterDetails.ContractId])

    const getFilteredSiteNameByContract = async () => {
        if (filterDetails.ContractId != null) {
            const { ContractCustomerSites } = await getContractCustomerSites(filterDetails.ContractId);
            const SiteNames = await formatSelectInput(ContractCustomerSites, "SiteName", "Id")
            store.dispatch(loadAssetSelectDetails({ name: "CustomerSiteNames", value: { Select: SiteNames } }));
        }
        const Assets = await getAllPreAmcPendingAssetList(Search, 1, filterDetails.CustomerId, filterDetails.ContractId, filterDetails.CustomerSiteId);
        store.dispatch(loadPreAmcPendingAssets(Assets));
    }

    useEffect(() => {
        if (filterDetails.CustomerSiteId != 0) {
            getPreAmcPendingAssetDetails()
        }
    }, [filterDetails.CustomerSiteId])

    const getPreAmcPendingAssetDetails = async () => {
        const Assets = await getAllPreAmcPendingAssetList(Search, 1, filterDetails.CustomerId, filterDetails.ContractId, filterDetails.CustomerSiteId);
        store.dispatch(loadPreAmcPendingAssets(Assets));
    }

    async function OnPageChange(index: number) {
        store.dispatch(changePreAmcPendingAssetPage(index));
        const Assets = await getAllPreAmcPendingAssetList(Search, index, filterDetails.CustomerId, filterDetails.ContractId, filterDetails.CustomerSiteId);
        store.dispatch(loadPreAmcPendingAssets(Assets));
    }

    const preAmcPendingAddData = async (event: any) => {
        store.dispatch(setPreAmcPendingSearch(event.target.value));
        if (event.target.value == "") {
            const Assets = await getAllPreAmcPendingAssetList(event.target.value, 1, filterDetails.CustomerId, filterDetails.ContractId, filterDetails.CustomerSiteId);
            store.dispatch(loadPreAmcPendingAssets(Assets));
        }
    }

    async function preAmcPendingFilterAssetsList(event: any) {
        store.dispatch(setPreAmcPendingSearch(event.target.value));
        const Assets = await getAllPreAmcPendingAssetList(event.target.value, 1, filterDetails.CustomerId, filterDetails.ContractId, filterDetails.CustomerSiteId);
        store.dispatch(loadPreAmcPendingAssets(Assets));
    }

    const onSelectChange = (selectedOption: any, actionMeta: any) => {
        var name = actionMeta.name
        store.dispatch(updateField({ name: name as keyof AssetsListState['filterDetails'], value: selectedOption ? selectedOption.value : null }));
    }
    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_calls', Link: '/calls/callcoordinator' },
        { Text: 'breadcrumbs_preamcpendingasset' },
    ]

    const redirectToViewDetails = async (Id) => {
        try {
            const result = await getClickedAssetDetails(Id)
            store.dispatch(loadAssetDetails(result))
        } catch (error) {
            return error
        }
    }

    function handleCheckboxClick(ev: any, AssetId: number) {
        var value = AssetId
        if (ev.target.checked) {
            store.dispatch(assetsSelected(value));
        } else {
            store.dispatch(assetsUnSelected(value));
        }
    }

    function InformationModal() {
        const { t, i18n } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={reDirectRoute}>
                {t('update_preamc_assets_created_successfully')}
            </SweetAlert>
        );
    }

    const reDirectRoute = async () => {
        store.dispatch(toggleInformationModalStatus());
        store.dispatch(initializeAssetsList())
        try {
            const Assets = await getAllPreAmcPendingAssetList("", 1);
            store.dispatch(loadPreAmcPendingAssets(Assets));
        } catch (error) {
            return error
        }
    }

    const toggleSelectAll = (ev: any, Id: number[]) => {
        store.dispatch(selectAllAssets({ selectedId: Id, selectStaus: ev.target.checked }))
    }

    return (
        <div className='container-fluid mt-0'>
            <BreadCrumb items={breadcrumbItems} />
            {preAmcPendingAsset.match({
                none: () => <div className="row m-1">{t('assetslist_loading_assets')}</div>,
                some: (assets) => (
                    <div>
                        <div className='row ps-2'>
                            <div className={`col-md-${store.getState().preamcbulkupdate.AssetIdList.length > 0 ? 3 : 4}`}>
                                <label>{t('preamcpending_assetlist_label_customername')}</label>
                                <Select
                                    value={AssetSelectDetails.CustomerNames && AssetSelectDetails.CustomerNames.find(option => option.value == filterDetails.CustomerId) || null}
                                    options={AssetSelectDetails.CustomerNames}
                                    onChange={onSelectChange}
                                    isClearable
                                    isSearchable
                                    placeholder={t('preamcpending_assetlist_placeholder_select')}
                                    name="CustomerId"
                                />
                            </div>
                            <div className={`col-md-${store.getState().preamcbulkupdate.AssetIdList.length > 0 ? 3 : 4}`}>
                                <label>{t('preamcpending_assetlist_label_contractnumber')}</label>
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
                            <div className={`col-md-${store.getState().preamcbulkupdate.AssetIdList.length > 0 ? 3 : 4}`}>
                                <label>{t('preamcpending_assetlist_label_customersite')}</label>
                                <Select
                                    options={AssetSelectDetails.CustomerSiteNames}
                                    value={AssetSelectDetails.CustomerSiteNames && AssetSelectDetails.CustomerSiteNames.find(option => option.value == filterDetails.CustomerSiteId) || null}
                                    onChange={onSelectChange}
                                    isSearchable
                                    isClearable
                                    placeholder={t('preamcpending_assetlist_placeholder_select')}
                                    name="CustomerSiteId"
                                />
                            </div>
                            {store.getState().preamcbulkupdate.AssetIdList.length > 0 && (
                                <div className="col-md-3 d-flex justify-content-end pe-0 item-center">
                                    <button
                                        type="button"
                                        name="AssetDeactivate"
                                        data-bs-toggle='modal' data-bs-target='#PreAmcBulkUpdate'
                                        className="btn app-primary-bg-color me-2 text-white mt-2 align-self-end">
                                        {t('preamcpending_assetlist_button_update')}
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="mb-3 mt-3 ms-2 p-0">
                            <div className="input-group">
                                <input type='search' className="form-control custom-input" value={Search ?? ''} placeholder={t('asset_list_placeholder_search') ?? ''} onChange={preAmcPendingAddData}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            preAmcPendingFilterAssetsList(e);
                                        }
                                    }} />
                                <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={preAmcPendingFilterAssetsList}>
                                    {t('preamcpending_assetlist_button_search')}
                                </button>
                            </div>
                        </div>
                        {/* preAmc Done Asset list Starts */}
                        {(assets.length > 0) ? (
                            <>
                                <div className="row ms-2 mt-3 me-0">
                                    <div className='ps-0 table-responsive overflow-auto pe-0'>
                                        <table className="table table-bordered text-nowrap">
                                            <thead>
                                                <tr>
                                                    <th scope="col">
                                                        <input type="checkbox" checked={assets.length == store.getState().preamcbulkupdate.selectedContractAssets.length} onChange={(ev) => toggleSelectAll(ev, assets.map(({ preAmcPendingAsset }) => (preAmcPendingAsset.Id)))} />
                                                    </th>
                                                    <th scope="col">{t('assetslist_header_asset_th_action')}</th>
                                                    <th scope="col">{t('assetslist_header_asset_th_sl_no')}</th>
                                                    <th scope="col">{t('assetslist_header_asset_accellocation_table')}</th>
                                                    <th scope="col">{t('assetslist_header_asset_customername_table')}</th>
                                                    <th scope="col">{t('assetslist_header_cno')}</th>
                                                    <th scope="col">{t('assetslist_header_asset_customersitename')}</th>
                                                    <th scope="col">{t('assetslist_header_asset_serial_number_table')}</th>
                                                    <th scope="col">{t('assetslist_header_asset_category_table')}</th>
                                                    <th scope="col">{t('assetslist_header_asset_make_table')}</th>
                                                    <th scope="col">{t('assetslist_header_asset_model_number_table')}</th>
                                                    <th scope="col">{t('assetslist_header_isoutsourcingneeded')}</th>
                                                    <th scope="col">{t('assetslist_header_outsourcevendor')}</th>
                                                    <th scope="col">{t('assetslist_header_asset_mode_table')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {assets.map(({ preAmcPendingAsset }, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <input
                                                                value={preAmcPendingAsset.Id}
                                                                checked={store.getState().preamcbulkupdate.selectedContractAssets.includes(preAmcPendingAsset.Id)}
                                                                type="checkbox"
                                                                name='PreamcAsset'
                                                                onChange={(event) => handleCheckboxClick(event, preAmcPendingAsset.Id)}
                                                            />
                                                        </td>
                                                        <td className="text-center">
                                                            <a className="pseudo-href app-primary-color" onClick={() => redirectToViewDetails(preAmcPendingAsset.Id)}
                                                                data-bs-toggle='modal' data-bs-target='#PreAmcUpdate'>
                                                                <span className="material-symbols-outlined fs-5">
                                                                    visibility
                                                                </span>
                                                            </a>
                                                        </td>
                                                        <th className="text-center" scope="row">{(CurrentPage - 1) * 10 + (index + 1)}</th>
                                                        <td>{preAmcPendingAsset.Location}</td>
                                                        <td>{preAmcPendingAsset.CustomerName}</td>
                                                        <td>{preAmcPendingAsset.ContractNumber}</td>
                                                        <td>{preAmcPendingAsset.CustomerSiteName}</td>
                                                        <td>{preAmcPendingAsset.ProductSerialNumber}</td>
                                                        <td>{preAmcPendingAsset.CategoryName}</td>
                                                        <td>{preAmcPendingAsset.ProductMake}</td>
                                                        <td>{preAmcPendingAsset.ModelName}</td>
                                                        <td>{preAmcPendingAsset.IsOutSourcingNeeded ? t("assetslist_header_isoutsourcingneeded_yes") : t("assetslist_header_isoutsourcingneeded_no")}</td>
                                                        <td>{preAmcPendingAsset.VendorBranch}</td>
                                                        <td>{preAmcPendingAsset.AssetAddedMode}</td>
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
            <PreAmcUpdate />
            <PreAmcBulkUpdate />
            {displayInformationModal ? <InformationModal /> : ""}
        </div>
    );
}
export default PreAmcPendingAssets 
