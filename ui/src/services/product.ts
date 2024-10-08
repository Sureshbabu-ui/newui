import { Err, Ok, Result } from "@hqoss/monads";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { ProductCategoryNames, ProductCategoryNamesDecoder, ModelNames, ProductCreate, ProductCreateResult, ProductDeleted, ProductEditResponse, ProductList, SelectedProduct, SelectedProductDetails, modelNamesDecoder, productCreateResultDecoder, productDeletedDecoder, productEditDecoder, productListDecoder, selectedProductDecoder } from "../types/product";
import axios from "axios";
import { guard, object } from "decoders";
import { MakeNames, makesNamesDecoder } from "../types/product";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const productCreate = async (product: ProductCreate): Promise<Result<ProductCreateResult, GenericErrors>> => {
  try {
    const { data } = await axios.post('product/create', product);
    return Ok(guard(object({ data: productCreateResultDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export const getProductList = async (search?: string, index?: number): Promise<ProductList> => {
  let url = `product/list?Page=${index}`;
  if (search) {
    url += `&Search=${search}`;
  }
  return guard(productListDecoder)((await axios.get(url)).data.data);
}

export async function editProduct(region: SelectedProductDetails): Promise<Result<ProductEditResponse, GenericErrors>> {
  try {
    const { data } = await axios.put('product/update', region);
    return Ok(guard(object({ data: productEditDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getProductMake(): Promise<MakeNames> {
  return guard(makesNamesDecoder)((await axios.get(`make/name`)).data.data);
}

export async function getProductCategory(): Promise<ProductCategoryNames> {
  return guard(ProductCategoryNamesDecoder)((await axios.get(`partproductcategory/categoryname`)).data.data);
}

export async function getProductModelName(): Promise<ModelNames> {
  return guard(modelNamesDecoder)((await axios.get(`product/modelnames`)).data.data);
}

export async function getClickedProductDetails(Id: string): Promise<SelectedProduct> {
  return guard(selectedProductDecoder)((await axios.get(`product/details?ProductId=${Id}`)).data.data);
}

export async function productDelete(Id: number): Promise<Result<ProductDeleted, GenericErrors>> {
  try {
    const { data } = await axios.post('product/delete', { Id });
    return Ok(guard(object({ data: productDeletedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}
export const downloadProductList = async () => {
  const url = `product/list/download`;
  return await axios.get(url, {
      responseType: 'blob',
      headers: {
          'Content-Type': 'application/json',
      }
  });
}