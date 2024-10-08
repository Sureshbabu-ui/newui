import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../../ValidationErrors/ValidationError";
import { store } from "../../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../../Preloader/Preloader.slice";
import { useStore } from '../../../../../../state/storeHooks';
import { useEffect, useRef } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { convertBackEndErrorsToValidationErrors } from "../../../../../../helpers/formats";
import * as yup from 'yup';
import { Fragment } from 'react';
import { useParams } from "react-router-dom";
import { PartCategorySelected, PartCategoryUnSelected, loadPCPartsNotCovered, initializeProductCategoryPartsCovered, loadPartsCategory, toggleInformationModalStatus, updateErrors, updateField } from "./ProductCategoryPartsNotCovered.slice";
import { UpdatePartsNotCovered, getProductCategoryPartsNotCovered } from "../../../../../../services/assetProductCategory";
import { checkForPermission } from "../../../../../../helpers/permissions";
import BreadCrumb from "../../../../../BreadCrumbs/BreadCrumb";
import { getAssetProductCategoryPartsCategoryMapping } from "../../../../../../services/partCategory";

export const ProductCategoryPartsNotCovered = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const {
        partsnotcovered: { PartCategory, productCategoryPartNotCovered, displayInformationModal, errors },
    } = useStore(({ partsnotcovered, app }) => ({ partsnotcovered, app }));

    const { PCId } = useParams<{ PCId: string }>();

    useEffect(() => {
        store.dispatch(initializeProductCategoryPartsCovered())
        onLoad(PCId);
    }, [PCId]);
    
    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_masters', Link: '/config/masters' },
        { Text: 'breadcrumbs_masters_assetproduct_category', Link: '/masterdata/assetproductcategory' },
        { Text: 'breadcrumbs_masters_parts_not_covered' }
    ];

    const updatePartsCoveredList = async () => {
        store.dispatch(toggleInformationModalStatus());
        const result = store.getState().partsnotcovered.productCategoryPartNotCovered.PartCategoryData
        store.dispatch(loadPCPartsNotCovered(result));
        modalRef.current?.click();
    }

    const validationSchema = yup.object().shape({
        PartCategoryData: yup.string().required('Please select parts category')
    });

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(store.getState().partsnotcovered.productCategoryPartNotCovered, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await UpdatePartsNotCovered(productCategoryPartNotCovered)
        result.match({
            ok: () => {
                store.dispatch(toggleInformationModalStatus());
            },
            err: (e) => {
                const errorMessages = convertBackEndErrorsToValidationErrors(e)
                store.dispatch(updateErrors(errorMessages));
            },
        });
        store.dispatch(stopPreloader());
    }

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={updatePartsCoveredList}>
                {t('partsnotcovered_success_message')}
            </SweetAlert>
        );
    }
    return (
        <>      <BreadCrumb items={breadcrumbItems} />

            {checkForPermission("ASSETPRODUCTCATEGORY_VIEW") &&
                <div>
                    <h5 className="mt-2">{t('partsnotcovered_main_heading')}</h5>
                    {/* part not covered starts */}
                    {PartCategory.length > 0 ? (
                        <>
                            <ValidationErrorComp errors={errors} />
                            <div className=''>
                                <div className='mb-1 m-0'>
                                    <div className="mt-3" >
                                        <label className="mb-1">{t('partsnotcovered_label_partcategory')} <strong>{store.getState().productcategorydetails.singleproductcategory.CategoryName}</strong></label>
                                        <br></br>
                                        <div className="text-danger small">
                                            {errors['PartCategoryData']}
                                        </div>
                                        {PartCategory.map((eachpartcategory) => (
                                            <div key={eachpartcategory.PartCategory.Id}  className="mt-1" >
                                                <input onChange={handleCheckboxClick}
                                                    type="checkbox"
                                                    value={eachpartcategory.PartCategory.Id}
                                                    checked={isPartsNotCoveredSelected(parseInt(eachpartcategory.PartCategory.Id.toString()))}
                                                    name="PartCategoryData"
                                                    className={`form-check-input ${errors["PartCategoryData"] ? "is-invalid" : ""}`} />&nbsp;
                                                <label className="form-check-label ms-2">{eachpartcategory.PartCategory.Name}</label>&nbsp;
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-md-12 mt-2">
                                    {
                                    checkForPermission('PRODUCT_CATEGORY_PARTS_NOT_COVERED_UPDATE') && 
                                    <button type='button' className='btn app-primary-bg-color text-white mt-2' onClick={onSubmit}>
                                        {t('partsnotcovered_update_button')}
                                    </button>
}
                                </div>
                            </div>
                        </>
                    ) : (
                        <Fragment>
                            <p className="mt-4">
                                {t('partsnotcovered_message1')} <a href='/masterdata/partcategory'>{t('partsnotcovered_message2')}</a>
                                {t('partsnotcovered_message3')}
                            </p>
                        </Fragment>
                    )}

                    {displayInformationModal ? <InformationModal /> : ""}
                </div>
            }

        </>
    );

    function isPartsNotCoveredSelected(Id: number) {
        const notCoveredParts = store.getState().partsnotcovered.productCategoryPartNotCovered;
        if (typeof notCoveredParts === "undefined") {
            return false;
        }
        const formatedArray = notCoveredParts.PartCategoryData.split(',').map(item => {
            const [id, value] = item.split('.');
            return { id, value: parseInt(value) };
        });

        const findmachingData = formatedArray.find(partcategoryId => partcategoryId.id === Id.toString());
        if (findmachingData) {
            return findmachingData.value === 1;
        } else {
            return false;
        }
    }

    function handleCheckboxClick(ev: any) {
        const partsnotcovered = store.getState().partsnotcovered.productCategoryPartNotCovered.PartCategoryData;
        const partCategoryId = ev.target.value;

        if (ev.target.checked) {
            const updatedPartsCategory = partsnotcovered.split(',').filter(part => !part.startsWith(partCategoryId + '.'));
            updatedPartsCategory.push(partCategoryId + '.1');

            let updatedPartsnotcovered = updatedPartsCategory.join(',');
            if (updatedPartsnotcovered.charAt(0) == ",") {
                updatedPartsnotcovered = updatedPartsnotcovered.substring(1)
            }
            store.dispatch(PartCategorySelected(updatedPartsnotcovered));
        }
        else {
            const partWithStatusOne = partCategoryId + '.1';
            const instance = store.getState().partsnotcovered.snapPartNotCovered.PartCategoryData.split(',');
            const filteredData = instance.includes(partCategoryId + '.1');

            if (filteredData) {
                const updatedPartsArray = partsnotcovered.split(',').map(part => {
                    if (part === partWithStatusOne) {
                        return partCategoryId + '.0';
                    }
                    return part;
                });
                const updatedPartsnotcovered = updatedPartsArray.join(',');
                store.dispatch(PartCategoryUnSelected(updatedPartsnotcovered));
            }
            else {
                const output = partsnotcovered.split(',').filter(item => {
                    return item != partCategoryId + '.1'
                })
                store.dispatch(PartCategoryUnSelected(output.join(',')))
            }
        }

    }

    async function onLoad(PCId: string) {
        store.dispatch(initializeProductCategoryPartsCovered());
        try {
            const result = await getAssetProductCategoryPartsCategoryMapping(PCId);
            store.dispatch(loadPartsCategory(result));
            store.dispatch(updateField({ name: "ProductCategoryId", value: PCId }));

            const data = await getProductCategoryPartsNotCovered(PCId)
            store.dispatch(loadPCPartsNotCovered(data.ProductCategoryPartsNotCovered[0].productCategoryPartsNotCovered));
        } catch (error) {
            console.error(error);
        }
    }
}