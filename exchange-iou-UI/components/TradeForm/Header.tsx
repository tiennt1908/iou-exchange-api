import React, { useState } from "react";
import { actSwitchSide } from "../../store/orderBookSlice";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";

type Props = {};

export default function Header({}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const { side } = useSelector((state: RootState) => state.orderbook);

  const switchSide = async (status: boolean) => {
    setLoading(true);
    if (!loading) {
      dispatch(actSwitchSide(status));
      setLoading(false);
    }
  };

  return (
    <div className="card-header">
      <ul className="nav nav-tabs-custom rounded card-header-tabs nav-justified border-bottom-0 mx-n3">
        <li className="nav-item">
          <a
            className={`nav-link cursor-pointer ${side && "active"}`}
            onClick={() => {
              switchSide(true);
            }}
          >
            Buy
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link cursor-pointer ${!side && "active"}`}
            onClick={() => {
              switchSide(false);
            }}
          >
            Sell
          </a>
        </li>
      </ul>
    </div>
  );
}
