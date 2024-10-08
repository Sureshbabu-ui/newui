import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { EditDivisionState, initializeDivisionEdit, toggleInformationModalStatus, updateErrors, updateField } from "./DivisionEdit.slice";
import { store } from "../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { getDivisionList, divisionCreate, divisionEdit } from "../../../../../services/division";
import { useStore } from '../../../../../state/storeHooks';
import { useEffect, useRef } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { loadDivisions } from "../DivisionList/DivisionList.slice";
import { convertBackEndErrorsToValidationErrors } from "../../../../../helpers/formats";
import * as yup from 'yup';
import { checkForPermission } from "../../../../../helpers/permissions";

export const DivisionEdit = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const { divisionedit: { division, displayInformationModal, errors } } = useStore(({ divisionedit }) => ({ divisionedit }));

    useEffect(() => {
        store.dispatch(initializeDivisionEdit())
    }, [])

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof EditDivisionState['division'], value }));
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(division, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await divisionEdit(division)
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
            <SweetAlert success title="Success" onConfirm={updateDivision}>
                {t('division_edit_success_message')}
            </SweetAlert>
        );
    }

    const updateDivision = async () => {
        store.dispatch(toggleInformationModalStatus());
        const Divisions = await getDivisionList(store.getState().divisionlist.search, 1);
        store.dispatch(loadDivisions(Divisions));
        modalRef.current?.click()
    }

    const onModalClose = () => {
        store.dispatch(initializeDivisionEdit())
    }

    const validationSchema = yup.object().shape({
        Name: yup.string().required(t('validation_error_division_edit_name_required') ?? ''),
    });

    return (
        <>
            <div
                className="modal fade"
                id='EditDivision'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('division_edit_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeEditDivisionModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        {checkForPermission("BUSINESSDIVISION_MANAGE") &&
                            <div className="modal-body">
                                <ContainerPage>
                                    <ValidationErrorComp errors={errors} />
                                    <div className=''>
                                        <div className='row mb-1'>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('division_edit_input_name')}</label>
                                                <input name='Name' onChange={onUpdateField} type='text'
                                                    value={division.Name}
                                                    className={`form-control  ${errors["Name"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {errors['Name']}</div>
                                            </div>
                                            <div className="col-md-12">
                                                <label className="mt-2 red-asterisk">{t('division_edit_label_status')}</label>
                                                <select name="IsActive" value={division.IsActive ?? ""} onChange={onUpdateField} className="form-select">
                                                    <option value={1}>{t('division_edit_select_option_1')}</option>
                                                    <option value={0}>{t('division_edit_select_option_2')}</option>
                                                </select>
                                            </div>
                                            <div className="col-md-12 mt-4">
                                                <button type='button' className='btn  app-primary-bg-color text-white mt-2' onClick={onSubmit}>
                                                    {t('division_edit_submit')}
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