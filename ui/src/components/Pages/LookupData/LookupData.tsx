import { useState } from 'react'
import { ContainerPage } from '../../ContainerPage/ContainerPage'
import BreadCrumb from '../../BreadCrumbs/BreadCrumb'
import { store } from '../../../state/store';
import { changePage, initializeConfigurations, loadEntitiesLists, setConfigurations, setEntityDataSearch, setSearch } from './LookupData.slice';
import { deleteLookupData, getMasterEntityNames, getSelectedConfigurations } from '../../../services/lookupdata';
import { formatSelectInput } from '../../../helpers/formats';
import { useTranslation } from 'react-i18next';
import { useStoreWithInitializer } from '../../../state/storeHooks';
import { Pagination } from '../../Pagination/Pagination';
import { updateEntityId } from './LookupDataCreate.slice';
import { checkForPermission } from '../../../helpers/permissions';
import SweetAlert from 'react-bootstrap-sweetalert';
import toast, { Toaster } from 'react-hot-toast';
import { LookupDataCreate } from './LookupDataCreate';
import { LookupDataEdit } from './LookupDataEdit/LookupDataEdit';
import { loadMasterEntityData } from './LookupDataEdit/LookupDataEdit.slice';

const LookupData = () => {

    const { t, i18n } = useTranslation();
    const { entitiesLists, entitydata, entityDataSearch, currentPage, totalRows, perPage, search } = useStoreWithInitializer(({ lookupdata }) => lookupdata, onLoad);
    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_masters', Link: '/config/masters' },
        { Text: 'breadcrumbs_masters_lookup_data' }
    ];
    const [Id, setId] = useState(0);
    const [EntityId, setEntityId] = useState(0);
    const [name, setName] = useState("")

    async function onLoad() {
        store.dispatch(initializeConfigurations());
        try {
            const entitiesLists = await getMasterEntityNames(search, currentPage);
            const EntityList = await formatSelectInput(entitiesLists.EntitiesLists, "EntityType", "Id")
            const payload = {
                Select: EntityList,
                TotalRows: entitiesLists.TotalRows,
                PerPage: entitiesLists.PerPage,
                Search: search
            };
            store.dispatch(loadEntitiesLists(payload));
        } catch (error) {
            return
        }
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const entitiesLists = await getMasterEntityNames(search, index);
        const EntityList = await formatSelectInput(entitiesLists.EntitiesLists, "EntityType", "Id")
        const payload = {
            Select: EntityList,
            TotalRows: entitiesLists.TotalRows,
            PerPage: entitiesLists.PerPage,
            Search: ""
        };
        store.dispatch(loadEntitiesLists(payload));
    }

    async function getSelectedTableDetails(Id: number) {
        setEntityId(Id);
        const result = await getSelectedConfigurations(Id, entityDataSearch);
        store.dispatch(setConfigurations(result));
        store.dispatch(updateEntityId(Id))
    }

    const handleConfirmDelete = (Id: number) => {
        setId(Id);
    };

    const handleCancelElete = () => {
        setId(0);
    };

    function DeleteConfirmationModal() {
        return (
            <SweetAlert
                danger
                showCancel
                confirmBtnText={t('lookupdata_delete_confirm_btn')}
                confirmBtnBsStyle="danger"
                title={t('lookupdata_delete_title')}
                onConfirm={() => handleDelete(Id)}
                onCancel={handleCancelElete}
                focusCancelBtn
            >
                {t('lookupdata_delete_question')}
            </SweetAlert>
        );
    }

    async function handleDelete(Id: number) {
        var result = await deleteLookupData(Id);
        setId(0);
        result.match({
            ok: () => {
                toast(i18n.t('lookupdata_message_success_delete'), {
                    duration: 3000,
                    style: {
                        borderRadius: '0',
                        background: '#00D26A',
                        color: '#fff',
                    },
                });
                getSelectedTableDetails(EntityId)
            },
            err: (err) => {
                toast(i18n.t(err.Message), {
                    duration: 3600,
                    style: {
                        borderRadius: '0',
                        background: '#F92F60',
                        color: '#fff',
                    },
                });
                getSelectedTableDetails(EntityId)
            },
        });
    }

    async function filterLookUpDataList(e) {
        store.dispatch(changePage(1))
        const entitiesLists = await getMasterEntityNames(search, 1)
        const EntityList = await formatSelectInput(entitiesLists.EntitiesLists, "EntityType", "Id")
        const payload = {
            Select: EntityList,
            TotalRows: entitiesLists.TotalRows,
            PerPage: entitiesLists.PerPage,
            Search: search
        };
        store.dispatch(loadEntitiesLists(payload));
    }

    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            store.dispatch(changePage(1))
            const entitiesLists = await getMasterEntityNames("", currentPage)
            const EntityList = await formatSelectInput(entitiesLists.EntitiesLists, "EntityType", "Id")
            const payload = {
                Select: EntityList,
                TotalRows: entitiesLists.TotalRows,
                PerPage: entitiesLists.PerPage,
                Search: ""
            };
            store.dispatch(loadEntitiesLists(payload));
        }
    }

    const addEntityData = async (event: any) => {
        store.dispatch(setEntityDataSearch(event.target.value));
        if (event.target.value == "") {
            const result = await getSelectedConfigurations(EntityId, entityDataSearch);
            store.dispatch(setConfigurations(result));
            store.dispatch(updateEntityId(EntityId))
        }
    }

    return (
        <ContainerPage>
            <div>
                <BreadCrumb items={breadcrumbItems} />
                <div className="m-2">
                    <div>
                        <p className="mt-1">{t('lookupdata_management_subtext1')}&nbsp;{t('lookupdata_management_subtext2')}</p>
                    </div>
                </div>
                <div className="row mx-0">
                    <div className="col-md-5 d-flex ps-2">
                        <input
                            type='search'
                            className="form-control custom-input"
                            onChange={addData}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    filterLookUpDataList(e);
                                }
                            }}
                            name='search'
                            value={search}
                            placeholder={`${t('manage_lookupdata_button_search_plaaceholder')}`}
                        />
                        <button
                            className="btn app-primary-bg-color text-white float-end "
                            type="button"
                            onClick={filterLookUpDataList}
                        >
                            {t('manage_lookupdata_button_search')}
                        </button>
                    </div>
                    {entitydata.match({
                        none: () => <></>,
                        some: (TableData) => <div className='col-md-7 fs-6 app-primary-color'>{name}</div>
                    })}
                </div>
                <div className="row mx-2 p-0 my-2 pt-2">
                    <div className="col-md-5 ps-0">
                        {entitiesLists.map((field, index) => (
                            <a className="pseudo-href app-primary-color  text-decoration-none"
                                data-toggle="tooltip"
                                key={index}
                                data-placement="left"
                                title={'View'}
                                onClick={() => {
                                    getSelectedTableDetails(field.value);
                                    setName(field.label)
                                }}
                            >
                                <div className={`border rounded p-2 mb-2 ${name == field.label && 'bg-light'}`}>{field.label}</div>
                            </a>
                        ))}
                    </div>
                    <div className="col-md-7 border rounded mb-2 p-1 m-0">
                        {entitydata.match({
                            none: () => <></>,
                            some: (TableData) =>
                                <div className="mx-2 mt-2">
                                    <div className="col col-md-12">
                                        <div className="mb-3">
                                            <div className="input-group">
                                                <input type='search' className="form-control custom-input " value={entityDataSearch} placeholder={t('lookupdata_management_placeholder_search') ?? ''} onChange={addEntityData}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            getSelectedTableDetails(EntityId);
                                                        }
                                                    }} />
                                                <button className="btn app-primary-bg-color text-white float-end" type="button" onClick={() => getSelectedTableDetails(EntityId)}>
                                                    {t('lookupdata_management_search_button')}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <label className="form-label col-md-6 mt-2">{t('lookupdata_management_label_table_content')}</label>
                                            <div className="col-md-6 ">
                                                {checkForPermission("LOOKUPDATA_MANAGE") && <button className="btn text-white app-primary-bg-color float-end" data-bs-toggle="modal" data-bs-target="#createNewMasterData">
                                                    {t('lookupdata_button_add_masterdata')}
                                                </button>
                                                }
                                            </div>
                                        </div>
                                        {TableData.length > 0 && (
                                            <div className="row mt-2">
                                                <>
                                                    <div className="">
                                                        {TableData.map((field, index) => (
                                                            <div key={index}>
                                                                <div className="row my-3 p-0">
                                                                    <div className="col">
                                                                        <div >
                                                                            {index + 1}.&nbsp;&nbsp;<span className='fs-6'>{field.entitydata.Name}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col d-flex justify-content-end">
                                                                        {field.entitydata.IsSystemData == false &&
                                                                            <>
                                                                                <div className="form-check form-switch">
                                                                                    {checkForPermission("LOOKUPDATA_MANAGE") &&
                                                                                        <a
                                                                                            className="pseudo-href app-primary-color"
                                                                                            onClick={() => {
                                                                                                store.dispatch(loadMasterEntityData(field.entitydata))
                                                                                            }}
                                                                                            data-bs-toggle="modal"
                                                                                            data-toggle="tooltip" data-placement="left" title={'Edit'}
                                                                                            data-bs-target="#EditMasterData"
                                                                                        >
                                                                                            <span className="material-symbols-outlined me-2 custom-pointer-cursor text-size-30">
                                                                                                edit_note
                                                                                            </span>
                                                                                        </a>
                                                                                    }
                                                                                </div>
                                                                                <span className="custom-pointer-cursor material-symbols-outlined app-primary-color text-size-20" onClick={() => handleConfirmDelete(field.entitydata.Id)}>
                                                                                    Delete
                                                                                </span>
                                                                            </>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            </div>

                                        )}
                                        {/* Modals */}
                                        {Id ? <DeleteConfirmationModal /> : ""}
                                        <LookupDataCreate />
                                        <LookupDataEdit Id={EntityId} />
                                        <Toaster />
                                        {/* Modals ends */}
                                    </div>
                                </div>
                        })}
                    </div>
                </div>
                <div className="row ms-1">
                    <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                </div>
            </div>
        </ContainerPage>
    )
}

export default LookupData