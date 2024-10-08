import { useEffect, useState } from 'react';
import { store } from '../../../../state/store';
import { useStoreWithInitializer } from '../../../../state/storeHooks';
import { Pagination } from '../../../Pagination/Pagination';
import { useTranslation } from 'react-i18next';
import { ContractAssetBulkDeactivation, getEditAssetDetails, getAssetList, getClickedAssetDetails } from '../../../../services/assets';
import { loadAssets, initializeAssetsList, changePage, setSearch, loadCustomerSite, assetsSelected, assetsUnSelected, loadSiteCount, updateErrors, toggleInformationModalStatus, setVisibleModal } from './AssetsList.slice';
import { CreateAssets } from './CreateAssets';
import { useParams } from 'react-router-dom';
import { AssetsDocumentUpload } from './AssetsDocumentUpload';
import { convertBackEndErrorsToValidationErrors, formatDate, formatDocumentName } from '../../../../helpers/formats';
import { getContractCustomerSite, getContractCustomerSites } from '../../../../services/customer';
import { updateField } from './CreateAssets.slice';
import { ContractAssetTransfer } from './AssetsView/AssetTransfer/AssetTransfer';
import { changeAssetSite, loadCustomerSites, loadSelectedAssets } from './AssetsView/AssetTransfer/AssetTransfer.slice';
import { checkForPermission } from '../../../../helpers/permissions';
import FeatherIcon from 'feather-icons-react';
import { loadAssetEditDetails } from './AssetDetailUpdate/AssetDetailUpdate.slice';
import { UpdateAsset } from './AssetDetailUpdate/AssetDetailUpdate';
import { getContractPeriod } from '../../../../services/contracts';
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ValidationErrorComp } from '../../../ValidationErrors/ValidationError';
import { Toaster } from 'react-hot-toast';
import { AssetListFilter } from './AssetFilter/AssetFilter';
import { loadAssetDocumentDetails } from './AssetsDocumentUpload.slice';
import { ContractAssetDownload } from './AssetDownload/ContractAssetDownload';
import { loadAssetDetails, setIsAssetInfo } from '../../ServiceRequestManagement/CallCordinatorManagement/PreAmcManagement/PreAmcPendingAssets/PreAmcUpdate/PreAmcUpdate.slice';
import { PreAmcUpdate } from '../../ServiceRequestManagement/CallCordinatorManagement/PreAmcManagement/PreAmcPendingAssets/PreAmcUpdate/PreAmcUpdate';

