import Web3 from "web3"
import { TransactionReceipt } from "web3-eth"
type SendTransactionType = {
  from: string,
  to: string,
  value?: string,
  data?: string
}
type GetReceiptInput = {
  hash: string,
  time: number,
  rpcURL: string
}
export const metamask = {
  sendTransaction: async ({ from, to, value, data }: SendTransactionType) => {
    return await window?.ethereum
      ?.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from, // The user's active address.
            to, // Required except during contract publications.
            value: value || 0, // Only required to send ether to the recipient from the initiating external account.
            data: data || "0x"
          },
        ],
      })
  },
  getReceipt: ({ hash, time, rpcURL }: GetReceiptInput): Promise<TransactionReceipt> => {
    const web3 = new Web3(rpcURL);
    const promise: Promise<TransactionReceipt> = new Promise((resolve) => {
      const receipt = () => {
        const promiseReceipt = setTimeout(() => {
          web3.eth.getTransactionReceipt(hash).then(async (res) => {
            if (res) {
              clearTimeout(promiseReceipt);
              resolve(res);
            } else {
              receipt();
            }
          });
        }, time);
      };
      receipt();
    });
    return promise;
  }
}