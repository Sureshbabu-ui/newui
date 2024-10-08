import { useTranslation } from "react-i18next"
import { useStoreWithInitializer } from "../../../../state/storeHooks";
import { initializeAppDetails, updateField, toggleInformationModalStatus, updateErrors, stopSubmitting, toggleUpdate, AppSettingsState, appSettings, toggleAppKey } from "./AppSetting.slice";
import { dispatchOnCall, store } from "../../../../state/store";
import { useEffect, useRef, useState } from 'react';
import SweetAlert from "react-bootstrap-sweetalert";
import FeatherIcon from 'feather-icons-react';
import { convertBackEndErrorsToValidationErrors } from "../../../../helpers/formats";
import * as yup from 'yup';
import { getAppSettingDetails, updateAppSetting } from "../../../../services/appsettings";

const AppSetting = () => {
    const { t } = useTranslation()
    const modalRef = useRef<HTMLButtonElement>(null);
    const { appsettings, displayInformationModal, errors, appKey, appEditDetail, isUpdateDisabled, submitting } = useStoreWithInitializer(
        ({ appsetting }) => appsetting,
        dispatchOnCall(initializeAppDetails())
    );
    useEffect(() => {
        onLoad();
    }, []);

    const [confirmId, setConfirmId] = useState(0);

    const handleConfirm = (data: number) => {
        setConfirmId(data);
    };

    async function handleCancel() {
        setConfirmId(0);
        store.dispatch(toggleAppKey(""))
    }

    function ConfirmationModal() {
        return (
            <SweetAlert
                warning
                showCancel
                confirmBtnText='Yes, Edit!'
                cancelBtnText='Cancel'
                cancelBtnBsStyle='light'
                confirmBtnBsStyle='warning'
                title={t('appsetting_confirmation_modal_title_message')}
                onConfirm={updateAppSettings}
                onCancel={handleCancel}
                focusCancelBtn
            >
                {t('appsetting_confirmation_modal_message')}
            </SweetAlert>
        );
    }

    const onUpdateField = (ev: any) => {
        const name = ev.target.name;
        const value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof AppSettingsState['appEditDetail'], value }));
    }

    const updateAppSettings = async () => {
        store.dispatch(updateErrors({}));

        try {
            await validationSchema.validate(appEditDetail, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        const result = await updateAppSetting(appEditDetail)
        result.match({
            ok: () => {
                setConfirmId(0)
                store.dispatch(toggleInformationModalStatus());
            },
            err: (e) => {
                const errorMessages = convertBackEndErrorsToValidationErrors(e)
                store.dispatch(updateErrors(errorMessages));
            },
        });
        store.dispatch(stopSubmitting())
    }

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={updatedAppSettings}>
                {t('appsetting_updated_success_message')}
            </SweetAlert>
        );
    }

    const updatedAppSettings = async () => {
        store.dispatch(toggleInformationModalStatus());
        const result = await getAppSettingDetails();
        store.dispatch(appSettings(result));
        modalRef.current?.click()
        store.dispatch(toggleUpdate())
        store.dispatch(toggleAppKey(""))
    }

    const enableEdit = (appKey, appValue) => {
        store.dispatch(toggleAppKey({ appKey, appValue }))
    }
    const validationSchema = yup.object().shape({
        AppValue: yup.string().required('validation_error_appsetting_appvalue_required'),
    });

    return (
        <>
            <div className="row  " id="app-setting">
                <div className="col ">
                    <h5 className="px-0 pt-0 ">{t('appsetting_view_title')}</h5>
                </div>
                {/* help text */}
                <div className="small">
                    {t('appsetting_view_helper_text')}
                </div>
                {/* help text ends */}
            </div>

            {/* settings */}
            <div className="mt-3">
                {
                    appsettings.match({
                        none: () => <div className="ms-1">{t('appsetting_view_loading')}</div>,
                        some: (x) => {
                            if (x.length > 0) {
                                return x.map((field, index) => (
                                    <div className="row m-0 mt-3" key={index}>
                                        <div className="col-3 p-0">
                                            {field.appsettings.Appkey}
                                        </div>
                                        <div className="col-7">
                                            <input
                                                name="AppValue"
                                                value={appKey !== field.appsettings.Appkey ? field.appsettings.AppValue : appEditDetail.AppValue}
                                                disabled={appKey !== field.appsettings.Appkey}
                                                onChange={(e) => onUpdateField(e)}
                                                type='text'
                                                className={`form-control py-1 `}
                                            ></input>
                                            <div className="invalid-feedback"> {t(errors['AppValue'])}</div>
                                        </div>
                                        <div className="col-1 d-flex">
                                            {!(appKey === field.appsettings.Appkey) && (
                                                <button
                                                    name={field.appsettings.Appkey}
                                                    type='button'
                                                    value={field.appsettings.AppValue}
                                                    className='btn app-primary-bg-color text-white '
                                                    onClick={() => enableEdit(field.appsettings.Appkey, field.appsettings.AppValue)}
                                                >
                                                    <FeatherIcon icon={'edit'} size='16' />
                                                </button>
                                            )}
                                            {(appKey === field.appsettings.Appkey) && (
                                                <div className='d-flex justify-content-end'>
                                                    <button
                                                        type='button'
                                                        className='btn btn-success app-sucess-bg-color text-white m-0 me-2'
                                                        onClick={() => handleConfirm(1)}
                                                    >
                                                        <FeatherIcon icon={'check'} size='16' />
                                                    </button>
                                                    <button
                                                        type='button'
                                                        className='btn btn-danger app-danger-bg-color text-white m-0'
                                                        onClick={() => store.dispatch(toggleAppKey(""))}
                                                    >
                                                        <FeatherIcon icon={'x'} size='16' />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ));
                            } else {
                                return <div className="text-muted ps-3">{t('appsetting_no_data_found')}</div>;
                            }
                        }
                    })
                }
            </div>
            {/* settings ends here*/}
            {displayInformationModal ? <InformationModal /> : ""}
            {confirmId > 0 ? <ConfirmationModal /> : ""}
        </>
    )
    async function onLoad() {
        store.dispatch(initializeAppDetails());
        try {
            const result = await getAppSettingDetails();
            store.dispatch(appSettings(result));
        } catch (error) {
            console.log(error)
        }
    }
}
export default AppSetting