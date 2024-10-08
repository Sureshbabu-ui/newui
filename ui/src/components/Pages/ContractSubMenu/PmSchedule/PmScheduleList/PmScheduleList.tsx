import { useTranslation } from "react-i18next";
import { useStore } from "../../../../../state/storeHooks";
import { store } from '../../../../../state/store';
import { useEffect } from "react";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { checkForPermission } from "../../../../../helpers/permissions";
import { useParams } from "react-router-dom";
import { initializePmSchedulesList, loadPmSchedules } from "./PmScheduleList.slice";
import { pmScheduleDetails, pmScheduleList } from "../../../../../services/pmSchedule";
import { formatDate } from "../../../../../helpers/formats";
import { PmScheduleView } from "../PmScheduleView/PmScheduleView";
import { loadPmScheduleDetails } from "../PmScheduleView/PmScheduleView.slice";

const PmScheduleList = () => {
    const { t, i18n } = useTranslation();
    const { ContractId } = useParams<{ ContractId: string }>();
    const {
        pmschedulelist: { PmSchedules },
    } = useStore(({ pmschedulelist }) => ({ pmschedulelist }));

    useEffect(() => {
        if (checkForPermission("CONTRACT_PMSCHEDULE_VIEW")) {
            onLoad();
        }
    }, []);

    const onLoad = async () => {
        store.dispatch(startPreloader());
        store.dispatch(initializePmSchedulesList());
        try {
            const result = await pmScheduleList(Number(ContractId));
            store.dispatch(loadPmSchedules(result));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader());
    };

    const redirectToViewDetails = async (Id: number) => {
        try {
            const result = await pmScheduleDetails(Id);
            store.dispatch(loadPmScheduleDetails(result));
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            {checkForPermission("CONTRACT_PMSCHEDULE_VIEW") && (PmSchedules.match({
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
                                                PmSchedules.map(({ PmSchedules }, index) => (
                                                    <div className="row m-0 bg-light mb-1 p-2">
                                                        <div className="col-md-3">
                                                            <div className="text-size-12">{t('pmschedule_list_header_th_schedule_number')}</div>
                                                            <div>{PmSchedules.PmScheduleNumber}</div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="text-size-12">{t('pmschedule_list_header_th_pmperiod')}</div>
                                                            <div>{formatDate(PmSchedules.PeriodFrom)} to {formatDate(PmSchedules.PeriodTo)}</div>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <div className="text-size-12">{t('pmschedule_list_header_th_pmduedate')}</div>
                                                            <div>{formatDate(PmSchedules.PmDueDate)}</div>
                                                        </div>
                                                        <div className="col-md-1">
                                                            <div className="text-size-12">{t('pmschedule_list_header_th_asset_count')}</div>
                                                            <div>{PmSchedules.AssetCount}</div>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <div className="text-size-12">{t('pmschedule_list_header_th_status')}</div>
                                                            <div>Pending</div>
                                                        </div>
                                                        <div className="col-md-1">
                                                            <div className="pseudo-href app-primary-color" onClick={() => redirectToViewDetails(PmSchedules.Id)}
                                                                data-bs-toggle='modal' data-bs-target='#ViewPMDetails'>
                                                                <span className="material-symbols-outlined fs-5">
                                                                    visibility
                                                                </span>
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
            }))}
            <PmScheduleView />
        </>
    );
};

export default PmScheduleList;
