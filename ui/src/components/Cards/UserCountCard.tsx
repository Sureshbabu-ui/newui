import { useEffect } from 'react';
import { store } from '../../state/store';
import { useStore } from '../../state/storeHooks';
import { getUsersCount } from '../../services/users';
import { loadcount, initializeUsersList } from './UserCountCard.slice';
import { useTranslation } from 'react-i18next';

export function UsersCount() {
  const { t, i18n } = useTranslation();
  const {
    usercount: { totalRows },
  } = useStore(({ usercount }) => ({ usercount }));
  useEffect(() => {
    onLoad();
  }, [null]);

  return (
    <div className="count">
      <div className="my-2">
        {totalRows ? (
          <div className="row m-3 mb-0" data-testid="user_count_card_total_rows">
            {totalRows > 0 ? (
              <div className="usercount">
                <h5>
                  <strong>{totalRows}</strong>
                </h5>
              </div>
            ) : (
              <div className="text-muted p-0">{t('dashboard_message_users_count')}</div>
            )}
          </div>
        ) : (
          <div>{t('dashboard_loading_message_users_count')}</div>
        )}
      </div>
    </div>
  );
}

async function onLoad() {
  store.dispatch(initializeUsersList());
  try {
    const totalRows = await getUsersCount();
    store.dispatch(loadcount(totalRows));
  }
  catch (error) {
    console.error(error);
  }
}




