
import { useStore } from '../../../../../../state/storeHooks';
import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../../ContainerPage/ContainerPage";
import { store } from "../../../../../../state/store";
import { useRef, useEffect, useState } from "react";
import Select from 'react-select';
import * as yup from 'yup';
import { SelectedAssetsListState, SelectedAssetsWithAssetId, initializeAssetsListForTransfer, toggleInformationModalStatus, updateErrors, updateField } from './AssetTransfer.slice';
import { convertBackEndErrorsToValidationErrors, formatDate, formatSelectInput } from '../../../../../../helpers/formats';
import { useParams } from 'react-router-dom';
import { startPreloader, stopPreloader } from '../../../../../Preloader/Preloader.slice';
import { changeAssetCustomerSite, getAssetList } from '../../../../../../services/assets';
import SweetAlert from 'react-bootstrap-sweetalert';
import { loadAssets, assetIdListInitialState } from '../../AssetsList.slice';
import { initializeAsset } from '../../CreateAssets.slice';
import { ValidationErrorComp } from '../../../../../ValidationErrors/ValidationError';

export const ContractAssetTransfer = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const { ContractId } = useParams<{ ContractId: string }>();
    const containerRef = useRef<HTMLDivElement | null>(null);

    const {
        assettransfer: { assets, errors, displayInformationModal, currentPage, CustomerSiteId, selectedList }, assetslist: { visibleModal }
    } = useStore(({ assettransfer, assetslist }) => ({ assettransfer, assetslist }));

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={updateAssetSite}>
                {t('contractassettransfer_success_message')}
            </SweetAlert>
        );
    }

    const updateAssetSite = async () => {
        store.dispatch(toggleInformationModalStatus());
        store.dispatch(assetIdListInitialState())
        const CurrentPage = store.getState().assetslist.CurrentPage;
        const SearchKey = store.getState().assetslist.Search;
        const Assets = await getAssetList(SearchKey, CurrentPage, ContractId);
        store.dispatch(loadAssets(Assets));
        modalRef.current?.click()
    }

    const [selectCustomerSiteIdList, setSelectCustomerSiteIdList] = useState<any>(null)
    useEffect(() => {
        setSelectCustomerSiteIdList(formatSelectInput(CustomerSiteId, "SiteName", "Id"))
    }, [CustomerSiteId])

    const onModalClose = () => {
        store.dispatch(assetIdListInitialState())
        store.dispatch(initializeAsset())
        store.dispatch(initializeAssetsListForTransfer())
    }

    const onSelectChange = (selectedOption: any, Name: any) => {
        var value = selectedOption.value
        var name = Name
        store.dispatch(updateField({ name: name as keyof SelectedAssetsListState['selectedList'], value }));
    }

    const validationSchema = yup.object().shape({
        CustomerSiteId: yup.number().moreThan(0, ('validation_error_create_asset_customersite_required') ?? ''),
    });

    function onSubmit(Data: SelectedAssetsWithAssetId) {
        return async (ev: React.FormEvent) => {
            ev.preventDefault();
            try {
                await validationSchema.validate(selectedList, { abortEarly: false });
            } catch (error: any) {
                const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                    return { ...allErrors, [currentError.path as string]: currentError.message };
                }, {});
                store.dispatch(updateErrors(errors))
                if (errors)
                    return;
            }
            store.dispatch(startPreloader());
            const result = await changeAssetCustomerSite(selectedList)
            result.match({
                ok: () => {
                    store.dispatch(toggleInformationModalStatus());
                },
                err: (e) => {
                    const errorMessages = convertBackEndErrorsToValidationErrors(e)
                    store.dispatch(updateErrors(errorMessages));
                    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
            store.dispatch(stopPreloader());
        };
    }

    return (
        <div
            className="modal fade"
            id='AssetTransfer'
            data-bs-backdrop='static'
            data-bs-keyboard='false'
            aria-hidden='true'
        >
            <div className="modal-dialog modal-fullscreen">
                <div className="modal-content">
                    <div className="modal-header mx-3">
                        <h5 className="modal-title app-primary-color ms-1">{t('assetstransfer_changesite')}</h5>
                        <button
                            type='button'
                            className="btn-close me-2"
                            data-bs-dismiss='modal'
                            id='closeAssetTransfer'
                            onClick={onModalClose}
                            aria-label='Close'
                            ref={modalRef}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <ContainerPage>
                            {assets.match({
                                none: () => <div className="row m-1">{t('assetslist_loading_assets')}</div>,
                                some: (assets) => (
                                    <>
                                        <div className="row ps-4 me-2  mt-2 ">
                                            <ValidationErrorComp errors={errors} />
                                            {assets.length > 0 ? (
                                                <div className='table-responsive overflow-y'>
                                                    <table className="table table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">{t('assetslist_header_asset_th_sl_no')}</th>
                                                                <th scope="col">{t('assetslist_header_asset_serial_number_table')}</th>
                                                                <th scope="col">{t('assetslist_header_asset_category_table')}</th>
                                                                <th scope="col">{t('assetslist_header_asset_make_table')}</th>
                                                                <th scope="col">{t('assetslist_header_asset_model_number_table')}</th>
                                                                <th scope="col">{t('assetslist_header_warranty_end_date_table')}</th>
                                                                <th scope="col">{t('assetslist_header_asset_customersitename')}</th>
                                                                <th scope="col">{t('assetslist_header_asset_mode_table')}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {assets.map((field, index) => (
                                                                <tr>
                                                                    <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                                                    <td>{field.asset.ProductSerialNumber}</td>
                                                                    <td>{field.asset.CategoryName}</td>
                                                                    <td>{field.asset.ProductMake}</td>
                                                                    <td>{field.asset.ModelName}</td>
                                                                    <td>{field.asset.WarrantyEndDate ? formatDate(field.asset.WarrantyEndDate) : ""}</td>
                                                                    <td>{field.asset.CustomerSiteName}</td>
                                                                    <td>{field.asset.AssetAddedMode}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <div className="text-muted p-0">{t('assetslist_no_assets_data_found')}</div>
                                            )}

                                            <div>
                                                <div className="mb-1">
                                                    <label>{t('create_assets_label_customer_site')}</label>
                                                    <Select
                                                        value={selectCustomerSiteIdList && selectCustomerSiteIdList.find(option => option.value == selectedList.CustomerSiteId) || null}
                                                        options={selectCustomerSiteIdList}
                                                        onChange={(selectedOption) => onSelectChange(selectedOption, "CustomerSiteId")}
                                                        isSearchable
                                                        name="CustomerSiteId"
                                                        placeholder="Select option"
                                                    />
                                                    <div className="small text-danger"> {t(errors['CustomerSiteId'])}</div>
                                                </div>
                                            </div>
                                            <div className='col-md-12'>
                                                <button type="button" onClick={onSubmit(selectedList)} className="btn app-primary-bg-color text-white mt-2  me-4">
                                                    {t('create_assets_button')}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ),
                            })}
                        </ContainerPage>
                        {displayInformationModal ? <InformationModal /> : ""}
                    </div>
                </div>
            </div>
        </div>
    )
} 