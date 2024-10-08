import { t } from "i18next";
import { EventWise } from "./EventWise/EventWise";
import { RoleWise } from "./RoleWise/RoleWise";

const NotificationSetting=()=>{

    return(
      
        <div className="notifications">
      {/* <ContainerPage> */}
          {/* Section 1 */}
          <div>
            
          </div>
          <div className="row" id="notification-setting">
            {/* Header */}
            <div className="">
              <h5>{t('notification_title_notification_settings')}</h5>
            </div>
            {/* Header ends */}
          </div>
          {/* Section 1 ends */}
          <nav className=" mt-3">
            <div className="nav nav-tabs" id="nav-tab" role="tablist">
              <button
                className="nav-link active"
                id="nav-profile-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-profile"
                type="button"
                role="tab"
                aria-controls="nav-profile"
                aria-selected="true"
              >
                 {t('notification_title_event_wise')}
              </button>
              <button
                className="nav-link"
                id="nav-home-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-home"
                type="button"
                role="tab"
                aria-controls="nav-home"
                aria-selected="false"
              >
                {t('notification_title_role_wise')}
              </button>
            </div>
          </nav>
          <div className="tab-content mt-3" id="nav-tabContent">
          <div className="tab-pane fade show active" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
              <div className="mt-2">
                <EventWise/>
              </div>
            </div>
            <div className="tab-pane fade" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
              <div className="mt-2">
                <RoleWise />
              </div>
            </div>
          </div>
        </div>
    )
}
export default NotificationSetting;