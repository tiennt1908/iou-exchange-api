import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { actAsyncGetMyOrders } from "../../store/userSlice";
import MyOrder from "./MyOrder";

type Props = {};

export default function UserOrderBook({}: Props) {
  const myOrders = useSelector((e: RootState) => e.user.order.list);
  return (
    <div className="card">
      <div className="card-header border-bottom-dashed d-flex align-items-center">
        <h4 className="card-title mb-0 flex-grow-1">My Orders</h4>
        {/* <div className="flex-shrink-0">
          <div className="btn-group" role="group" aria-label="Basic example">
            <button type="button" className="btn btn-primary btn-sm">
              Open Orders
            </button>
            <button type="button" className="btn btn-outline-primary btn-sm">
              Order History
            </button>
          </div>
        </div> */}
      </div>
      <div className="card-body">
        <div className="table-responsive table-card">
          <table className="table align-middle table-nowrap" id="customerTable">
            <thead className="table-light text-muted">
              <tr>
                <th className="sort" data-sort="currency_name" scope="col">
                  Trading Pair
                </th>
                <th className="sort" data-sort="quantity_value" scope="col">
                  Date
                </th>
                <th className="sort" data-sort="current_value" scope="col">
                  Side
                </th>
                <th className="sort" data-sort="returns" scope="col">
                  Price
                </th>
                <th className="sort" data-sort="returns_per" scope="col">
                  Amount
                </th>
                <th className="sort" data-sort="returns_per" scope="col">
                  Filled
                </th>
                <th className="sort text-end">
                  <span className="pe-3">Total</span>
                </th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            {/*end thead*/}
            <tbody className="list form-check-all">
              {myOrders?.map((e, k) => {
                return <MyOrder order={e} key={k} />;
              })}
            </tbody>
          </table>
          {/*end table*/}
        </div>
        {/* <div className="d-flex justify-content-end mt-3">
          <div className="pagination-wrap hstack gap-2">
            <a className="page-item pagination-prev disabled" href="#">
              Previous
            </a>
            <ul className="pagination listjs-pagination mb-0">
              <li className="active">
                <a className="page" href="#" data-i={1} data-page={6}>
                  1
                </a>
              </li>
              <li>
                <a className="page" href="#" data-i={2} data-page={6}>
                  2
                </a>
              </li>
            </ul>
            <a className="page-item pagination-next" href="#">
              Next
            </a>
          </div>
        </div> */}
      </div>
    </div>
  );
}
