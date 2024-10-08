import { useEffect } from 'react';
import { dispatchOnCall, store } from '../../../state/store';
import { useStoreWithInitializer } from '../../../state/storeHooks';
import { useStore } from '../../../state/storeHooks';
import { initializeLoginHistoryList, setLoginHistory } from './LoginHistory.slice';
import { loadUserIntoApp, UserEditTemplate } from '../../../types/user';
import { getLoginHistoryList } from '../../../services/users';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ContainerPage } from '../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import { formatDateTime } from '../../../helpers/formats';

export function LoginHistory() {
  const { t, i18n } = useTranslation();
  const { LoginHistory } = useStore(({ userhistory }) => userhistory);

  useEffect(() => {
    onLoad();
  }, [null]);

  return LoginHistory.match({
    none: () => (
      <div className='users'>
        <ContainerPage>
          <div className='my-2'>{t('login_history_message_loading_history')}</div>
        </ContainerPage>
      </div>
    ),
    some: (history) => (
      <div className='login-history'>
        {/* last login time */}
        { 
          (history.length > 1) && 
          (<div className='text-end fw-lighter'>
            <small>
              <span> 
                { 
                  history.map((eachHistoryRecord, index) => {
                    if(index == 1) {
                      return 'Last login was on ' + formatDateTime(eachHistoryRecord['CreatedOn'])
                    }
                  }) 
                } 
              </span> &nbsp;
              
              <a data-bs-toggle='modal' data-bs-target='#historyModal' className='psuedo-link pseudo-href app-primary-color'>
              {t('login_history_hyperlink_more')}
              </a>
            </small>
          </div>)
        }
        {/* last login time ends */}

        {/* history modal */}
        <div className='modal fade' id='historyModal'>
          <div className='modal-dialog modal-fullscreen'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>{t('login_history_title_recent_login_attempts')}</h5>
                <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
              </div>
              <div className='modal-body'>
                <div>
                  <small>
                  {t('login_history_message')}
                  </small>
                </div>
                <table className='table table-bordered mt-3'>
                  <thead>
                    <tr>
                      <th scope='col'>{t('login_history_header_date&time')}</th>
                      <th scope='col'>{t('login_history_header_browser')}</th>
                      <th scope='col'>{t('login_history_header_time_zone')}</th>
                      <th scope='col'>{t('login_history_header_ip_address')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      history.map((eachHistoryRecord, index) => {                       
                        var clientInfo = JSON.parse(eachHistoryRecord['ClientInfo']);
                        return (
                          <tr key={index}>
                            <td>
                            { formatDateTime(eachHistoryRecord['CreatedOn'])}
                            { (index == 0) && (<span className="ms-1 current-session">({t('login_history_header_current_session')})</span>) }
                            </td>
                            <td>{ clientInfo.Browser }</td>
                            <td>{ clientInfo.TimeZone }</td>
                            <td>{ clientInfo.IpAddress}</td>
                          </tr>
                        );
                    })}
                  </tbody>
                </table>
              </div>
              <div className='modal-footer'>
                <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
                {t('login_history_button_close')}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* history modal ends */}
      </div>
    ),
  });
}

async function onLoad() {
  store.dispatch(initializeLoginHistoryList());
  try {
    const history = await getLoginHistoryList();
    store.dispatch(setLoginHistory(history));
  } catch (error) {
    console.error(error);
  }
}
