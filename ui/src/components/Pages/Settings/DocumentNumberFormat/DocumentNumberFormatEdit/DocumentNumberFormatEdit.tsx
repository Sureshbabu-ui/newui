import { useEffect, useRef, useState } from 'react';
import { initializeDocumentNumberFormatEdit, updateField, updateErrors, toggleInformationModalStatus, DocumentNumberFormatEditState, loadDocTypes, setProceed, setCustomString, NumFormatupdateField, createFormatArray, SampleNumFormatupdateField, createFormat, clearFormatArray, setSampleArray } from './DocumentNumberFormatEdit.slice'
import * as yup from 'yup';
import Select from 'react-select';
import { useStore } from '../../../../../state/storeHooks';
import { useTranslation } from 'react-i18next';
import { store } from '../../../../../state/store';
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from '../../../../../helpers/formats';
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { EditDocumentNumberFormat, getDocumentNumberFormatList } from '../../../../../services/documentnumberformat';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ValidationErrorComp } from '../../../../ValidationErrors/ValidationError';
import { loadDocumentNumberFormatList } from '../DocumentNumberFormat.slice';
import { getValuesInMasterDataByTable } from '../../../../../services/masterData';

export const DocumentNumberFormatEdit = () => {
  const modalRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();
  const [submit, setEnableSubmit] = useState(false);
  const [customStringError, setcustomStringError] = useState("");
  const { displayInformationModal, errors, numberformat, DocumentTypes, NumFormatArray, SampleDocumentFormat, IsProceed, CustomString } = useStore(({ numberformatedit }) => numberformatedit)

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async () => {
    try {
      store.dispatch(initializeDocumentNumberFormatEdit())
      var { MasterData } = await getValuesInMasterDataByTable('DocumentType');
      const doctypes = await formatSelectInput(MasterData, 'Name', 'Id');
      store.dispatch(loadDocTypes({ MasterData: doctypes }));
    } catch (error) {
      return error;
    }
  }

  useEffect(() => {
    const valueToSampleMap = options.reduce((map, { value, sample }) => ({ ...map, [value]: sample }), { '{NOSPACE}': '' });

    const updatedSampleArray = SampleDocumentFormat.map(item => ({
      ...item, value: valueToSampleMap[item.value] ?? item.value
    }));

    store.dispatch(setSampleArray(updatedSampleArray));
  }, [NumFormatArray]);

  const validationSchema = yup.object().shape({
    separator: yup.string().nullable().matches(/^[!@#$%^&*()_+/\-=;':"\\|,.<>?`~[\]]+$/, {
      message: t('validation_error_documentnumberformat_edit_separator_valid_required') ?? '',
      excludeEmptyString: true,
    }),
    DocumentTypeId: yup.number().positive('validation_error_documentnumberformat_edit_dctype_required'),
    NumberPadding: yup.number().moreThan(0, 'validation_error_documentnumberformat_edit_numpadding_required').typeError('validation_error_documentnumberformat_edit_numpadding_required'),
    documentNumber: yup.number().moreThan(0, 'validation_error_documentnumberformat_edit_documentnumber_required').typeError('validation_error_documentnumberformat_edit_documentnumber_required').max(5, ('validation_error_documentnumberformat_edit_documentnumber_amcvalue_exceeds'))
  });

  const validationFormatSchema = yup.object().shape({
    Format: yup.string().max(32, t('validation_error_documentnumberformat_edit_format_valid_required') ?? '')
  });

  const onModalClose = () => {
    store.dispatch(initializeDocumentNumberFormatEdit())
    onLoad()
    store.dispatch(setCustomString({ index: 0, value: "" }))
  }

  const onResetFormat = () => {
    store.dispatch(clearFormatArray())
    setEnableSubmit(false)
    setcustomStringError("")
  }

  const onProceed = async () => {
    store.dispatch(updateErrors({}));
    try {
      await validationSchema.validate(numberformat, { abortEarly: false });
    } catch (error: any) {
      const errors = error.inner.reduce((allErrors: any, currentError: any) => {
        return { ...allErrors, [currentError.path as string]: currentError.message };
      }, {});
      store.dispatch(updateErrors(errors))
      if (errors)
        return;
    }
    store.dispatch(setProceed(true))
    store.dispatch(createFormatArray(true))
  }

  useEffect(() => {
    setEnableSubmit(false)
  }, [IsProceed])

  const onSubmit = async () => {
    store.dispatch(updateErrors({}));
    if (checkCustomString() == false) {
      setcustomStringError(`${t('documentnumberformat_create_validation_custom_string')}`);
    } else {
      setcustomStringError("");
      try {
        const sampleformat = SampleDocumentFormat.map(item => item.value).join('');
        await validationFormatSchema.validate({ Format: sampleformat }, { abortEarly: false });
      } catch (error: any) {
        const errors = error.inner.reduce((allErrors: any, currentError: any) => {
          return { ...allErrors, [currentError.path as string]: currentError.message };
        }, {});
        store.dispatch(updateErrors(errors))
        if (errors)
          return;
      }
      store.dispatch(createFormat());
      if (numberformat.Format != "")
        store.dispatch(startPreloader());
      const result = await EditDocumentNumberFormat(store.getState().numberformatedit.numberformat);
      result.match({
        ok: () => {
          store.dispatch(toggleInformationModalStatus());
        },
        err: async (e) => {
          const formattedErrors = convertBackEndErrorsToValidationErrors(e)
          store.dispatch(updateErrors(formattedErrors))
        },
      });
      store.dispatch(stopPreloader())
    }
  }

  const onUpdateField = (ev: any) => {
    var name = ev.target.name;
    var value = ev.target.value;
    store.dispatch(updateField({ name: name as keyof DocumentNumberFormatEditState['numberformat'], value }));
  }

  const GetPaddedNumber = (number, totalLength) => {
    return number.toString().padStart(totalLength, '0');
  };

  const onFormatSelectChange = (selectedOption: any, actionMeta: any, delimiter?: any) => {
    const { value, sample } = selectedOption;
    const dispatchUpdate = (numValue: any, sampleValue: any = numValue) => {
      store.dispatch(NumFormatupdateField({ key: actionMeta, value: numValue }));
      store.dispatch(SampleNumFormatupdateField({ key: actionMeta, value: sampleValue }));
    };

    if (delimiter === "separator") {
      dispatchUpdate(value === "{NOSPACE}" ? value : sample, value === "{NOSPACE}" ? "" : value);
    } else if (value === "{CUSTSTR}") {
      store.dispatch(setCustomString({ index: 0, value: "" }));
      dispatchUpdate(value);
    } else if (value === "{NUM}") {
      const paddedNumber = GetPaddedNumber(1, numberformat.NumberPadding);
      dispatchUpdate(value, paddedNumber);
    } else {
      dispatchUpdate(value, sample);
    }
  };

  const onSelectChange = (selectedOption: any, actionMeta: any) => {
    var value = selectedOption.value
    var name = actionMeta.name
    store.dispatch(updateField({ name: name as keyof DocumentNumberFormatEditState['numberformat'], value }));
  }

  const InformationModal = () => {
    const { t } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={reDirectRoute}>
        {t('documentnumberformat_edit_success')}
      </SweetAlert>
    );
  }
  const reDirectRoute = async () => {
    onModalClose()
    store.dispatch(setCustomString({ index: 0, value: "" }))
    const result = await getDocumentNumberFormatList(null, 1);
    store.dispatch(loadDocumentNumberFormatList(result));
    store.dispatch(clearFormatArray());
    document.getElementById('closeEditNumberFormatModal')?.click();
  }

  function getFinancialYear() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const startYear = year.toString().slice(-2);
    const endYear = (year + 1).toString().slice(-2);
    return `${startYear}${endYear}`;
  }

  const finYear = getFinancialYear();
  const paddedNumber = GetPaddedNumber(1, numberformat.NumberPadding);

  const options = [
    { value: '{LOC}', label: 'Location Code', sample: 'MAS' },
    { value: '{YYYY}', label: 'Financial Year', sample: finYear },
    { value: '{NUM}', label: 'Running Number', sample: paddedNumber },
    { value: '{CUSTSTR}', label: 'Custom String', sample: CustomString },
    { value: '{APPCODE}', label: 'App Name', sample: 'BS' },
    { value: '{REGION}', label: 'Region Code', sample: 'S3' },
    { value: '{STATE}', label: 'State Code', sample: 'TN' }
  ]

  const separatoroptions = [
    { value: '{NOSPACE}', label: 'No Space', sample: "" },
    { value: numberformat.separator, label: numberformat.separator, sample: numberformat.separator }
  ];

  const onFormatUpdateField = (ev: any, index: any) => {
    const newValue = ev.target.value;
    store.dispatch(setCustomString({ index: index, value: newValue }))
  };

  useEffect(() => {
    const allOddKeysHaveNonEmptyValue = NumFormatArray.filter(item => item.key % 2 !== 0).every(item => item.value !== "");
    setEnableSubmit(allOddKeysHaveNonEmptyValue);
  }, [NumFormatArray]);

  const checkCustomString = () => {
    const item = NumFormatArray.find((numFormat) => numFormat.value === '{CUSTSTR}');
    if (item && CustomString === "") {
      return false;
    } else if (item && CustomString !== "") {
      return true;
    }
  };

  const filteredOptions = (rowIndex) => {
    const selectedValues = NumFormatArray.filter((_, index) => index !== rowIndex).map(item => item.value);
    return options.filter(option => !selectedValues.includes(option.value));
  };

  return (
    <>
      <div
        className="modal fade"
        id='EditNumberFormat'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        aria-hidden='true'
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header mx-2">
              <h5 className="modal-title app-primary-color">{t('documentnumberformat_edit_modal')}</h5>
              <button
                type='button'
                className="btn-close"
                data-bs-dismiss='modal'
                id='closeEditNumberFormatModal'
                aria-label='Close'
                onClick={onModalClose}
                ref={modalRef}
              ></button>
            </div>
            <div className="modal-body">
              <ValidationErrorComp errors={errors} />
              <div className="row">
                <div className="d-flex bd-highlight">
                  <div className="p-2 flex-grow-1 bd-highlight red-asterisk">{t('documentnumberformat_edit_dctype')}</div>
                  <div className="p-2 bd-highlight col-md-3">
                    <Select
                      options={DocumentTypes}
                      isDisabled={true}
                      value={DocumentTypes && DocumentTypes.find(option => option.value == numberformat.DocumentTypeId) || null}
                      isSearchable
                      name="DocumentTypeId"
                      placeholder={t('documentnumberformat_search_placeholder')}
                    />
                    <div className="small text-danger"> {t(errors['DocumentTypeId'])}</div>
                  </div>
                </div>
                <div className="d-flex bd-highlight">
                  <div className="p-2 flex-grow-1 bd-highlight red-asterisk">{t('documentnumberformat_edit_document_number')}</div>
                  <div className="p-2 bd-highlight col-md-3">
                    <input onChange={onUpdateField} disabled={IsProceed} name="documentNumber" value={numberformat.documentNumber} className={`form-control  ${errors["documentNumber"] ? "is-invalid" : ""}`}></input>
                    <div className="invalid-feedback"> {t(errors['documentNumber'])}</div>
                  </div>
                </div>
                <div className="d-flex bd-highlight">
                  <div className="p-2 flex-grow-1 bd-highlight red-asterisk">{t('documentnumberformat_edit_running_number')}</div>
                  <div className="p-2 bd-highlight col-md-3">
                    <input onChange={onUpdateField} name="NumberPadding" disabled={IsProceed} value={numberformat.NumberPadding} className={`form-control  ${errors["NumberPadding"] ? "is-invalid" : ""}`}></input>
                    <div className="invalid-feedback"> {t(errors['NumberPadding'])}</div>
                  </div>
                </div>
                <div className="d-flex bd-highlight">
                  <div className="p-2 flex-grow-1 bd-highlight">
                    <span>{t('documentnumberformat_edit_delimiter')}</span>
                    <p className='text-muted text-size-11'>{t('documentnumberformat_create_delimiter_helptext')}</p>
                  </div>
                  <div className="p-2 bd-highlight col-md-3">
                    <input onChange={onUpdateField} name="separator" disabled={IsProceed} value={numberformat.separator} className={`form-control  ${errors["separator"] ? "is-invalid" : ""}`}></input>
                    <div className="invalid-feedback"> {t(errors['separator'])}</div>
                  </div>
                </div>
              </div>
              {IsProceed == false &&
                <div className="d-flex flex-row-reverse bd-highlight">
                  <div className="p-2 bd-highlight">
                    <button type="button" onClick={onProceed} className="btn  app-primary-bg-color text-white mt-2 float-end">{t('documentnumberformat_edit_proceed_button')}</button>
                  </div>
                </div>
              }
              {IsProceed == true &&
                <>
                  <div className="row mx-2 mt-3">
                    <div className="d-flex bd-highlight p-0 m-0">
                      <div className="pt-1 ps-0 flex-grow-1 bd-highlight app-primary-color fw-bold">{t('documentnumberformat_edit_sub_heading')}</div>
                    </div>
                    <div className="row">
                      {Array.from({ length: 2 * numberformat.documentNumber - 1 }).map((_, rowIndex) => (
                        <>
                          <div key={rowIndex} className={`col ps-0 pe-2 mb-3 ${rowIndex % 2 == 0 ? "col-md-5 " : " col-md-3"}`}>
                            {rowIndex % 2 === 0 ? (
                              <Select
                                options={filteredOptions(rowIndex)}
                                onChange={(selectedOption) => onFormatSelectChange(selectedOption, rowIndex + 1)}
                                isSearchable
                                value={filteredOptions(rowIndex) && filteredOptions(rowIndex).find(item => item.value == NumFormatArray.find(numItem => numItem.key === rowIndex + 1)?.value) || null}
                                placeholder={`${t('documentnumberformat_edit_placeholder_select_format')}`}
                                className="w-100"
                              />
                            ) : (
                              <>
                                {numberformat.separator != "" &&
                                  <Select
                                    options={separatoroptions}
                                    onChange={(selectedOption) => onFormatSelectChange(selectedOption, rowIndex + 1, 'separator')}
                                    isSearchable
                                    value={separatoroptions && separatoroptions.find(item => item.value == NumFormatArray.find(numItem => numItem.key === rowIndex + 1)?.value) || null}
                                    placeholder={`${t('documentnumberformat_edit_placeholder_select_separator')}`}
                                    className="w-100"
                                  />
                                }
                              </>
                            )}
                          </div>
                          {NumFormatArray.some(item => (item.value === "{CUSTSTR}" || (CustomString !== "" && item.value === CustomString)) && item.key === rowIndex + 1) ? (
                            <div className="col-md-3 mb-2 ps-0">
                              <input onChange={(ev) => onFormatUpdateField(ev, rowIndex + 1)} name="CustomString" placeholder={`${t('documentnumberformat_edit_custom_string')}`} value={CustomString} className={`form-control  ${customStringError != "" ? "border border-danger" : ""}`}></input>
                              <p className='text-muted text-size-11 mb-0'>{t('documentnumberformat_create_customstring_helptext')}</p>
                              <div className='text-size-14 text-danger'>{customStringError}</div>
                            </div>
                          ) : (<></>)}
                        </>
                      ))}
                    </div>
                  </div>
                  <div className="mx-2 p-1 mt-4 bg-light">
                    <div>{t('documentnumberformat_edit_sample')}</div>
                    <div className="d-flex justify-content-center bg-light p-4 fw-bold">
                      {SampleDocumentFormat.map(item => item.value)}
                    </div>
                  </div>

                  {/* validation error */}
                  {errors['Format'] &&
                    <div className="alert alert-warning rounded-0 d-flex m-2 p-2 border-1" role="alert">
                      <span className="material-symbols-outlined fs-5 me-2 flex-start">
                        warning
                      </span>
                      <span className="text-size-13 text-danger">{t(errors['Format'])}</span>
                    </div>
                  }
                  {/* validation error ends */}
                  <div className="d-flex flex-row-reverse bd-highlight">
                    <div className="bd-highlight pe-2">
                      <div className="bd-highlight pe-2">
                        <button type="button" onClick={onSubmit} disabled={submit == false} className="btn app-primary-bg-color text-white mt-2 float-end">{t('documentnumberformat_edit_submit_button')} </button>
                        <button type="button" onClick={onResetFormat} className="btn  app-primary-bg-color text-white float-end mt-2 me-2">{t('documentnumberformat_edit_reset_button')}</button>
                      </div>
                    </div>
                  </div>
                </>
              }
            </div>
          </div>
        </div>
      </div >
      {displayInformationModal ? <InformationModal /> : ''}
    </>
  );
}