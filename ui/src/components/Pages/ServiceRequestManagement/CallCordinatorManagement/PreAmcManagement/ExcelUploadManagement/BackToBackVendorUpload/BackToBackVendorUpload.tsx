import { store } from '../../../../../../../state/store';
import { useRef } from 'react';
import { useStore } from '../../../../../../../state/storeHooks';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../../../../../Preloader/Preloader.slice';
import {
    loadSelectedBackToBackAssets,
    toggleInformationModalStatus,
    updateErrors,
} from './BackToBackVendorUpload.slice';
import { ValidationErrorComp } from '../../../../../../ValidationErrors/ValidationError';
import { convertBackEndErrorsToValidationErrors } from '../../../../../../../helpers/formats';
import { uploadSelectedBackToBackAssets } from '../../../../../../../services/assets';
import { BackToBackAssetDetails, SelectedBackToBackAssetDetails } from '../../../../../../../types/assets';

export const BackToBackVendorAssetsUpload = () => {
    const { t } = useTranslation();
    const { displayInformationModal, errors, assets, selectedAssets } = useStore(
        ({ backtobackvendorupload }) => backtobackvendorupload,
    );
    const containerRef = useRef<HTMLDivElement | null>(null);

    const onSubmit = (selectedAssets: SelectedBackToBackAssetDetails[]) => {
        return async (ev: React.FormEvent) => {
            store.dispatch(startPreloader());
            ev.preventDefault();
            const result = await uploadSelectedBackToBackAssets(selectedAssets)
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
                {t('backtoback_vendorasset_upload_message_success')}
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
            store.dispatch(loadSelectedBackToBackAssets(assets))
        } else {
            store.dispatch(loadSelectedBackToBackAssets([]))
        }
    }

    const toggleRowSelection = (event: React.ChangeEvent<HTMLInputElement>, assets: BackToBackAssetDetails) => {
        const { checked } = event.target;
        if (checked) {
            store.dispatch(loadSelectedBackToBackAssets([...selectedAssets, assets]))
        } else {
            store.dispatch(loadSelectedBackToBackAssets(selectedAssets.filter((row) => (row.Id !== assets.Id))))
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
                                        <th scope="col">{t('backtoback_upload_header_slno')}</th>
                                        <th scope="col">{t('backtoback_upload_header_site_contractnum')}</th>
                                        <th scope="col">{t('backtoback_upload_header_serialnumber')}</th>
                                        <th scope="col">{t('backtoback_upload_header_vndrbranchname')}</th>
                                        <th scope="col">{t('backtoback_upload_header_tollfreenumber')}</th>
                                        <th scope="col">{t('backtoback_upload_header_email')}</th>
                                        <th scope="col">{t('backtoback_upload_header_vendorcontractnumber')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assets.map((eachAssetsDetail, index) => (
                                        <tr className={(!eachAssetsDetail.AssetId == null || eachAssetsDetail.VendorBranchId == null) ? "text-center bg-row-color" : "text-center"}>
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
                                            <td className={eachAssetsDetail.VendorBranchId == null ? "bg-column-color" : ""}>{eachAssetsDetail.BranchName}</td>
                                            <td >{eachAssetsDetail.TollFreeNumber}</td>
                                            <td >{eachAssetsDetail.Email}</td>
                                            <td >{eachAssetsDetail.VendorContractNumber}</td>
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
                {selectedAssets.length != 0 && selectedAssets.every((eachAssetDetail) => ((eachAssetDetail.AssetId != null && eachAssetDetail.VendorBranchId != null))) && (
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