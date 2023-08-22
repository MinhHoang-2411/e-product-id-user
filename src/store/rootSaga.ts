import { all } from "redux-saga/effects";
import { alertSaga } from "./alert/alertSaga";
import { authSaga } from "./auth/authSaga";
import { productSaga } from "./organizer/product/productSaga";
import { consignmentSaga } from "./organizer/consignment/consignmentSaga";

export default function* rootSaga() {
  yield all([alertSaga(), authSaga(), productSaga(), consignmentSaga()]);
}
