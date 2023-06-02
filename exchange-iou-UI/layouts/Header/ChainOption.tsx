import React from "react";
import { ChainType } from "../../services/chain";
import Image from "next/image";

type Props = {
  chainData: ChainType;
  selectChain: Function;
};

export default function ChainOption({ chainData, selectChain }: Props) {
  const { id, chainName, logoURL } = chainData;
  return (
    <div
      className="d-flex align-items-center cursor-pointer px-3 py-2 hover-blue-100"
      onClick={() => {
        selectChain(chainData);
      }}
    >
      <Image
        alt={chainName}
        width={18}
        height={18}
        src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${logoURL}`}
        className="me-2"
      />
      <span
        className="me-2 overflow-hidden"
        style={{
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          width: "calc(100% - 18px - 0.5rem)",
        }}
      >
        {chainName}
      </span>
    </div>
  );
}
