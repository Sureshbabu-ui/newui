import { store } from '../../../../state/store';
import { useRef, useState } from 'react';
import { useStore } from '../../../../state/storeHooks';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import {
    UploadDocumentState,
    loadSelectedSites,
    loadSiteDocumentDetails,
    setTargetRowId,
    startSubmitting,
    stopSubmitting,
    toggleInformationModalStatus,
    updateErrors,
} from './SiteDocumentUpload.slice';
import FeatherIcon from 'feather-icons-react';
import { updateValidationErrors } from '../../../App/App.slice';
import { ValidationErrorComp } from '../../../ValidationErrors/ValidationError';
import { SelectedSiteDetails, SiteDetails } from '../../../../types/customerSite';
import { getContractCustomerSiteList, getCustomerSiteList, uploadSelectedSites, uploadSiteDocument } from '../../../../services/customer';
import { convertBackEndErrorsToValidationErrors } from '../../../../helpers/formats';
// import { loadCustomerSite } from './SiteManagement.slice';
import { checkForPermission } from '../../../../helpers/permissions';
import { useHistory, useParams } from 'react-router-dom';
import { loadCustomerSite } from './CustomerSiteManagement.slice';

export const CustomerSiteDocumentUpload = ({ isPreAmcUpload }: { isPreAmcUpload: boolean }) => {
    const { t } = useTranslation();
    const { displayInformationModal, errors, sites, selectedSites, CustomerSiteValidations } = useStore(
        ({ sitedocumentupload }) => sitedocumentupload,
    );
    const { ContractId } = useParams<{ ContractId: string }>();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const hiddenFileUploadElement = useRef<HTMLInputElement | null>(null);
    const [excelName, setExcelName] = useState("")
    const [preAmcContractId, setPreAmcContractId] = useState<number | null>(null)
    const contractId = ContractId ?? null
    const history = useHistory();
    const handleFileUploaderClick = () => {
        hiddenFileUploadElement.current?.click();
    }

    const handleClearButtonClick = (event) => {
        event.stopPropagation();
        setExcelName("")
        store.dispatch(loadSiteDocumentDetails({ SiteDetails: [], ContractId: null, CustomerSiteValidations: [] }))
        store.dispatch(updateErrors({}))
        if (hiddenFileUploadElement.current !== null) {
            hiddenFileUploadElement.current.value = "";
        }
    }

    const fileUpload = async (ev) => {
        var value = ev.target.files[0];
        value?.name && setExcelName(value.name)
        if (value?.name != null) {
            store.dispatch(startPreloader());
            store.dispatch(startSubmitting());
            const result = await uploadSiteDocument(contractId, value)
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
    }

    const onSubmit = (selectedSites: SelectedSiteDetails[]) => {
        return async (ev: React.FormEvent) => {
            store.dispatch(startPreloader());
            ev.preventDefault();
            store.dispatch(startSubmitting());
            const result = await uploadSelectedSites(selectedSites, contractId ?? store.getState().sitedocumentupload.contractId)
            store.dispatch(stopSubmitting());
            result.match({
                ok: () => {
                    store.dispatch(toggleInformationModalStatus());
                },
                err: (e) => {
                    const formattedErrors = convertBackEndErrorsToValidationErrors(e)
                    store.dispatch(updateErrors(formattedErrors))
                    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                },
            });
            store.dispatch(stopPreloader());
        };
    }

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title='Success' onConfirm={reDirectRoute}>
                {t('site_document_upload_message_success')}
            </SweetAlert>
        );
    }

    const reDirectRoute = async () => {
        try {
            store.dispatch(toggleInformationModalStatus());
            store.dispatch(updateErrors({}))
            if (ContractId) {
                document.getElementById('closeSiteDocumentModal')?.click();
                const result = await getContractCustomerSiteList(store.getState().contractcustomersitemanagement.search, 1, contractId);
                store.dispatch(loadCustomerSite(result));
                // onCloseModal()
            } else {
                document.getElementById('closeExcelUploadManagementModal')?.click();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const toggleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;
        if (checked) {
            store.dispatch(loadSelectedSites(sites))
        } else {
            store.dispatch(loadSelectedSites([]))
        }
    }

    const toggleRowSelection = (event: React.ChangeEvent<HTMLInputElement>, site: SiteDetails) => {
        const { checked } = event.target;
        if (checked) {
            store.dispatch(loadSelectedSites([...selectedSites, site]))
        } else {
            store.dispatch(loadSelectedSites(selectedSites.filter((row) => (row.Id !== site.Id))))
        }
    };

    const fileUploadElement = useRef<HTMLInputElement | null>(null);

    const onCloseModal = () => {
        if (fileUploadElement.current !== null) {
            fileUploadElement.current.value = "";
        }
        store.dispatch(loadSiteDocumentDetails({ SiteDetails: [], ContractId: null, CustomerSiteValidations: [] }))
        store.dispatch(updateValidationErrors({}))
        store.dispatch(updateErrors({}))
        setExcelName("")
    }

    return (
        <div>
            {checkForPermission("CUSTOMER_SITE_UPLOAD") && <>
                <>
                    <ValidationErrorComp errors={errors} />
                    <div className={`row m-0 ${isPreAmcUpload ? 'ps-0' : 'ps-4'}`}>
                        {/* helptext */}
                        {!isPreAmcUpload && (
                            <>
                                <div className="row ps-1">
                                    {t('bulk_upload_site_modal_description')}
                                </div>
                                {/* helptext ends */}
                                {/* file uploader */}
                                <div className="row  ps-1 pe-0 mt-3">
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
                                        <input name='DocumentFile' ref={hiddenFileUploadElement} onChange={fileUpload} type='file' className='form-control invisible'></input>
                                    </div>
                                </div>
                                <div className="row ps-1 mt-2">
                                    {t('bulk_upload_site_modal_description_for_file_formats')}
                                </div>
                            </>
                        )}
                        {Object.values(CustomerSiteValidations).length > 0 && (
                            <div className='ps-0'>
                                <button type='button' className='btn btn-sm app-primary-bg-color text-white mt-2' data-bs-toggle="offcanvas"
                                    data-bs-target="#SiteErrorList">{Object.values(CustomerSiteValidations).length} {t('bulk_upload_errorfound_button')}</button>
                            </div>
                        )}
                        <div className="row ps-1 pe-0 mt-4">
                            <div className=" table-responsive px-0">
                                {sites.length > 0 && (
                                    <table className='table table-hover table-bordered table-sm '>
                                        <thead >
                                            <tr className="text-center">
                                                <th scope="col">
                                                    <input type="checkbox" checked={selectedSites.length === sites.length} onChange={toggleSelectAll} />
                                                </th>
                                                <th scope="col">{t('site_document_upload_header_slno')}</th>
                                                <th scope="col">{t('site_document_upload_header_site_contactnum')}</th>
                                                <th scope="col">{t('site_document_upload_header_site_name')}</th>
                                                <th scope="col">{t('site_document_upload_header_customeraddress')}</th>
                                                <th scope="col">{t('site_document_upload_header_customeraddressone')}</th>
                                                <th scope="col">{t('site_document_upload_header_customeraddresstwo')}</th>
                                                <th scope="col">{t('site_document_upload_header_customeraddressthree')}</th>
                                                <th scope="col">{t('site_document_upload_header_state')}</th>
                                                <th scope="col">{t('site_document_upload_header_city')}</th>
                                                <th scope="col">{t('site_document_upload_header_pincode')}</th>
                                                <th scope="col">{t('site_document_upload_header_contact_phone')}</th>
                                                <th scope="col">{t('site_document_upload_header_contact_nameone')}</th>
                                                <th scope="col">{t('site_document_upload_header_contact_nametwo')}</th>
                                                <th scope="col">{t('site_document_upload_header_contact_emailone')}</th>
                                                <th scope="col">{t('site_document_upload_header_contact_emailtwo')}</th>
                                                <th scope="col">{t('site_document_upload_header_mapped_location')}</th>
                                                <th scope="col">{t('site_document_upload_header_re')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sites.map((eachSiteDetail, index) => {
                                                const isInvalid = eachSiteDetail.IsSiteNameExist || !eachSiteDetail.IsContractNumValid ||
                                                    eachSiteDetail.StateId == null || eachSiteDetail.CityId == null || eachSiteDetail.Pincode == null || eachSiteDetail.Telephone == null ||
                                                    eachSiteDetail.ContactPersonOne == null || eachSiteDetail.LocationId == null || !eachSiteDetail.IsPincodeValid || !eachSiteDetail.IsTelephoneValid ||
                                                    !eachSiteDetail.IsReRequiredValid || !eachSiteDetail.Address

                                                return (
                                                    < tr className={isInvalid ? "text-center border border-secondary-subtle" : "text-center"}>
                                                        <td className={isInvalid ? "bg-danger-subtle" : ""}>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedSites.includes(eachSiteDetail)}
                                                                onChange={(event) => toggleRowSelection(event, eachSiteDetail)}
                                                                disabled={isInvalid ? true : false}
                                                            />
                                                        </td>
                                                        <th scope="row" className={isInvalid ? "bg-danger-subtle " : ""}>{(index + 1)}</th>
                                                        <td className={!eachSiteDetail.IsContractNumValid ? "bg-column-color bg-danger-subtle" : isInvalid ? "bg-danger-subtle" : ""}>{eachSiteDetail.ContractNumber}</td>
                                                        <td className={eachSiteDetail.IsSiteNameExist ? "bg-column-color bg-danger-subtle" : isInvalid ? "bg-danger-subtle" : ""}>{eachSiteDetail.SiteName}</td>
                                                        <td className={isInvalid ? "bg-danger-subtle " : ""}>{eachSiteDetail.Address}</td>
                                                        <td className={isInvalid ? "bg-danger-subtle " : ""}>{eachSiteDetail.AddressOne}</td>
                                                        <td className={isInvalid ? "bg-danger-subtle " : ""}>{eachSiteDetail.AddressTwo}</td>
                                                        <td className={isInvalid ? "bg-danger-subtle " : ""}>{eachSiteDetail.AddressThree}</td>
                                                        <td className={eachSiteDetail.StateId == null ? "bg-column-color bg-danger-subtle" : isInvalid ? "bg-danger-subtle" : ""} >{eachSiteDetail.State}</td>
                                                        <td className={eachSiteDetail.CityId == null ? "bg-column-color bg-danger-subtle" : isInvalid ? "bg-danger-subtle" : ""} >{eachSiteDetail.City}</td>
                                                        <td className={eachSiteDetail.Pincode == null || !eachSiteDetail.IsPincodeValid ? "bg-column-color bg-danger-subtle" : isInvalid ? "bg-danger-subtle" : ""} >{eachSiteDetail.Pincode}</td>
                                                        <td className={eachSiteDetail.Telephone == null || !eachSiteDetail.IsTelephoneValid ? "bg-column-color bg-danger-subtle" : isInvalid ? "bg-danger-subtle" : ""} >{eachSiteDetail.Telephone}</td>
                                                        <td className={eachSiteDetail.ContactPersonOne == null ? "bg-column-color bg-danger-subtle" : isInvalid ? "bg-danger-subtle" : ""} >{eachSiteDetail.ContactPersonOne}</td>
                                                        <td className={isInvalid ? "bg-danger-subtle " : ""}>{eachSiteDetail.ContactPersonTwo}</td>
                                                        <td className={isInvalid ? "bg-danger-subtle " : ""}>{eachSiteDetail.EmailOne}</td>
                                                        <td className={isInvalid ? "bg-danger-subtle " : ""}>{eachSiteDetail.EmailTwo}</td>
                                                        <td className={eachSiteDetail.LocationId == null ? "bg-column-color bg-danger-subtle" : isInvalid ? "bg-danger-subtle" : ""} >{eachSiteDetail.Location}</td>
                                                        <td className={!eachSiteDetail.IsReRequiredValid ? "bg-column-color bg-danger-subtle" : isInvalid ? "bg-danger-subtle" : ""}>{eachSiteDetail.IsReRequired}</td>
                                                    </tr>)
                                            })}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                        {/* file uploader ends */}
                    </div>
                    <div className={`${isPreAmcUpload ? 'ms-0' : 'ms-3'}`}>
                        {checkForPermission("CUSTOMER_SITE_UPLOAD") && <>
                            {selectedSites.length != 0 && selectedSites.every((eachSiteDetail) => ((!eachSiteDetail.IsSiteNameExist && eachSiteDetail.IsContractNumValid &&
                                eachSiteDetail.StateId !== null && eachSiteDetail.CityId !== null && eachSiteDetail.Pincode !== null && eachSiteDetail.Telephone !== null &&
                                eachSiteDetail.ContactPersonOne !== null && eachSiteDetail.LocationId !== null && eachSiteDetail.IsPincodeValid && eachSiteDetail.IsTelephoneValid
                                && eachSiteDetail.IsReRequiredValid && eachSiteDetail.Address))) && (
                                    <div>
                                        {sites.length > 0 && (
                                            <button type='button' onClick={onSubmit(selectedSites)} className='btn app-primary-bg-color text-white mt-2'>
                                                {t('site_bulk_upload_button_upload')}
                                            </button>
                                        )}
                                    </div>
                                )}
                        </>}
                    </div>

                </>
            </>}
            {displayInformationModal ? <InformationModal /> : ''}
            <OffCanvas />
        </div >
    );
}

const OffCanvas = () => {
    const { CustomerSiteValidations } = useStore(
        ({ sitedocumentupload }) => sitedocumentupload)
    const { t } = useTranslation();
    const OnCanvasClose = (Id: any) => {
        document.getElementById('SiteErrorList')?.click();
        setTimeout(() => {
            store.dispatch(setTargetRowId(Id));
        }, 100);
    }

    return (
        <div className="offcanvas offcanvas-end" id="SiteErrorList">
            <div className="offcanvas-header">
                <h3 className="offcanvas-title app-primary-color">Errors</h3>
                <button type="button" className="btn-close" id="SiteErrorListClose" data-bs-dismiss="offcanvas"></button>
            </div>
            <div className="offcanvas-body">
                <ul className="list-group">
                    {Object.keys(CustomerSiteValidations).map((Id) => {
                        const validationErrors = CustomerSiteValidations[Number(Id)];
                        return (
                            <li key={Id} className="list-group-item border-0">
                                <div className='bg-light ms-1' onClick={() => OnCanvasClose(Id)} role='button'>
                                    <span className="ms-4 app-primary-color"> Row {Id} :</span>
                                    <div className='ms-4 mt-1'>
                                        {validationErrors && (
                                            <ul>
                                                {validationErrors.map((error, index) => (
                                                    <li key={index}>
                                                        <span className="app-primary-color"> {t(error)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}