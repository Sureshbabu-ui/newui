import { store } from '../../../../../../state/store';
import { useRef, useState } from 'react';
import { useStore } from '../../../../../../state/storeHooks';
import { ContainerPage } from '../../../../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../../../../Preloader/Preloader.slice';
import { loadSelectedSites, loadSiteDocumentDetails, startSubmitting, stopSubmitting, updateErrors } from '../../../../ContractSubMenu/ContractCustomerSite/SiteDocumentUpload.slice';
import FeatherIcon from 'feather-icons-react';
import { ValidationErrorComp } from '../../../../../ValidationErrors/ValidationError';
import { uploadSiteDocument } from '../../../../../../services/customer';
import { convertBackEndErrorsToValidationErrors } from '../../../../../../helpers/formats';
import { useParams } from 'react-router-dom';
import { CustomerSiteDocumentUpload } from '../../../../ContractSubMenu/ContractCustomerSite/SiteDocumentUpload';
import { AssetsDocumentUpload } from '../../../../ContractSubMenu/Assets/AssetsDocumentUpload';
import { uploadAssetDocument, uploadBackToBackAsset, uploadPreAmcDoneAsset } from '../../../../../../services/assets';
import { loadAssetDocumentDetails, loadSelectedAssets } from '../../../../ContractSubMenu/Assets/AssetsDocumentUpload.slice';
import { BackToBackVendorAssetsUpload } from './BackToBackVendorUpload/BackToBackVendorUpload';
import { loadBackToBackAssetDetails, loadSelectedBackToBackAssets } from './BackToBackVendorUpload/BackToBackVendorUpload.slice';
import { loadPreAmcDoneAssetDetails, loadSelectedPreAmcDoneAssets } from './PreAmcDoneUpload/PreAmcDoneUpload.slice';
import { PreAmcDoneUpload } from './PreAmcDoneUpload/PreAmcDoneUpload';

