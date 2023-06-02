import React from "react";
import Row from "./row";
import { ResponseTokenIou, TokenIou } from "../../services/tokenIou";
import { type } from "os";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

type Props = {
  dapp: any;
};
export default function TokenIouTable({ dapp }: Props) {
  const tokens = useSelector((state: RootState) => state.token.iou.list);
  return (
    <table className="table align-middle table-nowrap mb-0" id="customerTable">
      <thead className="table-light text-muted">
        <tr>
          <th>#</th>
          <th className="sort">Token(IOU)</th>
          <th className="sort">Total Supply</th>
          <th className="sort">Total Collateral</th>
          <th className="sort">Collateral/Supply</th>
          <th className="sort">Deadline</th>
          <th className="d-flex justify-content-center">Action</th>
        </tr>
      </thead>
      <tbody className="list form-check-all">
        {tokens?.map((e: any, k: number) => {
          return <Row key={k} token={e} top={k + 1} dapp={dapp}></Row>;
        })}
      </tbody>
    </table>
  );
}
