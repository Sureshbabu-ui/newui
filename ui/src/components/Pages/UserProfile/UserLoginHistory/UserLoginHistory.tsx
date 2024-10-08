import { useEffect } from 'react';
import { store } from '../../../../state/store';
import { useStore } from '../../../../state/storeHooks';
import { initializeLoginHistoryList, setLoginHistory } from './UserLoginHistory.slice';
import { getUserLoginHistoryList } from '../../../../services/users';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import { formatDateTime } from '../../../../helpers/formats';
import { useParams } from 'react-router-dom';

export function UserLoginHistory() {
  const { t, i18n } = useTranslation();
  const { LoginHistory } = useStore(({ userloginhistory }) => userloginhistory);

  const { UserId } = useParams<{ UserId: string }>();
  useEffect(() => {
    onLoad(UserId);
  }, [UserId]);

  return (
    <ContainerPage>
      {LoginHistory.match({
        none: () => (
          <div className='users'>
            <ContainerPage>
              <div className='my-2'>{t('user_login_history_message_loading_history')}</div>
            </ContainerPage>
          </div>
        ),
        some: (history) => (
          <>
              {history.length > 0 ? (
              <div>
                <table className='table table-bordered mt-0 me-5 pe-4'>
                  <thead>
                    <tr>
                      <th scope='col'>{t('user_login_history_header_date&time')}</th>
                      <th scope='col'>{t('user_login_history_header_browser')}</th>
                      <th scope='col'>{t('user_login_history_header_time_zone')}</th>
                      <th scope='col'>{t('user_login_history_header_ip_address')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      history.map((eachHistoryRecord, index) => {
                        var clientInfo = JSON.parse(eachHistoryRecord['ClientInfo']);
                        return (
                          <tr>
                            <td>
                              {formatDateTime(eachHistoryRecord['CreatedOn'])}<br></br>
                              {(index === 0) && (
                                <span className="ms-1 current-session">
                                  {eachHistoryRecord['UserId'] === store.getState().app.user.unwrap().user[0].Id
                                    ? `(${t('login_history_header_current_session')})`
                                    : `(${t('login_history_header_last_login')})`
                                  }
                                </span>
                              )}
                            </td>
                            <td>{clientInfo.Browser}</td>
                            <td>{clientInfo.TimeZone}</td>
                            <td>{clientInfo.IpAddress}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              ):(
                <div className="text-muted ps-3">{t('user_login_history_not_found')}</div>
              )}
          </>
        ),
      })}
    </ContainerPage>
  )

  async function onLoad(UserId: string) {
    store.dispatch(initializeLoginHistoryList());
    try {
      const history = await getUserLoginHistoryList(UserId);
      store.dispatch(setLoginHistory(history));
    } catch (error) {
      console.error(error);
    }
  }
}