export const ExcelUploadManagement = () => {
    const { t } = useTranslation();
    const { errors } = useStore(({ sitedocumentupload }) => sitedocumentupload);

    const [file, setFile] = useState<File | null>(null);
    const [excelType, setExcelType] = useState(null);
    const [excelTypeIndex, setexcelTypeIndex] = useState(-1);
    const [excelProsceeded, setExcelProsceeded] = useState(false);
    const [excelTypeError, setExcelTypeError] = useState("");

    const { ContractId } = useParams<{ ContractId: string }>();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const hiddenFileUploadElement = useRef<HTMLInputElement | null>(null);
    const [excelName, setExcelName] = useState("")

    const [preAmcContractId, setPreAmcContractId] = useState<number | null>(null)
    const contractId = ContractId ?? null

    const handleFileUploaderClick = () => {
        hiddenFileUploadElement.current?.click();
    }

    const handleClearButtonClick = (event) => {
        event.stopPropagation();
        setExcelName("")
        if (excelType == "EU_CUS") {
            store.dispatch(loadSiteDocumentDetails({ SiteDetails: [], ContractId: null, CustomerSiteValidations: [] }))
        } else if (excelType == "EU_AST") {
            store.dispatch(loadAssetDocumentDetails({ AssetDetails: [], ContractId: null, AssetValidations: [] }))
        }
        store.dispatch(updateErrors({}))
        if (hiddenFileUploadElement.current !== null) {
            hiddenFileUploadElement.current.value = "";
        }
        setExcelProsceeded(false)
        setExcelType(null)
        setFile(null)
        setexcelTypeIndex(-1)
    }

    const fileSubmit = async (ev) => {
        var value = ev.target.files[0];
        value?.name && setExcelName(value.name)
        setFile(value)
    }

    const fileUpload = async () => {
        if (excelType != null) {
            setExcelProsceeded(true)
            if (file?.name != null && excelType == "EU_CUS") {
                store.dispatch(startPreloader());
                store.dispatch(startSubmitting());
                const result = await uploadSiteDocument(contractId, file)
                store.dispatch(stopSubmitting())
                result.match({
                    ok: (result) => {
                        store.dispatch(loadSiteDocumentDetails(result))
                        store.dispatch(loadSelectedSites(result.SiteDetails.filter((eachSiteDetail) => (!eachSiteDetail.IsSiteNameExist && eachSiteDetail.IsContractNumValid &&
                            eachSiteDetail.StateId !== null && eachSiteDetail.CityId !== null && eachSiteDetail.Pincode !== null && eachSiteDetail.Telephone !== null &&
                            eachSiteDetail.ContactPersonOne !== null && eachSiteDetail.LocationId !== null && eachSiteDetail.IsPincodeValid && eachSiteDetail.IsTelephoneValid &&
                            eachSiteDetail.IsReRequiredValid && eachSiteDetail.Address))))
                        setPreAmcContractId(result.ContractId)
                    },
                    err: (e) => {
                        const formattedErrors = convertBackEndErrorsToValidationErrors(e)
                        store.dispatch(updateErrors(formattedErrors))
                    },
                });
                store.dispatch(stopPreloader());
            }
            else if (file?.name != null && excelType == "EU_AST") {
                store.dispatch(startPreloader())
                const result = await uploadAssetDocument({ ContractId: contractId, DocumentFile: file })
                result.match({
                    ok: (result) => {
                        store.dispatch(loadAssetDocumentDetails(result))
                        store.dispatch(loadSelectedAssets(result.AssetDetails.filter((assets) => (!assets.IsSerialNumberExist &&
                            assets.SiteNameId !== null && assets.AssetSupportTypeId !== null &&
                            assets.ProductCategoryId !== null && assets.ProductMakeId !== null &&
                            assets.ProductId !== null && assets.LocationId !== null && assets.IsContractNOValid &&
                            assets.IsAmcValueValid && assets.AmcValue !== null && assets.IsResponseTimeInHoursValid
                            && assets.ResponseTimeInHours !== null &&
                            assets.ResolutionTimeInHours !== null &&
                            assets.IsResolutionTimeInHoursValid && assets.StandByTimeInHours !== null &&
                            assets.IsStandByTimeInHoursValid && assets.CallType !== null
                            && assets.IsCallTypeValid && assets.AMCStartDate !== null && assets.AMCEndDate !== null &&
                            assets.IsPreAmcCompletedValid && assets.IsRenewedAssetValid))))
                    },
                    err: (e) => {
                        const formattedErrors = convertBackEndErrorsToValidationErrors(e)
                        store.dispatch(updateErrors(formattedErrors))
                    },
                });
                store.dispatch(stopPreloader())
            }
            else if (file?.name != null && excelType == "EU_VTP") {
                store.dispatch(startPreloader())
                const result = await uploadBackToBackAsset(file)
                result.match({
                    ok: (result) => {
                        store.dispatch(loadBackToBackAssetDetails(result))
                        store.dispatch(loadSelectedBackToBackAssets(result.AssetDetails.filter((assets) => (assets.AssetId != null &&
                            assets.VendorBranchId != null))))
                    },
                    err: (e) => {
                        const formattedErrors = convertBackEndErrorsToValidationErrors(e)
                        store.dispatch(updateErrors(formattedErrors))
                    },
                });
                store.dispatch(stopPreloader())
            }
            else if (file?.name != null && excelType == "EU_PRD") {
                store.dispatch(startPreloader())
                const result = await uploadPreAmcDoneAsset(file)
                result.match({
                    ok: (result) => {
                        store.dispatch(loadPreAmcDoneAssetDetails(result))
                        store.dispatch(loadSelectedPreAmcDoneAssets(result.AssetDetails.filter((assets) => ((assets.AssetId != null && ((assets.PreAmcCompletedById != null && assets.PreAmcVendorBranchId == null
                            || assets.PreAmcCompletedById == null && assets.PreAmcVendorBranchId != null)))))))
                    },
                    err: (e) => {
                        const formattedErrors = convertBackEndErrorsToValidationErrors(e)
                        store.dispatch(updateErrors(formattedErrors))
                    },
                });
                store.dispatch(stopPreloader())
            }
        } else {
            setExcelTypeError(`${t('bulk_upload_preamc_options_error')}`);
        }
    }

    const fileUploadElement = useRef<HTMLInputElement | null>(null);

    const onCloseModal = () => {
        if (fileUploadElement.current !== null) {
            fileUploadElement.current.value = "";
        }
        setExcelName("")
        setExcelType(null)
        if (excelType == "EU_CUS") {
            store.dispatch(loadSiteDocumentDetails({ SiteDetails: [], ContractId: null, CustomerSiteValidations: [] }))
        } else if (excelType == "EU_AST") {
            store.dispatch(loadAssetDocumentDetails({ AssetDetails: [], ContractId: null, AssetValidations: [] }))
        }
    }

    const options = [
        { value: 'EU_CUS', label: 'excelupload_label_customersite', helptext: 'excelupload_customersite_helptext', component: <CustomerSiteDocumentUpload isPreAmcUpload={true} /> },
        { value: 'EU_AST', label: 'excelupload_label_asset', helptext: 'excelupload_asset_helptext', component: <AssetsDocumentUpload isPreAmcUpload={true} /> },
        { value: 'EU_PRD', label: 'excelupload_label_preamcdone', helptext: 'excelupload_preamcpdone_helptext', component: <PreAmcDoneUpload /> },
        { value: 'EU_PMD', label: 'excelupload_label_pmdone', helptext: 'excelupload_pmdone_helptext', component: <div></div> },
        { value: 'EU_VTP', label: 'excelupload_label_backtoback_vndr_type', helptext: 'excelupload_bacttoback_vndr_type_helptext', component: <BackToBackVendorAssetsUpload /> },
    ];

    function handleCheckbox(index: any, ev: any) {
        var value = ev.target.value
        setExcelType(value)
        setexcelTypeIndex(index)
    }

    return (
        <div
            className="modal fade px-0"
            id='ExcelUploadManagement'
            data-bs-backdrop='static'
            data-bs-keyboard='false'
            aria-hidden='true'
        >
            <div className="modal-dialog modal-fullscreen">
                <div className="modal-content">
                    <div className="modal-header mx-3">
                        <h5 className="modal-title app-primary-color">{t('bulk_upload_preamc_modal_title')}</h5>
                        <button
                            type='button'
                            className="btn-close"
                            data-bs-dismiss='modal'
                            id='closeExcelUploadManagementModal'
                            aria-label='Close'
                            onClick={onCloseModal}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div ref={containerRef}>
                            <ContainerPage>
                                <ValidationErrorComp errors={errors} />
                                <div className='row m-0 ps-4'>
                                    {/* helptext */}
                                    <div className="row ps-1">
                                        {t('bulk_upload_preamc_modal_description')}
                                    </div>
                                    {/* helptext ends */}
                                    {/* file uploader */}
                                    <div className="row ps-1 pe-0 mt-3">
                                        <div role="button" className="file-uploader border-dark bg-light p-5 text-center " onClick={handleFileUploaderClick}>
                                            {/* icon */}
                                            <div className="mb-2">
                                                <FeatherIcon icon={`${excelName ? "file" : "upload"}`} size="22" />
                                            </div>
                                            {/* icon ends */}
                                            <span className="fw-bold">
                                                {excelName
                                                    ? (
                                                        <>
                                                            <p> {excelName}</p>
                                                            <a className='ms-2' onClick={handleClearButtonClick}>{t('bulk_upload_assets_input_clear')}</a>
                                                        </>
                                                    )
                                                    : <p>{t('bulk_upload_assets_input_message')}</p>
                                                }
                                            </span>
                                        </div>
                                        <div className='col-md-10 p-0 ps-0'>
                                            <input name='DocumentFile' ref={hiddenFileUploadElement} onChange={fileSubmit} type='file' className='form-control invisible'></input>
                                        </div>
                                    </div>
                                    <div className="row ps-1">
                                        {t('bulk_upload_site_modal_description_for_file_formats')}
                                    </div>
                                    {file?.name && !excelProsceeded && (
                                        <div className="row ps-1 mt-2">
                                            <div className='text-size-15 text-danger'>{excelTypeError}</div>
                                            {options.map((option, index) => (
                                                <div key={index}>
                                                    {/* checkbox & label */}
                                                    <div>
                                                        <input
                                                            className={`form-check-input ${excelTypeError != "" ? "is-invalid" : ""}`}
                                                            type="radio"
                                                            onChange={(ev) => handleCheckbox(index, ev)}
                                                            value={option.value}
                                                            checked={excelTypeIndex === index}
                                                        />
                                                        <label className="form-check-label fw-bold ms-1">{t(option.label)}</label>
                                                        {/* checkbox & label ends */}
                                                    </div>
                                                    {/* helptext */}
                                                    <div className="ms-3 text-muted">
                                                        <small>{t(option.helptext)}</small>
                                                    </div>
                                                    {/* helptext ends */}
                                                </div>
                                            ))}
                                            <div className='ps-0'>
                                                <button type='button' onClick={fileUpload} className='btn app-primary-bg-color text-white mt-2'>
                                                    {t('site_bulk_upload_button_proceed')}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        {excelProsceeded && options[excelTypeIndex].component}
                                    </div>
                                    {/* file uploader ends */}
                                </div>
                            </ContainerPage>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}