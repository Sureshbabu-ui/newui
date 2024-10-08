import { useStore } from '../../../../../../../state/storeHooks';
import { useTranslation } from 'react-i18next';

const CustomerDetails = () => {
  const { t } = useTranslation();

  const { selectedServiceRequest } = useStore(
    ({ callcentreservicerequestdetails }) => callcentreservicerequestdetails);
  return (
    <>
      {selectedServiceRequest ? (
        <div className="row mb-3">
          <div className="col-6" >
            <div className="row mb-1 mt-1">
              <label className="form-text">{t('callcentrecallscutomerdetails_label_customername')}</label>
              <div >{selectedServiceRequest.CustomerName}</div>
            </div>
            <div className="row mb-1 mt-1">
              <label className="form-text">{t('callcentrecallscutomerdetails_label_siteaddress')}</label>
              <div >{selectedServiceRequest.SiteAddress}</div>
            </div>
            <div className="row mb-1 mt-1">
              <label className="form-text">{t('callcentrecallscutomerdetails_label_contractnumber')}</label>
              <div >{selectedServiceRequest.ContractNumber}</div>
            </div>
          </div>
          <div className="col-6" >
            <div className="row mb-1 mt-1">
              <label className="form-text">{t('callcentrecallscutomerdetails_label_customercode')}</label>
              <div >{selectedServiceRequest.CustomerCode}</div>
            </div>
            <div className="row mb-1 mt-1">
              <label className="form-text">{t('callcentrecallscutomerdetails_label_serviceaddress')}</label>
              <div >{selectedServiceRequest.CustomerServiceAddress ? selectedServiceRequest.CustomerServiceAddress : "---"}</div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {t('callcentredetails_no_data')}
        </div>
      )}
    </>
  )
}

export default CustomerDetails