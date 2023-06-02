import axiosCustom from "./axiosCustom";

interface GetDappParams {
  chainId: number,
  typeId: number,
}
export interface DappType {
  id: number,
  contract: string,
  totalEventCalled: number,
  typeId: number,
  chainId: number,
  chainName: string,
  rpcURL: string
}
const dappAPI = {
  get: async (params: GetDappParams): Promise<DappType | null> => {
    try {
      const { data: { data, success } } = await axiosCustom.request()
        .get("dapp-contract/list", {
          params
        })
      if (data[0]) {
        const {
          id,
          contract,
          totalEventCalled,
          typeId,
          chainId,
          chainName,
          rpcURL
        } = data[0];
        return {
          id,
          contract,
          totalEventCalled: parseInt(totalEventCalled),
          typeId,
          chainId: parseInt(chainId),
          chainName,
          rpcURL
        }
      }
      return null;
    }
    catch (err: any) {
      console.log(err.response?.data, "dapp-contract/gets");
      return null;
    }
  },
  getById: async ({ id }: { id: number }): Promise<DappType | null> => {
    try {
      const { data: { data, success } } = await axiosCustom.request()
        .get("dapp-contract/list", {
          params: {
            id
          }
        })
      if (data[0]) {
        const {
          id,
          contract,
          totalEventCalled,
          typeId,
          chainId,
          chainName,
          rpcURL
        } = data[0];
        return {
          id,
          contract,
          totalEventCalled: parseInt(totalEventCalled),
          typeId,
          chainId: parseInt(chainId),
          chainName,
          rpcURL
        }
      }
      return null;
    }
    catch (err: any) {
      console.log(err.response?.data, "dapp-contract/get-by-id");
      return null;
    }
  }
}
export default dappAPI;