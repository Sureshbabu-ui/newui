import { ContainerPage } from '../../ContainerPage/ContainerPage';
import { LoginHistory } from '../LoginHistory/LoginHistory';
import { useStore } from '../../../state/storeHooks';
import { useTranslation } from 'react-i18next';
import { store } from '../../../state/store';
import BarGraphManagement from '../../DashboardWidget/BarGraph/BarGraphMangement';
import CallStopNotification from '../../DashboardWidget/CallStopNotification/CallStopNotification';
import { useEffect, useState } from 'react';
import { UserPasscodeExpiryNotice } from '../../../services/users';
import { PasscodeExpiryInfo } from '../../../types/login';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { t, i18n } = useTranslation();
  const { passwordExpired } = useStore(({ login }) => login);
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(currentDate);

  useEffect(() => {
    onLoad();
  }, []);

  const [expiryInfo, setExpiryInfo] = useState<PasscodeExpiryInfo>({ DaysUntilExpiry: null })

  const onLoad = async () => {
    try {
      const data = await UserPasscodeExpiryNotice();
      setExpiryInfo(data.ExpiryInfo)
    } catch (error) {
      return
    }
  };

  return (
    <div className="dashboard">
      {passwordExpired == false ? (
        <ContainerPage>
          <div className="">
            <div className="row mx-0 mt-1">
              <div className="text-end ps-2 dashboard-welcome-text"><span className="">{`Welcome back, ${store.getState().app.user.unwrap().user[0].FullName}`}</span></div>
              <div className="text-muted text-end">
                <small><span className="">{formattedDate}</span></small>
              </div>
              <div className="text-muted">
                <LoginHistory />
              </div>
              {expiryInfo.DaysUntilExpiry !== null &&
                <div className="text-end ps-2">
                  {expiryInfo.DaysUntilExpiry === 0 ? (
                    <span className='text-warning'>
                      {t('dashboard_message_pswd_expire_today')} <Link to='/passwordreset' className='app-primary-color'>{t('dashboard_message_pswd_link')}</Link>{t('dashboard_message_pswd_to_change')}
                    </span>
                  ) : (
                    <span className='text-warning'>
                        {t('dashboard_message_pswd_expire_in')}<span className="highlight"> {expiryInfo.DaysUntilExpiry}{expiryInfo.DaysUntilExpiry === 1 ? ' day' : ' days'} <Link to='/passwordreset' className='app-primary-color'>{t('dashboard_message_pswd_link')}</Link>{t('dashboard_message_pswd_to_change')}</span>
                    </span>
                  )}
                </div>
              }
            </div>
            <div className='mt-4 mb-2'>
              <CallStopNotification />
            </div>
            <div className="row m-0 ">
              <div className="mt-3 bg-light rounded">
                <BarGraphManagement />
              </div>
            </div>
          </div>
        </ContainerPage>
      ) : (
        <ContainerPage>
          <div className="col-md-6 offset-md-3 col-xs-12">
            <div className="card mt-3">
              <div className="card-header">
                <strong>{t('dashboard_message_update_password')}</strong>
                <div className="card-body">
                  <p>
                    {t('dashboard_message_validity_expired')} <a href='/passwordreset'>{t('dashboard_message_click_here')}</a> {t('dashboard_hyperlink_password_reset')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ContainerPage>
      )}
    </div>
  );
}