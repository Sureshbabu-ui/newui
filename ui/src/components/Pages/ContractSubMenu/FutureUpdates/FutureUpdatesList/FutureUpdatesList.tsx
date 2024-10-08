import { useTranslation } from "react-i18next";
import { useStore } from "../../../../../state/storeHooks";
import { store } from '../../../../../state/store';
import { useEffect, useState } from "react";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { initializeFutureUpdatesList, loadFutureUpdates, setSearch, setVisibleModal } from "./FutureUpdateList.slice";
import { deleteFutureUpdate, getFutureUpdateList } from "../../../../../services/futureUpdates";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { formatDate, formatDateTime } from "../../../../../helpers/formats";
import { checkForPermission } from "../../../../../helpers/permissions";
import FutureUpdateCreate from "../FutureUpdateCreate/FutureUpdateCreate";
import FeatherIcon from 'feather-icons-react';
import { FutureUpdateEdit } from "../../../../../types/futureupdates";
import { loadFutureUpdateEditDetails } from "../FutureUpdateEdit/FutureUpdateEdit.slice";
import FutureUpdatesEdit from "../FutureUpdateEdit/FutureUpdateEdit";
import { useParams } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import toast, { Toaster } from 'react-hot-toast';

const FutureUpdatesList = () => {
    const { t, i18n } = useTranslation();
    const { ContractId } = useParams<{ ContractId: string }>();
    const {
        futureupddatelist: { futureupdates, search },
    } = useStore(({ futureupddatelist, app }) => ({ futureupddatelist, app }));

    useEffect(() => {
        if (checkForPermission("CONTRACT_FUTUREUPDATES_VIEW")) {
            onLoad();
        }
    }, []);

    const onLoad = async () => {
        store.dispatch(startPreloader());
        store.dispatch(initializeFutureUpdatesList());
        try {
            const FutureUpdates = await getFutureUpdateList(Number(ContractId), store.getState().futureupddatelist.search);
            store.dispatch(loadFutureUpdates(FutureUpdates));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader());
    };

    async function filterFutureUpdateList(e) {
        const result = await getFutureUpdateList(Number(ContractId), store.getState().futureupddatelist.search);
        store.dispatch(loadFutureUpdates(result));
    }

    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value === "") {
            const result = await getFutureUpdateList(Number(ContractId), store.getState().futureupddatelist.search);
            store.dispatch(loadFutureUpdates(result));
        }
    };

    const loadClickedFutureUpdateDetails = (FutureUpdateDetails: FutureUpdateEdit) => {
        store.dispatch(setVisibleModal("EditFutureUpdates"))
        store.dispatch(loadFutureUpdateEditDetails(FutureUpdateDetails));
    };

    const [Id, setId] = useState(0);

    const handleConfirm = (Id: number) => {
        setId(Id);
    };

    const handleCancel = () => {
        setId(0);
    };

    function DeleteConfirmationModal() {
        return (
            <SweetAlert
                danger
                showCancel
                confirmBtnText={t('future_update_delete_confirm_btn')}
                confirmBtnBsStyle="danger"
                title={t('future_update_delete_title')}
                onConfirm={() => handleDelete(Id)}
                onCancel={handleCancel}
                focusCancelBtn
            >
                {t('future_update_delete_question')}
            </SweetAlert>
        );
    }

    async function handleDelete(Id: number) {
        const result = await deleteFutureUpdate(Id);
        result.match({
            ok: () => {
                setId(0);
                toast(i18n.t('future_update_message_success_delete'), {
                    duration: 3000,
                    style: {
                        borderRadius: '0',
                        background: '#00D26A',
                        color: '#fff',
                    },
                });
                onLoad();
            },
            err: (err) => {
                toast(i18n.t(err.Message), {
                    duration: 3600,
                    style: {
                        borderRadius: '0',
                        background: '#F92F60',
                        color: '#fff',
                    },
                });
                setId(0);
            },
        });
    }
    return (
        <>
            {checkForPermission("CONTRACT_FUTUREUPDATES_VIEW") && (futureupdates.match({
                none: () => (
                    <div className="m-2">
                        <ContainerPage>
                            <div className="my-2">{t('future_update_info_list')}</div>
                        </ContainerPage>
                    </div>
                ),
                some: (futureupdates) => (
                    <div className="row mt-1 mb-3 p-0">
                        {checkForPermission("CONTRACT_FUTUREUPDATES_MANAGE") &&
                            <div className="col-md-/6 ">
                                <button onClick={() => store.dispatch(setVisibleModal("CreateFutureUpdate"))} className="btn app-primary-bg-color text-white float-end " data-bs-toggle='modal' data-bs-target='#CreateFutureUpdate'>
                                    {t('future_update_create_button')}
                                </button>
                            </div>
                        }
                        <div>
                            <div className="mb-3 ps-1 mt-5">
                                <div className="input-group">
                                    <input
                                        type="search"
                                        className="form-control custom-input"
                                        value={search || ""}
                                        placeholder={`${t('future_update_list_select_state_placeholder')}`}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                filterFutureUpdateList(e);
                                            }
                                        }}
                                        onChange={addData}
                                    />
                                    <button
                                        className="btn app-primary-bg-color text-white float-end"
                                        type="button"
                                        onClick={filterFutureUpdateList}>
                                        {t('future_update_search_button')}
                                    </button>
                                </div>
                            </div>
                            <div className="row mt-3 ps-2">
                                {futureupdates.length > 0 ? (
                                    <div className="ps-2 pe-1">
                                        {
                                            futureupdates.map((futureupdate) => (
                                                <div className="row bg-light p-2 mb-1" key={futureupdate.futureUpdates.Id}>
                                                    <div className="col-md-2">
                                                        <div className="text-muted text-size-11">{t('future_update_contract_number')}</div>
                                                        <div>{futureupdate.futureUpdates.ContractNumber}</div>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <div className="text-muted text-size-11">{t('future_update_renewed_merged_contract_number')}</div>
                                                        <div>{futureupdate.futureUpdates.RenewedMergedContractNumber}</div>
                                                    </div>
                                                    <div className="col-md-1">
                                                        <div className="text-muted text-size-11">{t('future_update_serial_number')}</div>
                                                        <div>{futureupdate.futureUpdates.SerialNumber}</div>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <div className="text-muted text-size-11">{t('future_update_status')}</div>
                                                        <div>{futureupdate.futureUpdates.ContractFutureUpdateStatus}</div>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <div className="text-muted text-size-11">{t('future_update_substatus')}</div>
                                                        <div>{futureupdate.futureUpdates.ContractFutureUpdateSubStatus}</div>
                                                    </div>
                                                    <div className="col-md-1">
                                                        <div className="text-muted text-size-11">{t('future_update_probability_percentage')}</div>
                                                        <div>{futureupdate.futureUpdates.ProbabilityPercentage}</div>
                                                    </div>
                                                    <div className="col-md-1">
                                                        <div className="text-muted text-size-11">{t('future_update_target_date')}</div>
                                                        <div>{formatDate(futureupdate.futureUpdates.TargetDate)}</div>
                                                    </div>
                                                    <div className="col-md-1">
                                                        <div>
                                                            {checkForPermission("CONTRACT_FUTUREUPDATES_MANAGE") &&
                                                                <>
                                                                    <span
                                                                        className="pseudo-href app-primary-color ms-3"
                                                                        onClick={() => loadClickedFutureUpdateDetails({
                                                                            Id: futureupdate.futureUpdates.Id,
                                                                            StatusId: futureupdate.futureUpdates.StatusId,
                                                                            SubStatusId: futureupdate.futureUpdates.SubStatusId,
                                                                            ProbabilityPercentage: futureupdate.futureUpdates.ProbabilityPercentage,
                                                                            TargetDate: futureupdate.futureUpdates.TargetDate
                                                                        })}
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target='#EditFutureUpdates'
                                                                    >
                                                                        <FeatherIcon icon={"edit"} size="16" />
                                                                    </span>
                                                                    <span
                                                                        className="pseudo-href app-primary-color ms-3"
                                                                        onClick={() => handleConfirm(futureupdate.futureUpdates.Id)}>
                                                                        <FeatherIcon icon={"trash"} size="16" />
                                                                    </span>
                                                                </>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                ) : (
                                    <div className="text-muted ps-3">{t('future_update_no_data')}</div>
                                )}
                            </div>
                        </div>
                        <FutureUpdateCreate />
                        <FutureUpdatesEdit />
                        {Id ? <DeleteConfirmationModal /> : ""}
                        <Toaster />
                    </div>
                ),
            }))}
        </>
    );
};

export default FutureUpdatesList;
