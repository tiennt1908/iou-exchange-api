import axiosCustom from './axiosCustom';

export class TokenIouAPI {
  async get({ tokenContract, dappId }): Promise<any> {
    const {
      data: { data, success },
    } = await axiosCustom
      .request()
      .get('token-iou/list/basic', {
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
  async update({
    dappId,
    id,
    totalSupplyOfficialToken,
    totalSupplyPromiseToken,
    totalSupplyCollateralToken,
    eventNumber,
  }): Promise<any> {
    const {
      data: { data, success },
    } = await axiosCustom
      .requestSignature()
      .put('token-iou/update', {
        dappId,
        id,
        totalSupplyOfficialToken,
        totalSupplyPromiseToken,
        totalSupplyCollateralToken,
        eventNumber,
      })
      .catch((err) => {
        return { data: err.response.data, success: false };
      });
    return { data, success };
  }
  async create({
    dappId,
    eventNumber,
    tokenAddress,
    tokenName,
    tokenSymbol,
    tokenDecimal,
    creatorAddress,
    circulatingSupply,
    collateralAmount,
    tokenCollateralId,
    tokenOfficialId,
    isPublicPool,
    deadline,
  }): Promise<any> {
    const {
      data: { data, success },
    } = await axiosCustom
      .requestSignature()
      .post('token-iou/create', {
        dappId,
        eventNumber,
        tokenAddress,
        tokenName: tokenName.toString(),
        tokenSymbol: tokenSymbol.toString(),
        tokenDecimal,
        creatorAddress,
        circulatingSupply,
        collateralAmount,
        tokenCollateralId,
        tokenOfficialId,
        isPublicPool,
        deadline,
      })
      .catch((err) => {
        return { data: err.response.data, success: false };
      });
    return { data, success };
  }
}
