import { useStore } from '../../../../../../../state/storeHooks';
import { useTranslation } from 'react-i18next';

const SLADetails = () => {
  const { t } = useTranslation();

  const { selectedServiceRequest } = useStore(
    ({ callcentreservicerequestdetails }) => callcentreservicerequestdetails);
  return (
    <>
      <div className="row mb-3">
        <div className="col-6" >
          <div className="row mb-1 mt-1">
            <label className="form-text">{t('callcentrecallssladetails_label_responsetimeinhrs')}</label>
            <div >{selectedServiceRequest.ResponseTimeInHours ?? "---"}</div>
          </div>
          <div className="row mb-1 mt-1">
            <label className="form-text">{t('callcentrecallssladetails_label_resolutiontimeinhrs')}</label>
            <div >{selectedServiceRequest.ResolutionTimeInHours ?? "---"}</div>
          </div>
        </div>
        <div className="col-6" >
          <div className="row mb-1 mt-1">
            <label className="form-text">{t('callcentrecallssladetails_label_standbytimeinhrs')}</label>
            <div >{selectedServiceRequest.StandByTimeInHours ?? "---"}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SLADetails