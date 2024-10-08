import { useTranslation } from "react-i18next";
import { formatDateTime } from "../../helpers/formats";
import { ApprovalRequestReviewListDetail } from "../../types/pendingApproval";

export function ApprovalRequestReviewList({ ReviewList }: { ReviewList: ApprovalRequestReviewListDetail[] }) {
    const { t } = useTranslation();

    return (
        <div>
            <label className='app-primary-color'><strong>{t('approvalrequestreview_label_reviewcomment')}</strong></label>
            {ReviewList.map((Review, index) => {
                return <div className="mb-2" key={index}>
                    <p className="mb-0 fw-bold">{Review.ReviewStatusName}</p>
                    <div> {Review.ReviewComment ?? "No Comment"}</div>
                    <small><span className="me-3">{Review.ReviewedBy}</span><span>{formatDateTime(Review.ReviewedOn)}</span></small>
                </div>
            }
            )}
        </div>
    );
}
