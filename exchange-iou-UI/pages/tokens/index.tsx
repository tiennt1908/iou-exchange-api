import React from "react";
import TokenTable from "../../components/TokenTable";
import { GetServerSideProps } from "next";
import TokenOfficialAPI, {
  ResponseTokenOfficial,
  TokenOfficial,
} from "../../services/tokenOfficial";
import Input from "../../components/General/Input";

export default function TopTokenPage() {
  return (
    <div className="card" id="marketList">
      <div className="card-header border-bottom-dashed">
        <div className="row align-items-center">
          <div className="col-auto">
            <h5 className="card-title mb-0">Top Tokens</h5>
          </div>
        </div>
        {/*end row*/}
      </div>
      {/*end card-header*/}
      <div className="card-body p-0 border-bottom border-bottom-dashed d-flex align-items-center">
        <Input
          placeHolder="Search name coin, contract"
          icon={{ class: "ri-search-line search-icon", color: "#878a99" }}
          className="border-0 py-3 w-100"
        />
      </div>
      {/*end card-body*/}
      <div className="card-body">
        <div className="table-responsive table-card">
          <TokenTable></TokenTable>
        </div>
      </div>
      {/*end card-body*/}
    </div>
  );
}
