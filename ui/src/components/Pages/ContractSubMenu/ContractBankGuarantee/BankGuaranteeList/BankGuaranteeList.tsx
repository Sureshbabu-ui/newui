import { useTranslation } from "react-i18next";
import { useStore, useStoreWithInitializer } from '../../../../../state/storeHooks';
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { store } from '../../../../../state/store';
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { formatCurrency, formatDate, formatDateTime } from "../../../../../helpers/formats";
import FeatherIcon from 'feather-icons-react';
import { initializeBankGuaranteeList, loadBankGuarantees, setVisibleModal } from "./BankGuaranteeList.slice";
import { getBankGuaranteeDetails, getBankGuaranteeList } from "../../../../../services/contractBankGuarantee";
import { useParams } from "react-router-dom";
import { BankGuaranteeCreate } from "../BankGuaranteeCreate/BankGuaranteeCreate";
import { BankGuaranteeEdit } from "../BankGuaranteeEdit/BankGuaranteeEdit";
import { loadBankGuaranteeEditDetails } from "../BankGuaranteeEdit/BankGuaranteeEdit.slice";
import { checkForPermission } from "../../../../../helpers/permissions";
import { useEffect } from 'react';

const BankGuaranteeList = () => {
    const { t, i18n } = useTranslation();
    const { ContractId } = useParams<{ ContractId: string }>();
    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeBankGuaranteeList());
        try {
            const result = await getBankGuaranteeList(ContractId);
            store.dispatch(loadBankGuarantees(result));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }
    const { bankGuarantee } = useStore(({ bankguaranteelist }) => (bankguaranteelist));

    useEffect(() => {
        if (checkForPermission("CONTRACT_BANK_GUARANTEE_LIST")) {
            onLoad();
        }
    }, [ContractId]);

    async function loadClickedBankGuaranteeDetails(BankGuaranteeId: number) {
        store.dispatch(setVisibleModal("BankGuaranteeEdit"));
        const { BankGuaranteeDetails } = await getBankGuaranteeDetails(BankGuaranteeId);
        store.dispatch(loadBankGuaranteeEditDetails(BankGuaranteeDetails));
    }

    return (
        <ContainerPage>
            <>
                {checkForPermission("CONTRACT_BANK_GUARANTEE_LIST") && bankGuarantee.match({
                    none: () => <>{t('bankguarantee_list_loading')}</>,
                    some: (bankGuarantee) => <div className="ps-3 pe-4 mt-3">
                        <div className="row mt-1 mb-3  ">
                            <div className="col-md-6 app-primary-color ">
                                <h5 className="ms-0"> {t('bankguarantee_list_title')}</h5>
                            </div>
                            {checkForPermission("CONTRACT_BANK_GUARANTEE_CREATE") && store.getState().generalcontractdetails.singlecontract.ContractStatusCode !== 'CTS_PNDG' &&
                                <div className="col-md-6 ">
                                    <button onClick={() => store.dispatch(setVisibleModal("CreateBankGuarantee"))} disabled={store.getState().generalcontractdetails.singlecontract.ContractStatusCode === 'CTS_PNDG'} className="btn app-primary-bg-color text-white float-end " data-bs-toggle='modal' data-bs-target='#CreateBankGuarantee'>
                                        {t('bankguarantee_list_button_create')}
                                    </button>
                                </div>
                            }
                        </div>
                        <div className="mb-3">
                            <div className="row m-0  mt-3">
                                {bankGuarantee.length > 0 ? (
                                    <div className='ps-0 table-responsive overflow-auto pe-0'>
                                        <table className="table table-bordered text-nowrap">
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th scope="col">{t('bankguarantee_list_th_sl_no')}</th>
                                                    <th scope="col">{t('bankguarantee_list_th_guarantee_type')}</th>
                                                    <th scope="col">{t('bankguarantee_list_th_guarantee_number')}</th>
                                                    <th scope="col">{t('bankguarantee_list_th_bank_branch_name')}</th>
                                                    <th scope="col">{t('bankguarantee_list_th_guarantee_amount')}</th>
                                                    <th scope="col">{t('bankguarantee_list_th_guarantee_end_date')}</th>
                                                    <th scope="col">{t('bankguarantee_list_th_guarantee_claim_period')}</th>
                                                    <th scope="col">{t('bankguarantee_list_th_guarantee_status')}</th>
                                                    <th scope="col">{t('bankguarantee_list_th_guarantee_remarks')}</th>
                                                    <th scope="col">{t('bankguarantee_list_th_createdby')}</th>
                                                    <th scope="col">{t('bankguarantee_list_th_createdon')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {bankGuarantee.map((field, index) => (
                                                    <tr className="mt-2">
                                                        {checkForPermission("CONTRACT_BANK_GUARANTEE_EDIT") &&
                                                            <td className="">
                                                                <a
                                                                    className="pseudo-href app-primary-color ms-2"
                                                                    onClick={() => {
                                                                        loadClickedBankGuaranteeDetails(field.Id)
                                                                    }}
                                                                    data-bs-toggle="modal"
                                                                    data-toggle="tooltip" data-placement="left" title={'Edit BankGuarantee'}
                                                                    data-bs-target="#BankGuaranteeEdit"
                                                                >
                                                                    <FeatherIcon icon={"edit"} size="16" />
                                                                </a>
                                                            </td>
                                                        }
                                                        <th scope="row">{(index + 1)}</th>
                                                        <td>{field.GuaranteeType} </td>
                                                        <td>{field.GuaranteeNumber} </td>
                                                        <td>{field.BranchName} </td>
                                                        <td>{formatCurrency(field.GuaranteeAmount)}</td>
                                                        <td>{formatDate(field.GuaranteeEndDate)} </td>
                                                        <td>{field.GuaranteeClaimPeriodInDays} </td>
                                                        <td>{field.GuaranteeStatus} </td>
                                                        <td>{field.Remarks} </td>
                                                        <td>{field.CreatedBy}</td>
                                                        <td>{formatDateTime(field.CreatedOn)} </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-muted m-0 p-0">{t('bankguarantee_list_no_data')}</div>
                                )}
                            </div>
                            <BankGuaranteeEdit />
                            <BankGuaranteeCreate />
                        </div>
                    </div>
                })}
            </>
        </ContainerPage>
    )
}

export default BankGuaranteeList