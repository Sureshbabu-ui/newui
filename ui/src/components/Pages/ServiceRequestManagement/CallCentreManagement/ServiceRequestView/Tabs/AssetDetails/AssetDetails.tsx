import { useStore } from '../../../../../../../state/storeHooks';
import { useTranslation } from 'react-i18next';

const AssetDetails = () => {
  const { t } = useTranslation();

  const { selectedServiceRequest } = useStore(
    ({ callcentreservicerequestdetails }) => callcentreservicerequestdetails);
  return (
    <>
      <div className="row mb-3">
        <div className="col-6" >
          <div className="row mb-1 mt-1">
            <label className="form-text">{t('callcentrecallscutomerdetails_label_make')}</label>
            <div >{selectedServiceRequest.Make ?? "---"}</div>
          </div>
          <div className="row mb-1 mt-1">
            <label className="form-text">{t('callcentrecallscutomerdetails_label_categoryname')}</label>
            <div >{selectedServiceRequest.CategoryName ?? "---"}</div>
          </div>
        </div>
        <div className="col-6" >
          <div className="row mb-1 mt-1">
            <label className="form-text">{t('callcentrecallscutomerdetails_label_modelname')}</label>
            <div >{selectedServiceRequest.ModelName ?? "---"}</div>
          </div>
          <div className="row mb-1 mt-1">
            <label className="form-text">{t('callcentrecallscutomerdetails_label_serialnumber')}</label>
            <div >{selectedServiceRequest.ProductSerialNumber ?? "---"}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AssetDetails