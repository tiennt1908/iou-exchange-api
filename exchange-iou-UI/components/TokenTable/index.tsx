import React, { useEffect } from "react";
import { TokenIou } from "../../services/tokenIou";
import Row from "./row";
import { ResponseTokenOfficial, TokenOfficial } from "../../services/tokenOfficial";
import { type } from "os";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { actAsyncGetTokenOfficial } from "../../store/tokenSlice";

type Props = {
  tokenData: ResponseTokenOfficial;
};
export default function TokenTable() {
  const dispatch = useDispatch<AppDispatch>();
  const chain = useSelector((e: RootState) => e.chain);
  const tokenOfficial = useSelector((e: RootState) => e.token.official);
  useEffect(() => {
    dispatch(
      actAsyncGetTokenOfficial({
        index: 0,
        limit: 20,
        column: "totalCollateralValue",
        sort: "DESC",
        chainId: chain.using,
      })
    );
  }, [chain.using]);
  return (
    <table className="table align-middle table-nowrap mb-0" id="customerTable">
      <thead className="table-light text-muted">
        <tr>
          <th>#</th>
          <th className="sort">Token</th>
          <th className="sort">Chain</th>
          <th className="sort">Total IOU Created</th>
          <th className="sort">Total Collateral</th>
          <th>Website URL</th>
          <th className="d-flex justify-content-center">Action</th>
        </tr>
      </thead>
      <tbody className="list form-check-all">
        {tokenOfficial.list?.map((e: any, k: number) => {
          return <Row key={k} token={e} top={k + 1}></Row>;
        })}
      </tbody>
    </table>
  );
}
