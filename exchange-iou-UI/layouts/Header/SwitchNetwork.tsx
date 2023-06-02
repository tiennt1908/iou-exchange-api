import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import ChainOption from "./ChainOption";
import { actAsyncSwitchChain } from "../../store/chainSlice";
import { ChainType } from "../../services/chain";
import TokenLogo from "../../components/General/TokenLogo";

type Props = {};

export default function SwitchNetwork({}: Props) {
  const [show, setShow] = useState(false);
  const { mapping, using } = useSelector((state: RootState) => state.chain);
  const chainSelected = mapping[using];
  const list = Object.keys(mapping).map((e) => {
    return mapping[parseInt(e)];
  });
  const dispatch = useDispatch<AppDispatch>();
  const selectChain = (chain: ChainType) => {
    dispatch(actAsyncSwitchChain({ chain }));
    setShow(false);
  };
  return (
    <>
      <div className="bg-light bg-gradient w-100 position-relative rounded">
        <div
          className="d-flex align-items-center cursor-pointer px-3 py-2"
          onClick={() => {
            setShow(!show);
          }}
        >
          <TokenLogo
            alt="Chain Logo"
            width={18}
            height={18}
            imgURL={`https://s2.coinmarketcap.com/static/img/coins/64x64/${chainSelected?.logoURL}`}
            className="me-2"
          />
          <span className="me-2">{chainSelected?.chainName || "Unknown Network"}</span>
          <i className={`ri-arrow-${show ? "up" : "down"}-s-line`}></i>
        </div>
        {show && (
          <>
            <div
              className="vw-100 vh-100 position-fixed left-0 top-0"
              onClick={() => {
                setShow(false);
              }}
            ></div>
            <div
              className="position-absolute left-0 bg-white shadow-lg rounded-bottom py-2 hover-blue-100"
              style={{ width: 175 }}
            >
              {list?.map((e, k) => {
                return <ChainOption key={k} chainData={e} selectChain={selectChain} />;
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}
