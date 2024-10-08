import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { store } from "../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { useStore } from '../../../../../state/storeHooks';
import { useEffect, useRef } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { convertBackEndErrorsToValidationErrors } from "../../../../../helpers/formats";
import * as yup from 'yup';
import { loadCustomerGroups } from "../CustomerGroupList/CustomerGroupList.slice";
import { customerGroupCreate, getCustomerGroupList } from "../../../../../services/customerGroup";
import { CreateCustomerGroupState, initializeCustomerGroupCreate, toggleInformationModalStatus, updateErrors, updateField } from "./CustomerGroupCreate.slice";
import { checkForPermission } from "../../../../../helpers/permissions";

export const CustomerGroupCreate = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const {
        customergroupcreate: { customergroup, displayInformationModal, errors },
    } = useStore(({ customergroupcreate, app }) => ({ customergroupcreate, app }));

    useEffect(() => {
        store.dispatch(initializeCustomerGroupCreate())
    }, [])

    const onUpdateField = (ev: any) => {
        var { name, value } = ev.target
        store.dispatch(updateField({ name: name as keyof CreateCustomerGroupState['customergroup'], value }));
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(customergroup, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await customerGroupCreate(customergroup)
        result.match({
            ok: () => {
                store.dispatch(toggleInformationModalStatus());
            },
            err: (e) => {
                const errorMessages = convertBackEndErrorsToValidationErrors(e)
                store.dispatch(updateErrors(errorMessages));
            },
        });
        store.dispatch(stopPreloader());
    }

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={updateMakeList}>
                {t('customer_group_create_success_message')}
            </SweetAlert>
        );
    }

    const updateMakeList = async () => {
        store.dispatch(toggleInformationModalStatus());
        const result = await getCustomerGroupList(1,store.getState().customergrouplist.search);
        store.dispatch(loadCustomerGroups(result));
        modalRef.current?.click()
    }

    const onModalClose = () => {
        store.dispatch(initializeCustomerGroupCreate())
    }
    const validationSchema = yup.object().shape({
        GroupCode: yup.string().required(t('validation_error_customer_group_create_code_required') ?? '').max(32, ('validation_error_customer_group_create_groupcode_max') ?? ''),
        GroupName: yup.string().required(t('validation_error_customer_group_create_name_required') ?? '').max(32, ('validation_error_customer_group_create_groupcode_max') ?? ''),
    });
    return (
        <>
            <div
                className="modal fade"
                id='CreateCustomerGroup'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('customer_group_create_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeCustomerGroupModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        {checkForPermission("CUSTOMERGROUP_MANAGE") &&
                        <div className="modal-body">
                            <ContainerPage>
                                <ValidationErrorComp errors={errors} />
                                <div className=''>
                                    <div className='row mb-1'>
                                        <div className='col-md-12'>
                                            <label className="mt-2 red-asterisk">{t('customer_group_create_input_code')}</label>
                                            <input name='GroupCode'
                                                value={customergroup.GroupCode}
                                                className={`form-control  ${errors["GroupCode"] ? "is-invalid" : ""}`}
                                                onChange={onUpdateField} type='text' ></input>
                                            <div className="invalid-feedback"> {t(errors['GroupCode'])}</div>
                                        </div>
                                        <div className='col-md-12'>
                                            <label className="mt-2 red-asterisk">{t('customer_group_create_input_name')}</label>
                                            <input name='GroupName' onChange={onUpdateField} type='text'
                                                value={customergroup.GroupName}
                                                className={`form-control  ${errors["GroupName"] ? "is-invalid" : ""}`}
                                            ></input>
                                            <div className="invalid-feedback"> {t(errors['GroupName'])}</div>
                                        </div>
                                        <div className="col-md-12 mt-2">
                                            <button type='button' className='btn float-end app-primary-bg-color text-white mt-2' onClick={onSubmit}>
                                                {t('customer_group_create_button')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                            </ContainerPage>
                            {displayInformationModal ? <InformationModal /> : ""}
                        </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}