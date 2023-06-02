import React from "react";
import MintForm from "../../../components/MintForm";

type Props = {};

export default function MintPage({}: Props) {
  return (
    <div className="d-flex justify-content-center">
      <div className="col-12 col-xl-10 col-xxl-6">
        <MintForm></MintForm>
      </div>
    </div>
  );
}
