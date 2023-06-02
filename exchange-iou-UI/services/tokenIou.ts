import axiosCustom from "./axiosCustom";

export interface GetTokenIouParams {
  index: number,
  limit: number,
  column: string,
  sort: string,
  tokenOfficial: string,
  chainId: number
}
export interface TokenIou {
  dappId: number,
  chainId: string,
  blockExplorerURL: string,
  circulatingSupply: number,
  collateralAmount: number,
  contract: string,
  creator: string,
  cTokenContract: string,
  deadline: number,
  estCollateral: number,
  protectiveValue: number,
  isPublicPool: number,
  logoURL: string | null,
  officialAmount: number,
  tokenDecimal: number,
  tokenName: string,
  tokenSymbol: string,
  websiteURL: string
}
export interface ResponseTokenIou {
  data: TokenIou[],
  total: number
}
const TokenIouAPI = {
  getTokens: async ({ index, limit, column, sort, tokenOfficial, chainId }: GetTokenIouParams): Promise<ResponseTokenIou> => {
    try {
      const { data: { data, success } } = await axiosCustom.request()
        .get("token-iou/list", {
          params: {
            index,
            limit,
            column,
            sort,
            tokenOfficial,
            chainId
          }
        })
      return {
        data: data?.data || [],
        total: data?.total || 0
      };
    }
    catch (err: any) {
      console.log(err.response?.data, "kke");
      return {
        data: [],
        total: 0
      };
    }

  }
}
export default TokenIouAPI;