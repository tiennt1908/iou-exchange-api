import axiosCustom from './axiosCustom';

export class DappContracts {
  async gets({ index, limit, typeId }): Promise<any[]> {
    const {
      data: { data, success },
    } = await axiosCustom.request().get('dapp-contract/list', {
      params: {
        index,
        limit: limit,
        typeId,
      },
    });

    return success ? data : [];
  }
  async get({ id }): Promise<any> {
    const {
      data: { data, success },
    } = await axiosCustom.request().get('dapp-contract/list', {
      params: {
        id,
      },
    });
    return success ? data[0] : null;
  }
}
