import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { useStoreWithInitializer } from '../../../../state/storeHooks';
import { useTranslation } from 'react-i18next';
import { store } from '../../../../state/store';
import { loadReviewDetails } from './ContractReviewHistory.slice';
import { formatDateTime } from '../../../../helpers/formats';

const ContractReviewHistory = () => {
  const { t } = useTranslation();
  const onLoad = async () => {
    try {
      const reviewComment = store.getState().generalcontractdetails.singlecontract.ReviewComment;
      if (reviewComment) {
        const parsedReviewComment = JSON.parse(reviewComment || "");
        store.dispatch(loadReviewDetails(parsedReviewComment));
      }
    } catch (error) {
      console.log(error);
    }
  }
  const { ReviewedJsonDetails } = useStoreWithInitializer(
    ({ contractreviewhistory }) => contractreviewhistory, onLoad);

  const statusCodes = [
    { name: "Approved", value: "CTS_APRV" },
    { name: "Rejected", value: "CTS_RJTD" },
    { name: "Request Change", value: "CTS_PGRS" }
  ];
  return (
    <ContainerPage>
      <>
        {
          ReviewedJsonDetails[0].CreatedOn != null ? (
            <>
              {/* title */}
              <label className='mt-2 fw-bold'>
                {t('contract_review_history_title')}
              </label>
              {/* title ends */}
              <div className="mt-2">
                <table className="table contract-documents">
                  <tbody>
                    {ReviewedJsonDetails.map((field, index) => (
                      <tr className="mt-2">
                        <td>
                          <div>{field.ReviewComment}</div>
                          <div><small> <span className='text-muted'>{`${field.ReviewedBy} `}</span></small></div>
                          <div><small className="text-muted">{statusCodes.find((status) => status.value == field.ReviewStatus)?.name ?? "Submit For Review"}</small></div>
                          <div><small className="text-muted">{formatDateTime(field.CreatedOn)}</small></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className='mt-2'>{t('contract_review_history_no_history_found')}</div>
          )
        }
      </>
    </ContainerPage >
  )
}

export default ContractReviewHistory 