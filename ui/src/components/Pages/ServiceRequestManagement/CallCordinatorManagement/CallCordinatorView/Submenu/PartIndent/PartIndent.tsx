import { store } from '../../../../../../../state/store';
import { ContainerPage } from '../../../../../../ContainerPage/ContainerPage';
import { useStoreWithInitializer } from '../../../../../../../state/storeHooks';
import { useTranslation } from 'react-i18next';
import { getClickedPartRequestDetails, partIndentList } from '../../../../../../../services/partIndent';
import { initializePartIndent, loadPartIndent, loadPartIndentDetail } from './PartIndent.slice';
import { formatDateTime } from '../../../../../../../helpers/formats';
import { PartIndentDetails } from '../../../../../../../types/partIndent';
import { checkForPermission } from '../../../../../../../helpers/permissions';

const PartIndentList = () => {
    const { t } = useTranslation();
    const ServiceRequestId = store.getState().callcordinatormanagement.serviceRequestId

    const onLoad = async () => {
        store.dispatch(initializePartIndent());
        if (ServiceRequestId) {
            try {
                const result = await partIndentList(ServiceRequestId);
                store.dispatch(loadPartIndent(result));
            } catch (error) {
                console.error(error);
            }
        }
    }

    const { partindent, partIndentDetails } = useStoreWithInitializer(
        ({ partindentlist }) => partindentlist, onLoad
    );

    const loadSelectedRequestDetail = (Id: number) => {
        return async () => {
            if (!partIndentDetails.find(request => request.Id == Id)) {
                const PartRequestInfo = await getClickedPartRequestDetails(Id);
                store.dispatch(loadPartIndentDetail({ Id: Id, Details: PartRequestInfo }))
            }
        }
    }

    const getSelectedRequestDetail = (Id: number): PartIndentDetails[] | undefined => {
        const selectedRequestDetail = partIndentDetails.find(request => request.Id === Id);
        return selectedRequestDetail?.Details;
    };

    return (
        <ContainerPage>
            {checkForPermission('SERVICE_REQUEST_DETAILS') ? <div className="px-0">
                {partindent.match({
                    none: () => <>{t('partindent_list_th_loading')}</>,
                    some: (partindent) => (
                        <div className="row mt-1 ps-0">
                            {partindent.length > 0 ? (
                                <div className="">
                                    <div className="accordion accordion-flush" id="part-indent-orders">
                                        {partindent.map((field, index) => (
                                            <div className="accordion-item mb-1" key={index}>
                                                <div className="accordion-header">
                                                    <div className="accordion-button p-2 bg-light collapsed row m-0" role="button" onClick={loadSelectedRequestDetail(field.partindent.Id)} data-bs-toggle="collapse" data-bs-target={`#flush-${index}`} aria-expanded="false" aria-controls="flush-collapseOne">
                                                        {/* indent number */}
                                                        <div className="col-md-3 ps-0">
                                                            <div className="text-muted text-size-11">{t('partindent_label_indentnum')}</div>
                                                            <div className="text-size-12 fw-normal">{field.partindent.IndentRequestNumber}</div>
                                                        </div>
                                                        {/* indent request date */}
                                                        <div className="col-md-2">
                                                            <div className="text-muted text-size-11">{t('partindent_label_requestdate')}</div>
                                                            <div className="text-size-12 fw-normal">{formatDateTime(field.partindent.CreatedOn)}</div>
                                                        </div>
                                                        {/* service engineer */}
                                                        <div className="col-md-4">
                                                            <div className="text-muted text-size-11">{t('partindent_label_engname')}</div>
                                                            <div className="text-size-12 fw-normal">{field.partindent.RequestedBy}</div>
                                                        </div>
                                                        {/* parts count */}
                                                        <div className="col-md-2">
                                                            <div className="text-muted text-size-11">{t('partindent_label_parts')}</div>
                                                            <div className="text-size-12 fw-normal">
                                                                <span className="badge text-bg-secondary me-1" data-bs-toggle="Total" data-bs-placement="top" title="Tooltip on top">{field.partindent.CreatedRequestCount}</span>
                                                                <span className="badge text-bg-success me-1" data-bs-toggle="Approved" data-bs-placement="top" title="Approved">{field.partindent.ApprovedRequestCount}</span>
                                                                <span className="badge text-bg-danger me-1" data-bs-toggle="Rejected" data-bs-placement="top" title="Rejected">{field.partindent.RejectedRequestCount}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div id={`flush-${index}`} className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                                    <div className="accordion-body bg-white">
                                                        <div key={index}>
                                                            <div>
                                                                {getSelectedRequestDetail(field.partindent.Id)?.map((detail, index) => {
                                                                    return (
                                                                        <div className="row m-0 mb-3" key={index}>
                                                                            <div className="col-md-1 px-0 py-1 text-start">
                                                                                <div className="p-1 bg-light">&nbsp;</div>
                                                                            </div>
                                                                            <div className="col-md-9">
                                                                                <div className="small">
                                                                                    <span className="me-2"><small><span className="fw-bold">{t('partindent_header_hsncode')}: </span>{detail.HsnCode}</small></span>
                                                                                    <span className="me-2"><small><span className="fw-bold">{t('partindent_header_partcode')}: </span>{detail.PartCode}</small></span>
                                                                                    <span className="me-2"><small><span className="fw-bold">{t('partindent_header_oemnum')}: </span>{detail.OemPartNumber}</small></span>
                                                                                </div>
                                                                                <div><small className="small fw-bold">{detail.PartName} </small></div>
                                                                                <div>
                                                                                    <small className="me-1">{detail.ProductCategoryName}</small>
                                                                                    <small className="me-1 text-secondary">&#9679;</small>
                                                                                    <small className="me-1">{detail.PartCategoryName}</small>
                                                                                    <small className="me-1 text-secondary">&#9679;</small>
                                                                                    <small>{detail.MakeName}</small>
                                                                                </div>
                                                                                <div>
                                                                                    <small className="me-1"><span className="fw-bold">{t('partindent_header_quantity')} : </span> {detail.Quantity}</small>
                                                                                    <small className="me-1 text-secondary">&#9679;</small>
                                                                                    <small className="me-1"><span className="fw-bold">{t('partindent_header_parttype')}</span>{detail.StockType}</small>
                                                                                    <small className="me-1 text-secondary">&#9679;</small>
                                                                                    <small className="me-1"><span className="fw-bold">{t('partindent_header_warranty_replacement')}</span>{detail.IsWarrantyReplacement == true ? 'Available' : 'Not Available'}</small>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-muted small">{detail.Remarks}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-2 pe-0">
                                                                                <>
                                                                                    <span className="small" ><small>{detail.PartRequestStatus}</small></span>
                                                                                </>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-muted mt-1">{t('partindentlist_th_norecords')}</div>
                            )}
                        </div>
                    ),
                })}
            </div> :
                <></>}
        </ContainerPage>
    );
}

export default PartIndentList