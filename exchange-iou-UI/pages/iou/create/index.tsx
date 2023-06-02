import React from "react";
import CreateForm from "../../../components/CreateForm";

type Props = {};

export default function CreateIOU({}: Props) {
  return (
    <div className="d-flex justify-content-center">
      <div className="col-12 col-xl-10 col-xxl-6">
        <CreateForm></CreateForm>
      </div>
    </div>
  );
}
