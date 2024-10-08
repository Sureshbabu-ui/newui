import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from "../../../../../state/storeHooks";
import { store } from "../../../../../state/store";
import { getAllPartIndentRequestDetails, reviewPartIndent } from "../../../../../services/partIndent";
import { initializePartIndent, updateErrors } from "../../../Inventory/PartIndentRequest/PartIndentRequestList/PartIndentRequestList.slice";
import { convertBackEndErrorsToValidationErrors, formatDateTime } from "../../../../../helpers/formats";
import { updateField, toggleInformationModalStatus } from "../../../Inventory/PartIndentRequest/PartIndentReview/PartIndentReview.slice";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import SweetAlert from 'react-bootstrap-sweetalert';
import { loadPartIndentDetails } from '../SmeIndentDetail/SmeIndentDetails.slice';

const SmeIndentDetailsView = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const { partindentreview: { smereview, displayInformationModal }, partindentrequestdetailslist: { stockTypeId, reqStatus }, partindentrequestlist: { partAvilability }, smeindentdetailsview: { partIndentGeneralDetailsForSme, requestedPartStatus } } = useStore(({ partindentrequestlist, smeindentdetailsview, partindentrequestdetailslist, partindentreview }) => ({ partindentrequestlist, smeindentdetailsview, partindentrequestdetailslist, partindentreview }));
    const [isOptionSelected, setIsOptionSelected] = useState(false);
    const handleClick = (ev: any, StockTypeId?: any) => {
        store.dispatch(updateField({ name: "StockTypeId", value: StockTypeId }));
        store.dispatch(updateField({ name: "RequestStatus", value: ev.target.value }));
        store.dispatch(updateField({ name: "Id", value: ev.target.name }));
        setIsOptionSelected(true); // Update state to enable submit button
    }
    const onSubmit = async () => {
        store.dispatch(updateErrors({}));
        store.dispatch(startPreloader());
        const result = await reviewPartIndent(smereview);
        result.match({
            ok: () => {
                store.dispatch(toggleInformationModalStatus());
            },
            err: async (e) => {
                const formattedErrors = convertBackEndErrorsToValidationErrors(e);
                store.dispatch(updateErrors(formattedErrors));
            },
        });
        store.dispatch(stopPreloader());
    }

    const redirectTo = async () => {
        store.dispatch(toggleInformationModalStatus());
        document.getElementById('SMEClose')?.click();
        modalRef.current?.click()
    }

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title='Success' onConfirm={redirectTo}>
                {t('partindentreview_success_message')}
            </SweetAlert>
        );
    }

    const onModalClose = async () => {
        store.dispatch(initializePartIndent());
        const PartIndentRequestDetailsList = await getAllPartIndentRequestDetails(1,reqStatus);
        store.dispatch(loadPartIndentDetails(PartIndentRequestDetailsList));
    }

    return (
        <div className="modal fade modal-xl" id="SmeIndentDetailView" data-bs-backdrop='static'
            data-bs-keyboard='false' tabIndex={-1} aria-labelledby="SME" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title ps-2" id="SME">{t("sme_indent_detail_view_partindentdetail")}</h5>
                        <button type="button" className="btn-close me-1" id="SMEClose" data-bs-dismiss="modal" onClick={onModalClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body row">
                        <div className="col-8">
                            <div className="container">
                                <div className="fs-7 mb-1 fw-bold">{t("sme_indent_detail_view_call_details")}</div>
                                <div className="row">
                                    <div className="col-3">
                                        <div className="text-muted small">{t("sme_indent_detail_view_wono")}</div>
                                        <p className="mb-0">{partIndentGeneralDetailsForSme.WorkOrderNumber}</p>
                                    </div>
                                    <div className="col-3">
                                        <div className="text-muted small">{t("sme_indent_detail_view_call_status")}</div>
                                        <p className="mb-0">{partIndentGeneralDetailsForSme.CallStatus}</p>
                                    </div>
                                    <div className="col-3">
                                        <div className="text-muted small fs-7">{t("sme_indent_detail_view_location")}</div>
                                        <p className="mb-0">{partIndentGeneralDetailsForSme.Location}</p>
                                    </div>
                                    <div className="col-3">
                                        <div className="text-muted small">{t("sme_indent_detail_view_indent_no")}</div>
                                        <p className="mb-0">{partIndentGeneralDetailsForSme.IndentRequestNumber}</p>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-3">
                                        <div className="text-muted small">{t("sme_indent_detail_view_requested_engineer")}</div>
                                        <p className="mb-0">{partIndentGeneralDetailsForSme.RequestedBy}</p>
                                    </div>
                                    <div className="col-3">
                                        <div className="text-muted small">{t("sme_indent_detail_view_requested_on")}</div>
                                        <p className="mb-0">{formatDateTime(partIndentGeneralDetailsForSme.CreatedOn)}</p>
                                    </div>
                                    <div className="col-3">
                                        <div className="text-muted small">{t("sme_indent_detail_view_remarks")}</div>
                                        <p className="mb-0">{partIndentGeneralDetailsForSme.Remarks ? partIndentGeneralDetailsForSme.Remarks : "---"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="container mt-4">
                                <div className="fs-6 mb-1 fw-bold">{t("sme_indent_detail_view_asset_details")}</div>
                                <div className="row">
                                    <div className="col-3">
                                        <div className="text-muted small">{t("sme_indent_detail_view_asset_category")}</div>
                                        <p className="mb-0">{partIndentGeneralDetailsForSme.CategoryName}</p>
                                    </div>
                                    <div className="col-3">
                                        <div className="text-muted small">{t("sme_indent_detail_view_make")}</div>
                                        <p className="mb-0">{partIndentGeneralDetailsForSme.Make}</p>
                                    </div>
                                    <div className="col-3">
                                        <div className="text-muted small">{t("sme_indent_detail_view_serial_number")}</div>
                                        <p className="mb-0">{partIndentGeneralDetailsForSme.ProductSerialNumber}</p>
                                    </div>
                                    <div className="col-3">
                                        <div className="text-muted small">{t("sme_indent_detail_view_is_warranty")}</div>
                                        <p className="mb-0">{partIndentGeneralDetailsForSme.IsWarranty ? t("sme_indent_detail_view_is_warranty_yes") : t("sme_indent_detail_view_is_warranty_no")}</p>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-3">
                                        <div className="text-muted small">{t("sme_indent_detail_view_model_name")}</div>
                                        <p className="mb-0">{partIndentGeneralDetailsForSme.ModelName}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="container mt-4">
                                <div className="mb-2 mt-1">
                                    <div className="fs-7 mb-1 fw-bold"><strong>{t('partindent_view_indentaccordiontitle_customerrepissue')}</strong></div>
                                    <div className='row'>
                                        <div className="col-4">
                                            <div className="text-muted small">{t('partindent_view_indentaccordionheader_customerrepissue')}</div>
                                            <div className="mb-1">
                                                {partIndentGeneralDetailsForSme.CustomerReportedIssue}
                                            </div>
                                        </div>

                                        {!partIndentGeneralDetailsForSme.CallcenterRemarks && (
                                            <div className='col-8'>
                                                <div className="text-muted small">{t('partindent_view_indentaccordionheader_callcentreremarks')}</div>
                                                <div className="mb-1">
                                                    {partIndentGeneralDetailsForSme.CallcenterRemarks}---
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="col-4 px-4">
                            <div className="border bg-light fw-bold px-3 py-2">
                                {t("sme_indent_detail_view_part_availability")}
                            </div>
                            {partAvilability.map((eachItem, index) => (
                                <div className="border px-3 py-2 mt-1 d-flex justify-content-between" key={index}>
                                    <span>{eachItem.Location}</span>
                                    <span className='badge text-dark bg-light'>{eachItem.Quantity}</span>
                                </div>
                            ))}
                            <div>
                                {(requestedPartStatus != "PRT_CRTD" && requestedPartStatus != "PRT_HOLD") ?
                                    <div className="border px-3 py-2 mt-3">
                                        <div className='fw-bold'>{t("sme_indent_detail_view_status")}</div>
                                        <p className="small mt-1 ">
                                            {(requestedPartStatus == "PRT_APRV") ?
                                                <div className=''>
                                                    <span className="badge rounded-pill bg-success">{t("sme_indent_detail_view_approved")}</span>
                                                    <div className="d-flex mt-1 align-items-center">
                                                        <small className='text-muted '>{t("sme_indent_detail_view_reviewed_by")}</small>:
                                                        <div className="ms-1">{partIndentGeneralDetailsForSme.ReviewedBy}</div>
                                                    </div>
                                                    <div className="d-flex  mt-1 align-items-center">
                                                        <small className='text-muted'>{t("sme_indent_detail_view_reviewed_on")}</small>:
                                                        <div className="ms-1">{formatDateTime(partIndentGeneralDetailsForSme.ReviewedOn)}</div>
                                                    </div>
                                                </div>
                                                :
                                                <div className=''>
                                                    <span className="badge rounded-pill bg-danger">{t("sme_indent_detail_view_rejected")}</span>
                                                    <div className="d-flex  mt-1 align-items-center">
                                                        <small>{t("sme_indent_detail_view_reviewed_by")}</small>:
                                                        <div className="ms-1">{partIndentGeneralDetailsForSme.ReviewedBy}</div>
                                                    </div>
                                                    <div className="d-flex  mt-1 align-items-center">
                                                        <small>{t("sme_indent_detail_view_reviewed_on")}</small>:
                                                        <div className="ms-1">{formatDateTime(partIndentGeneralDetailsForSme.ReviewedOn)}</div>
                                                    </div>
                                                </div>
                                            }
                                        </p>
                                    </div>
                                    :
                                    <div className="border px-3 pt-2 mt-3">
                                        <div className='fw-bold'>{t("sme_indent_detail_view_lets_take_action")}</div>
                                        <p className="small mt-1 text-muted small">{t("sme_indent_detail_view_review_prompt")}</p>
                                        {requestedPartStatus === "PRT_HOLD"&& <div>
                                            <span className="badge rounded-pill bg-warning">{t("sme_indent_detail_view_onhold")}</span>
                                                    <div className="d-flex  mt-1 align-items-center">
                                                        <small>{t("sme_indent_detail_view_reviewed_by")}</small>:
                                                        <div className="ms-1">{partIndentGeneralDetailsForSme.ReviewedBy}</div>
                                                    </div>
                                                    <div className="d-flex mb-2  mt-1 align-items-center">
                                                        <small>{t("sme_indent_detail_view_reviewed_on")}</small>:
                                                        <div className="ms-1">{formatDateTime(partIndentGeneralDetailsForSme.ReviewedOn)}</div>
                                                    </div>
                                        </div>
                                            }
                                        <div>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name={`${smereview.Id}`}
                                                    id="actionRadio1"
                                                    value='PRT_APRV'
                                                    onChange={(ev) => handleClick(ev, stockTypeId)}
                                                />
                                                <label className="form-check-label" htmlFor="actionRadio1">{t("sme_indent_detail_view_approve")}</label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name={`${smereview.Id}`}
                                                    id="actionRadio2"
                                                    value='PRT_HOLD'
                                                    onChange={(ev) => handleClick(ev)}
                                                    disabled={requestedPartStatus === "PRT_HOLD"}
                                                />
                                                <label className="form-check-label" htmlFor="actionRadio2">{t("sme_indent_detail_view_hold")}</label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name={`${smereview.Id}`}
                                                    id="actionRadio3"
                                                    value='PRT_RJTD'
                                                    onChange={(ev) => handleClick(ev)}
                                                />
                                                <label className="form-check-label" htmlFor="actionRadio3">{t("sme_indent_detail_view_reject")}</label>
                                            </div>
                                            <button
                                                type="button"
                                                className="btn app-primary-bg-color text-white mt-2"
                                                disabled={!isOptionSelected}
                                                onClick={onSubmit}
                                            >
                                                {t("sme_indent_detail_view_submit")}
                                            </button>
                                        </div>
                                        {displayInformationModal ? <InformationModal /> : ""}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmeIndentDetailsView;
