import { store } from '../../../../state/store';
import { useStore } from '../../../../state/storeHooks';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { MasterEntitiDataEditState, toggleInformationModalStatus, updateErrors, updateField, } from './LookupDataEdit.slice';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import { editLookupData, getSelectedConfigurations } from '../../../../services/lookupdata';
import { convertBackEndErrorsToValidationErrors } from '../../../../helpers/formats';
import * as yup from 'yup';
import { checkForPermission } from '../../../../helpers/permissions';
import { setConfigurations } from '../LookupData.slice';
import { useRef } from 'react';
import { getLookupList } from '../../../../services/lookup';

export const LookupDataEdit = (props: any) => {
  const { t, i18n } = useTranslation();
  const { configurations, displayInformationModal, errors } = useStore(({ lookupdataedit }) => lookupdataedit);
  const modalRef = useRef<HTMLButtonElement>(null);

  const validationSchema = yup.object().shape({
    Name: yup.string().required('validation_error_lookupdata_create_name_required'),
    IsActive: yup.string().required('validation_error_lookupdata_create_isactive_required')
  });

  const onSubmit = async () => {
    store.dispatch(updateErrors({}))
    try {
      await validationSchema.validate(configurations, { abortEarly: false });
    } catch (error: any) {
      const errors = error.inner.reduce((allErrors: any, currentError: any) => {
        return { ...allErrors, [currentError.path as string]: currentError.message };
      }, {});
      store.dispatch(updateErrors(errors))
      if (errors)
        return;
    }
    store.dispatch(startPreloader());
    const result = await editLookupData(configurations)
    const lookup = await getLookupList();
    localStorage.setItem('bsmasterdata', JSON.stringify(lookup));
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

  function onUpdateField(ev: any) {
    var name = ev.target.name;
    var value = ev.target.value;
    if (name == 'IsSystemData') {
      value = ev.target.checked ? true : false;
    }
    store.dispatch(updateField({ name: name as keyof MasterEntitiDataEditState['configurations'], value }));
  }

  function InformationModal() {
    const { t, i18n } = useTranslation();
    return (
      <SweetAlert success title="Success" onConfirm={updateLookupData}>
        {t('lookupdata_edit_success_message')}
      </SweetAlert>
    );
  }

  async function updateLookupData() {
    store.dispatch(toggleInformationModalStatus());
    const result = await getSelectedConfigurations(props.Id);
    store.dispatch(setConfigurations(result));
    modalRef.current?.click()
  }
  const onModalClose = () => {
    store.dispatch(updateErrors({}))
    store.dispatch(updateField({ name: 'Name', value: "" }))
    store.dispatch(updateField({ name: 'IsActive', value: 1 }))
  }
  return (
    <ContainerPage>
      <div
        className="modal fade"
        id="EditMasterData"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title app-primary-color">{t('lookupdata_modal_title_edit_masterdata')}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                onClick={onModalClose}
                ref={modalRef}
                id="closeEditMasterDataModal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="masterdata">
                {checkForPermission("LOOKUPDATA_MANAGE") && <>
                  <div className="row">
                    <div className="col-md-12 mt-2">
                      <label className="red-asterisk">{t('lookupdata_edit_label_name')}</label>
                      <input name="Name" type="text" value={configurations.Name ?? ""} onChange={onUpdateField} className={`form-control  ${errors["Name"] ? "is-invalid" : ""}`}></input>
                      <div className="small text-danger"> {t(errors['Name'])}</div>
                    </div>
                    <div className="col-md-12 mt-3">
                      <label className="red-asterisk">{t('lookupdata_edit_label_status')}</label>
                      <select name="IsActive" value={configurations.IsActive} onChange={onUpdateField} className="form-select">
                        <option value={1}>{t('lookupdata_edit_select_option_1')}</option>
                        <option value={0}>{t('lookupdata_edit_select_option_2')}</option>
                      </select>
                      <div className="small text-danger"> {t(errors['IsActive'])}</div>
                    </div>
                    <div className='mt-1 d-flex'>
                      <button type="button" onClick={onSubmit} className="btn  app-primary-bg-color text-white mt-2 float-end">
                        {t('lookupdata_edit_button')}
                      </button>
                    </div>
                  </div>
                  {displayInformationModal ? <InformationModal /> : ""}
                </>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContainerPage>
  );
}