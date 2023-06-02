import { GetServerSideProps } from "next";
import Link from "next/link";
import TokenIouTable from "../../../components/TokenIouTable";
import dappAPI from "../../../services/dapp";
import TokenIouAPI, { ResponseTokenIou } from "../../../services/tokenIou";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { actAsyncGetTokenIOU } from "../../../store/tokenSlice";
import { validate } from "../../../helpers/validate";

type Props = {
  tokenData: ResponseTokenIou;
  dapp: any;
};

export default function TokenIouPage({ dapp }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { chainId, tokenContract } = router.query;
  useEffect(() => {
    if (chainId && validate.address(tokenContract)) {
      dispatch(
        actAsyncGetTokenIOU({
          index: 0,
          limit: 20,
          column: "estCollateral",
          sort: "DESC",
          tokenOfficial: tokenContract as string,
          chainId: parseInt(chainId as string),
        })
      );
    }
  }, [chainId, tokenContract]);
  return (
    <div className="card" id="marketList">
      <div className="card-header border-bottom-dashed">
        <div className="row align-items-center">
          <div className="col-auto">
            <h5 className="card-title mb-0">
              <Link href="/tokens">Tokens</Link> / <span>Token IOU</span>
            </h5>
          </div>
        </div>
        {/*end row*/}
      </div>
      {/*end card-header*/}
      <div className="card-body p-0 border-bottom border-bottom-dashed">
        <div className="search-box">
          <input
            type="text"
            className="form-control search border-0 py-3"
            placeholder="Search to currency..."
          />
          <i className="ri-search-line search-icon" />
        </div>
      </div>
      {/*end card-body*/}
      <div className="card-body">
        <div className="table-responsive table-card">
          <TokenIouTable dapp={dapp}></TokenIouTable>
        </div>
      </div>
      {/*end card-body*/}
    </div>
  );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const params = context.params;
  const chainIdInt = parseInt(params?.chainId as string) as number;

  const dapp = await dappAPI.get({ chainId: chainIdInt, typeId: 2 });
  return {
    props: {
      dapp,
    },
  };
};
