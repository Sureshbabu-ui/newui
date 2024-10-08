import { useStoreWithInitializer } from '../../../state/storeHooks';
import { getCallStopCount } from '../../../services/callStopNotification';
import { store } from '../../../state/store';
import { setCallStopCount } from './CallStopNotification.slice';
import { useTranslation } from 'react-i18next';

const CallStopNotification = () => {
  const { t } = useTranslation();

  const onLoad = async () => {
    try {
      const result = await getCallStopCount()
      store.dispatch(setCallStopCount(result))
    } catch (error) {
      console.error(error);
    }
  }

  const { callStopExpiryCount } = useStoreWithInitializer(({ callstopnotification }) => callstopnotification, onLoad);
  return (
    <>
      <div className="row m-0">
        <div className="col-md-6">
          <div className="bg-light me-1 p-3">
            <div className="small"><span className="fw-bold">{t('callstopnotification_titlebold_total')}</span> {t('callstopnotification_titletext_total')} </div>
            <div className="fs-1 app-primary-color fw-bold ">{callStopExpiryCount.TotalCallStopped}</div>
            <div className="small fw-bold">{t('callstopnotification_title_contract')}</div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="bg-light me-1 p-3">
            <div className="small"><span className="fw-bold">{t('callstopnotification_titlebold_tonight')}</span>{t('callstopnotification_titletext_tonight')}</div>
            <div className="fs-1 app-primary-color fw-bold ">{callStopExpiryCount.Tonightcallstop}</div>
            <div className="small fw-bold">{t('callstopnotification_title_contract')}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CallStopNotification