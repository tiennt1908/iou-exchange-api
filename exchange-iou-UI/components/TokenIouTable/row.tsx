import React from "react";
import Link from "next/link";
import { TokenIou } from "../../services/tokenIou";
import TokenLogo from "../General/TokenLogo";
import CountDown from "./CountDown";

export default function Row({ token, top, dapp }: { token: TokenIou; top: number; dapp: any }) {
  const {
    dappId,
    chainId,
    blockExplorerURL,
    circulatingSupply,
    collateralAmount,
    cTokenContract,
    contract,
    creator,
    deadline,
    estCollateral,
    protectiveValue,
    isPublicPool,
    logoURL,
    officialAmount,
    tokenDecimal,
    tokenName,
    tokenSymbol,
    websiteURL,
  } = token;
  console.log(isPublicPool, "isPublicPool");
  return (
    <tr>
      <td>{top}</td>
      <td className="w-200px">
        <div className="d-flex align-items-center fw-medium w-200px">
          <TokenLogo
            imgURL={logoURL}
            alt={tokenName}
            width={24}
            height={24}
            className="avatar-xxs me-2"
          />
          <div style={{ width: "calc(100% - 24px)" }}>
            <p className="currency_name m-0 text-truncate">{tokenName}</p>
            <p className="currency_name m-0 text-muted text-truncate">{tokenSymbol}</p>
          </div>
        </div>
      </td>
      <td className="high">
        <b>
          {Math.round(circulatingSupply)} {tokenSymbol}
        </b>
      </td>
      <td className="low">
        <b>${Math.round(estCollateral)}</b>
      </td>
      <td className="market_cap">
        <b>${protectiveValue.toFixed(2)}</b>
      </td>
      <td className="market_cap w-150px">
        <CountDown deadline={deadline}></CountDown>
      </td>
      <td className="d-flex justify-content-center">
        {isPublicPool === 1 && (
          <Link href={"/iou/mint"} className="btn btn-light btn-border me-2 px-0 w-6r text-center">
            Mint
          </Link>
        )}

        <Link
          href={`/exchange/${dapp?.id}/${contract}/${cTokenContract}`}
          className="btn btn-success btn-border w-6r"
        >
          Trade
        </Link>
      </td>
    </tr>
  );
}
