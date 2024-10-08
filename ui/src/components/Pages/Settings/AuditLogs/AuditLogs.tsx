import { useEffect } from 'react';
import { Container, } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import BreadCrumb from '../../../BreadCrumbs/BreadCrumb';
import { t } from 'i18next';
import { getAllUsersNames } from '../../../../services/users';
import { store } from '../../../../state/store';
import { useStore } from '../../../../state/storeHooks';
import { AuditLogsState, loadDatabaseTables, updateErrors, updateField } from './AuditLogs.slice';
import { formatDocumentName, formatSelectInput } from '../../../../helpers/formats';
import { getBaseTableNamesListForDropDown } from '../../../../services/masterData';
import { submitAuditLogs } from '../../../../services/auditlogs';
import FileSaver from 'file-saver';
import * as yup from 'yup';
import { ValidationErrorComp } from '../../../ValidationErrors/ValidationError';


const AuditLogs = () => {

  const { TableList, AuditLog,errors } = useStore(({ auditlogs }) => auditlogs);  

  const onLoad = async () => {
    try {
      const result = await getBaseTableNamesListForDropDown();
      // For Removing the first table name from the list 
      if (result.TableNames && result.TableNames.length > 0) {
        const modifiedTableNames = result.TableNames.slice(1);
        const formattedTableNames = modifiedTableNames.map(table => ({ label: table.TableName, value: table.TableName }));
        store.dispatch(loadDatabaseTables({ TableNames: formattedTableNames }));
      }
    } catch (error) {
      return
    }
  }

  const validationSchema = yup.object().shape({ 
    TableName: yup.string().required('validation_error_auditlog_tablename_required'), 
});

  useEffect(() => {
    onLoad()
  }, [])

  const onSelectChange = (ev) => {
    const name = ev.target.name;
    const value = ev.target.value;
    store.dispatch(updateField({ name: name as keyof AuditLogsState['AuditLog'], value }));
  }

  function onFieldChangeSelect(selectedOption, actionMeta) {
    const name = actionMeta.name;
    const value = selectedOption.value;
    store.dispatch(updateField({ name: name as keyof AuditLogsState['AuditLog'], value }));
  }

  const handleSubmit = async () => {
    store.dispatch(updateErrors({}))
    try {
        await validationSchema.validate(AuditLog, { abortEarly: false });
    } catch (error: any) {
        const errors = error.inner.reduce((allErrors: any, currentError: any) => {
            return { ...allErrors, [currentError.path as string]: currentError.message };
        }, {});
        store.dispatch(updateErrors(errors))
        if (errors)
            return;
    }
    try {
      const response = await submitAuditLogs(AuditLog);
      const url = window.URL.createObjectURL(response.data);
        FileSaver.saveAs(url, formatDocumentName());
    } catch (error) {   
      return;   
    }
  }

  const actionOptions = [
    { label: "Insert", value: "I" },
    { label: "Update", value: "U" },
    { label: "Delete", value: "D" }
  ];

  const breadcrumbItems = [
    { Text: 'breadcrumbs_home', Link: '/' },
    { Text: 'breadcrumbs_audit_logs' }
  ];
  
  return (
    <Container>
      <BreadCrumb items={breadcrumbItems} />
      <ValidationErrorComp errors={errors} />
      <h5>{t("auditlog_title")}</h5>
      <p>{t("auditlog_helper_text")}</p>
      <div>
        <div className="div">
          <label className="mt-2 red-asterisk">{t('auditlog_choose_table_name')}</label>
          <Select
            options={TableList}
            isSearchable
            classNamePrefix="react-select"
            name="TableName"
            placeholder={t("auditlog_choose_table_placeholder")}
            onChange={onFieldChangeSelect}
          />
           <div className="small text-danger"> {t(errors['TableName'])}</div>
        </div>
        <div className="row py-1">
          <div className="col-6">
            <label>{t("auditlog_label_startdate")}</label>
            <input name="StartDate" className="form-control" type="date"
              value={AuditLog.StartDate ? AuditLog.StartDate : ""}
              onChange={onSelectChange} />
          </div>
          <div className="col-6">
            <label>{t("auditlog_label_enddate")}</label>
            <input name="EndDate" className="form-control" type="date"
              value={AuditLog.EndDate ? AuditLog.EndDate : ""}
              onChange={onSelectChange} />
          </div>
        </div>
        <div className="div">
          <label className="mt-2 ">{t('auditlog_action_label')}</label>
          <Select
            options={actionOptions}
            isSearchable
            classNamePrefix="react-select"
            name="Action"
            placeholder={t("auditlog_action_placeholder")}
            onChange={onFieldChangeSelect}
          />
        </div>
        <div className="my-3">
          <button type="button" onClick={handleSubmit} className='w-100 app-primary-bg-color text-white'>{t("auditlog_button_show_audit_logs")}</button>
        </div>
      </div>
    </Container>
  );
}

export default AuditLogs;
