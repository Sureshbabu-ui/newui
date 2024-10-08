import { useStore } from '../../../../../../../state/storeHooks';
import { useTranslation } from 'react-i18next';

const InterimCallInfo = () => {
    const { t } = useTranslation();

    const { selectedServiceRequest } = useStore(
        ({ callcentreservicerequestdetails }) => callcentreservicerequestdetails);

    return (
        <>
            {selectedServiceRequest.InterimStatus ? (
                <div className="row mb-3">
                    <div className="col-6" >
                        <div className="row mb-1 mt-1">
                            <label className="form-text">{t('callcentreinterimdetails_label_interimstatus')}</label>
                            <div >{selectedServiceRequest.InterimStatus}</div>
                        </div>
                        <div className="row mb-1 mt-1">
                            <label className="form-text">{t('callcentreinterimdetails_label_interimreviewedon')}</label>
                            <div >{selectedServiceRequest.InterimReviewedOn ?? "---"}</div>
                        </div>
                    </div>
                    <div className="col-6" >
                        <div className="row mb-1 mt-1">
                            <label className="form-text">{t('callcentrecalldetails_label_interimreviewremarks')}</label>
                            <div >{selectedServiceRequest.InterimReviewRemarks ?? "---"}</div>
                        </div>
                        <div className="row mb-1 mt-1">
                            <label className="form-text">{t('callcentreinterimdetails_label_interimreviewedby')}</label>
                            <div >{selectedServiceRequest.ReviewedBy ?? "---"}</div>
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

export default InterimCallInfo