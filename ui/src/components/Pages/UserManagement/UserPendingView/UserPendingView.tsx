import { store } from '../../../../state/store';
import { useStore } from '../../../../state/storeHooks';
import { useTranslation } from 'react-i18next';
import { formatDateTime } from '../../../../helpers/formats';
import { useEffect, useState } from 'react';
import {  initializeUserPendingDetails, loadSelectedApproval, setSelectedIdForPendingView} from './UserPendingView.slice';
import SweetAlert from 'react-bootstrap-sweetalert';
import { deleteUserApprovalRequest, getUserPendingDetails, getUserPendingList } from '../../../../services/users';
import { ApprovalRequestReviewList } from '../../../ApprovalRequestReviewList/ApprovalRequestReviewList';
import { loadPendingUsers } from '../UserPendingList/UserPendingList.slice';
import toast, { Toaster } from 'react-hot-toast';

export const UserPendingRequestView = () => {
    const { t, i18n } = useTranslation();
    const { userpendingrequestview: { selectedApprovals, SelectedId, ReviewDetails } } = useStore(({ userpendingrequestview }) => ({ userpendingrequestview }));

    useEffect(() => {
        onLoad()
    }, [SelectedId])

    const onLoad = async () => {
        if (Number(SelectedId) > 0) {
            try {

                const result = await getUserPendingDetails(SelectedId ?? 0)
                store.dispatch(loadSelectedApproval(result));
            } catch (error) {
                console.log(error);
            }
        }
    }

    const [Id, setId] = useState<number|null>(null);

    const handleConfirm = (Id: number) => {
        setId(Id);
    };

    const handleCancel = () => {
        setId(null);
    };

    function ConfirmationModal() {
        return (
            <SweetAlert
                warning
                showCancel
                confirmBtnText={t('customer_pending_delete_confirm_btn')}
                confirmBtnBsStyle="warning"
                title={t('customer_delete_conformation_text1')}
                onConfirm={() => deleteApprovalRequest(Id)}
                onCancel={handleCancel}
                focusCancelBtn
            >
                {t('customer_pending_delete_question')}
            </SweetAlert>
        );
    }

    async function deleteApprovalRequest(Id: number|null) {
        var result = await deleteUserApprovalRequest(Id??0);
        result.match({
            ok: () => {
                      onDelete();
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
                return err;
            },
        });
    }

    const onDelete = async () => {
  
        setId(null)
        store.dispatch(setSelectedIdForPendingView(null));
        const result = await getUserPendingList(1);
        store.dispatch(loadPendingUsers(result));
        store.dispatch(initializeUserPendingDetails())
        toast(i18n.t('userapprovalrequest_message_success_delete'), {
            duration: 3000,
            style: {
                borderRadius: '0',
                background: '#00D26A', 
                color: '#fff',
            },
        });
    }

    const imageUrl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";
    const [isImageValid, setIsImageValid] = useState(true);

    useEffect(() => {
        if (selectedApprovals.DocumentUrl) {
            const img = new Image();
            img.src = selectedApprovals.DocumentUrl;
            img.onload = () => setIsImageValid(true);
            img.onerror = () => setIsImageValid(false);
        } else {
            setIsImageValid(false);
        }
    }, [selectedApprovals.DocumentUrl]);

    return (
        <>
            {selectedApprovals.Id ? (
                <>
                    <div className="">
                        <div className="d-flex bg-light m-1 rounded-1">
                            {/* user image */}
                            {isImageValid ?
                                (
                                    <div className="flex-shrink-0 text-start p-2">
                                        <img src={selectedApprovals.DocumentUrl} className='profile-image-md' alt="user image" />
                                    </div>
                                ) : (
                                    <div className="flex-shrink-0 text-start p-2">
                                        <img src={imageUrl} className='profile-image-md' alt="user image" />
                                    </div>
                                )
                            }
                            {/* user image ends */}

                            <div className="flex-grow-1">
                                <div className="row d-flex justify-content-between m-1">
                                    <div className="col app-primary-color p-1">
                                        {selectedApprovals.FullName}&nbsp;({selectedApprovals.EmployeeCode})
                                    </div>
                                    <div className="col text-end">
                                        {
                                            selectedApprovals.ReviewStatus == 'ARS_CAND' &&
                                            (
                                                <a
                                                    className="pseudo-href app-primary-color"
                                                    href={`/config/users/pendingupdate/${selectedApprovals.Id}`}
                                                >
                                                    <span className="material-symbols-outlined text-size-user">edit</span>
                                                </a>
                                            )}
                                        {selectedApprovals.ReviewStatus == 'ARS_RJTD' &&
                                            (
                                                <a className="pseudo-href app-primary-color" onClick={() => handleConfirm(selectedApprovals.Id)}>
                                                    <span className="material-symbols-outlined text-size-user"> delete</span>
                                                </a>
                                            )}
                                    </div>
                                </div>
                                <div className=" row d-flex justify-content-between m-1">
                                    <span className="col-auto px-1 fs-6 p-0 m-0 material-symbols-outlined">
                                        mail
                                    </span>
                                    <small className="p-0 col m-0">{selectedApprovals.Email}</small>
                                    <span className="col-auto fs-6 p-0 m-0 material-symbols-outlined">
                                        <span className="material-symbols-outlined col-auto fs-6 px-1">
                                            settings_accessibility
                                        </span>
                                    </span>
                                    <small className="p-0 col m-0">{selectedApprovals.Designation}</small>
                                </div>
                                <div className=" row d-flex justify-content-between m-1">
                                    <span className="col-auto px-1 fs-6 p-0 m-0 material-symbols-outlined">
                                        call
                                    </span>
                                    <small className="p-0 col m-0">{selectedApprovals.Phone}</small>
                                    <span className="col-auto px-1 fs-6 p-0 m-0  material-symbols-outlined">
                                        support_agent
                                    </span>
                                    <small className="p-0 col m-0">{selectedApprovals.Department}</small>
                                </div>
                                <div className=" row d-flex justify-content-between m-1">
                                    {selectedApprovals.ReviewStatus == 'ARS_SMTD' ? (
                                        <span className="col-auto px-1 fs-6 p-0 m-0 material-symbols-outlined">
                                            pending
                                        </span>
                                    ) : selectedApprovals.ReviewStatus == 'ARS_RJTD' ? (
                                        <span className="col-auto px-1 fs-6 p-0 m-0 material-symbols-outlined">
                                            cancel
                                        </span>
                                    ) : selectedApprovals.ReviewStatus == 'ARS_CAND' && (
                                        <span className="col-auto px-1 fs-6 p-0 m-0 material-symbols-outlined">
                                            work_alert
                                        </span>
                                    )}
                                    <small className="p-0 col m-0">{selectedApprovals.ReviewStatusName}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mx-0">
                        <div className='row border-bottom p-2'>
                            <div className="col-md-6">
                                <div className="row pt-2">
                                    <label className="form-text">{t('userrequestview_label_usercategory')}</label>
                                    <div >{selectedApprovals.UserCategory} </div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('userrequestview_label_location')}</label>
                                    <div >{selectedApprovals.Location} </div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('userrequestview_label_userrole')}</label>
                                    <div >{selectedApprovals.UserRole} </div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('userrequestview_label_designation')}</label>
                                    <div >{selectedApprovals.Designation} </div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('userrequestview_label_user_grade')}</label>
                                    <div >{selectedApprovals.UserGrade} </div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('userrequestview_label_department')}</label>
                                    <div >{selectedApprovals.Department} </div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('userrequestview_label_gender')}</label>
                                    <div >{selectedApprovals?.Gender}</div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('userrequestview_label_engagementtype')}</label>
                                    <div >{selectedApprovals.EngagementType} </div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('userrequestview_label_division')}</label>
                                    <div >{selectedApprovals.Division} </div>
                                </div>
                                <div className="row pt-2">
                                    <label className="form-text">{t('userrequestview_label_reportingmanager')}</label>
                                    <div >{selectedApprovals.ReportingManager} </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                {selectedApprovals.ServiceEngineerLevel && (
                                    <>
                                        <div className="row pt-2">
                                            <label className="form-text">{t('userrequestview_label_serviceengineerlevel')}</label>
                                            <div >{selectedApprovals.ServiceEngineerLevel} </div>
                                        </div>
                                        <div className="row pt-2">
                                            <label className="form-text">{t('userrequestview_label_serviceengineertype')}</label>
                                            <div >{selectedApprovals.ServiceEngineerType} </div>
                                        </div>
                                        <div className="row pt-2">
                                            <label className="form-text">{t('userrequestview_label_serviceengineercategory')}</label>
                                            <div >{selectedApprovals.ServiceEngineerCategory} </div>
                                        </div>
                                        {selectedApprovals.ServiceEngineerCategory == "RE" &&
                                            <div>
                                                <div className="row pt-2">
                                                    <label className="form-text">{t('userrequestview_label_customername')}</label>
                                                    <div >{selectedApprovals.CustomerName} </div>
                                                </div>
                                                <div className="row pt-2">
                                                    <label className="form-text">{t('userrequestview_label_contractnumber')}</label>
                                                    <div >{selectedApprovals.ContractNumber} </div>
                                                </div>
                                                <div className="row pt-2">
                                                    <label className="form-text">{t('userrequestview_label_customersite')}</label>
                                                    <div >{selectedApprovals.CustomerSite} </div>
                                                </div>
                                                <div className="row pt-2">
                                                    <label className="form-text">{t('userrequestview_label_budgetedamount')}</label>
                                                    <div >{selectedApprovals.BudgetedAmount} </div>
                                                </div>
                                                <div className="row pt-2">
                                                    <label className="form-text">{t('userrequestview_label_customeragreedamount')}</label>
                                                    <div >{selectedApprovals.CustomerAgreedAmount} </div>
                                                </div>
                                                <div className="row pt-2">
                                                    <label className="form-text">{t('userrequestview_label_startdate')}</label>
                                                    <div >{selectedApprovals.StartDate} </div>
                                                </div>
                                                <div className="row pt-2">
                                                    <label className="form-text">{t('userrequestview_label_enddate')}</label>
                                                    <div >{selectedApprovals.EndDate} </div>
                                                </div>
                                            </div>
                                        }
                                        <div className="row pt-2">
                                            <label className="form-text">{t('userrequestview_label_country')}</label>
                                            <div >{selectedApprovals.Country} </div>
                                        </div>
                                        <div className="row pt-2">
                                            <label className="form-text">{t('userrequestview_label_state')}</label>
                                            <div >{selectedApprovals.State} </div>
                                        </div>
                                        <div className="row pt-2">
                                            <label className="form-text">{t('userrequestview_label_city')}</label>
                                            <div >{selectedApprovals.City} </div>
                                        </div>
                                        <div className="row pt-2">
                                            <label className="form-text">{t('userrequestview_label_pincode')}</label>
                                            <div >{selectedApprovals.EngineerPincode} </div>
                                        </div>
                                        <div className="row pt-2">
                                            <label className="form-text">{t('userrequestview_label_geolocation')}</label>
                                            <div >{selectedApprovals.EngineerGeolocation} </div>
                                        </div>
                                        <div className="row pt-2">
                                            <label className="form-text">{t('userrequestview_label_enghomelocation')}</label>
                                            <div >{selectedApprovals.EngineerAddress} </div>
                                        </div>
                                    </>
                                )}
                            </div>

                        </div>
                        <div className='border-bottom p-2'>
                            <div className='row pt-2'>
                                <div className="col-md-6">
                                    <label className="form-text">{t('userrequestview_label_createdby')}</label>
                                    <div >{selectedApprovals.CreatedUserName}</div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-text">{t('userrequestview_label_createdon')}</label>
                                    <div >{formatDateTime(selectedApprovals.CreatedOn)}</div>
                                </div>
                            </div>
                            {ReviewDetails.length > 0 ? (
                                <div className="row pt-2">
                                    <ApprovalRequestReviewList ReviewList={ReviewDetails} />
                                </div>
                            ) : <></>}
                        </div>
                    </div>
                </>
            ) : <></>}
            {Id ? <ConfirmationModal /> : ""}
            <Toaster />
        </>
    )
}