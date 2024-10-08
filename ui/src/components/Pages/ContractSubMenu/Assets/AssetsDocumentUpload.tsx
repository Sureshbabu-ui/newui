import { store } from '../../../../state/store';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../../../state/storeHooks';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import FeatherIcon from 'feather-icons-react';
import {
    loadAssetDocumentDetails,
    loadSelectedAssets,
    setTargetRowId,
    toggleInformationModalStatus,
    updateErrors,
} from './AssetsDocumentUpload.slice';
import { useParams } from 'react-router-dom';
import { ValidationErrorComp } from '../../../ValidationErrors/ValidationError';
import { AssetDetails, SelectedAssetDetail } from '../../../../types/assets';
import { uploadAssetDocument, uploadSelectedAssets, getAssetList } from '../../../../services/assets';
import { loadAssets } from './AssetsList.slice';
import { convertBackEndErrorsToValidationErrors } from '../../../../helpers/formats';

export const AssetsDocumentUpload = ({ isPreAmcUpload }: { isPreAmcUpload: boolean }) => {
    const { t } = useTranslation();
    const { displayInformationModal, errors, assets, selectedAssets, targetRowId, AssetValidations } = useStore(
        ({ assetdocumentupload }) => assetdocumentupload,
    );
    const containerRef = useRef<HTMLDivElement | null>(null);
    const { ContractId } = useParams<{ ContractId: string }>();
    const [excelName, setExcelName] = useState("")
    const contractId = ContractId ?? null

    const hiddenFileUploadElement = useRef<HTMLInputElement | null>(null);

    const onCloseModal = () => {
        if (hiddenFileUploadElement.current !== null) {
            hiddenFileUploadElement.current.value = "";
        }
        store.dispatch(loadAssetDocumentDetails({ AssetDetails: [], ContractId: null, AssetValidations: [] }))
        store.dispatch(updateErrors({}))
        setExcelName("")
    }

    const rowRefs = useRef({});

    useEffect(() => {
        if (targetRowId) {
            if (rowRefs.current[targetRowId]) {
                rowRefs.current[targetRowId].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [targetRowId]);

    const handleFileUploaderClick = () => {
        hiddenFileUploadElement.current?.click();
    }

    const handleClearButtonClick = (event) => {
        event.stopPropagation();
        setExcelName("")
        store.dispatch(loadAssetDocumentDetails({ AssetDetails: [], ContractId: null, AssetValidations: [] }))
        store.dispatch(updateErrors({}))
        if (hiddenFileUploadElement.current !== null) {
            hiddenFileUploadElement.current.value = "";
        }
    }

    const fileUpload = async (ev) => {
        var value = ev.target.files[0];
        value?.name && setExcelName(value.name)
        if (value?.name != null) {
            store.dispatch(startPreloader())
            const result = await uploadAssetDocument({ ContractId: ContractId, DocumentFile: value })
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
    }

    const onSubmit = (selectedAssets: SelectedAssetDetail[]) => {
        return async (ev: React.FormEvent) => {
            store.dispatch(startPreloader());
            ev.preventDefault();
            const result = await uploadSelectedAssets(selectedAssets, contractId ?? store.getState().assetdocumentupload.ContractId)
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
                {t('asset_document_upload_message_success')}
            </SweetAlert>
        );
    }

    const reDirectRoute = async () => {
        try {
            store.dispatch(toggleInformationModalStatus());
            document.getElementById('closeAssetDocumentModal')?.click();
            if (ContractId) {
                var result = await getAssetList(store.getState().assetslist.Search, store.getState().assetslist.CurrentPage, ContractId);
                store.dispatch(loadAssets(result));
                onCloseModal()
            }
            else {
                document.getElementById('closeExcelUploadManagementModal')?.click();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const toggleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;
        if (checked) {
            store.dispatch(loadSelectedAssets(assets))
        } else {
            store.dispatch(loadSelectedAssets([]))
        }
    }

    const toggleRowSelection = (event: React.ChangeEvent<HTMLInputElement>, asset: AssetDetails) => {
        const { checked } = event.target;
        if (checked) {
            store.dispatch(loadSelectedAssets([...selectedAssets, asset]))
        } else {
            store.dispatch(loadSelectedAssets(selectedAssets.filter((row) => (row.Id !== asset.Id))))
        }
    };

    return (
        <div ref={containerRef}>
            <ValidationErrorComp errors={errors} />
            {(errors["limitExceeded"] || errors["notAddedInSummary"]) && (
                <>
                    <div className="fw-bold text-danger mb-2">{t('asset_upload_error_msg')}</div>
                    {errors["limitExceeded"] && (
                        <div className="ps-3 mb-2 text-danger">
                            {t('asset_upload_error_msg_limitexceeded')}  {(errors['limitExceeded'])}
                        </div>
                    )}
                    {errors["notAddedInSummary"] && (
                        <div className="ps-3 mb-2 text-danger">
                            {t('asset_upload_error_msg_notadded')} {(errors['notAddedInSummary'])}
                        </div>
                    )}
                </>
            )}
            <div className={`row m-0 ${isPreAmcUpload ? 'ps-0' : 'ps-4'}`}>
                {!isPreAmcUpload && (
                    <>
                        {/* helptext */}
                        <div className="row  ps-1">
                            {t('bulk_upload_assets_modal_description')}
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
                            {t('bulk_upload_assetfiletype_description')}
                        </div>
                    </>
                )}
                {Object.values(AssetValidations).length > 0 && (
                    <div className='ps-0'>
                        <button type='button' className='btn btn-sm app-primary-bg-color text-white mt-2' data-bs-toggle="offcanvas"
                            data-bs-target="#ErrorList">{Object.values(AssetValidations).length} {t('bulk_upload_errorfound_button')}</button>
                    </div>
                )}
                <div className="row ps-1 pe-0 mt-4">
                    <div className=" table-responsive px-0">
                        {assets.length > 0 && (
                            <table className='table table-hover table-bordered text-nowrap'>
                                <thead className='text-center'>
                                    <tr className="">
                                        <th >
                                            <input type="checkbox" checked={selectedAssets.length === assets.length} onChange={toggleSelectAll} />
                                        </th>
                                        <th >{t('asset_document_upload_header_Id')}</th>
                                        <th >{t('asset_document_upload_header_location')}</th>
                                        <th >{t('asset_document_upload_header_contractnumber')}</th>
                                        <th >{t('asset_document_upload_header_sitename')}</th>
                                        <th >{t('asset_document_upload_header_productcategory')}</th>
                                        <th >{t('asset_document_upload_header_productmake')}</th>
                                        <th >{t('asset_document_upload_header_product')}</th>
                                        <th >{t('asset_document_upload_header_assetserialnumber')}</th>
                                        <th >{t('asset_document_upload_header_amcvalue')}</th>
                                        <th >{t('asset_document_upload_header_responsetimeinhours')}</th>
                                        <th >{t('asset_document_upload_header_resolutiontimeinhours')}</th>
                                        <th >{t('asset_document_upload_header_standbytimeinhours')}</th>
                                        <th >{t('asset_document_upload_header_calltype')}</th>
                                        <th >{t('asset_document_upload_header_amcstartdate')}</th>
                                        <th >{t('asset_document_upload_header_amcenddate')}</th>
                                        <th >{t('asset_document_upload_header_assetsupporttype')}</th>
                                        <th >{t('asset_document_upload_header_isrenewedasset')}</th>
                                        <th >{t('asset_document_upload_header_ispreamccompleted')}</th>
                                        <th >{t('asset_document_upload_header_warrantyenddate')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assets.map((eachAssetDetails, index) => {
                                        const IsInValid = eachAssetDetails.IsSerialNumberExist || eachAssetDetails.SiteNameId == null ||
                                            eachAssetDetails.AssetSupportTypeId == null || eachAssetDetails.LocationId == null ||
                                            eachAssetDetails.ProductCategoryId == null || eachAssetDetails.ProductMakeId == null || eachAssetDetails.LocationId == null ||
                                            eachAssetDetails.ProductId == null || !eachAssetDetails.IsAmcValueValid || !eachAssetDetails.IsResponseTimeInHoursValid ||
                                            !eachAssetDetails.IsResolutionTimeInHoursValid || !eachAssetDetails.IsStandByTimeInHoursValid || !eachAssetDetails.IsCallTypeValid ||
                                            eachAssetDetails.AMCStartDate == null || eachAssetDetails.AMCEndDate == null ||
                                            !eachAssetDetails.IsContractNOValid || !eachAssetDetails.IsPreAmcCompletedValid || !eachAssetDetails.IsRenewedAssetValid

                                        return (
                                            <tr key={index} ref={(ref) => (rowRefs.current[eachAssetDetails.Id] = ref)} className={IsInValid ? "text-center border border-secondary-subtle" : "text-center"}>
                                                <td className={`${IsInValid ? "bg-danger-subtle" : ""}`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedAssets.includes(eachAssetDetails)}
                                                        onChange={(event) => toggleRowSelection(event, eachAssetDetails)}
                                                        disabled={IsInValid ? true : false}
                                                    />
                                                </td>
                                                <th scope="row" className={IsInValid ? "bg-danger-subtle " : "mb-1 "}>{(index + 1)}</th>
                                                <td className={eachAssetDetails.LocationId == null ? "bg-column-color bg-danger-subtle" : IsInValid ? "bg-danger-subtle" : ""}>{eachAssetDetails.Location}</td>
                                                <td className={!eachAssetDetails.IsContractNOValid ? "bg-column-color bg-danger-subtle" : IsInValid ? "bg-danger-subtle" : ""}>{eachAssetDetails.ContractNumber}</td>
                                                <td className={eachAssetDetails.SiteNameId == null ? "bg-column-color bg-danger-subtle" : IsInValid ? "bg-danger-subtle" : ""}>{eachAssetDetails.SiteName}</td>
                                                <td className={eachAssetDetails.ProductCategoryId == null ? "bg-column-color  bg-danger-subtle" : IsInValid ? "bg-danger-subtle" : ""}>{eachAssetDetails.ProductCategory}</td>
                                                <td className={eachAssetDetails.ProductMakeId == null ? "bg-column-color bg-danger-subtle" : IsInValid ? "bg-danger-subtle" : ""}>{eachAssetDetails.ProductMake}</td>
                                                <td className={eachAssetDetails.ProductId == null ? "bg-column-color bg-danger-subtle" : IsInValid ? "bg-danger-subtle" : ""}>{eachAssetDetails.Product}</td>
                                                <td className={eachAssetDetails.IsSerialNumberExist ? "bg-column-color bg-danger-subtle" : IsInValid ? "bg-danger-subtle" : ""}>{eachAssetDetails.AssetSerialNumber}</td>
                                                <td className={(!eachAssetDetails.IsAmcValueValid || eachAssetDetails.AmcValue == null) ? "bg-column-color bg-danger-subtle" : IsInValid ? "bg-danger-subtle" : ""}>{eachAssetDetails.AmcValue}</td>
                                                <td className={(!eachAssetDetails.IsResponseTimeInHoursValid || eachAssetDetails.ResponseTimeInHours == null) ? "bg-column-color bg-danger-subtle" : IsInValid ? "bg-danger-subtle" : ""}>{eachAssetDetails.ResponseTimeInHours}</td>
                                                <td className={(!eachAssetDetails.IsResolutionTimeInHoursValid || eachAssetDetails.ResolutionTimeInHours == null) ? "bg-column-color bg-danger-subtle" : IsInValid ? "bg-danger-subtle" : ""}>{eachAssetDetails.ResolutionTimeInHours}</td>
                                                <td className={(!eachAssetDetails.IsStandByTimeInHoursValid || eachAssetDetails.StandByTimeInHours == null) ? "bg-column-color bg-danger-subtle" : IsInValid ? "bg-danger-subtle" : ""}>{eachAssetDetails.StandByTimeInHours}</td>
                                                <td className={(!eachAssetDetails.IsCallTypeValid || eachAssetDetails.CallType == null) ? "bg-column-color bg-danger-subtle" : IsInValid ? "bg-danger-subtle" : ""}>{eachAssetDetails.CallType}</td>
                                                <td className={eachAssetDetails.AMCStartDate == null ? "bg-column-color bg-danger-subtle" : IsInValid ? "bg-danger-subtle" : ""}>{eachAssetDetails.AMCStartDate?.toString()?.split('T')[0]}</td>
                                                <td className={eachAssetDetails.AMCEndDate == null ? "bg-column-color bg-danger-subtle" : IsInValid ? "bg-danger-subtle" : ""}>{eachAssetDetails.AMCEndDate?.toString()?.split('T')[0]}</td>
                                                <td className={eachAssetDetails.AssetSupportTypeId == null ? "bg-column-color bg-danger-subtle" : IsInValid ? "bg-danger-subtle" : ""}>{eachAssetDetails.AssetSupportType}</td>
                                                <td className={!eachAssetDetails.IsRenewedAssetValid ? "bg-column-color bg-danger-subtle" : IsInValid ? "bg-danger-subtle" : ""}>{eachAssetDetails.IsRenewedAssetValue}</td>
                                                <td className={!eachAssetDetails.IsPreAmcCompletedValid ? "bg-column-color bg-danger-subtle" : IsInValid ? "bg-danger-subtle" : ""}>{eachAssetDetails.IsPreAmcCompletedValue}</td>
                                                <td className={IsInValid ? "bg-danger-subtle" : ""} >{eachAssetDetails.WarrantyEndDate?.toString()?.split('T')[0]}</td>
                                            </tr>)
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                {/* file uploader ends */}

            </div>
            <div className="col-6 mt-2  ps-3 mt-2 ">
                {selectedAssets.length != 0 && selectedAssets.every((assets) => (!assets.IsSerialNumberExist &&
                    assets.SiteNameId !== null && assets.AssetSupportTypeId !== null &&
                    assets.ProductCategoryId !== null && assets.ProductMakeId !== null &&
                    assets.ProductId !== null && assets.LocationId != null && assets.IsContractNOValid
                    && assets.IsAmcValueValid && assets.AmcValue !== null && assets.IsResponseTimeInHoursValid
                    && assets.ResponseTimeInHours !== null &&
                    assets.ResolutionTimeInHours !== null &&
                    assets.IsResolutionTimeInHoursValid && assets.StandByTimeInHours !== null &&
                    assets.IsStandByTimeInHoursValid && assets.CallType !== null
                    && assets.IsCallTypeValid && assets.IsPreAmcCompletedValid && assets.IsRenewedAssetValid &&
                    assets.AMCStartDate !== null && assets.AMCEndDate !== null
                )) && (
                        <>
                            {assets.length > 0 && (
                                <button type='button' onClick={onSubmit(selectedAssets)} className='btn app-primary-bg-color text-white mt-2 ms-0'>
                                    {t('asset_document_upload_button_upload')}
                                </button>
                            )}
                        </>
                    )}
            </div>
            {displayInformationModal ? <InformationModal /> : ''}
            <OffCanvas />
        </div >
    );
}


const OffCanvas = () => {
    const { AssetValidations } = useStore(
        ({ assetdocumentupload }) => assetdocumentupload)
    const { t } = useTranslation();
    const OnCanvasClose = (Id: any) => {
        document.getElementById('ErrorListClose')?.click();
        setTimeout(() => {
            store.dispatch(setTargetRowId(Id));
        }, 100);
    }

    return (
        <div className="offcanvas offcanvas-end" id="ErrorList">
            <div className="offcanvas-header">
                <h3 className="offcanvas-title app-primary-color">Errors</h3>
                <button type="button" className="btn-close" id="ErrorListClose" data-bs-dismiss="offcanvas"></button>
            </div>
            <div className="offcanvas-body">
                <ul className="list-group">
                    {Object.keys(AssetValidations).map((Id) => {
                        const validationErrors = AssetValidations[Number(Id)];
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
