import axiosCustom from "./axiosCustom";

export interface GetChainParams {
  index: number,
  limit: number,
}
export interface ChainType {
  id: number,
  chainName: string,
  rpcURL: string,
  blockExplorerURL: string,
  logoURL: string
}
const chainAPI = {
  gets: async (params: GetChainParams): Promise<ChainType[]> => {
    try {
      const { data: { data, success } } = await axiosCustom.request()
        .get("chain/list", {
          params
        })
      return data || [];
    }
    catch (err: any) {
      console.log(err.response?.data, "OrderBook/gets");
      return [];
    }
  },
}
export default chainAPI;