const AssetsList = () => {
  const { t, i18n } = useTranslation();
  const { ContractId } = useParams<{ ContractId: string }>();
  const [checkBoxStatus, setcheckBoxStatus] = useState("")
  const [showModal, setShowModal] = useState(false);

  const onLoad = async () => {
    store.dispatch(initializeAssetsList());
    try {
      store.dispatch(startPreloader())
      var Assets = await getAssetList(store.getState().assetslist.Search, store.getState().assetslist.CurrentPage, ContractId, store.getState().assetfilters.AssetFilters);
      store.dispatch(loadAssets(Assets));
      store.dispatch(stopPreloader())

      const sitecount = await getContractCustomerSite(Number(ContractId))
      store.dispatch(loadSiteCount(sitecount.contractcustomersitecount))

      const Customers = await getContractCustomerSites(ContractId);
      store.dispatch(loadCustomerSites(Customers));
    } catch (error) {
      console.error(error);
    }
  }
  const {
    assetslist: { Assets, contractcustomersitescount, displayInformationModal, TotalRows, perPage, CurrentPage, Search, AssetIdList, errors, visibleModal },
  } = useStoreWithInitializer(({ assetslist, app }) => ({ assetslist, app }), onLoad);

  const ErrorModal = () => {
    return (
      <div className="modal" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Modal body text goes here.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  async function OnPageChange(index: number) {
    store.dispatch(changePage(index));
    const searchKey = store.getState().assetslist.Search;
    const result = await getAssetList(searchKey, index, ContractId, store.getState().assetfilters.AssetFilters);
    store.dispatch(loadAssets(result));
  }

  const AssetListAddData = async (event: any) => {
    store.dispatch(setSearch(event.target.value));
    if (event.target.value == "") {
      const result = await getAssetList(store.getState().assetslist.Search, store.getState().assetslist.CurrentPage, ContractId, store.getState().assetfilters.AssetFilters);
      store.dispatch(loadAssets(result));
    }
  }

  async function filterAssetList(event: any) {
    const result = await getAssetList(store.getState().assetslist.Search, store.getState().assetslist.CurrentPage, ContractId, store.getState().assetfilters.AssetFilters);
    store.dispatch(loadAssets(result));
  }

  function handleCheckboxClick(ev: any, AssetId) {
    var value = AssetId
    var name = ev.target.name
    setcheckBoxStatus(name)
    if (ev.target.checked) {
      store.dispatch(assetsSelected(value));
    } else {
      store.dispatch(assetsUnSelected(value));
    }
  }

  async function setSelectedAssets(name: any, SelectedAssets: string) {
    store.dispatch(setVisibleModal("AssetTransfer"))
    if (name == "AssetDeactivate") {
      store.dispatch(startPreloader());
      const result = await ContractAssetBulkDeactivation(SelectedAssets)
      result.match({
        ok: () => {
          store.dispatch(toggleInformationModalStatus());
        },
        err: (e) => {
          const errorMessages = convertBackEndErrorsToValidationErrors(e)
          store.dispatch(updateErrors(errorMessages));
          setShowModal(true)
        }
      });
      store.dispatch(stopPreloader());
    } else {
      const result = store.getState().assetslist.Assets.unwrap().filter(item => SelectedAssets.split(",").includes(item.Assets.Id.toString()))
      store.dispatch(loadSelectedAssets(result.map(({ Assets }) => (Assets))))  // load selected assets

      const Customers = await getContractCustomerSites(ContractId);
      const assets = store.getState().assettransfer.assets.unwrap(); // Assuming this returns an array or null/undefined
      if (assets) {
        const filteredArray = Customers.ContractCustomerSites.filter((obj) => {
          return obj.Id !== undefined && !assets.map((field) => field.asset.CustomerSiteId).includes(obj.Id);
        });
        const filteredServiceEngineers = { ContractCustomerSites: filteredArray };
        store.dispatch(loadCustomerSites(filteredServiceEngineers));
      }
      else {
        const Customers = await getContractCustomerSites(ContractId);
        store.dispatch(loadCustomerSite(Customers));
      }
      store.dispatch(changeAssetSite(SelectedAssets));
    }
  }

  function InformationModal() {
    const { t, i18n } = useTranslation();
    return (
      <SweetAlert success title="Success" onConfirm={reDirectRoute}>
        {t('update_assets_assets_created_successfully')}
      </SweetAlert>
    );
  }

  const reDirectRoute = async () => {
    store.dispatch(toggleInformationModalStatus());
    store.dispatch(initializeAssetsList());
    var result = await getAssetList("", 1, ContractId);
    store.dispatch(loadAssets(result));
  }

  async function loadContractAssetDetails(Id: number) {
    var result = await getEditAssetDetails(Id.toString());
    store.dispatch(loadAssetEditDetails(result));
    store.dispatch(setVisibleModal("UpdateAsset"))
  }

  async function contractPeriod(ContractId: number) {
    const result = await getContractPeriod(ContractId);
    store.dispatch(updateField({ name: "AmcStartDate", value: result.ContractPeriod.StartDate }));
    store.dispatch(updateField({ name: "AmcEndDate", value: result.ContractPeriod.EndDate }));
    store.dispatch(setVisibleModal("CreateNewAssets"))
  }

  const fileName = "AssetUploadSample";

  const redirectToViewDetails = async (Id) => {
    store.dispatch(setIsAssetInfo(true))
    try {
      const result = await getClickedAssetDetails(Id)
      store.dispatch(loadAssetDetails(result))
    } catch (error) {
      return error
    }
  }

  return (
    <div>
      <ValidationErrorComp errors={errors} />
      <div>
        {Assets.match({
          none: () => <div className="row mb-5 border">{t('assetslist_loading_assets')}</div>,
          some: (assets) => (
            <div className="ms-2 mt-2 mb-5">
              <div className="d-flex justify-content-between dropdown nav-link mb-0">
                <div>
                  <h5 className='app-primary-color'>{t('assetslist_contract_assets')}</h5>
                </div>
                <div className="dropdown position-relative">
                  <span
                    className="material-symbols-outlined align-middle pe-2"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    more_vert
                  </span>
                  <span
                    className="material-symbols-outlined align-middle pe-2 app-primary-color"
                    onClick={() => store.dispatch(setVisibleModal("AssetFilters"))}
                    role="button"
                    data-bs-toggle="modal"
                    data-bs-target="#AssetFilters"
                  >
                    filter_alt
                  </span>
                  <div className="dropdown-menu custom-dropdown-left">
                    {AssetIdList.length > 0 && (
                      <div>
                        <a
                          className="dropdown-item"
                          role="button"
                          data-name="AssetDeactivate"
                          onClick={() => {
                            setSelectedAssets("AssetDeactivate", AssetIdList);
                          }}
                        >
                          {t("assetslist_header_asset_deactivate")}
                        </a>
                        {checkBoxStatus === "PreAmcDoneId" && contractcustomersitescount > 1 && (
                          <div>
                            <a
                              className="dropdown-item"
                              role="button"
                              data-name="AssetTransfer"
                              onClick={(ev) => {
                                setSelectedAssets(ev, AssetIdList);
                              }}
                              data-bs-toggle="modal"
                              data-bs-target="#AssetTransfer"
                            >
                              {t("assetslist_header_asset_button_transfer")}
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                    {checkForPermission("CONTRACT_ASSET") &&
                      store.getState().generalcontractdetails.singlecontract
                        .ContractStatusCode !== "CTS_PNDG" && (
                        <>
                          {/* Download template button */}
                          <a
                            href={`${process.env.REACT_APP_DOWNLOAD_TEMPLATE}${fileName}.xlsx`}
                            download
                            role="button"
                            className="dropdown-item"
                          >
                            {t("bankcollectionmanagement_pendingcard_download_template")}
                          </a>
                          {/* Download template button ends */}
                          <a
                            className="dropdown-item"
                            data-bs-toggle="modal"
                            role="button"
                            data-bs-target="#UploadAssetDocument"
                          >
                            {t("assetslist_button_add_asset_bulk")}
                          </a>
                          <a
                            className="dropdown-item"
                            onClick={() => contractPeriod(Number(ContractId))}
                            role="button"
                            data-bs-toggle="modal"
                            data-bs-target="#CreateNewAssets"
                          >
                            {t("assetslist_button_add_asset")}
                          </a>
                          <a
                            className="dropdown-item"
                            // onClick={() => contractPeriod(Number(ContractId))}
                            role="button"
                            data-bs-toggle="modal"
                            data-bs-target="#ContractAssetDownload"
                          >
                            {t("assetslist_button_asset_download")}
                          </a>
                                  </>
                      )}
                  </div>
                </div>

              </div>
              {/* preAmc Done Asset list Starts */}
              {(assets.length > 0 || Search != null) ? (
                <>
                  <div className="row">
                    <div className="">
                      <div className="input-group">
                        <input type='search' className="form-control custom-input" value={Search ?? ''} placeholder={t('asset_list_placeholder_search') ?? ''} onChange={AssetListAddData}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              filterAssetList(e);
                            }
                          }} />
                        <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterAssetList}>
                          Search
                        </button>
                      </div>
                    </div>
                  </div>

                  {assets.length > 0 ? (
                    <div className="row m-1 mt-3 me-0">
                      <div className='ps-0 table-responsive overflow-auto pe-0'>
                        <table className="table table-bordered text-nowrap">
                          <thead>
                            <tr>
                              <th></th>
                              <th scope="col">
                              </th>
                              <th scope="col ">{t('assetslist_header_asset_th_sl_no')}</th>
                              <th scope="col">{t('assetslist_header_asset_accellocation_table')}</th>
                              <th scope="col">{t('assetslist_header_asset_customersitename')}</th>
                              <th scope="col">{t('assetslist_header_asset_serial_number_table')}</th>
                              <th scope="col">{t('assetslist_header_asset_category_table')}</th>
                              <th scope="col">{t('assetslist_header_asset_make_table')}</th>
                              <th scope="col">{t('assetslist_header_asset_model_number_table')}</th>
                              <th scope="col">{t('assetslist_header_warranty_end_date_table')}</th>
                              <th scope="col">{t('assetslist_header_preamcstatus_table')}</th>
                              <th scope="col">{t('assetslist_header_asset_mode_table')}</th>
                              <th scope="col">{t('assetslist_header_asset_status')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {assets.map(({ Assets }, index) => (
                              <tr key={index}>
                                <td>
                                  {store.getState().generalcontractdetails.singlecontract.ContractStatusCode !== 'CTS_PNDG' && (
                                    <div className='d-flex justify-center items-center'>
                                      <a
                                        className='pseudo-href app-primary-color'
                                        data-toggle="tooltip" data-placement="left" title={'Edit'}
                                        onClick={() => loadContractAssetDetails(Assets.Id)}
                                        data-bs-toggle='modal'
                                        data-bs-target='#UpdateAsset'
                                        data-testid={`asset_update_button_edit_${Assets.Id}`}
                                      >
                                        <FeatherIcon icon={"edit"} size="16" />
                                      </a>
                                      <a className="pseudo-href app-primary-color ms-2" onClick={() => redirectToViewDetails(Assets.Id)}
                                        data-bs-toggle='modal' data-bs-target='#PreAmcUpdate'>
                                        <span className="material-symbols-outlined fs-5">
                                          visibility
                                        </span>
                                      </a>
                                    </div>
                                  )}
                                </td>
                                <th>
                                  <input
                                    value={Assets.Id}
                                    checked={store.getState().assetslist.selectedContractAssets.includes(Assets.Id)}
                                    name='PreAmcDoneId'
                                    type="checkbox"
                                    onChange={(event) => handleCheckboxClick(event, Assets.Id)}
                                    disabled={Assets.IsActive ? false : true}
                                  />
                                </th>
                                <th className="text-center" scope="row">{(CurrentPage - 1) * 10 + (index + 1)}</th>
                                <td>{Assets.Location}</td>
                                <td>{Assets.CustomerSiteName}</td>
                                <td>{Assets.ProductSerialNumber}</td>
                                <td>{Assets.CategoryName}</td>
                                <td>{Assets.ProductMake}</td>
                                <td>{Assets.ModelName}</td>
                                <td>{Assets.WarrantyEndDate ? formatDate(Assets.WarrantyEndDate) : ""}</td>
                                <td>{`${Assets.IsPreAmcCompleted ? t('assetslist_status_preamcdone') : t('assetslist_status_preamcpending')}`}</td>
                                <td>{Assets.AssetAddedMode}</td>
                                <td><span className={`badge text-bg-${Assets.IsActive ? "success" : "warning"}`}> {Assets.IsActive ? "Active" : "InActive"}</span> </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="row ps-0">
                          <Pagination currentPage={CurrentPage} count={TotalRows} itemsPerPage={perPage} onPageChange={OnPageChange} />
                        </div>
                      </div>
                    </div>) : (
                    <div className="ms-1 text-muted p-0">{t('assetslist_no_preamc_done_assets_search_data_found')}</div>
                  )}
                </>
              ) : (
                <div className="ms-1 text-muted mb-5 pb-5">{t('assetslist_no_preamc_done_assets_data_found')}</div>
              )}
              {/* preAmc Done Asset list Ends */}
            </div>
          )
        })}
        {/* modal start */}
        <CreateAssets />
        <ContractAssetTransfer />
        <AssetBulkUpload />
        <UpdateAsset />
        <Toaster />
        <AssetListFilter />
        <ContractAssetDownload/>
        <PreAmcUpdate />
        {displayInformationModal ? <InformationModal /> : ""}
        {showModal ? <ErrorModal /> : ""}
      </div>
      {/* modal end       */}
    </div>
  );
}
export default AssetsList

function AssetBulkUpload() {
  const onCloseModal = () => {
    store.dispatch(loadAssetDocumentDetails({ AssetDetails: [], ContractId: null, AssetValidations: [] }))
    store.dispatch(updateErrors({}))
  }

  const { t, i18n } = useTranslation();
  return (
    <div
      className="modal fade px-0"
      id='UploadAssetDocument'
      data-bs-backdrop='static'
      data-bs-keyboard='false'
      aria-hidden='true'
    >
      <div className="modal-dialog modal-fullscreen">
        <div className="modal-content">
          <div className="modal-header mx-3">
            <h5 className="modal-title app-primary-color">{t('bulk_upload_assets_modal_title')}</h5>
            <button
              type='button'
              className="btn-close"
              data-bs-dismiss='modal'
              id='closeAssetDocumentModal'
              aria-label='Close'
              onClick={onCloseModal}
            ></button>
          </div>
          <div className="modal-body">
            <AssetsDocumentUpload isPreAmcUpload={false} />
          </div>
        </div>
      </div>
    </div>
  );
}