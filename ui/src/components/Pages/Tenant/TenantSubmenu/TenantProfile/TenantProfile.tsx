import { dispatchOnCall, store } from '../../../../../state/store';
import { useStoreWithInitializer } from '../../../../../state/storeHooks';
import { useEffect } from 'react';
import { loadTenantDetails, initializeTenantProfile } from './TenantProfile.slice';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getClickedTenantDetails, getTenantUpdateDetails } from '../../../../../services/tenant';
import { checkForPermission } from '../../../../../helpers/permissions';
import { EditTenant } from './TenantProfileEdit/TenantProfileEdit';
import { initializeTenantEdit, loadSelectDetails, loadTenantEditDetails, updateField } from './TenantProfileEdit/TenantProfileEdit.slice';
import { getCountries } from '../../../../../services/country';
import { formatSelectInputWithCode } from '../../../../../helpers/formats';

const TenantProfile = () => {
  const { t, i18n } = useTranslation();
  const { singletenant } = useStoreWithInitializer(
    ({ tenantprofile }) => tenantprofile,
    dispatchOnCall(initializeTenantProfile())
  );
  const { TenantId } = useParams<{ TenantId: string }>();
  useEffect(() => {
    if (checkForPermission("ACCEL_MANAGE")) {
      onLoad(TenantId);
    }
  }, [TenantId]);

  const onLoad = async (TenantId: string) => {
    store.dispatch(initializeTenantProfile());
    try {
      const result = await getClickedTenantDetails(TenantId);
      store.dispatch(loadTenantDetails(result));
    } catch (error) {
      console.error(error);
    }
  };

  const loadTenantUpdateDetails = async () => {
    if (checkForPermission("ACCEL_MANAGE")) {
      store.dispatch(initializeTenantEdit());
      try {
        const result = await getTenantUpdateDetails(TenantId);
        store.dispatch(loadTenantEditDetails(result));

        const Countries = await getCountries();
        const filteredCountries = await formatSelectInputWithCode(Countries.Countries, "Name", "Id", "CallingCode")
        store.dispatch(loadSelectDetails({ name: 'Countrys', value: { Select: filteredCountries } }));
      } catch (error) {
        console.error(error);
      }
      store.dispatch(updateField({ name: "TenantId", value: TenantId }));
    }
  };

  return (
    <>
      {checkForPermission('ACCEL_MANAGE') && (
        <div>
          <div className='row'>
            <div className='mt-2 fs-6 fw-bold'>{t('tenant_details')}</div>
          </div>
          {singletenant.match({
            none: () => <div className='row m-1'>{t('tenant_details_loading')}</div>,
            some: (SelectedTenant) => (
              <div className="tenant-info-wrapper">
                {/* company info */}
                <div className="row bg-light-subtle shadow-sm p-2 rounded mt-2">
                  {/* info */}
                  <div className="col-md-7 p-1">
                    {/* tenant name */}
                    <div className='mb-2'>
                      <div className='text-size-11 text-muted'>{t('tenant_tenant_name')}</div>
                      <div className='text-size-13'>{SelectedTenant[0]['SelectedTenant']['Name']}</div>
                    </div>
                    {/* tenant name ends */}
                    {/* name on print */}
                    <div className='mb-2'>
                      <div className='text-size-11 text-muted'>{t('tenant_nameinprint')}</div>
                      <div className='text-size-13'>{SelectedTenant[0]['SelectedTenant']['NameOnPrint']}</div>
                    </div>
                    {/* name on print ends */}
                    {/* pan number */}
                    <div className='mb-2'>
                      <div className='text-size-11 text-muted'>{t('tenant_tenant_pan')}</div>
                      <div className='text-size-13'>{SelectedTenant[0]['SelectedTenant']['PanNumber']}</div>
                    </div>
                    {/* pan number ends */}
                  </div>
                  {/* info ends */}
                  {/* address */}
                  <div className="col-md-5 bg-warning-subtle rounded p-3">
                    <div className="text-size-11 text-muted">{t('tenant_tenant_address')}</div>
                    <div className='text-size-13'>
                      {SelectedTenant[0]['SelectedTenant']['Address']}, &nbsp;
                      {SelectedTenant[0]['SelectedTenant']['City']}, &nbsp;
                      {SelectedTenant[0]['SelectedTenant']['TenantState']}, &nbsp;
                      {SelectedTenant[0]['SelectedTenant']['Country']} &nbsp;-&nbsp;
                      {SelectedTenant[0]['SelectedTenant']['Pincode']}
                    </div>
                    {/* edit button */}
                    <div className="mt-2">
                      {checkForPermission("ACCEL_MANAGE") &&
                        <div className="text-size-12 text-primary fw-bold" role="button" data-bs-toggle='modal' data-bs-target='#EditTenant' onClick={loadTenantUpdateDetails}>
                          {t('tenant_details_button_update')}
                        </div>
                      }
                    </div>
                    {/* edit button ends */}
                  </div>
                  {/* address ends */}
                </div>
                {/* company info ends */}
                {/* head office */}
                <div className="text-size-11 text-muted mt-3">{t('tenant_hoaddress')}</div>
                <div className="text-size-13">{SelectedTenant[0]['SelectedTenant']['HOAddress']}</div>
                {/* head office ends */}
                {/* central warehouse */}
                <div className="text-size-11 text-muted mt-3">{t('tenant_cwhaddress')}</div>
                <div className="text-size-13">{SelectedTenant[0]['SelectedTenant']['CWHAddress']}</div>
                {/* central warehouse ends */}
                {/* global repair center */}
                <div className="text-size-11 text-muted mt-3">{t('tenant_grcaddress')}</div>
                <div className="text-size-13">{SelectedTenant[0]['SelectedTenant']['GRCAddress']}</div>
                {/* global repair center ends */}
              </div>
            ),
          })}
        </div>
      )}
      <EditTenant />
    </>
  );
};
export default TenantProfile