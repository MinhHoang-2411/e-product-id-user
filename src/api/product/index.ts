import axiosClient from "../axiosClient";
import axiosWithOrganizer from "../axiosWithOrganizer";

const productApi = {
  upload(formData: any) {
    const url = "/products/uploads";
    return axiosClient.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getListProducts(params: any) {
    const url = "/products/";
    return axiosWithOrganizer.get(url, { params });
  },
  createProduct(params: any) {
    const url = "/products/";
    return axiosWithOrganizer.post(url, params);
  },
  editProduct(params: any, id: any) {
    const url = `/products/${id}`;
    return axiosWithOrganizer.put(url, params);
  },
  removeProduct(id: any) {
    const url = `/products/${id}`;
    return axiosWithOrganizer.delete(url);
  },
};

export default productApi;
