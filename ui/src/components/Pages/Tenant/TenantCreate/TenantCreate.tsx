import { useStoreWithInitializer } from '../../../../state/storeHooks';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import { dispatchOnCall, store } from '../../../../state/store';
import {
  initializeTenant, updateField, updateErrors, toggleInformationModalStatus, stopSubmitting, CreateTenentState
} from './TenantCreate.slice'
import { TenentForCreation } from '../../../../types/tenant';
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import { createTenant } from '../../../../services/tenant';
import * as yup from 'yup';

export const Tenant=()=> {
  const { t, i18n } = useTranslation();
  const { tenant, displayInformationModal, errors } = useStoreWithInitializer(({ tenantcreate }) => tenantcreate,
    dispatchOnCall(initializeTenant)
  )

  const validationSchema = yup.object().shape({
    Name: yup.string().required('validation_error_tenant_create_name_required'),
    NameInPrint: yup.string().required('validation_error_tenant_create_name_in_print_required'),
    Address: yup.string().required('validation_error_tenant_create_address_required') 
  });
  const onSubmit = async () => {
    store.dispatch(updateErrors({}))
    try {
      await validationSchema.validate(tenant, { abortEarly: false });
    } catch (error: any) {
      const errors = error.inner.reduce((allErrors: any, currentError: any) => {
        return { ...allErrors, [currentError.path as string]: currentError.message };
      }, {});
      store.dispatch(updateErrors(errors))
      if (errors)
        return;
    }
    store.dispatch(startPreloader());
    const result = await createTenant(store.getState().tenantcreate.tenant);
    store.dispatch(stopSubmitting());
    result.match({
      ok: () => {
        store.dispatch(toggleInformationModalStatus());
      },
      err: (e) => store.dispatch(updateErrors(e)),
    });
    store.dispatch(stopPreloader())
  }

  return (
    <div className="Tenent">
      <ContainerPage>
        <div className="col-md-12" >
          {/* Create manpower form */}
          <div className="mb-1">
            <label className="form-label">Name</label>
            <input onChange={onUpdateField} name="Name" value={tenant.Name} type="text" className={`form-control  ${errors["Name"] ? "is-invalid" : ""}`} />
            <div className="invalid-feedback"> {t(errors['Name'])}</div>
          </div>
          <div className="mb-1">
            <label className="form-label">Name In Print</label>
            <input onChange={onUpdateField} name="NameOnPrint" value={tenant.NameOnPrint} type="text" className={`form-control  ${errors["NameInPrint"] ? "is-invalid" : ""}`} />
            <div className="invalid-feedback"> {t(errors['NameOnPrint'])}</div>
          </div>
          <div className="mb-1">
            <label className="form-label">Address</label>
            <textarea onChange={onUpdateField} name="Address" value={tenant.Address} className={`form-control  ${errors["Address"] ? "is-invalid" : ""}`} style={{ height: "100px", resize: "vertical" }}></textarea>
            <div className="invalid-feedback"> {t(errors['Address'])}</div>
          </div>

          <button type="button" onClick={onSubmit} className="btn app-primary-bg-color text-white mt-2">{t('tenant_create_button_create_tenant')}</button><div>    <br></br></div>
          {displayInformationModal ? <InformationModal /> : ''}
        </div>
      </ContainerPage>
    </div>
  );
}
const onUpdateField=(ev: any)=> {
  console.log(store.getState().usercreate.user);
  var name = ev.target.name;
  var value = ev.target.value;
  store.dispatch(updateField({ name: name as keyof CreateTenentState['tenant'], value }));
}

const InformationModal=()=> {
  const { t, i18n } = useTranslation();
  return (
    <SweetAlert success title='Success' onConfirm={reDirectRoute}>
      {t('tenant_create_success')}
    </SweetAlert>
  );
}
const reDirectRoute=()=> {
  store.dispatch(toggleInformationModalStatus());
  document.getElementById('closeCreateTenantModal')?.click();
  window.location.reload();
}