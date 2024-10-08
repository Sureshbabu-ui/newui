import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../../../state/storeHooks";
import SweetAlert from "react-bootstrap-sweetalert";
import { store } from "../../../../../state/store";
import { checkForPermission } from "../../../../../helpers/permissions";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { PartIndentReviewState, initializePartIndentReview, toggleInformationModalStatus, updateField } from "./PartIndentReview.slice";
import { initializePartIndent, loadPartAvailbilityDetail, loadPartIndentDetail, updateErrors } from "../PartIndentRequestList/PartIndentRequestList.slice";
import { convertBackEndErrorsToValidationErrors } from "../../../../../helpers/formats";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { getSelectedPartRequestDetails, partRequestStockAvialability, reviewPartIndent } from "../../../../../services/partIndent";
import { useParams } from "react-router-dom";

export const PartIndentReview = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const { RequestId } = useParams<{ RequestId: string }>();
    const {
        partindentreview: { smereview, displayInformationModal, errors },
    } = useStore(({ partindentreview }) => ({ partindentreview }));

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof PartIndentReviewState['smereview'], value }));
    }

    const updatePartIndentList = async () => {
        try {
            const { PartRequestInfo, SelectedPartIndentInfo } = await getSelectedPartRequestDetails(Number(RequestId));
            store.dispatch(loadPartIndentDetail({ PartIndentDetail: PartRequestInfo, selectedPartdetails: SelectedPartIndentInfo }))
            const { PartRequestAvailability, PartRequestLocationWiseAvailability } = await partRequestStockAvialability(store.getState().partindentrequestlist?.partAvailabilityStatus);
            store.dispatch(loadPartAvailbilityDetail({ partAvilability: PartRequestAvailability, partLocationWiseAvilability: PartRequestLocationWiseAvailability }))
        } catch (error) {
            console.log(error)
        }
        store.dispatch(toggleInformationModalStatus());
        modalRef.current?.click()
    }

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title='Success' onConfirm={updatePartIndentList}>
                {t('partindentreview_success_message')}
            </SweetAlert>
        );
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
                const formattedErrors = convertBackEndErrorsToValidationErrors(e)
                store.dispatch(updateErrors(formattedErrors))
            },
        });
        store.dispatch(stopPreloader())
    }

    const onModalClose = () => {
        store.dispatch(initializePartIndentReview())
    }

    return (
        <>
            <div
                className="modal fade"
                id='ReviewPartIndent'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{smereview.RequestStatus == 'PRT_APRV' ? t('partindentreview_title_approve') : smereview.RequestStatus == 'PRT_RJTD' ? t('partindentreview_title_reject') : smereview.RequestStatus == 'PRT_HOLD' && t('partindentreview_title_hold')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeReviewPartIndentModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        {checkForPermission("PARTINDENT_APPROVAL") &&
                            <div className="modal-body">
                                <div className="container-fluid">
                                    <ValidationErrorComp errors={errors} />
                                    <div className=''>
                                        <div className='row mb-1'>
                                            <div className='col-md-12'>
                                                <label className="">{t('partindentreview_comment')}</label>
                                                <textarea name='ReviewerComments'
                                                    onChange={onUpdateField}
                                                    value={smereview.ReviewerComments}
                                                    className="form-control"
                                                ></textarea>
                                            </div>

                                            <div className="col-md-12 mt-2">
                                                <button type='button' className='btn  app-primary-bg-color text-white mt-2'
                                                    onClick={onSubmit}
                                                >
                                                    {smereview.RequestStatus == 'PRT_APRV' ? t('partindentreview_btn_approve') : smereview.RequestStatus == 'PRT_RJTD' ? t('partindentreview_btn_reject') : smereview.RequestStatus == 'PRT_HOLD' && t('partindentreview_btn_hold')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {displayInformationModal ? <InformationModal /> : ""}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}