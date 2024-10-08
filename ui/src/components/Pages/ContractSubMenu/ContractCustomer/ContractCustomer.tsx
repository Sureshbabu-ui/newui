import { useTranslation } from "react-i18next";
import { useStoreWithInitializer } from "../../../../state/storeHooks";
import { initializeContractCustomer, loadContractCustomer } from "./ContractCustomer.slice";
import { getContractCustomerDetails } from "../../../../services/contracts";
import { store } from "../../../../state/store";
import { useParams } from "react-router-dom";
import { ContainerPage } from "../../../ContainerPage/ContainerPage";

const ContractCustomer = () => {
  const { t } = useTranslation();
  const { ContractId } = useParams<{ ContractId: string }>();

  const onLoad = async () => {
    store.dispatch(initializeContractCustomer());
    try {
      const customer = await getContractCustomerDetails(ContractId);
      store.dispatch(loadContractCustomer(customer));
    } catch (error) {
      console.error(error);
    }
  }

  const { customer } = useStoreWithInitializer(
    ({ contractcustomer }) => contractcustomer,
    onLoad
  );

  return (
    <ContainerPage>
      <h5 className="px-0 ps-2 pt-2 bold-text">{t('service_request_customer_site_details')}</h5>
      <div className="row">
        {/* col-1 */}
        <div className="col-md-4">
          <div className="row pt-2">
            <label className="form-text">{t('profile_customer_name')}</label>
            <div >{customer.Name}</div>
          </div>
          <div className="row pt-2">
            <label className="form-text">{t('profile_customer_nameonprint')}</label>
            <div >{customer.NameOnPrint}</div>
          </div>
          <div className="row pt-2">
            <label className="form-text">{t('profile_customer_code')}</label>
            <div >{customer.CustomerCode == null ? "---" : customer.CustomerCode}</div>
          </div>
          <div className="row pt-2">
            <label className="form-text">{t('profile_customer_tenantoffice')}</label>
            <div >{customer.TenantOffice}</div>
          </div>
          <div className="row pt-2">
            <label className="form-text">{t('profile_iscontractcustomer')}</label>
            <div >{customer.IsContractCustomer == true ? "Yes" : "No"}</div>
          </div>
          <div className="row pt-2">
            {/* TODOS hardcoded values should change with translation */}
            <label className="form-text">{t('profile_group_name')}</label>
            <div >{customer.GroupName == null ? "---" : customer.GroupName}</div>
          </div>
          <div className="row pt-2">
            <label className="form-text">{t('profile_pan_number')}</label>
            <div >{customer.PanNumber == "" ? "---" : customer.PanNumber}</div>
          </div>
          <div className="row pt-2">
            <label className="form-text">{t('profile_tin_number')}</label>
            <div >{customer.TinNumber == "" ? "---" : customer.TinNumber}</div>
          </div>
          <div className="row pt-2">
            <label className="form-text">{t('profile_tan_number')}</label>
            <div >{customer.TanNumber == "" ? "---" : customer.TanNumber}</div>
          </div>
          <div className="row pt-2">
            <label className="form-text">{t('profile_cin_number')}</label>
            <div >{customer.CinNumber == "" ? "---" : customer.CinNumber} </div>
          </div>
          <div className="row pt-2">
            <label className="form-text">{t('profile_is_msme')}</label>
            <div >{customer.IsMsme ? 'yes' : 'No'}</div>
          </div>
        </div>

        {/* col-2 */}
        <div className="col-md-4">
          <div className="row pt-2">
            <label className="form-text">{t('profile_msme_registration_number')}</label>
            <div >{customer.MsmeRegistrationNumber == "" ? "---" : customer.MsmeRegistrationNumber}</div>
          </div>
          <div className="pt-2">
            <label className="form-text">{t('profile_primary_contact_name')}</label>
            <div >{customer.PrimaryContactName}</div>
          </div>
          <div className="pt-2">
            <label className="form-text">{t('profile_primary_contact_phone')}</label>
            <div >{customer.PrimaryContactPhone}</div>
          </div>
          <div className="pt-2">
            <label className="form-text">{t('profile_primary_contact_email')}</label>
            <div >{customer.PrimaryContactEmail}</div>
          </div>
          <div className="pt-2">
            <label className="form-text">{t('profile_secondary_contact_name')}</label>
            <div >{customer.SecondaryContactName == null ? '---' : customer.SecondaryContactName}</div>
          </div>
          <div className="pt-2">
            <label className="form-text">{t('profile_secondary_contact_phone')}</label>
            <div >{customer.SecondaryContactPhone == null ? '---' : customer.SecondaryContactPhone}</div>
          </div>
          <div className="pt-2">
            <label className="form-text">{t('profile_secondary_contact_email')}</label>
            <div >{customer.SecondaryContactEmail == null ? '---' : customer.SecondaryContactEmail}</div>
          </div>
          <div className="pt-2">
            <label className="form-text">{t('profile_billedto_city')}</label>
            <div >{customer.BilledToCityName}</div>
          </div>
          <div className="pt-2">
            <label className="form-text">{t('profile_billedto_state')}</label>
            <div >{customer.BilledToStateName}</div>
          </div>
          <div className="pt-2">
            <label className="form-text">{t('profile_billedto_country')}</label>
            <div >{customer.BilledToCountryName}</div>
          </div>
          <div className="pt-2">
            <label className="form-text">{t('profile_billedto_pincode')}</label>
            <div >{customer.BilledToPincode}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="pt-2">
            <label className="form-text">{t('profile_billedto_industry')}</label>
            <div>{customer.Industry}</div>
          </div>
          <div className="pt-2">
            <label className="form-text">{t('profile_billedto_address')}</label>
            <p className='pre-line'>{customer.BilledToAddress}</p>
          </div>
          <div className="pt-2">
            <label className="form-text">{t('profile_billedto_gst_number')}</label>
            <div >{customer.BilledToGstNumber}</div>
          </div>
          <div className="pt-2">
            <label className="form-text">{t('profile_shippedto_city')}</label>
            <div >{customer.ShippedToCityName}</div>
          </div>
          <div className="pt-2">
            <label className="form-text">{t('profile_shippedto_state')}</label>
            <div >{customer.ShippedToStateName}</div>
          </div>
          <div className="pt-2">
            <label className="form-text">{t('profile_shippedto_country')}</label>
            <div >{customer.ShippedToCountryName}</div>
          </div>
          <div className="pt-2">
            <label className="form-text">{t('profile_shippedto_pincode')}</label>
            <div >{customer.ShippedToPincode}</div>
          </div>
          <div className="pt-2">
            <label className="form-text">{t('profile_shippedto_address')}</label>
            <div>{customer.ShippedToAddress}</div>
          </div>
          <div className="pt-2">
            <label className="form-text">{t('profile_shippedto_gst_number')}</label>
            <div >{customer.ShippedToGstNumber}</div>
          </div>
        </div>
      </div>
    </ContainerPage>
  );
}

export default ContractCustomer