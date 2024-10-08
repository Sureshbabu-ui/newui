import { useEffect, useState } from "react";
import { store } from "../../../../state/store";
import { useStore } from "../../../../state/storeHooks";
import { Pagination } from "../../../Pagination/Pagination";
import { loadPendingUsers, UserPendingchangePage } from "./UserPendingList.slice";
import { useTranslation } from "react-i18next"; 
import { checkForPermission } from "../../../../helpers/permissions";
import { isApprovalNeededStatus } from "../../PendingApproval/PendingApprovalView/UserRequestView/UserRequestView.slice";
import { setApprovalEvent, setApprovalRequestDetailId} from "../../PendingApproval/PendingApprovalList/PendingApprovals.slice";
import { UserPendingRequestView } from "../UserPendingView/UserPendingView";
import {  initializeUserPendingDetails, setSelectedIdForPendingView } from "../UserPendingView/UserPendingView.slice";
import ClickToCopy from "../../Common/ClickToCopy";
import { IsImageValid } from "../../../../helpers/formats";
import { getUserPendingList } from "../../../../services/users";

export const UserPending = () => {
  const { t } = useTranslation();
  const { userspending: { users, totalRows, perPage, currentPage, SearchText, SearchWith } } = useStore(({ userspending }) => ({ userspending }));

  const [profile, setSelectedProfile] = useState<number>();

  useEffect(() => { 
    onLoad()
  }, [store.getState().usermanagement.activeTab == "nav-pending"])

  const redirectToViewDetail = async (Id: number, tableName: string) => {
    store.dispatch(initializeUserPendingDetails())
    store.dispatch(isApprovalNeededStatus());
    store.dispatch(setApprovalRequestDetailId(Id));
    store.dispatch(setSelectedIdForPendingView(Id));
    setSelectedProfile(Id)
  }

  async function onLoad() {
    try {
      const { currentPage } = store.getState().userspending;
      const result = await getUserPendingList(currentPage, SearchText, SearchWith);
      store.dispatch(loadPendingUsers(result));
    } catch (error) {
      console.error(error);
    }
  }

  async function onPageChange(index: number) {
    store.dispatch(UserPendingchangePage(index));
    const { currentPage } = store.getState().userspending;
    const result = await getUserPendingList(currentPage, SearchText, SearchWith);
    store.dispatch(loadPendingUsers(result));
  }
  const imageUrl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";

  const [imageValidity, setImageValidity] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    users.forEach(user => {
      const url = JSON.parse(user.Content).DocumentUrl;
      IsImageValid(url).then(isValid => {
        setImageValidity(prev => ({ ...prev, [user.Id]: isValid }));
      });
    });
  }, [users]);

  return (
    <div className='row mx-0 px-0'>
      {
        <div className='row mx-0 p-0 mt-3'>
          {checkForPermission("USER_VIEW") && <>
            <div className='p-0'>
              {users.length > 0 ? (
                <div className="row mx-0">
                  <div className="col-md-5 pe-1 p-0">
                    {users.map((user, index) => (
                      <a className="pseudo-href app-primary-color  text-decoration-none"
                        data-toggle="tooltip"
                        data-placement="left"
                        title={'View'}
                        key={index}
                        onClick={() => redirectToViewDetail(user.Id, user.TableName)}>
                        <div className="row border rounded mb-2 p-1 m-0" key={index}>
                          {/* user image */}
                          <div className="px-1 col-md-2 d-flex align-items-center">
                            {imageValidity[user.Id] ?
                              (
                                <div className=''>
                                  <img
                                    src={JSON.parse(user.Content).DocumentUrl}
                                    alt="Image not found"
                                    className='profile-image-sm'
                                  />
                                </div>
                              ) : (
                                <div className=''>
                                  <img
                                    src={imageUrl}
                                    alt="Image not found"
                                    className='profile-image-sm'
                                  />
                                </div>)
                            }
                          </div>
                          {/* user image ends */}
                          <div className='col-md-10 p-0'>
                            <div className="row">
                              <div className="d-flex">
                                <div className="p-0 fw-bold">{JSON.parse(user.Content).FullName}</div>
                                <div className="ms-auto p-0 fw-bold"><span data-toggle="tooltip" data-placement="left" title={'Copy'} className="small">{JSON.parse(user.Content).EmployeeCode} <ClickToCopy ContentToCopy={JSON.parse(user.Content).EmployeeCode} /></span></div>
                              </div>
                              <div className="text-size-11"> {JSON.parse(user.Content).Email}</div>
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                  {profile &&
                    <div className="col-md-7 p-0 border rounded-3">
                      <UserPendingRequestView />
                    </div>
                  }
                </div>
              ) : (
                <div className='text-muted p-0'>{t('userManagement_message_no_users_found')}</div>
              )}
            </div>
            {/* Pagination */}
            <div className='row m-0'>
              <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
            </div>
            {/* Pagination ends */}
          </>}
        </div>
      }
    </div>
  )
}