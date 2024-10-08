import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../../ValidationErrors/ValidationError";
import { store } from "../../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../../Preloader/Preloader.slice";
import { useStoreWithInitializer } from '../../../../../../state/storeHooks';
import { useEffect, useRef } from "react";
import { formatSelectInput, formatSelectInputWithThreeArgWithParenthesis } from "../../../../../../helpers/formats";
import * as yup from 'yup';
import { InterimCallCreateState, initializeInterimCallCreate, loadInterimCallDetails, updateAsetField, updateErrors, updateField, updateRemainingAssetDdetails } from "./InterimCallCreate.slice";
import Select from 'react-select';
import { getPartMake } from "../../../../../../services/part";
import { getContractCustomerSites, getCustomersList } from "../../../../../../services/customer";
import { getFilteredContractsByCustomer, getInterimServiceRequestAssetDetails, getProductModelNames } from "../../../../../../services/serviceRequest";
import { loadAssetDetails } from "../ServiceRequestCreate.slice";
import { getAssetProductCategoryNames } from "../../../../../../services/assetProductCategory";

export const InterimCallCreate = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);

    const getSelectListData = async () => {
        const { AssetProductCategoryNames } = await getAssetProductCategoryNames()
        const ProductCategorys = await (formatSelectInput(AssetProductCategoryNames, "CategoryName", "Id"))
        store.dispatch(loadInterimCallDetails({ name: "ProductCategory", value: { SelectDetails: ProductCategorys } }));

        const { MakeNames } = await getPartMake()
        const Make = await (formatSelectInput(MakeNames, "Name", "Id"))
        store.dispatch(loadInterimCallDetails({ name: "Make", value: { SelectDetails: Make } }));

        const { CustomersList } = await getCustomersList();
        const Customers = await formatSelectInputWithThreeArgWithParenthesis(CustomersList, "Name", "CustomerCode", "Id")
        store.dispatch(loadInterimCallDetails({ name: "CustomerNames", value: { SelectDetails: Customers } }));
    }

    const {
        errors, interimDetails, interimSelectDetails, assetDetails
    } = useStoreWithInitializer(({ interimcallcreate }) => interimcallcreate, getSelectListData);

    useEffect(() => {
        if (interimDetails.CustomerId != 0) {
            getFilteredContracts()
        }
    }, [interimDetails.CustomerId])

    const getFilteredContracts = async () => {
        const { Contracts } = await getFilteredContractsByCustomer(interimDetails.CustomerId);
        const FormatedContracts = await formatSelectInput(Contracts, "ContractNumber", "Id")
        store.dispatch(loadInterimCallDetails({ name: "ContractNumbers", value: { SelectDetails: FormatedContracts } }));
    }

    useEffect(() => {
        if (interimDetails.ContractId != 0) {
            getFilteredSiteNameByContract()
        }
    }, [interimDetails.ContractId])

    const getFilteredSiteNameByContract = async () => {
        const { ContractCustomerSites } = await getContractCustomerSites(interimDetails.ContractId.toString());
        const SiteNames = await formatSelectInput(ContractCustomerSites, "SiteName", "Id")
        store.dispatch(loadInterimCallDetails({ name: "CustomerSiteNames", value: { SelectDetails: SiteNames } }));
    }

    useEffect(() => {
        if (interimDetails.CustomerSiteId != 0) {
            getInterimAssetDetails()
        }
    }, [interimDetails.CustomerSiteId])

    const getInterimAssetDetails = async () => {
        const { AssetDetails } = await getInterimServiceRequestAssetDetails(interimDetails.ContractId);
        store.dispatch(updateAsetField({ valuesToUpdate: AssetDetails }))
    }

    useEffect(() => {
        if (interimDetails.ProductCategoryId != 0 && interimDetails.ProductMakeId != 0) {
            getFilteredModelName()
        }
    }, [interimDetails.ProductCategoryId, interimDetails.ProductMakeId])

    const getFilteredModelName = async () => {
        const { ModelNames } = await getProductModelNames(interimDetails.ProductCategoryId, interimDetails.ProductMakeId)
        const ModelName = await (formatSelectInput(ModelNames, "ModelName", "Id"))
        store.dispatch(loadInterimCallDetails({ name: "ProductModel", value: { SelectDetails: ModelName } }));
    }

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof InterimCallCreateState['interimDetails'], value }));
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(interimDetails, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        store.dispatch(loadAssetDetails(assetDetails))
        modalRef.current?.click()
        store.dispatch(stopPreloader());
        getSelectListData()
    }

    const onModalClose = () => {
        store.dispatch(initializeInterimCallCreate())
        getSelectListData()
    }

    const validationSchema = yup.object().shape({
        CustomerId: yup.number().positive('validation_error_interim_call_create_customer_name_required'),
        ContractId: yup.number().positive('validation_error_interim_call_create_contract_required'),
        ProductCategoryId: yup.number().positive('validation_error_interim_call_create_product_category_required'),
        ProductMakeId: yup.number().positive('validation_error_interim_call_create_product_make_required'),
        ProductModelNumber: yup.number().positive('validation_error_interim_call_create_product_model_number_required'),
        CustomerSiteId: yup.number().positive('validation_error_interim_call_create_site_name_required'),
    });

    const onSelectChange = (selectedOption: any, actionMeta: any) => {
        var value = selectedOption.value
        var name = actionMeta.name
        if (name == "ProductCategoryId" || name == "ProductMakeId" || name == "ProductModelNumber") {
            store.dispatch(updateRemainingAssetDdetails({ name: name as keyof InterimCallCreateState['assetDetails'], value }))
        }
        store.dispatch(updateField({ name: name as keyof InterimCallCreateState['interimDetails'], value }));
    }

    return (
        <>
            <div
                className="modal fade"
                id="CreateInterimCall"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('interim_call_create_title')}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                id="closeCreateInterimCallModal" 
                                aria-label="Close"
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <ContainerPage>
                                <ValidationErrorComp errors={errors} />
                                <div>
                                    <div className="row mb-1">
                                        <div className="col-md-12">
                                            <label className="mt-2 red-asterisk">{store.getState().servicerequestcreate.SearchType == "ProductSerialNumber" ? t('interimcall_create_label_serial_number') : t('interimcall_create_label_msp_asset_id')}</label>
                                            <input name="SearchValue"
                                                value={store.getState().servicerequestcreate.SearchValue}
                                                className={`form-control  ${errors["SearchValue"] ? "is-invalid" : ""}`}
                                                onChange={onUpdateField} type="text"
                                                disabled={true}
                                            ></input>   
                                            <div className="invalid-feedback"> {errors['SearchValue']}</div>
                                        </div>
                                        <div className="col-md-12">
                                            <label className="mt-2 red-asterisk">{t('interimcall_create_label_customer_name')}</label>
                                            <Select
                                                value={interimSelectDetails.CustomerNames && interimSelectDetails.CustomerNames.find(option => option.value == interimDetails.CustomerId) || null}
                                                options={interimSelectDetails.CustomerNames}
                                                onChange={onSelectChange}
                                                isSearchable
                                                placeholder="Select option"
                                                name="CustomerId"
                                            />
                                            <div className="small text-danger"> {t(errors['CustomerId'])}</div>
                                        </div>
                                        <div className="col-md-12">
                                            <label className="mt-2 red-asterisk">{t('interimcall_create_label_contract_number')}</label>
                                            <Select
                                                options={interimSelectDetails.ContractNumbers}
                                                value={interimSelectDetails.ContractNumbers && interimSelectDetails.ContractNumbers.find(option => option.value == interimDetails.ContractId) || null}
                                                onChange={onSelectChange}
                                                isSearchable
                                                placeholder="Select option"
                                                classNamePrefix="react-select"
                                                name="ContractId"
                                            />
                                            <div className="small text-danger"> {t(errors['ContractId'])}</div>
                                        </div>
                                        <div className="col-md-12">
                                            <label className="mt-2 red-asterisk">{t('interimcall_create_label_contract_customer_site_name')}</label>
                                            <Select
                                                options={interimSelectDetails.CustomerSiteNames}
                                                value={interimSelectDetails.CustomerSiteNames && interimSelectDetails.CustomerSiteNames.find(option => option.value == interimDetails.CustomerSiteId) || null}
                                                onChange={onSelectChange}
                                                isSearchable
                                                placeholder="Select option"
                                                name="CustomerSiteId"
                                            />
                                            <div className="small text-danger"> {t(errors['CustomerSiteId'])}</div>
                                        </div>

                                        {/* Asset category */}
                                        <div className="col-md-12">
                                            <label className="mt-2 red-asterisk">{t('interimcall_create_label_product_category')}</label>
                                            <Select
                                                options={interimSelectDetails.ProductCategory}
                                                value={interimSelectDetails.ProductCategory && interimSelectDetails.ProductCategory.find(option => option.value == interimDetails.ProductCategoryId) || null}
                                                onChange={onSelectChange}
                                                isSearchable
                                                name="ProductCategoryId"
                                                placeholder="Select option"
                                            />
                                            <div className="small text-danger"> {t(errors['ProductCategoryId'])}</div>
                                        </div>
                                        {/* Asset category Ends*/}

                                        {/* Asset make */}
                                        <div className="col-md-12">
                                            <label className="mt-2 red-asterisk">{t('interimcall_create_label_product_make')}</label>
                                            <Select
                                                options={interimSelectDetails.Make}
                                                value={interimSelectDetails.Make && interimSelectDetails.Make.find(option => option.value == interimDetails.ProductMakeId) || null}
                                                onChange={onSelectChange}
                                                isSearchable
                                                name="ProductMakeId"
                                                placeholder="Select option"
                                            />
                                            <div className="small text-danger"> {t(errors['ProductMakeId'])}</div>
                                        </div>
                                        {/* Asset make Ends*/}

                                        {/* Asset model */}
                                        <div className="col-md-12">
                                            <label className="mt-2 red-asterisk">{t('interimcall_create_label_product_model_number')}</label>
                                            <Select
                                                options={interimSelectDetails.ProductModel}
                                                value={interimSelectDetails.ProductModel && interimSelectDetails.ProductModel.find(option => option.value == interimDetails.ProductModelNumber) || null}
                                                onChange={onSelectChange}
                                                isSearchable
                                                name="ProductModelNumber"
                                                placeholder="Select option"
                                            />
                                            <div className="small text-danger"> {t(errors['ProductModelNumber'])}</div>
                                        </div>
                                        {/* Asset model Ends*/}
                                        <div className="col-md-12 mt-2">
                                            <button type="button" className="btn app-primary-bg-color text-white mt-2 w-100" onClick={onSubmit}>
                                                {t('interim_call_create_button')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </ContainerPage>
                            {/* {displayInformationModal ? <InformationModal /> : ""} */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}