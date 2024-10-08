import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useParams } from 'react-router-dom';
import { useStore } from '../../../../../../state/storeHooks';
import { checkForPermission } from '../../../../../../helpers/permissions';
import { store } from '../../../../../../state/store';
import { startPreloader, stopPreloader } from '../../../../../Preloader/Preloader.slice';
import { initializeAssetSiteWiseSummaryList, loadAssetSiteWiseSummary } from './ContractAssetSiteWiseSummaryList.slice';
import { getSitewiseAssetSummaryList } from '../../../../../../services/assetsSummary';
import { ContainerPage } from '../../../../../ContainerPage/ContainerPage';

const ContractAssetSiteWiseSummaryList = () => {
    const { t } = useTranslation();
    const { ContractId } = useParams<{ ContractId: string }>();
    const { contractassetsitewiseummarylist: { assetSiteWiseSummary },
    } = useStore(({ contractassetsitewiseummarylist }) => ({ contractassetsitewiseummarylist }));

    useEffect(() => {
        if (checkForPermission('CONTRACT_ASSET') && ContractId) {
            onLoad();
        }
    }, []);

    const onLoad = async () => {
        store.dispatch(startPreloader());
        store.dispatch(initializeAssetSiteWiseSummaryList());
        try {
            const SummaryList = await getSitewiseAssetSummaryList(ContractId);
            store.dispatch(loadAssetSiteWiseSummary(SummaryList));
        } catch (error) {
            store.dispatch(loadAssetSiteWiseSummary({ SiteWiseSummaryList: [] }))
        }
        store.dispatch(stopPreloader());
    };

    return (
        <ContainerPage>
            <>{checkForPermission('CONTRACT_ASSET') &&
                <div>
                    {assetSiteWiseSummary.match({
                        none: () => <>{t('contractassetsitewisesummarylist_loading')}</>,
                        some: (SiteWiseSummaryList) => (
                            <div className="ps-1 pe-0 mt-3">
                                <div className="row mt-1 mb-3 p-0">
                                    {SiteWiseSummaryList.length > 0 && (
                                        <div className="col-md-9 app-primary-color">
                                            <h5 className="ms-0 ps-1"> {t('contractassetsitewisesummarylist_title')}</h5>
                                        </div>
                                    )}
                                </div>
                                <div className="row mt-3">
                                    {SiteWiseSummaryList.length > 0 ? (
                                        <div className="table-responsive">
                                            <table className="table table-hover text-nowrap table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">{t('contractassetsitewisesummarylist_header_location')} </th>
                                                        <th scope="col">{t('contractassetsitewisesummarylist_header_site')} </th>
                                                        <th scope="col">{t('contractassetsitewisesummarylist_header_category')} </th>
                                                        <th scope="col" className="col-1">{t('contractassetsitewisesummarylist_header_count')} </th>
                                                        <th scope="col" className="col-1">{t('contractassetsitewisesummarylist_header_totalcount')} </th>
                                                    </tr>
                                                </thead>                                                
                                                    {SiteWiseSummaryList.map((field, index) => (
                                                        <tbody key={index}>
                                                            {field.assetSiteWiseSummary.TenantOfficeName && field.assetSiteWiseSummary.SiteName && field.assetSiteWiseSummary.CategoryName ?
                                                                <tr key={index}>
                                                                    <td>{field.assetSiteWiseSummary.TenantOfficeName}</td>
                                                                    <td>{field.assetSiteWiseSummary.SiteName}</td>
                                                                    <td>{field.assetSiteWiseSummary.CategoryName}</td>
                                                                    <td className="text-end">{field.assetSiteWiseSummary.AssetCount}</td>
                                                                    <td></td>
                                                                </tr>
                                                                :
                                                                field.assetSiteWiseSummary.TenantOfficeName && field.assetSiteWiseSummary.SiteName ?
                                                                    <tr className="bg-light" key={index}>
                                                                        <td colSpan={4}>{`${t('contractassetsitewisesummarylist_text_sitewise')} ${field.assetSiteWiseSummary.SiteName}`}</td>
                                                                        <td className="text-end">{field.assetSiteWiseSummary.AssetCount}</td>
                                                                    </tr>
                                                                    :
                                                                    field.assetSiteWiseSummary.TenantOfficeName ?
                                                                        <tr className="bg-secondary text-white" key={index}>
                                                                            <td colSpan={4}>{`${t('contractassetsitewisesummarylist_text_locationwise')} ${field.assetSiteWiseSummary.TenantOfficeName}`}</td>
                                                                            <td className="text-end">{field.assetSiteWiseSummary.AssetCount}</td>
                                                                        </tr>
                                                                        :
                                                                        <tr className="bg-dark text-white" key={index}>
                                                                            <td colSpan={4}>{t('contractassetsitewisesummarylist_text_total')}</td>
                                                                            <td className="text-end">{field.assetSiteWiseSummary.AssetCount}</td>
                                                                        </tr>
                                                            }
                                                        </tbody>
                                                    )
                                                    )}
                                            </table>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="text-muted ps-3">{t('contractassetsitewisesummarylist_title_nodata')}</div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ),
                    })}
                </div>
            }
            </>
        </ContainerPage>
    );
};

export default ContractAssetSiteWiseSummaryList