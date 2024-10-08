import { store } from '../../../../state/store';
import { useStore } from '../../../../state/storeHooks';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import { approvalPartIndentList } from '../../../../services/partIndent';
import { formatDateTime } from '../../../../helpers/formats';
import BreadCrumb from '../../../BreadCrumbs/BreadCrumb';
import { Pagination } from '../../../Pagination/Pagination';
import { checkForPermission } from '../../../../helpers/permissions';
import { useEffect } from 'react';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';
import { initializePartIndent,changePage,setSearch, loadPartIndent } from '../../Inventory/PartIndentRequest/PartIndentRequestList/PartIndentRequestList.slice';
import { PartIndentReview } from '../../Inventory/PartIndentRequest/PartIndentReview/PartIndentReview';

const SmeIndents = () => {
  const { t } = useTranslation();

  const breadcrumbItems = () => {
      return [
          { Text: 'breadcrumbs_home', Link: '/' },
          { Text: 'breadcrumbs_sme_view', Link: '' },
          { Text: 'breadcrumbs_sme_view_indents' }
      ];
  }
  const { partindent, currentPage, search, totalRows, perPage } = useStore(
      ({ partindentrequestlist }) => partindentrequestlist
  );  

  const onLoad = async () => {
      store.dispatch(startPreloader())
      store.dispatch(initializePartIndent());
      try {
          const currentPage = store.getState().partindentrequestlist.currentPage;
          const searchKey = store.getState().partindentrequestlist.search;
          const result = await approvalPartIndentList(currentPage, searchKey,store.getState().partindentrequestlist.AssetProductCategoryId);
          store.dispatch(loadPartIndent(result));
      } catch (error) {
         return
      }
      store.dispatch(stopPreloader())
  }

  useEffect(() => {
      onLoad();
  }, []);

  async function onPageChange(index: number) {
      store.dispatch(changePage(index));
      const result = await approvalPartIndentList(index, search,store.getState().partindentrequestlist.AssetProductCategoryId);
      store.dispatch(loadPartIndent(result));
  }

  const addData = async (event: any) => {
      store.dispatch(setSearch(event.target.value));
      if (event.target.value == "") {
          store.dispatch(changePage(1))
          const result = await approvalPartIndentList(store.getState().partindentrequestlist.currentPage, store.getState().partindentrequestlist.search);
          store.dispatch(loadPartIndent(result));
      }
  }
  async function filterPartIndentRequests(event: any) {
      store.dispatch(changePage(1))
      const requests = await approvalPartIndentList(1, search);
      store.dispatch(loadPartIndent(requests));
  }
  return (
      <div>
          <BreadCrumb items={breadcrumbItems()} />
          <div className="ps-2 m-0  fs-5">{t("sme_indent_title")}</div>

          {checkForPermission('PARTINDENT_APPROVAL') ?
              <div className=''>
                  {partindent.match({
                      none: () => <>{t('partindent_list_th_loading')}</>,
                      some: (partindent) => (
                          <div className="row mt-1 m-0 ps-0">
                              {partindent.length > 0 ? (
                                  <div className="">
                                      <div className="">
                                          <div className="input-group">
                                              <input type='search' className="form-control custom-input" value={search} placeholder={t('smeapproval_partindent_list_search_placeholder') ?? ''} onChange={addData}
                                                  onKeyDown={(e) => {
                                                      if (e.key === 'Enter') {
                                                          filterPartIndentRequests(e);
                                                      }
                                                  }} />
                                              <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterPartIndentRequests}>
                                                  {t('partindentrequestlist_btn_search')}
                                              </button>
                                          </div>
                                      </div>
                                      <table className="table table-bordered text-nowrap mt-2">
                                          <thead>
                                              <tr>
                                                  <th></th>
                                                  <th scope="col">{t('partindent_label_indentnum')}</th>
                                                  <th scope="col">{t('partindent_label_requestdate')}</th>
                                                  <th scope="col">{t('partindent_label_engname')}</th>
                                                  <th scope="col">{t('partindent_label_location')}</th>
                                              </tr>
                                          </thead>
                                          <tbody>
                                              {partindent.map(({ partindent }, index) => (
                                                  <tr key={index}>
                                                      <td className='text-center'>
                                                          <Link
                                                              to={`/logistics/partindentrequests/view/${partindent.Id}`}
                                                              className='pseudo-href app-primary-color'
                                                              data-toggle="tooltip" data-placement="left" title={'View'}
                                                          >
                                                              <FeatherIcon icon={"eye"} size="16" />
                                                          </Link>
                                                      </td>
                                                      <td>{partindent.IndentRequestNumber}</td>
                                                      <td>{formatDateTime(partindent.CreatedOn)}</td>
                                                      <td>{partindent.RequestedBy}</td>
                                                      <td>{partindent.Location}</td>
                                                  </tr>
                                              ))}
                                          </tbody>
                                      </table>
                                  </div>
                              ) : (
                                  <div className="text-muted ps-0 mt-1">{t('partindentlist_th_norecords')}</div>
                              )}
                          </div>
                      ),
                  })}
                  {/* Pagination */}
                  <div className='row m-0'>
                      <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                  </div>
                  {/* Pagination ends */}
                  <PartIndentReview />
              </div>
              :
              <></>
          }
      </div>
  );
}

export default SmeIndents