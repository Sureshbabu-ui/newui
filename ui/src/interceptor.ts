import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { updateApiErrorStatusCode } from "./components/App/App.slice";
import { stopPreloader } from "./components/Preloader/Preloader.slice";

let store

export const injectStore = _store => {
    store = _store
}
const createCustomError = (message: string, statusCode: number) => {
    return {
        response: {
            status: statusCode,
            data: {
                errors: {
                    CustomErrorMessage: [message],
                }
            },
        },
    };
};

const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
    return config;
}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    store.dispatch(updateApiErrorStatusCode("500"))
    return Promise.reject(error);
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
    store.dispatch(updateApiErrorStatusCode(''))
    return response;
}

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    store.dispatch(updateApiErrorStatusCode(''))
    if (error.response) {
        store.dispatch(updateApiErrorStatusCode(error.response?.status.toString() ?? ''))
        if (error.response.status === 403) {
            // Return a custom error for 403 Forbidden
            return Promise.reject(createCustomError("You do not have permission to access this resource.", error.response.status));
        }
        if (error.response.status === 404) {
            // Return a custom error for 403 Forbidden
            return Promise.reject(createCustomError("Something went wrong", error.response.status));
        }
    }
    else {
        return Promise.reject(createCustomError("Server Down.", 500));
    }
    store.dispatch(stopPreloader())
    return Promise.reject(error);
};

export const setupInterceptorsTo = (axiosInstance: AxiosInstance): AxiosInstance => {
    axiosInstance.interceptors.request.use(onRequest, onRequestError);
    axiosInstance.interceptors.response.use(onResponse, onResponseError);
    return axiosInstance;
}