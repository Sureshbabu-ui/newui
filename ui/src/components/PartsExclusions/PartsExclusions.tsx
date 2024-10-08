import { dispatchOnCall, store } from '../../state/store';
import { ContainerPage } from '../ContainerPage/ContainerPage';
import { useStoreWithInitializer } from '../../state/storeHooks';
import { useEffect, useState } from 'react';
import { initializePartsExclusions, loadPartsCategory } from './PartsExclusions.slice';
import { useTranslation } from 'react-i18next';
import { getSelectedPartsNotCovered } from '../../services/assetsSummary';
import { getProductCategory } from '../../services/product';
import { formatSelectInput } from '../../helpers/formats';

export function PartsExclusions(props: { ProductCategoryId: number, ContractId: number, View?: string, ProductCategoryName?: string }) {
    const { t, i18n } = useTranslation();
    const { contractPartsExclusions } = useStoreWithInitializer(
        ({ exclusions }) => exclusions,
        dispatchOnCall(initializePartsExclusions())
    );
    const [productCategoryList, setProductCategoryList] = useState<any>([])

    useEffect(() => {
        onLoad(props.ProductCategoryId.toString(), props.ContractId.toString()); // Pass Props to onLoad function
    }, []);

    return (
        <ContainerPage>
            {props.View ? (
                <>
                    <div className="px-2 ms-1">
                        {contractPartsExclusions.length > 0 && (
                            <>
                                <div className="fw-bold">
                                    {t('partsexclusions_partsnotcovered_label1')}
                                </div>
                                <div className="d-flex flex-wrap">
                                    {contractPartsExclusions.map((eachpartcategory) => (
                                        <div className="mt-1 me-2">
                                            <span className="badge rounded-pill bg-secondary text-white">{eachpartcategory}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                </>
            ) : (
                <>
                    {contractPartsExclusions.length ? (
                        <div className="mt-2 px-0" >
                            <div>{t('partsexclusions_partsnotcovered_label')}
                                &nbsp;
                                <span className="fw-bold">{props.ProductCategoryName ? props.ProductCategoryName : (productCategoryList.find(option => option.value === props.ProductCategoryId) || {}).label || '---'}</span>
                            </div>
                            <div className="row mt-1">
                                {contractPartsExclusions.map((eachpartcategory) => (
                                    <div className="mt-1 me-2 ">
                                        <li>{eachpartcategory}</li>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="mt-2 px-0 text-muted" >{t('partsexclusions_partsnotcovered_label2')} &nbsp;
                            <span className="fw-bold">{(productCategoryList.find(option => option.value === props.ProductCategoryId) || {}).label || '---'}</span>
                        </div>
                    )}
                </>
            )}
        </ContainerPage>
    );

    async function onLoad(ProductCategoryId: string, ContractId: string) { // Accept Props as a parameter
        store.dispatch(initializePartsExclusions());
        try {
            const { ProductCategoryNames } = await getProductCategory()
            setProductCategoryList(formatSelectInput(ProductCategoryNames, "CategoryName", "Id"))

            const data = await getSelectedPartsNotCovered(ProductCategoryId, ContractId);
            store.dispatch(loadPartsCategory(data.ProductCategoryPartnotCovered[0].PartCategoryNames));
        } catch (error) {
            console.error(error);
        }
    }
}