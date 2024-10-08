import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../../state/storeHooks';
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { store } from '../../../../../state/store';
import { initializeStockRoomList, loadStockRooms, setSearch } from './StockRoomList.slice'
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { checkForPermission } from "../../../../../helpers/permissions";
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";
import { deleteStockRoom, getStockRoomList } from "../../../../../services/stockroom";
import { StockRoomCreate } from "../StockRoomCreate/StockRoomCreate";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { loadStockRoomDetails } from "../StockRoomEdit/StockRoomEdit.slice";
import { StockRoomEdit } from "../StockRoomEdit/StockRoomEdit";
import SweetAlert from "react-bootstrap-sweetalert";
import toast, { Toaster } from 'react-hot-toast';

export const StockRoomList = () => {
    const { t,i18n } = useTranslation();
    const {
        stockroomlist: { stockroom, totalRows, search },
    } = useStore(({ stockroomlist, app }) => ({ stockroomlist, app }));

    useEffect(() => {
        if (checkForPermission("STOCKROOM_VIEW")) {
            onLoad();
        }
    }, []);

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeStockRoomList());
        try {
            const stockrooms = await getStockRoomList(search);
            store.dispatch(loadStockRooms(stockrooms));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    async function filterstockroomsList(e) {
        const result = await getStockRoomList(store.getState().stockroomlist.search)
        store.dispatch(loadStockRooms(result));
    }
    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            const result = await getStockRoomList(store.getState().stockroomlist.search);
            store.dispatch(loadStockRooms(result));
        }
    }

    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_masters', Link: '/config/masters' },
        { Text: 'breadcrumbs_masters_stockroom' },
    ];

    const [Id, setId] = useState(0);

    const handleConfirm = (StockRoomId: number) => {
        setId(StockRoomId);
    };

    const handleCancel = () => {
        setId(0);
    };

    function DeleteConfirmationModal() {
        return (
            <SweetAlert
                danger
                showCancel
                confirmBtnText={t('stockroom_delete_confirm_btn')}
                confirmBtnBsStyle="danger"
                title={t('stockroom_delete_title')}
                onConfirm={() => handleDelete(Id)}
                onCancel={handleCancel}
                focusCancelBtn
            >
                {t('stockroom_delete_question')}
            </SweetAlert>
        );
    }

    async function handleDelete(Id: number) {
        var result = await deleteStockRoom(Id);
        result.match({
            ok: () => {
                setId(0);
                toast(i18n.t('stockroom_message_success_delete'), {
                    duration: 3000,
                    style: {
                        borderRadius: '0',
                        background: '#00D26A',
                        color: '#fff',
                    },
                });
                onLoad();
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
                setId(0);
            },
        });
    }

    return (<ContainerPage>
        <>
            <BreadCrumb items={breadcrumbItems} />
            {
                checkForPermission("STOCKROOM_VIEW") &&
                stockroom.match({
                    none: () => <>{t('stockroom_list_loading')}</>,
                    some: (Stockroom) => <div className="ps-3 pe-4 ">
                        <div className="row mt-1 mb-3 p-0 ">
                            <div className="col-md-9 app-primary-color ">
                                <h5 className="ms-0 ps-1"> {t('stockroom_list_title')}</h5>
                            </div>
                            {
                                checkForPermission("STOCKROOM_MANAGE") &&
                                <div className="col-md-3 ">
                                    <button className="btn app-primary-bg-color text-white float-end " data-bs-toggle='modal' data-bs-target='#Createstockroom'>
                                        {t('stockroom_list_button_create')}
                                    </button>
                                </div>
                            }
                        </div>
                        <div className="mb-3 ps-1">
                            <div className="input-group">
                                <input type='search' className="form-control custom-input" value={search} placeholder={t('stockroom_list_placeholder_search') ?? ''}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            filterstockroomsList(e);
                                        }
                                    }} onChange={addData} />
                                <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterstockroomsList}>
                                    {t('stockroom_list_button_search')}
                                </button>
                            </div>
                        </div>
                        <div className="row mt-3 ps-1">
                            {Stockroom.length > 0 ? (
                                <div className="row ms-0">
                                    {Stockroom.map((field, index) => (
                                        <OverlayTrigger
                                            key={index}
                                            placement="auto"
                                            overlay={<Tooltip>{field.stockroom.Description}</Tooltip>}
                                        >
                                            <div className="col-md-2 col-sm-2 bg-light me-2 mb-2 p-0 shadow-sm">
                                                <div className="d-flex flex-column h-100">
                                                    {/* Status and Actions */}
                                                    <div className="d-flex justify-content-between align-items-center p-2">
                                                        <span className={`material-symbols-outlined ${field.stockroom.IsActive ? "text-success" : "text-warning"} fs-5`}>circle</span>
                                                        <div className="d-flex">
                                                            <a
                                                                onClick={() => store.dispatch(loadStockRoomDetails(field.stockroom))}
                                                                data-bs-toggle="modal"
                                                                className="custom-pointer-cursor me-2"
                                                                data-toggle="tooltip"
                                                                data-placement="left"
                                                                title="Edit"
                                                                data-bs-target="#Editstockroom"
                                                            >
                                                                <span className="material-symbols-outlined app-primary-color">edit_note</span>
                                                            </a>
                                                            <span
                                                                className="custom-pointer-cursor material-symbols-outlined text-size-20 app-primary-color"
                                                                onClick={() => handleConfirm(field.stockroom.Id)}
                                                                data-toggle="tooltip"
                                                                data-placement="left"
                                                                title="Delete"
                                                            >
                                                                delete
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {/* Status and Actions end */}

                                                    {/* Room name */}
                                                    <div className="text-center app-primary-color fs-3 fw-bold pb-5">{field.stockroom.RoomName}</div>
                                                    {/* Room name ends */}
                                                </div>
                                            </div>

                                        </OverlayTrigger>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-muted ps-3">{t('stockroomlist_no_data')}</div>
                            )}
                        </div>
                        {Id ? <DeleteConfirmationModal /> : ""}
                        <Toaster />
                        <StockRoomEdit />
                        <StockRoomCreate />
                    </div>
                })}
        </>
    </ContainerPage>)
}