import { ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";
import { AppDispatch, RootState } from "../store";
import { actAsyncGetChains, actSelectChain } from "../store/chainSlice";
import { actAsyncConnectWallet } from "../store/userSlice";
import Header from "./Header";
import Sidebar from "./sidebar";
import { useRouter } from "next/router";

type Props = {
  children?: ReactElement;
};

export default function Layout({ children }: Props) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const chain = useSelector((state: RootState) => state.chain);
  useEffect(() => {
    dispatch(actAsyncGetChains({ index: 0, limit: 20 }));
    window?.ethereum?.on("accountsChanged", () => {
      dispatch(actAsyncConnectWallet());
    });
  }, []);
  useEffect(() => {
    if (Object.keys(chain.mapping).length > 0) {
      window?.ethereum?.on("chainChanged", (res: any) => {
        const chainId = Web3.utils.toDecimal(res);
        if (chainId != chain.using) {
          dispatch(actSelectChain(chainId));
          router.push("/tokens");
        }
      });
    }
  }, [chain.mapping]);

  return (
    <div>
      <Header></Header>
      <Sidebar></Sidebar>
      <div className="main-content">
        <div className="page-content p-4 ml-lg-250px">{children}</div>
      </div>
    </div>
  );
}
