import { ValidationErrors } from "../../types/error";
import { store } from "../../state/store";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const ValidationErrorComp = ({ errors }: { errors?: ValidationErrors }) => {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  useEffect(() => {
    if (errors && errors['NoResponse']) {
      history.push('/error-page');
    }
  }, [errors])

  return (
    <>
      {/* TODOS : To be removed once all error messages has been converted to type ValidationError from  GenericError */}
      {store.getState().app.validationErrors && (
        Object.keys(store.getState().app.validationErrors).length > 0 ? (
          <div className="error-messages-validations-wrapper">
            <div className="text-danger mt-3 fw-bold pl-3"></div>
            <ul className="error-messages">
              {Object.entries(store.getState().app.validationErrors).map((err) => (
                <li className="text-danger" key={err[0]}>
                  {t(err[1])}
                </li>
              ))}
            </ul>
          </div>
        ) : ""
      )}

      {errors && (
        Object.keys(errors).length > 0 ? (
          <div className="error-messages-backend-wrapper">
            <div className="text-danger mt-3 fw-bold pl-3"></div>
            <div className="error-messages " role="alert">
              <ul className="list-unstyled">
              {Object.entries(errors).map((err) => (
                err[0] == "Message" && <li className="text-danger p-0 m-0 " key={err[0]}>
                   {t(err[1])}
                </li>
              ))}
              </ul>
            </div>
          </div>
        ) : ""
      )}

    </>
  );
};
