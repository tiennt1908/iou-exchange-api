import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { Contract, ContractOptions } from 'web3-eth-contract';

const ABI: AbiItem[] = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "orderId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "maker",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "taker",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "tokenIn",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "tokenOut",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenInAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenOutAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "status",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "datetime",
        "type": "uint256"
      }
    ],
    "name": "OrderHistory",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "orderId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "buy",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[]",
        "name": "ids",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
    "name": "buyByOrderIds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "orderId",
        "type": "uint256"
      }
    ],
    "name": "cancel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[]",
        "name": "ids",
        "type": "uint256[]"
      }
    ],
    "name": "cancelByOrderIds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "eventCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tokenIn",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tokenOut",
        "type": "address"
      },
      {
        "internalType": "uint256[]",
        "name": "index",
        "type": "uint256[]"
      }
    ],
    "name": "getMyOpenOrderIds",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "getOrderById",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "maker",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "tokenIn",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "tokenOut",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "tokenInAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tokenOutAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tokenInAmountSold",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "createAt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "status",
            "type": "uint256"
          }
        ],
        "internalType": "struct TradeData.Order",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[]",
        "name": "ids",
        "type": "uint256[]"
      }
    ],
    "name": "getOrderByIds",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "maker",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "tokenIn",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "tokenOut",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "tokenInAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tokenOutAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tokenInAmountSold",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "createAt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "status",
            "type": "uint256"
          }
        ],
        "internalType": "struct TradeData.Order[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "pastEvents",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenIn",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tokenOut",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenInAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "tokenOutAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "orderIndex",
        "type": "uint256"
      }
    ],
    "name": "setOrder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
interface ExchangeParams {
  rpc: string,
  address: string,
}
export interface GetMyOpenOrderIdsParams {
  user: string,
  tokenIn: string,
  tokenOut: string
}
export interface BuyParams {
  orderId: number,
  amount: number
}
export interface CancelParams {
  orderIds: number[]
}
export interface BuyByOrderIds {
  orderIds: number[],
  amounts: string[]
}
export interface SetOrderParams {
  tokenIn: string,
  tokenOut: string,
  tokenInAmount: number,
  tokenOutAmount: number,
  orderIndex: number
}
export interface GetOrderByIdsParams {
  orderIds: number[]
}
export const ExchangeAPI = ({ rpc, address }: ExchangeParams) => {
  const web3 = new Web3(rpc);
  const contract = new web3.eth.Contract(ABI, address);
  return {
    getMyOpenOrderIds({ user, tokenIn, tokenOut }: GetMyOpenOrderIdsParams): Promise<string[]> {
      const index = [];
      let i = 0;
      for (i = 1; i <= 50; i++) {
        index.push(i)
      }
      return contract.methods.getMyOpenOrderIds(user, tokenIn, tokenOut, index).call();
    },
    getOrderByIds({ orderIds }: GetOrderByIdsParams) {
      return contract.methods.getOrderByIds(orderIds).call();
    },
    buy({ orderId, amount }: BuyParams) {
      return contract.methods.buy(orderId, amount).encodeABI();
    },
    cancelByOrderIds({ orderIds }: CancelParams) {
      return contract.methods.cancelByOrderIds(orderIds).encodeABI();
    },
    buyByOrderIds({ orderIds, amounts }: BuyByOrderIds) {
      return contract.methods.buyByOrderIds(orderIds, amounts).encodeABI();
    },
    setOrder({ tokenIn, tokenOut, tokenInAmount, tokenOutAmount, orderIndex }: SetOrderParams) {
      return contract.methods.setOrder(tokenIn, tokenOut, "0x" + Math.floor(tokenInAmount).toString(16), "0x" + Math.floor(tokenOutAmount).toString(16), orderIndex).encodeABI();
    }
  }
}
