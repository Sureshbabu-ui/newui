import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../../../../ValidationErrors/ValidationError";
import { store } from "../../../../../../../../state/store";
import { useEffect, useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import * as yup from 'yup';
import Select from 'react-select';
import { convertBackEndErrorsToValidationErrors, formatDate, formatSelectInput, formatSelectInputWithCode } from "../../../../../../../../helpers/formats";
import { useStoreWithInitializer } from "../../../../../../../../state/storeHooks";
import { PartIndentCartState, setPartQuantity, initializeRequestPartCreate, loadPartSelectedDetails, setServiceRequestId, toggleInformationModalStatus, updateErrors, updateField, updatePartRemarks, loadTenantOffices, loadMasterData, loadPartStocks, PartIndendCartErrors, setStockType, SetWarrantyReplacement, RemoveFromCart, updatePartErrorList } from "./PartIndentCart.slice";
import { startPreloader, stopPreloader } from "../../../../../../../Preloader/Preloader.slice";
import { RequestPartCreate } from "../../../../../../../../services/partIndent";
import { setTabStatus } from "../PartIndentManagement/PartIndentManagement.slice";
import { TenantInfoDetails } from "../../../../../../../../types/tenantofficeinfo";
import { getValuesInMasterDataByTable } from "../../../../../../../../services/masterData";
import { getRegionWiseServiceEngineers, getUserTenantOfficeName } from "../../../../../../../../services/users";
import { getPartStockDetailsForPartIndentRequest } from "../../../../../../../../services/partStockDetail";

export const PartRequestCreate = () => {
    const { t } = useTranslation();

    const getSelectListData = async () => {
        try {
            const { ServiceEngineers } = await getRegionWiseServiceEngineers()
            const EngineersName = await (formatSelectInput(ServiceEngineers, "FullName", "Id"))
            store.dispatch(loadPartSelectedDetails({ name: "ServiceEngineers", value: { SelectDetails: EngineersName } }));
        }
        catch (error) {
            console.error(error);
        }
    }

    const { requestPart, errors, displayInformationModal, PartCategoryIdList, masterDataList, errorlist, PartStocks, PartSelectDetails } = useStoreWithInitializer(({ partindentcart }) => partindentcart, getSelectListData);

    const [TenantOfficeList, setTenantOfficeList] = useState<TenantInfoDetails[]>([]);
    const [formattedOfficeList, setFormattedOfficeList] = useState<any>([])
    const ServiceRequestId = store.getState().callcordinatormanagement.serviceRequestId

    useEffect(() => {
        onLoad();
    }, []);

    const onLoad = async () => {
        try {
            const TenantOffices = await getUserTenantOfficeName();
            setTenantOfficeList(TenantOffices.TenantOfficeName)
            setFormattedOfficeList(formatSelectInput(TenantOffices.TenantOfficeName, "OfficeName", "Id"))
            store.dispatch(loadTenantOffices({ SelectDetails: formatSelectInput(TenantOffices.TenantOfficeName, "OfficeName", "Id") }))

            // MasterData tables
            var { MasterData } = await getValuesInMasterDataByTable("StockType")
            const stocktype = await formatSelectInputWithCode(MasterData, "Name", "Id", "Code")
            const filteredStocktypes = stocktype.filter(i => i.code !== "STT_DFCT" && i.code !== "STT_GRPC")
            store.dispatch(loadMasterData({ name: "StockType", value: { SelectDetails: filteredStocktypes } }));
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const getPartStocks = async () => {
            const PartStocks = await getPartStockDetailsForPartIndentRequest(Number(requestPart.ServiceRequestId), PartCategoryIdList)
            store.dispatch(loadPartStocks(PartStocks))
        }
        getPartStocks()
    }, [requestPart.ServiceRequestId])

    useEffect(() => {
        if (ServiceRequestId)
            store.dispatch(setServiceRequestId(ServiceRequestId))
    }, [ServiceRequestId])

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        if (name == "IsWarrantyReplacement") {
            value = ev.target.checked ? true : false;
        }
        store.dispatch(updateField({ name: name as keyof PartIndentCartState['requestPart'], value }));
    }

    function getErrorForPartId(errorList: PartIndendCartErrors[], fieldId: number, fieldName: string): string | undefined {
        const errorItem = errorList.find(item => item.Id === fieldId);
        if (errorItem) {
            return errorItem[fieldName];
        }
        return undefined;
    }

    const validationRequestPartSchema = yup.object().shape({
        RequestedBy: yup.number().positive('validation_error_part_request_create_requested_by'),
        TenantOfficeId: yup.number().positive('validation_error_partindentcart_tenantofficeid_required'),
    });

    const validationSchemaForPart = yup.object().shape({
        Quantity: yup.number().required('validation_error_part_request_create_quantity_req').typeError('validation_error_part_request_create_quantity_req').moreThan(0, ('create_po_validation_error_message_quantity_req')),
        StockTypeId: yup.number().positive('validation_error_part_request_create_required')
    });

    const onRequestPartSubmit = async () => {
        store.dispatch(updateErrors({}))
        store.dispatch(updatePartErrorList([]))
        if (requestPart.partInfoList != null) {
            try {
                const allErrors: PartIndendCartErrors[] = [];
                await Promise.all(requestPart.partInfoList.map(async (partitem, index) => {
                    try {
                        await validationSchemaForPart.validate(partitem, { abortEarly: false });
                    } catch (error: any) {
                        const errors: PartIndendCartErrors = { Id: partitem.Id, StockTypeId: 0, Quantity: 0 };
                        error.inner.forEach((currentError: any) => {
                            if (currentError.path === 'StockTypeId') {
                                errors.StockTypeId = currentError.message;
                            } else if (currentError.path === 'Quantity') {
                                errors.Quantity = currentError.message;
                            }
                        });
                        allErrors.push(errors);
                    }
                    try {
                        await validationRequestPartSchema.validate(requestPart, { abortEarly: false });
                    } catch (error: any) {
                        const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                            return { ...allErrors, [currentError.path as string]: currentError.message };
                        }, {});
                        store.dispatch(updateErrors(errors))
                        if (errors)
                            return;
                    }
                }));
                store.dispatch(updatePartErrorList(allErrors));
                if (allErrors.length === 0 && JSON.stringify(errors) === '{}') {
                    store.dispatch(startPreloader());
                    const result = await RequestPartCreate(requestPart)
                    result.match({
                        ok: () => {
                            store.dispatch(toggleInformationModalStatus());
                        },
                        err: (e) => {
                            const formattedErrors = convertBackEndErrorsToValidationErrors(e)
                            store.dispatch(updateErrors(formattedErrors))
                        },
                    });
                    store.dispatch(stopPreloader());
                }
            }
            catch (error) {
                return;
            }
        }
    }

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={updatePartIndent}>
                {t('partindentcart_create_success_message')}
            </SweetAlert>
        );
    }

    const updatePartIndent = async () => {
        store.dispatch(toggleInformationModalStatus());
        store.dispatch(initializeRequestPartCreate())
        store.dispatch(setTabStatus("3"))
    }

    const onSelectChange = (selectedOption: any, Name: any) => {
        var value = selectedOption.value
        var name = Name
        store.dispatch(updateField({ name: name as keyof PartIndentCartState['requestPart'], value }));
    }

    const setQuantity = (ev: any) => {
        store.dispatch(setPartQuantity({ PartId: ev.target.name, Quantity: ev.target.value }))
    }

    const setIsWarrantyReplacement = (ev: any) => {
        var value = ev.target.value;
        value = ev.target.checked ? true : false;
        store.dispatch(SetWarrantyReplacement(({ PartId: ev.target.name, IsWarrantyReplacement: value })));
    }

    const setPartType = (selectedOption: any, actionMeta: any) => {
        var value = selectedOption.value
        var name = actionMeta.name
        store.dispatch(setStockType({ PartId: name, StockTypeId: value }))
    }

    useEffect(() => {
        if (requestPart.partInfoList.length == 0)
            store.dispatch(setTabStatus('1'))
    }, [requestPart.partInfoList])

    const RemovePart = (Id: number | string, Action: string) => {
        return () => {
            const part = requestPart.partInfoList.find(part => part.Id == Id)
            if (part)
                store.dispatch(RemoveFromCart({ Part: part, Action: Action }))
        }
    }

    return (
        <ContainerPage>
            <div className="">
                <ValidationErrorComp errors={errors} />
                <div className="mt-3">
                    <div className="row">
                        {requestPart.partInfoList.map((field, index) => (
                            <div key={index} className="px-0 m-0 me-0 mb-3 bg-light ">
                                <div className="text-size-12 p-2">
                                    <button className="text-white float-end btn-close btn-sm" aria-label='Close'
                                        onClick={RemovePart(field.Id, "remove")} disabled={requestPart.partInfoList.length == 0} type="button" >
                                    </button>
                                </div>
                                <div className="d-flex flex-row fw-bold">
                                    <div className="p-2">{field.PartCode}</div>
                                    <div className="p-2">{field.PartName}
                                        <div>{field.Description}</div>
                                    </div>
                                </div>
                                <div className="d-flex flex-row">
                                    <div className="col-md-1"></div>
                                    <div className="col-md-11 ps-3">
                                        <small className="me-1">{field.ProductCategoryName}</small>
                                        <small className="me-1 text-secondary">&#9679;</small>
                                        <small className="me-1">{field.PartCategoryName}</small>
                                        <small className="me-1 text-secondary">&#9679;</small>
                                        <small>{field.MakeName}</small>
                                        <small className="px-2">|</small>
                                        <small>{t('partindentcart_header_hsncode')} : {field.HsnCode}</small>
                                    </div>
                                </div>
                                <div className="row m-0 mb-3 mt-2">
                                    <div className="col-md-3">
                                        <label className="form-label mb-0 red-asterisk">{t('create_purchaseorder_quantity')}</label>
                                        <div className="">
                                            <input className={`form-control ${getErrorForPartId(errorlist, field.Id, 'Quantity') ? "is-invalid" : ""}`} name={String(field.Id)} onChange={setQuantity} value={field.Quantity ?? ''} />
                                            {getErrorForPartId(errorlist, field.Id, 'Quantity') ? (
                                                <div className="invalid-feedback">
                                                    {t(getErrorForPartId(errorlist, field.Id, 'Quantity') || '')}
                                                </div>
                                            ) : <></>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label mb-0 red-asterisk">{t('partindentcart_label_stocktype')}</label>
                                        <Select
                                            options={masterDataList.StockType}
                                            onChange={setPartType}
                                            isSearchable
                                            name={String(field.Id)}
                                            placeholder={t('create_purchaseorder_stocktype_select')}
                                            classNames={{ control: (state) => getErrorForPartId(errorlist, field.Id, 'StockTypeId') ? "border-danger" : "" }}
                                        />
                                        {getErrorForPartId(errorlist, field.Id, 'StockTypeId') ? (
                                            <div className="text-danger form-text">
                                                {t(getErrorForPartId(errorlist, field.Id, 'StockTypeId') || '')}
                                            </div>
                                        ) : <></>}
                                    </div>
                                    <div className='mb-2 form-check form-switch col-md-4 mt-3'>
                                        <input
                                            className='form-check-input switch-input-lg'
                                            type='checkbox'
                                            name={String(field.Id)}
                                            id='flexSwitchCheckDefault'
                                            onChange={setIsWarrantyReplacement}
                                        />
                                        <label className='form-check-label'>{t('partindentcart_label_iswarrantyreplacement')}</label>
                                        <div className='form-text'>{t('partindentcart_iswarrantyreplacement_help_text')}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                        }
                        {PartStocks.length > 0 && (
                            <div className="row mb-1">
                                <div className="alert alert-warning p-2 rounded-0" role="alert">
                                    <div>
                                        <span className="material-symbols-outlined align-bottom">warning</span>&nbsp;
                                        <span className="fw-bold">{t('partindentcart_warning')}</span>
                                    </div>
                                    <>
                                        <div className="pt-1"><small>{t('partindentcart_warning_helptext')}</small></div>
                                        <table className="table table-borderless table-warning text-size-12">
                                            <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">{t('partindentcart_warning_serialno')}</th>
                                                    <th scope="col">{t('partindentcart_warning_stocktype')}</th>
                                                    <th scope="col">{t('partindentcart_warning_installedon')}</th>
                                                    <th scope="col">{t('partindentcart_warning_warranty_status')}</th>
                                                    <th scope="col">{t('partindentcart_warning_expireson')}</th>
                                                </tr>
                                            </thead>
                                            {PartStocks.map((field, index) => (
                                                <tbody key={index}>
                                                    <tr>
                                                        <td className="col-md-1">{index + 1}</td>
                                                        <td className="col-md-2">{field.SerialNumber}</td>
                                                        <td className="col-md-2">{field.StockType}</td>
                                                        <td className="col-md-2">{formatDate(field.InstalledOn)}</td>
                                                        {field.PartWarrantyExpiryDate == null ? (
                                                            <td className="col-md-2">{t('partindentcart_warning_not_available')}</td>
                                                        ) : (
                                                            <td className="col-md-2">
                                                                {field.PartWarrantyExpiryDate && new Date(field.PartWarrantyExpiryDate) > new Date() ? t('partindentcart_warning_underwarranty') : t('partindentcart_warning_expired')}
                                                            </td>
                                                        )}
                                                        <td className="col-md-2">{field.PartWarrantyExpiryDate ? formatDate(field.PartWarrantyExpiryDate) : '---'}</td>
                                                    </tr>
                                                </tbody>
                                            ))}
                                        </table>
                                    </>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 px-0">
                        <p className="fw-bold">{t('partindentcart_other_details')}</p>
                    </div>
                    <div className="col-md-6 ps-0">
                        <label className="red-asterisk">{t('partindentcart_label_req_by')}</label>
                        <Select
                            options={PartSelectDetails.ServiceEngineers}
                            value={PartSelectDetails.ServiceEngineers && PartSelectDetails.ServiceEngineers.find(option => option.value == requestPart.RequestedBy) || null}
                            onChange={(selectedOption) => onSelectChange(selectedOption, "RequestedBy")}
                            isSearchable
                            classNames={{ control: (state) => errors["RequestedBy"] ? "border border-danger" : "" }}
                            name="RequestedBy"
                            placeholder="Select option"
                        />
                        <div className="small text-danger"> {t(errors['RequestedBy'])}</div>
                    </div>
                    <div className="col-md-6 pe-0">
                        <label className="form-label mb-0 red-asterisk">{t('partindentcart_label_tenantoffice_id')}</label>
                        <Select
                            options={formattedOfficeList}
                            value={formattedOfficeList && formattedOfficeList.find(option => option.value == requestPart.TenantOfficeId) || null}
                            name="TenantOfficeId"
                            classNames={{ control: (state) => errors["TenantOfficeId"] ? "border-danger" : "" }}
                            onChange={(selectedOption) => onSelectChange(selectedOption, "TenantOfficeId")}
                            isSearchable
                            placeholder={t('partindentcart_select_tenantoffice')}
                        />
                        <div className="small text-danger"> {t(errors['TenantOfficeId'])}</div>
                        {(formattedOfficeList.length > 0 &&
                            <div className="text-muted mt-1">
                                {(TenantOfficeList.filter((value) => (value.Id == requestPart.TenantOfficeId)
                                )).length > 0 ? `Address : ${(TenantOfficeList.filter((value) => (value.Id == requestPart.TenantOfficeId)
                                ))[0].Address}` : ''}
                            </div>
                        )}
                    </div>
                    <div className="mb-1 mt-2 p-0">
                        <label className="">{t('partindentcart_label_remarks')}</label>
                        <textarea onChange={onUpdateField} name="Remarks" value={requestPart.Remarks} className="form-control" />
                    </div>
                </div>
                <div className="row mt-2 mb-2">
                    <button className="btn app-primary-bg-color text-white" type="button" onClick={onRequestPartSubmit}>
                        {t('partindentcart_button_submit')}
                    </button>
                </div>
                {displayInformationModal ? <InformationModal /> : ""}
            </div>
        </ContainerPage >
    )
}