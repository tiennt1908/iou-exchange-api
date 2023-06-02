import React from "react";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { validate } from "../../helpers/validate";

type Props = {
  token: string;
};

export default function Balance({ token }: Props) {
  const chain = useSelector((state: RootState) => state.chain);
  const user = useSelector((state: RootState) => state.user);
  const { pair } = useSelector((state: RootState) => state.orderbook);
  const tokenSymbol = pair[token]?.symbol;

  let balanceToken = 0;
  if (validate.address(token) && chain.using) {
    balanceToken = user.balance[chain.using]?.[token]?.amount || 0;
  }

  return (
    <div className="px-3 pt-3">
      <h6 className="mb-0 text-muted">
        Available :{" "}
        <span className="text-dark">
          {parseFloat(balanceToken?.toFixed(8))} {tokenSymbol}
        </span>
      </h6>
    </div>
  );
}
