import { dispatchOnCall, store } from '../../../../state/store';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { useStoreWithInitializer } from '../../../../state/storeHooks';
import { useEffect } from 'react';
import { loadCustomerDetails, initializeCustomerProfile } from './Profile.slice';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getClickedCustomerDetails } from '../../../../services/customer';
import { checkForPermission } from '../../../../helpers/permissions';

export function Profile() {
  const { t, i18n } = useTranslation();
  const { singlecustomer } = useStoreWithInitializer(
    ({ customerprofile }) => customerprofile,
    dispatchOnCall(initializeCustomerProfile())
  );

  const { CustomerId } = useParams<{ CustomerId: string }>();

  useEffect(() => {
    onLoad(CustomerId);
  }, [CustomerId]);

  return (
    <>
      {checkForPermission('CUSTOMER_PROFILE_DETAILS') && (
        <ContainerPage>
          <h5 className='mt-2'>{t('profile_details')}</h5>
          <div className="row">
            {/* col-1 */}
            <div className="col-md-4">
              <div className="pt-2">
                <label className="form-text">{t('profile_customer_name')}</label>
                <div >{singlecustomer.Name}</div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_customer_nameonprint')}</label>
                <div >{singlecustomer.NameOnPrint}</div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_customer_code')}</label>
                <div >{singlecustomer.CustomerCode == null ? "---" : singlecustomer.CustomerCode}</div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_customer_tenantoffice')}</label>
                <div >{singlecustomer.TenantOffice}</div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_iscontractcustomer')}</label>
                <div >{singlecustomer.IsContractCustomer == true ? "Yes" : "No"}</div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_group_name')}</label>
                <div >{singlecustomer.GroupName == null ? "---" : singlecustomer.GroupName}</div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_pan_number')}</label>
                <div >{singlecustomer.PanNumber == "" ? "---" : singlecustomer.PanNumber}</div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_tin_number')}</label>
                <div >{singlecustomer.TinNumber == "" ? "---" : singlecustomer.TinNumber}</div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_tan_number')}</label>
                <div >{singlecustomer.TanNumber == "" ? "---" : singlecustomer.TanNumber}</div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_cin_number')}</label>
                <div >{singlecustomer.CinNumber == "" ? "---" : singlecustomer.CinNumber} </div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_is_msme')}</label>
                <div >{singlecustomer.IsMsme ? 'yes' : 'No'}</div>
              </div>
            </div>

            {/* col-2 */}
            <div className="col-md-4">
              <div className="row pt-2">
                <label className="form-text">{t('profile_msme_registration_number')}</label>
                <div >{singlecustomer.MsmeRegistrationNumber == "" ? "---" : singlecustomer.MsmeRegistrationNumber}</div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_primary_contact_name')}</label>
                <div >{singlecustomer.PrimaryContactName}</div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_primary_contact_phone')}</label>
                <div >{singlecustomer.PrimaryContactPhone}</div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_primary_contact_email')}</label>
                <div >{singlecustomer.PrimaryContactEmail}</div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_secondary_contact_name')}</label>
                <div >{singlecustomer.SecondaryContactName == null ? '---' : singlecustomer.SecondaryContactName}</div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_secondary_contact_phone')}</label>
                <div >{singlecustomer.SecondaryContactPhone == null ? '---' : singlecustomer.SecondaryContactPhone}</div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_secondary_contact_email')}</label>
                <div >{singlecustomer.SecondaryContactEmail == null ? '---' : singlecustomer.SecondaryContactEmail}</div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_billedto_city')}</label>
                <div >{singlecustomer.BilledToCityName}</div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_billedto_state')}</label>
                <div >{singlecustomer.BilledToStateName}</div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_billedto_country')}</label>
                <div >{singlecustomer.BilledToCountryName}</div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_billedto_pincode')}</label>
                <div >{singlecustomer.BilledToPincode}</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="pt-2">
                <label className="form-text">{t('profile_billedto_industry')}</label>
                <div>{singlecustomer.Industry}</div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_billedto_address')}</label>
                <p className='pre-line'>{singlecustomer.BilledToAddress}</p>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_billedto_gst_number')}</label>
                <div >{singlecustomer.BilledToGstNumber}</div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_shippedto_city')}</label>
                <div >{singlecustomer.ShippedToCityName}</div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_shippedto_state')}</label>
                <div >{singlecustomer.ShippedToStateName}</div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_shippedto_country')}</label>
                <div >{singlecustomer.ShippedToCountryName}</div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_shippedto_pincode')}</label>
                <div >{singlecustomer.ShippedToPincode}</div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_shippedto_address')}</label>
                <div>{singlecustomer.ShippedToAddress}</div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('profile_shippedto_gst_number')}</label>
                <div >{singlecustomer.ShippedToGstNumber}</div>
              </div>
            </div>
          </div>
        </ContainerPage>
      )}
    </>
  );
}

async function onLoad(CustomerId: string) {
  store.dispatch(initializeCustomerProfile());
  try {
    const result = await getClickedCustomerDetails(CustomerId);
    store.dispatch(loadCustomerDetails(result));
  } catch (error) {
    console.error(error);
  }
}
