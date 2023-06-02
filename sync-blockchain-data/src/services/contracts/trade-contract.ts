import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { Contract, ContractOptions } from 'web3-eth-contract';

const ABI: AbiItem[] = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'orderId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'maker',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'taker',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenIn',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenOut',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenInAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenOutAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'status',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'datetime',
        type: 'uint256',
      },
    ],
    name: 'OrderHistory',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'orderId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'buy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256[]',
        name: 'ids',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
    ],
    name: 'buyByOrderIds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'orderId',
        type: 'uint256',
      },
    ],
    name: 'cancel',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256[]',
        name: 'ids',
        type: 'uint256[]',
      },
    ],
    name: 'cancelByOrderIds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'eventCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'tokenIn',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'tokenOut',
        type: 'address',
      },
      {
        internalType: 'uint256[]',
        name: 'index',
        type: 'uint256[]',
      },
    ],
    name: 'getMyOpenOrderIds',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'getOrderById',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'maker',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'tokenIn',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'tokenOut',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenInAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'tokenOutAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'tokenInAmountSold',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'createAt',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'status',
            type: 'uint256',
          },
        ],
        internalType: 'struct TradeData.Order',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256[]',
        name: 'ids',
        type: 'uint256[]',
      },
    ],
    name: 'getOrderByIds',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'maker',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'tokenIn',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'tokenOut',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenInAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'tokenOutAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'tokenInAmountSold',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'createAt',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'status',
            type: 'uint256',
          },
        ],
        internalType: 'struct TradeData.Order[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'pastEvents',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tokenIn',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'tokenOut',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenInAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'tokenOutAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'orderIndex',
        type: 'uint256',
      },
    ],
    name: 'setOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
export class TradeContract {
  public contract: Contract;
  private web3: Web3;

  constructor(rpcURL: string, contractAddress: string) {
    this.web3 = new Web3(rpcURL);
    this.contract = new this.web3.eth.Contract(ABI, contractAddress);
  }
  getBlockNumber(index: number): Promise<any> {
    return this.contract.methods.pastEvents(index).call();
  }
  getEventCount() {
    return this.contract.methods.eventCount().call();
  }
  getOrderById({ orderId }) {
    return this.contract.methods.getOrderById(orderId).call();
  }
}
