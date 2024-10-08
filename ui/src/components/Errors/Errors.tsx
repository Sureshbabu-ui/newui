import { GenericErrors } from '../../types/error';

export function Errors({ errors }: { errors: GenericErrors }) {
  return (
    <div>
      { (Object.keys(errors).length > 0) ? (<div className="text-danger my-3 fw-bold pl-3">Please fix the following error(s)</div>) : '' }
      <ul className='error-messages'>
        {Object.entries(errors).map(([field, fieldErrors]) =>
          fieldErrors.map((fieldError) => (
            <li className="text-danger" key={field + fieldError}>
              {fieldError}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
