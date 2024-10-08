import { userTabs } from '../../../tabs.json';
import { useState, useEffect } from 'react';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { PersonalInfo } from './ProfileInfo';
import { UpdateUserPassword } from './UpdateUserPassword';
import feather from 'feather-icons';
import { UserLoginHistory } from './UserLoginHistory/UserLoginHistory';
import { dispatchOnCall, store } from '../../../state/store';
import { updateErrors } from './UpdateUserPassword.slice';
import { useStore, useStoreWithInitializer } from '../../../state/storeHooks';
import { initializeProfile } from './ProfileInfo.slice';
import { deleteSingleUser } from '../UserManagement/UsersList/DeleteUsers/DeleteUsers.slice';
import { selectUserDetails, } from '../ToggleUserStatus/ToggleUserStatus.slice';
import { UserStatus } from '../ToggleUserStatus/ToggleUserStatus';
import { t } from 'i18next';

export function UserProfile() {
  const { singleprofile, roles } = useStoreWithInitializer(({ profile }) => profile, dispatchOnCall(initializeProfile()));
  const { user } = useStore(({ userprofile }) => userprofile);
  const [selectedTab, setSelectedTab] = useState(0);
  const location = useLocation();
  const history = useHistory();

  const handleTabClick = (index: any) => {
    setSelectedTab(index);
    index == 1 && store.dispatch(updateErrors({}));
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("Tab", index.toString());
    history.push({ search: searchParams.toString() });
  };
 
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams) {
      const Tab = searchParams.get("Tab");
      if (Tab != undefined && parseInt(Tab) > 0 && parseInt(Tab) <= userTabs.length) {
        setSelectedTab(Tab ? parseInt(Tab) : 0);
      }
    }
    feather.replace();
  }, []);

  const imageUrl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";

  const [isImageValid, setIsImageValid] = useState(true);

  useEffect(() => {
    if (singleprofile.DocumentUrl) {
      const img = new Image();
      img.src = singleprofile.DocumentUrl;
      img.onload = () => setIsImageValid(true);
      img.onerror = () => setIsImageValid(false);
    } else {
      setIsImageValid(false);
    }
  }, [singleprofile.DocumentUrl]);

  return (
    <div className="">
      {singleprofile.Id != 0 ? (
        <div className="d-flex bg-light m-1 rounded-1">
          {/* user image */}
          {isImageValid && singleprofile.DocumentUrl ? (
            <div className="flex-shrink-0 text-start p-2">
              <img src={singleprofile.DocumentUrl} className='profile-image-md' alt="user image" />
            </div>
          ) : (
            <div className="flex-shrink-0 text-start p-2">
              <img src={imageUrl} className='profile-image-md' alt="user image" />
            </div>
          )}
          {/* user image ends */}
          <div className="flex-grow-1">
            <div className="row d-flex justify-content-between m-1">
              <div className="col app-primary-color p-1">
                {singleprofile.FullName} ({singleprofile.EmployeeCode}) {singleprofile.IsActive ? (
                  <span className="col-auto px-1 fs-6 p-0 m-0 material-symbols-outlined text-success" data-toggle="tooltip" data-placement="left" title="Active">
                    person_check
                  </span>
                ) : (
                  <span className="col-auto px-1 fs-6 p-0 m-0 material-symbols-outlined text-danger" data-toggle="tooltip" data-placement="left" title="In Active">
                    person_cancel
                  </span>
                )}
              </div>
              <div className="col text-end dropdown nav-link">
                <span className="material-symbols-outlined" role="button" data-bs-toggle="dropdown" aria-expanded="false">more_vert</span>
                <div className="dropdown-menu">
                  <Link to={`/config/users/edit/${singleprofile.Id}`} className="dropdown-item">{t('user_management_edit')}</Link>
                  {store.getState().app.user.unwrap().user[0].Id !== singleprofile.Id && (
                    <>
                      <a
                        className="dropdown-item"
                        role="button"
                        onClick={() => store.dispatch(selectUserDetails({ Email: user.Email, FullName: user.FullName, Id: user.Id, IsDeleted: user.IsDeleted, Phone: user.Phone, UserInfoStatus: user.UserInfoStatus }))}
                        data-bs-toggle="modal"
                        data-bs-target="#updatUserStatus"
                        data-testid={`user_management_button_disable_${singleprofile.Id}`}
                      >
                        {user.UserInfoStatus ? 'Disable' : 'Enable'}
                      </a>
                      <a
                        className="dropdown-item"
                        role="button"
                        onClick={() => store.dispatch(deleteSingleUser(singleprofile.Id))}
                        data-bs-toggle="modal"
                        data-toggle="tooltip" data-placement="left" title="Delete"
                        data-bs-target="#DeleteUsers"
                      >
                        {t('user_management_delete')}
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="row d-flex justify-content-between m-1">
              <span className="col-auto px-1 fs-6 p-0 m-0 material-symbols-outlined">
                mail
              </span>
              <small className="p-0 col m-0">{singleprofile.Email}</small>
              <span className="col-auto fs-6 p-0 m-0 material-symbols-outlined">
                settings_accessibility
              </span>
              <small className="p-0 col m-0">{singleprofile.Designation}</small>
            </div>
            <div className="row d-flex justify-content-between m-1">
              <span className="col-auto px-1 fs-6 p-0 m-0 material-symbols-outlined">
                call
              </span>
              <small className="p-0 col m-0">{singleprofile.Phone}</small>
              <span className="col-auto px-1 fs-6 p-0 m-0 material-symbols-outlined">
                support_agent
              </span>
              <small className="p-0 col m-0">{singleprofile.Department}</small>
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex bg-light m-1 rounded-1">
        </div>
      )}

      {/* Horizontal Tabs */}
      <div className="nav nav-tabs ps-1" id="nav-tab" role="tablist">
        {userTabs.map((userTabs, index) => (
          <li className="nav-item" key={userTabs.id}>
            <button
              className={selectedTab === index ? "nav-link active" : "nav-link"}
              id={`${userTabs.name}-tab`}
              data-bs-toggle="pill"
              type="button"
              role="tab"
              aria-controls={`${userTabs.name}`}
              aria-selected={selectedTab === index}
              onClick={() => handleTabClick(index)}
            >
              <span className="app-primary-color">{userTabs.name}</span>
            </button>
          </li>
        ))}
      </div>
      <div className="tab-content" id="pills-tabContent">
        {userTabs.map((userTabs, index) => (
          <div
            className={selectedTab === index ? "tab-pane fade show active" : "tab-pane fade"}
            key={userTabs.id}
            id={userTabs.name}
            role="tabpanel"
            aria-labelledby={`${userTabs.name}-tab`}
          >
            {userTabs.id === 1 && <PersonalInfo />}
            {userTabs.id === 2 && <UpdateUserPassword />}
            {userTabs.id === 3 && <UserLoginHistory />}
          </div>
        ))}
      </div>
      <UserStatus />
    </div>
  );

}
