import axiosCustom from './axiosCustom';

export class TokenAPI {
  async getTokenBasic({ tokenContract, dappId }): Promise<any> {
    const {
      data: { data, success },
    } = await axiosCustom
      .request()
      .get('token/list/basic', {
        params: {
          contract: tokenContract,
          dappId,
        },
      })
      .catch((err) => {
        console.log(err.response.data);
        return null;
      });
    return success && data[0] ? data[0] : null;
  }
  async create({
    dappId,
    tokenAddress,
    tokenName,
    tokenSymbol,
    tokenDecimal,
  }): Promise<any> {
    const {
      data: { data, success },
    } = await axiosCustom
      .requestSignature()
      .post('token/create', {
        dappId,
        tokenAddress,
        tokenName: tokenName.toString(),
        tokenSymbol: tokenSymbol.toString(),
        tokenDecimal,
      })
      .catch((err) => {
        return { data: err.response.data, success: false };
      });
    return { data, success };
  }
}
