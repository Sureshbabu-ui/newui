import { store } from '../../../../../../../state/store';
import { useRef } from 'react';
import { useStore } from '../../../../../../../state/storeHooks';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../../../../../Preloader/Preloader.slice';
import {
    loadSelectedPreAmcDoneAssets,
    toggleInformationModalStatus,
    updateErrors,
} from './PreAmcDoneUpload.slice';
import { ValidationErrorComp } from '../../../../../../ValidationErrors/ValidationError';
import { convertBackEndErrorsToValidationErrors, formatDate } from '../../../../../../../helpers/formats';
import { uploadSelectedPreAmcDoneAssets } from '../../../../../../../services/assets';
import { PreAmcDoneAssetDetails, SelectedPreAmcDoneAssetDetails } from '../../../../../../../types/assets';

export const PreAmcDoneUpload = () => {
    const { t } = useTranslation();
    const { displayInformationModal, errors, assets, selectedAssets } = useStore(
        ({ preamcdonebulkupload }) => preamcdonebulkupload,
    );
    const containerRef = useRef<HTMLDivElement | null>(null);

    const onSubmit = (selectedAssets: SelectedPreAmcDoneAssetDetails[]) => {
        return async (ev: React.FormEvent) => {
            store.dispatch(startPreloader());
            ev.preventDefault();
            const result = await uploadSelectedPreAmcDoneAssets(selectedAssets)
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
                {t('preamcdone_asset_upload_message_success')}
            </SweetAlert>
        );
    }

    const reDirectRoute = async () => {
        try {
            store.dispatch(toggleInformationModalStatus());
            store.dispatch(updateErrors({}))
            document.getElementById('closeExcelUploadManagementModal')?.click();
        } catch (error) {
            console.error(error);
        }
    }

    const toggleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;
        if (checked) {
            store.dispatch(loadSelectedPreAmcDoneAssets(assets))
        } else {
            store.dispatch(loadSelectedPreAmcDoneAssets([]))
        }
    }

    const toggleRowSelection = (event: React.ChangeEvent<HTMLInputElement>, assets: PreAmcDoneAssetDetails) => {
        const { checked } = event.target;
        if (checked) {
            store.dispatch(loadSelectedPreAmcDoneAssets([...selectedAssets, assets]))
        } else {
            store.dispatch(loadSelectedPreAmcDoneAssets(selectedAssets.filter((row) => (row.Id !== assets.Id))))
        }
    };

    return (
        <div>
            <ValidationErrorComp errors={errors} />
            <div className={`row m-0 ps-0`}>
                <div className="row ps-1 pe-0 mt-4">
                    <div className=" table-responsive px-0">
                        {assets.length > 0 && (
                            <table className='table table-hover table-bordered table-sm '>
                                <thead >
                                    <tr className="text-center">
                                        <th scope="col">
                                            <input type="checkbox" checked={selectedAssets.length === assets.length} onChange={toggleSelectAll} />
                                        </th>
                                        <th scope="col">{t('preamcdone_upload_header_slno')}</th>
                                        <th scope="col">{t('preamcdone_upload_header_site_contractnum')}</th>
                                        <th scope="col">{t('preamcdone_upload_header_serialnumber')}</th>
                                        <th scope="col">{t('preamcdone_upload_header_completedby')}</th>
                                        <th scope="col">{t('preamcdone_upload_header_completedvendor')}</th>
                                        <th scope="col">{t('preamcdone_upload_header_completeddate')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assets.map((eachAssetsDetail, index) => (
                                        <tr className={(!eachAssetsDetail.AssetId == null || ((eachAssetsDetail.PreAmcCompletedById == null && eachAssetsDetail.PreAmcVendorBranchId == null) ||
                                            (eachAssetsDetail.PreAmcCompletedById != null && eachAssetsDetail.PreAmcVendorBranchId != null))
                                        ) ? "text-center bg-row-color" : "text-center"}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedAssets.includes(eachAssetsDetail)}
                                                    onChange={(event) => toggleRowSelection(event, eachAssetsDetail)}
                                                />
                                            </td>
                                            <th scope="row">{(index + 1)}</th>
                                            <td className={!eachAssetsDetail.IsContractNumValid ? "bg-column-color" : ""}>{eachAssetsDetail.ContractNumber}</td>
                                            <td className={eachAssetsDetail.AssetId == null ? "bg-column-color" : ""}>{eachAssetsDetail.AssetSerialNumber}</td>
                                            <td className={((eachAssetsDetail.PreAmcCompletedById == null && eachAssetsDetail.PreAmcVendorBranchId == null) || (eachAssetsDetail.PreAmcCompletedById != null && eachAssetsDetail.PreAmcVendorBranchId != null)) ? "bg-column-color" : ""}>{eachAssetsDetail.PreAmcCompletedBy}</td>
                                            <td className={((eachAssetsDetail.PreAmcCompletedById == null && eachAssetsDetail.PreAmcVendorBranchId == null) || (eachAssetsDetail.PreAmcCompletedById != null && eachAssetsDetail.PreAmcVendorBranchId != null)) ? "bg-column-color" : ""}>{eachAssetsDetail.PreAmcVendorBranch}</td>
                                            <td className={eachAssetsDetail.IsCompletedDateValid ? "bg-column-color" : ""}>{formatDate(eachAssetsDetail.PreAmcCompletedDate)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                {/* file uploader ends */}
            </div>
            <div className={'ms-0'}>
                {selectedAssets.length != 0 && selectedAssets.every((eachAssetDetail) => ((eachAssetDetail.AssetId != null && ((eachAssetDetail.PreAmcCompletedById != null && eachAssetDetail.PreAmcVendorBranchId == null
                    || eachAssetDetail.PreAmcCompletedById == null && eachAssetDetail.PreAmcVendorBranchId != null))))) && (
                        <div>
                            {selectedAssets.length > 0 && (
                                <button type='button' onClick={onSubmit(selectedAssets)} className='btn app-primary-bg-color text-white mt-2'>
                                    {t('site_bulk_upload_button_upload')}
                                </button>
                            )}
                        </div>
                    )}
            </div>
            {displayInformationModal ? <InformationModal /> : ''}
        </div>
    );
}