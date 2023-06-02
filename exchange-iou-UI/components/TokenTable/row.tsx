import Link from "next/link";
import { TokenOfficial } from "../../services/tokenOfficial";
import TokenLogo from "../General/TokenLogo";

type Props = {
  token: TokenOfficial;
  top: number;
};
export default function Row({ token, top }: Props) {
  const {
    tokenId,
    totalTokenCreated,
    contract,
    tokenName,
    tokenSymbol,
    logoURL,
    websiteURL,
    totalCollateralValue,
    chainName,
    chainId,
    blockExplorerURL,
  } = token;
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
      <td className="current_value">{chainName}</td>
      <td className="high">
        <b>{totalTokenCreated}</b>
      </td>
      <td className="low">
        <b>${Math.round(totalCollateralValue)}</b>
      </td>
      <td className="low text-info">
        {websiteURL && (
          <Link href={websiteURL} target="__blank">
            {websiteURL}
          </Link>
        )}
      </td>
      <td className="d-flex justify-content-center">
        <Link
          href={`/tokens/${chainId}/${contract}`}
          className="btn btn-success me-2 px-4 text-center"
        >
          IOU List
        </Link>
      </td>
    </tr>
  );
}
