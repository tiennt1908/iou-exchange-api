import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { actAsyncConnectWallet } from "../../store/userSlice";
import SwitchNetwork from "./SwitchNetwork";
import { useEffect } from "react";
import { actAsyncGetChains, actAsyncSwitchChain, actSelectChain } from "../../store/chainSlice";
import Image from "next/image";
import Web3 from "web3";
import { useRouter } from "next/router";

type Props = {};

export default function Header({}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { address } = useSelector((state: RootState) => state.user);
  const chain = useSelector((state: RootState) => state.chain);

  const connectWallet = async () => {
    if (Object.keys(chain.mapping).length > 0) {
      const chainId = Web3.utils.toDecimal(
        await window?.ethereum?.request({ method: "eth_chainId" })
      );

      if (!chain.mapping[chainId]) {
        dispatch(actAsyncSwitchChain({ chain: chain.mapping[chain.defaultNetwork] }));
      }

      dispatch(actSelectChain(chainId));
      dispatch(actAsyncConnectWallet());
    }
  };
  useEffect(() => {
    connectWallet();
  }, [chain.mapping]);

  return (
    <header className="left-lg-250px left-0 bg-white fixed-top">
      <div className="layout-width">
        <div className="navbar-header px-4 d-flex justify-content-end">
          <div className="d-flex align-items-center">
            <div className="me-2 header-item d-none d-sm-flex">
              <SwitchNetwork />
            </div>
            <div>
              {!address && (
                <button
                  type="button"
                  className="btn btn-success bg-gradient w-100"
                  onClick={connectWallet}
                >
                  Connect Wallet
                </button>
              )}
              {address && (
                <div className="d-flex align-items-center cursor-pointer px-3 py-2 shadow rounded">
                  <Image
                    alt=""
                    width={18}
                    height={18}
                    src={`https://s2.coinmarketcap.com/static/img/coins/64x64/24458.png`}
                    className="me-2"
                  />
                  {address.slice(0, 6)}...{address.slice(-4)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
