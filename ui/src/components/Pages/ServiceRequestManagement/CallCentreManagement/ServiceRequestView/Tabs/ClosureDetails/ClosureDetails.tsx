import { formatDateTime } from '../../../../../../../helpers/formats';
import { useStore } from '../../../../../../../state/storeHooks';
import { useTranslation } from 'react-i18next';

const ClosureDetails = () => {
  const { t } = useTranslation();

  const { selectedServiceRequest } = useStore(
    ({ callcentreservicerequestdetails }) => callcentreservicerequestdetails);
  return (
    <>
      {selectedServiceRequest.ClosedBy ? (
        <div className="row mb-3">
          <div className="col-6" >
            <div className="card-body text-dark">
              <div className="row mb-1 mt-1">
                <label className="form-text">{t('callcentreclosuredetails_label_diagnosis')}</label>
                <div >{selectedServiceRequest.Diagnosis}</div>
              </div>
              <div className="row mb-1 mt-1">
                <label className="form-text">{t('callcentreclosuredetails_label_closureremarks')}</label>
                <div >{selectedServiceRequest.ClosureRemarks ?? "---"}</div>
              </div>
              <div className="row mb-1 mt-1">
                <label className="form-text">{t('callcentreclosuredetails_closedon')}</label>
                <div >{formatDateTime(selectedServiceRequest.ClosedOn)}</div>
              </div>
            </div>
          </div>
          <div className="col-6" >
            <div className="row mb-1 mt-1">
              <label className="form-text">{t('callcentreclosuredetails_label_closedby')}</label>
              <div >{selectedServiceRequest.ClosedBy}</div>
            </div>
            <div className="row mb-1 mt-1">
              <label className="form-text">{t('callcentreclosuredetails_label_hoursspent')}</label>
              <div >{selectedServiceRequest.HoursSpent ?? "---"}</div>
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

export default ClosureDetails