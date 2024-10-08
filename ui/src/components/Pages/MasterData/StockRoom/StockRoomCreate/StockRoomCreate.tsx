import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { CreateStockRoomState, initializeStockRoomCreate, toggleInformationModalStatus, updateErrors, updateField } from "./StockRoomCreate.slice";
import { store } from "../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { useStore } from '../../../../../state/storeHooks';
import { useEffect, useRef } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { convertBackEndErrorsToValidationErrors } from "../../../../../helpers/formats";
import * as yup from 'yup';
import { checkForPermission } from "../../../../../helpers/permissions";
import { getStockRoomList, stockRoomCreate } from "../../../../../services/stockroom";
import { loadStockRooms } from "../StockRoomList/StockRoomList.slice";

export const StockRoomCreate = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const {
        stockroomcreate: { stockroom, displayInformationModal, errors },
    } = useStore(({ stockroomcreate, app }) => ({ stockroomcreate, app }));

    useEffect(() => {
        store.dispatch(initializeStockRoomCreate())
    }, [])

    const onUpdateField = (ev: any) => {
        const name = ev.target.name;
        const value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof CreateStockRoomState['stockroom'], value }));
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(stockroom, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await stockRoomCreate(stockroom)
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
            <SweetAlert success title="Success" onConfirm={updateRole}>
                {t('stockroom_create_success_message')}
            </SweetAlert>
        );
    }

    const updateRole = async () => {
        store.dispatch(toggleInformationModalStatus());
        const result = await getStockRoomList(store.getState().stockroomlist.search, 1)
        store.dispatch(loadStockRooms(result));
        modalRef.current?.click()
    }
    const onModalClose = () => {
        store.dispatch(initializeStockRoomCreate())
    }
    const validationSchema = yup.object().shape({
        RoomName: yup.string().required('validation_error_stockroom_create_roomname_required').max(32, 'validation_error_stockroom_create_roomname_max'),
        RoomCode: yup.string().required('validation_error_stockroom_create_roomcode_required').max(8, 'validation_error_stockroom_create_roomcode_max').min(4,'validation_error_stockroom_create_roomcode_min').trim(),
        Description: yup.string().required('validation_error_stockroom_create_description_required').max(128, 'validation_error_stockroom_create_description_max'),
    });
    return (
        <>
            {checkForPermission("STOCKROOM_MANAGE") &&
                <div
                    className="modal fade"
                    id='Createstockroom'
                    data-bs-backdrop='static'
                    data-bs-keyboard='false'
                    aria-hidden='true'
                >
                    <div className="modal-dialog ">
                        <div className="modal-content">
                            <div className="modal-header mx-2">
                                <h5 className="modal-title">{t('stockroom_create_title')}</h5>
                                <button
                                    type='button'
                                    className="btn-close"
                                    data-bs-dismiss='modal'
                                    id='closeCreateRoleModal'
                                    aria-label='Close'
                                    onClick={onModalClose}
                                    ref={modalRef}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <ContainerPage>
                                    <ValidationErrorComp errors={errors} />
                                    <div className=''>
                                        <div className='row mb-1'>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('stockroom_create_input_roomcode')}</label>
                                                <input name='RoomCode' onChange={onUpdateField} type='text'
                                                    value={stockroom.RoomCode ? stockroom.RoomCode :""}
                                                    className={`form-control  ${t(errors["RoomCode"] ? "is-invalid" : "")}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['RoomCode'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('stockroom_create_input_roomname')}</label>
                                                <input name='RoomName' onChange={onUpdateField} type='text'
                                                    value={stockroom.RoomName}
                                                    className={`form-control  ${t(errors["RoomName"] ? "is-invalid" : "")}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['RoomName'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('stockroom_list_th_description')}</label>
                                                <input name='Description' onChange={onUpdateField} type='text'
                                                    value={stockroom.Description}
                                                    className={`form-control  ${t(errors["Description"] ? "is-invalid" : "")}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['Description'])}</div>
                                            </div>
                                            <div className="col-md-12">
                                                <label className="mt-2 red-asterisk">{t('stockroom_create_label_status')}</label>
                                                <select name="IsActive" value={stockroom.IsActive} onChange={onUpdateField} className="form-select">
                                                    <option value="1">{t('stockroom_create_select_option_1')}</option>
                                                    <option value="0">{t('stockroom_create_select_option_0')}</option>
                                                </select>
                                            </div>
                                            <div className="col-md-12 mt-4 ">
                                                <button type='button' className='btn  app-primary-bg-color text-white mt-2 float-end' onClick={onSubmit}>
                                                    {t('stockroom_create_button')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </ContainerPage>
                                {displayInformationModal ? <InformationModal /> : ""}
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}