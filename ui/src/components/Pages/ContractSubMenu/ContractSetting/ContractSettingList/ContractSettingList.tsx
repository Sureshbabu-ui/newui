import { useTranslation } from "react-i18next";
import { CallStatusUpdate } from "../CallStopUpdate/CallStatusUpdate"
import { checkForPermission } from "../../../../../helpers/permissions";
import { Link, useParams } from "react-router-dom";
import { useStoreWithInitializer } from "../../../../../state/storeHooks";
import { getClickedContractDetails } from "../../../../../services/contracts";
import { store } from "../../../../../state/store";
import { loadContracts } from "./ContractSettingList.slice";
import { ContractClose } from "../ContractClose/ContractClose";
import { loadCallStophistory, toggleUpdate } from "../CallStopUpdate/CallStatusUpdate.slice";
import { getCallStopHistory } from "../../../../../services/contractSetting";
import { formatDate } from "../../../../../helpers/formats";
import { CallExpiryExtend } from "../CallExpiryExtend/CallExpiryExtend";
const ContractSettingList = () => {
    const { t } = useTranslation();
    const { ContractId } = useParams<{ ContractId: string }>();
    
    const loadContractDetails = async () => {
        try {
            const { CallStopHistoryDetails } = await getCallStopHistory(ContractId)
            store.dispatch(loadCallStophistory(CallStopHistoryDetails))
        } catch (error) {
            console.log(error);
        }
    }
    const CALL_STOP_REASONS = "CALL_STOP_REASONS"
    const CALL_STATS_UPDATE = "CALL_STATUS_UPDATE"
    const { callStatusDetails } = store.getState().callstopsetting
    const { contractsettinglist: { singlecontract }, callexpiryextend: { contractExpiryDetail } } = useStoreWithInitializer(({ contractsettinglist, callexpiryextend }) => ({ contractsettinglist, callexpiryextend }), loadContractDetails);
    const IsRenewable = singlecontract && !singlecontract.RenewContractId && new Date(String(singlecontract.EndDate)) < new Date(new Date().setDate(new Date().getDate() + Number(process.env.REACT_APP_CONTRACT_RENEW_DAYSDIFF))) && checkForPermission("CONTRACT_RENEW")

    const callStopHistoryDetails = async () => {
        store.dispatch(toggleUpdate(CALL_STOP_REASONS))
    }

    return <>
        <div className="row m-0">
            <div className="d-flex justify-content-between ps-0 pe-0  ms-0 mt-2">
                {checkForPermission("CONTRACT_CREATE") &&
                    <div className="col-md-7 ">
                        <h4 className=" pt-1 ms-0 app-primary-color">{t('contractsetting_title')}</h4>
                    </div>
                }
            </div>
            {/* call stop date management */}
            <div className="col-md-6 me-2 p-3 ms-1 bg-light">
                <div className="row">
                    <div className="col-md-9">
                        <div className="text-muted mb-1"><small>{t('contractsetting_title_callstop_date')}</small></div>
                        <div className="fs-6 fw-bold app-primary-color">{callStatusDetails.CallStopDate ? formatDate(callStatusDetails.CallStopDate) : "---"}</div>
                    </div>
                    <div data-bs-toggle="modal" data-bs-target="#CallStatusUpdate" className="col-md-3 text-center" onClick={() => store.dispatch(toggleUpdate(CALL_STATS_UPDATE))} role="button">
                        <div><span className={`border border-light bg-light shadow-sm fs-1 material-symbols-outlined  ${callStatusDetails.CallStopDate ? "text-success" : "text-danger"}`}>{callStatusDetails.CallStopDate ? "play_arrow" : "pause"}</span></div>
                        <div><small>{callStatusDetails.CallStopDate ? "Start Calls" : "Stop Calls"}</small></div>
                    </div>
                </div>
                <div className="mt-2">
                    {callStatusDetails.CallStopReason && (
                        <>
                            <div className="d-flex align-items-center">
                                <div className="text-muted"><small>{t('contractsetting_title_callstop_reason')}</small></div>
                                {store.getState().callstopsetting.callStopHistory.length > 0 && (
                                    <span className="material-symbols-outlined ms-2 app-primary-color" role="button" data-bs-toggle="modal" data-bs-target="#CallStatusUpdate" onClick={() => callStopHistoryDetails()}>
                                        {t('contractsetting_title_icon_history')}
                                    </span>
                                )}
                            </div>
                            <div><small>{callStatusDetails.CallStopReason}</small></div>
                        </>
                    )}
                    {store.getState().callstopsetting.callStopHistory.length > 0 && (
                        <a data-bs-toggle="modal" data-bs-target="#CallStatusUpdate" href="" onClick={() => callStopHistoryDetails()}>View History</a>
                    )}
                </div>
            </div>
            {/* call stop date management ends */}

            {/* call expiry date management */}
            <div className="col-md-5 me-2 p-3 bg-light">
                <div className="row">
                    <div className="col-md-9">
                        <div className="text-muted mb-1"><small>{t('contractsetting_title_contract_enddate')}</small></div>
                        <div className="fs-6 fw-bold app-primary-color">{contractExpiryDetail.EndDate ? formatDate(contractExpiryDetail.EndDate) : "---"}</div>
                    </div>
                    <div className="col-md-3">
                        <div className="text-muted mb-1"><small>{t('contractsetting_title_call_expirydate')}</small></div>
                        <div className="fs-6 fw-bold app-primary-color">{contractExpiryDetail.CallExpiryDate ? formatDate(contractExpiryDetail.CallExpiryDate) : "---"}</div>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-md-6">
                        <div className="text-muted mb-1"><small>{t('contractsetting_title_additional_days')}</small></div>
                        <div className="fs-6 fw-bold app-primary-color">{contractExpiryDetail.AdditionalDays ?? 0} Days</div>
                    </div>
                    <div className="col-md-6">
                        <button className="btn app-primary-bg-color text-white float-end mt-2 btn-sm" data-bs-toggle="modal" data-bs-target="#CallExpiryExtend">{t('contractsetting_title_extendexpiry_date')}</button>
                    </div>
                </div>
            </div>
            {/* call expiry date management ends */}

            {/* contract renewal management */}
           
                {IsRenewable && (
                    <div className="col-md-6 mt-2 row me-1 ms-1 p-3  bg-light">
                            <div className="app-primary-color fw-bold mb-2"><small>{t('contractsetting_title_wanttorenew')}</small></div>
                            <div><small>{t('contractsetting_title_clickonthe')}<strong className="app-primary-color">{t('contractsetting_title_renewcontract')}</strong>{t('contractsetting_title_renew_description')}</small></div>
                            <div className="mt-2">
                                <Link to={`/contracts/renew/${ContractId}`}>
                                    <button type="button" className="btn border-0 btn-primary app-primary-bg-color btn-sm">{t('contractsetting_btn_renew')}</button>
                                </Link>
                            </div>                       
                    </div>
                )}
                {/* contract renewal management ends */}

                {/* Contract Close management */}
                {store.getState().contractview.contractStatus != 'CTS_CLSD' && (
                    <div className={`col-md-5 row ${IsRenewable ? 'CTS_EXPR' : 'CTS_CLSD'} mt-2 p-3 mb-1 ms-1 bg-light`}>
                        {checkForPermission("CONTRACT_CREATE") &&
                            <div >
                                <ContractClose />
                            </div>
                        }
                    </div>
                )}
            {/* contract close management ends */}
        </div >
        <CallStatusUpdate />
        <CallExpiryExtend />
    </>
}

export default ContractSettingList 