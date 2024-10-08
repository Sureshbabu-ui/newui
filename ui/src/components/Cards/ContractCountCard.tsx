import { useEffect } from 'react';
import { store } from '../../state/store';
import { useStore } from '../../state/storeHooks';
import { ContainerPage } from '../ContainerPage/ContainerPage';
import { initializeContractsList, loadContracts } from '../Pages/ContractManagement/ContractManagement.slice';
import { getContractCount } from '../../services/contracts';
import { loadcount } from './ContractCountCard.slice';
import { useTranslation } from 'react-i18next';

export function ContractCount() {
  const { t, i18n } = useTranslation();
  const {
    contractcount: { totalRows },
  } = useStore(({ contractcount }) => ({ contractcount }));

  useEffect(() => {
    onLoad();
  }, [null]);

  return (
    <div className="count">
      <div className="my-2">
        {totalRows ? (
          <div className="row m-3 mb-0" data-testid='user_count_card_total_rows'>
            {totalRows > 0 ? (
              <div className="contractcount">
                <h5>
                  <strong>{totalRows}</strong>
                </h5>
              </div>
            ) : (
              <div className="text-muted p-0">{t('dashboard_message_contract_count')}</div>
            )}
          </div>
        ) : (
          <div>{t('dashboard_loading_message_contract_count')}</div>
        )}
      </div>
    </div>
  );
}

async function onLoad() {
  store.dispatch(initializeContractsList());
  try {
    const totalRows = await getContractCount();
    store.dispatch(loadcount(totalRows));
  } catch (error) {
    console.error(error);
  }
}