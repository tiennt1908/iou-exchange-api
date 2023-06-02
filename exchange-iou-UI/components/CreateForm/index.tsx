import React, { useEffect, useState } from "react";
import useForm, { InitialForm } from "../../customHook/useForm";
import Input from "../General/Input";
import Switches from "../General/Switches";
import { CreateIOUParams, IOUAPI } from "../../contractAPI/IOU";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { metamask } from "../../services/metamask";
import Button from "../General/Button";
import { ERC20API } from "../../contractAPI/ERC20";
import dappAPI from "../../services/dapp";
import { actAsyncGetDappById } from "../../store/dappSlice";

type Props = {};

export default function CreateForm({}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const chain = useSelector((state: RootState) => state.chain);
  const { rpcURL, contract } = useSelector((state: RootState) => state.dapp.using);
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const initialForm = {
    officialToken: "",
    collateralToken: "",
    amountCollateral: 0,
    tokenNameIOU: "",
    tokenSymbolIOU: "",
    totalSupplyIOU: 0,
    publicMint: true,
    deadline: 0,
  };
  const initialRules = {
    officialToken: {
      isAddress: {
        message: "Token address not invalid.",
      },
    },
    collateralToken: {
      isAddress: {
        message: "Token address not invalid.",
      },
    },
    amountCollateral: {
      validate: {
        message: "Amount collateral > 0.",
        value: (val: number) => {
          return val > 0;
        },
      },
    },
    tokenNameIOU: {
      minLength: {
        value: 1,
        message: "Token name is empty.",
      },
      pattern: {
        value: /^\w+(\s\w+)*$/,
        message: "Token name invalid.",
      },
    },
    tokenSymbolIOU: {
      minLength: {
        value: 1,
        message: "Token symbol is empty.",
      },
      pattern: {
        value: /^\w+$/,
        message: "Token symbol invalid.",
      },
    },
    totalSupplyIOU: {
      validate: {
        message: "Total Supply > 0.",
        value: (val: number) => {
          return val > 0;
        },
      },
    },
    publicMint: {},
    deadline: {
      validate: {
        message: "Deadline must be greater than current time.",
        value: (val: string) => {
          const date = new Date(val).getTime();
          const now = new Date().getTime();
          return date > now;
        },
      },
    },
  };
  const { errors, register, form, handleSubmit } = useForm({ initialForm, rules: initialRules });

  const handleCreate = async (formData: CreateIOUParams) => {
    if (!loading) {
      setLoading(true);
      try {
        const oToken = ERC20API({
          rpc: rpcURL,
          token: formData.officialToken,
        });
        const cToken = ERC20API({
          rpc: rpcURL,
          token: formData.collateralToken,
        });
        const oTokenDecimal = parseInt(await oToken.getDecimals());
        const cTokenDecimal = parseInt(await cToken.getDecimals());

        formData = {
          ...formData,
          amountCollateral: formData.amountCollateral * 10 ** cTokenDecimal,
          totalSupplyIOU: formData.totalSupplyIOU * 10 ** oTokenDecimal,
        };

        const data = IOUAPI({ rpc: rpcURL, address: contract }).create(formData);
        const hash = await metamask.sendTransaction({
          from: user.address,
          to: contract,
          data: data,
        });
        await metamask.getReceipt({ hash, time: 3000, rpcURL });
      } catch (err) {
        alert("Official Token or Collateral Token invalid");
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    if (chain.using > 0) {
      dappAPI.get({ chainId: chain.using, typeId: 1 }).then((e) => {
        if (e) {
          dispatch(actAsyncGetDappById({ dappId: e.id }));
        }
      });
    }
  }, [chain.using]);
  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title mb-0">Create Token IOU</h4>
      </div>
      <div className="card-body">
        <form
          className="p-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(handleCreate);
          }}
        >
          <div className="row mb-3">
            <Input
              title="Official Token"
              type="text"
              placeholder="Enter contract address"
              error={errors["officialToken"]?.message}
              onChange={(e: any) => {
                register("officialToken", e.target.value);
              }}
            />
          </div>
          <div className="row mb-3">
            <Input
              title="Collateral Token"
              type="text"
              placeholder="Enter contract address"
              error={errors["collateralToken"]?.message}
              onChange={(e: any) => {
                register("collateralToken", e.target.value);
              }}
            />
          </div>
          <div className="row mb-3">
            <Input
              title="Amount Collateral"
              type="text"
              placeholder="Enter amount collateral"
              error={errors["amountCollateral"]?.message}
              onChange={(e: any) => {
                register("amountCollateral", parseFloat(e.target.value));
              }}
            />
          </div>
          <div className="row mb-3 mt-5">
            <Input
              title="Token Name IOU"
              type="text"
              placeholder="e.g. Sui IOU, Ethreum IOU, Starknet IOU"
              error={errors["tokenNameIOU"]?.message}
              onChange={(e: any) => {
                register("tokenNameIOU", e.target.value);
              }}
            />
          </div>
          <div className="row mb-3">
            <Input
              title="Token Symbol IOU"
              type="text"
              placeholder="e.g. iouSUI, iouETH, iouSTRK"
              error={errors["tokenSymbolIOU"]?.message}
              onChange={(e: any) => {
                register("tokenSymbolIOU", e.target.value);
              }}
            />
          </div>
          <div className="row mb-3">
            <Input
              title="Total Supply IOU"
              type="text"
              placeholder="Enter amount collateral"
              error={errors["totalSupplyIOU"]?.message}
              onChange={(e: any) => {
                register("totalSupplyIOU", parseFloat(e.target.value));
              }}
            />
          </div>
          <div className="row mb-3">
            <Input
              title="IOU Payment Deadline"
              type="datetime-local"
              placeholder="Enter amount collateral"
              error={errors["deadline"]?.message}
              onChange={(e: any) => {
                register("deadline", e.target.value);
              }}
            />
          </div>
          <div className="row mb-3">
            <div>
              <Switches
                title="Open Public Mint"
                id="public_mint_input"
                defaultChecked
                onChange={(e: any) => {
                  register("publicMint", e.target.checked);
                }}
              />
            </div>
          </div>

          <div>
            <Button type="submit" theme="success" className="w-100" loading={loading}>
              Create IOU
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
