import axiosCustom from "./axiosCustom";

export interface GetTokenOfficialParams {
  index: number,
  limit: number,
  column: string,
  sort: string,
  chainId: number
}
export interface TokenOfficial {
  tokenId: number,
  totalTokenCreated: number,
  contract: string,
  tokenName: string,
  tokenSymbol: string,
  logoURL: null | string,
  websiteURL: null | string,
  totalCollateralValue: number,
  chainName: string,
  chainId: number,
  blockExplorerURL: null | string
}
export interface ResponseTokenOfficial {
  data: TokenOfficial[],
  total: number
}
const TokenOfficialAPI = {
  gets: async ({ index, limit, column, sort, chainId }: GetTokenOfficialParams): Promise<ResponseTokenOfficial> => {
    try {
      const { data: { data, success } } = await axiosCustom.request()
        .get("token-official/list", {
          params: {
            index,
            limit,
            column,
            sort,
            chainId
          }
        })
      return {
        data: data?.data || [],
        total: data?.total || 0
      };
    }
    catch (err: any) {
      console.log(err.response?.data);
      return {
        data: [],
        total: 0
      };
    }

  }
}
export default TokenOfficialAPI;