import { useTranslation } from "react-i18next";
import { store } from "../../../../../state/store";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { initializePmScheduleDetails } from "./PmScheduleView.slice";
import { useStoreWithInitializer } from "../../../../../state/storeHooks";
import { formatDate } from "../../../../../helpers/formats";
import { checkForPermission } from "../../../../../helpers/permissions";

export const PmScheduleView = () => {
    const { t } = useTranslation();
    const { PmScheduleDetails } = useStoreWithInitializer(
        ({ pmscheduledetails }) => (pmscheduledetails), initializePmScheduleDetails)

    return (
        <div
            className="modal fade"
            id='ViewPMDetails'
            data-bs-backdrop='static'
            data-bs-keyboard='false'
            aria-hidden='true'
        >
            <div className="modal-dialog modal-fullscreen">
                <div className="modal-content">
                    <div className="modal-header mx-2">
                        <h5 className="modal-title app-primary-color">{t('pmschedule_details_header_schedule_detail')}</h5>
                        <button
                            type='button'
                            className="btn-close"
                            data-bs-dismiss='modal'
                            id='closePMDetails'
                            aria-label='Close'
                            onClick={onModalClose}
                        ></button>
                    </div>
                    <div className="modal-body pt-0">
                        {checkForPermission("CONTRACT_PMSCHEDULE_VIEW") && (PmScheduleDetails.match({
                            none: () => (
                                <div className="m-2">
                                    <ContainerPage>
                                        <div className="my-2">{t('pmschedule_list')}</div>
                                    </ContainerPage>
                                </div>
                            ),
                            some: (PmSchedules) => (
                                <div className="row mt-1 mb-3 p-0">
                                    <div>
                                        <div className="row mt-3 ps-2">
                                            {PmSchedules.length > 0 ? (
                                                <div className='table-responsive overflow-auto'>
                                                    <div className="">
                                                        {
                                                            PmSchedules.map(({ PmScheduleDetails }, index) => (
                                                                <div className="row m-0 bg-light mb-1 p-2" key={index}>
                                                                    <div className="row m-0 bg-light mb-1 p-2">
                                                                        <div className="col-md-3">
                                                                            <div className="text-size-12">{t('pmschedule_details_label_schedule_number')}</div>
                                                                            <div>{PmScheduleDetails.PmScheduleNumber}</div>
                                                                        </div>
                                                                        <div className="col-md-3">
                                                                            <div className="text-size-12">{t('pmschedule_details_label_serialnumber')}</div>
                                                                            <div>{PmScheduleDetails.ProductSerialNumber}</div>
                                                                        </div>
                                                                        <div className="col-md-3">
                                                                            <div className="text-size-12">{t('pmschedule_details_label_pmnote')}</div>
                                                                            <div>{PmScheduleDetails.PmNote ?? "---"}</div>
                                                                        </div>
                                                                        <div className="col-md-3">
                                                                            <div className="text-size-12">{t('pmschedule_details_label_pmdate')}</div>
                                                                            <div>{formatDate(PmScheduleDetails.PmDate) ?? "---"}</div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row m-0 bg-light mb-1 p-2">
                                                                        <div className="col-md-3">
                                                                            <div className="text-size-12">{t('pmschedule_details_label_pmengineer')}</div>
                                                                            <div>{PmScheduleDetails.PmEngineer}</div>
                                                                        </div>
                                                                        <div className="col-md-3">
                                                                            <div className="text-size-12">{t('pmschedule_details_label_pmvendorbranch')}</div>
                                                                            <div>{PmScheduleDetails.PmVendorBranch ?? "---"}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-muted">{t('pmschedule_no_manpower_data_found')}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ),
                        }))}                    </div>
                </div>
            </div>
        </div>
    )
}

const onModalClose = () => {
    store.dispatch(initializePmScheduleDetails())
}