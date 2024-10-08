import { getProfileDetails } from '../../../../services/userprofiles';
import { store } from '../../../../state/store';
import { useStore } from '../../../../state/storeHooks';
import { ContainerPage } from '../.././../ContainerPage/ContainerPage';
import { initializeProfile, loadAppkeyValues, loadUserProfile, setSelectedRoles } from './LoggedUserProfileInfo.slice';
import { getSelectedRoles } from '../../../../services/users';
import { useTranslation } from 'react-i18next';
import { getAppKeyValues } from '../../../../services/appsettings';
import { useEffect } from 'react';

export function LoggedUserProfileInfo() {
  const { t, i18n } = useTranslation();
  const { singleprofile,roles } = useStore(({ loggeduserprofile }) => loggeduserprofile);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    store.dispatch(initializeProfile());
    try {
        const result = await getProfileDetails();
        store.dispatch(loadUserProfile(result.UserDetails[0]));
        const data = await getSelectedRoles(result.UserDetails[0].Id.toString())
        store.dispatch(setSelectedRoles(data.SelectedUserRoles[0]));
      const AppSettingsKeyValues = await getAppKeyValues('SEDesignationCodes');
      store.dispatch(loadAppkeyValues(AppSettingsKeyValues));
    } catch (error) {
      return
    }
  }

  const appValues = (store.getState().profile?.appvalues?.AppKey === "SEDesignationCodes") ? (store.getState().profile.appvalues.AppValue.split(",")) : [];
  const isServiceEngineer = appValues.includes(singleprofile.DesignationCode)
  return (

    <ContainerPage>
      <div className="ms-2">
        <div className="row">
          {/* col-1 */}
          <div className='col-md-6 '>
            <div className="row">
              <div> <label className="form-control-label text-muted">{t('profileinfo_list_name')}</label>
                <div className=''>{singleprofile.FullName}</div>
              </div>
              <div className="row pt-2">
                <label className="form-text">{t('profileinfo_list_userid')}</label>
                <div className=''>{singleprofile.EmployeeCode}</div>
              </div>
            </div>
            <div className="row pt-2">
              <label className="form-text">{t('profileinfo_list_email')}</label>
              <div className=''>{singleprofile.Email}</div>
            </div>
            <div className="row pt-2">
              <label className="form-text">{t('profileinfo_list_phone')}</label>
              <div className=''>{singleprofile.Phone}</div>
            </div>
            <div className="row pt-2">
              <label className="form-text">{t('profileinfo_list_role')}</label>
              <div className=''>{roles.RoleNames}</div>
            </div>
            <div className="row pt-2">
              <label className="form-text">{t('profileinfo_location')}</label>
              <div className=''>{singleprofile.Location}</div>
            </div>
            {isServiceEngineer && (
              <>
                <div className="row pt-2">
                  <label className="form-text">{t('profileinfo_list_serviceengineer_category')}</label>
                  <div className=''>{singleprofile.ServiceEngineerCategory}</div>
                </div>
                <div className="row pt-2">
                  <label className="form-text">{t('profileinfo_list_serviceengineer_level')}</label>
                  <div className=''>{singleprofile.ServiceEngineerLevel}</div>
                </div>
                <div className="row pt-2">
                  <label className="form-text">{t('profileinfo_list_serviceengineer_type')}</label>
                  <div className=''>{singleprofile.ServiceEngineerType}</div>
                </div>
              </>
            )}
          </div>
          <div className='col-md-6 '>
            <div className="row">
              <div> <label className="form-control-label text-muted">{t('profileinfo_list_engagementtype')}</label>
                <div className=''>{singleprofile.EngagementType}</div>
              </div>
              <div className="row pt-2">
                <label className="form-text">{t('profileinfo_list_designation')}</label>
                <div className=''>{singleprofile.Designation}</div>
              </div>
            </div>
            <div className="row pt-2">
              <label className="form-text">{t('profileinfo_list_department')}</label>
              <div className=''>{singleprofile.Department}</div>
            </div>
            <div className="row pt-2">
              <label className="form-text">{t('profileinfo_list_division')}</label>
              <div className=''>{singleprofile.Division}</div>
            </div>
            <div className="row pt-2">
              <label className="form-text">{t('profileinfo_list_usercategory')}</label>
              <div className=''>{singleprofile.UserCategory}</div>
            </div>
            <div className="row pt-2">
              <label className="form-text">{t('profileinfo_list_businessunit')}</label>
              <div className=''>{singleprofile.BusinessUnits ?? '---'}</div>
            </div>
            {isServiceEngineer && (
              <>
                <div className="row pt-2">
                  <label className="form-text">{t('profileinfo_list_serviceengineer_geolocation')}</label>
                  <div className=''>{singleprofile.EngineerGeolocation ?? "---"}</div>
                </div>
                <div className="row pt-2">
                  <label className="form-text">{t('profileinfo_list_serviceengineer_homelocation')}</label>
                  <div className=''>{singleprofile.EngineerHomeLocation ?? "---"}</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </ContainerPage>
  );
}