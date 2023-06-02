import React from "react";

type Props = {};

export default function MintForm({}: Props) {
  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title mb-0">Mint Token IOU</h4>
      </div>
      <div className="card-body">
        <form className="p-4">
          <div className="row mb-3">
            <div className="col-lg-3">
              <label htmlFor="nameInput" className="form-label">
                Official Token
              </label>
            </div>
            <div className="col-lg-9">
              <input type="text" className="form-control" placeholder="Enter contract address" />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-lg-3">
              <label htmlFor="websiteUrl" className="form-label">
                Collateral Token
              </label>
            </div>
            <div className="col-lg-9">
              <input type="url" className="form-control" placeholder="Enter contract address" />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-lg-3">
              <label htmlFor="websiteUrl" className="form-label">
                Amount Collateral
              </label>
            </div>
            <div className="col-lg-9">
              <input type="url" className="form-control" placeholder="Enter amount" />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-lg-3">
              <label htmlFor="websiteUrl" className="form-label">
                Total Supply IOU
              </label>
            </div>
            <div className="col-lg-9">
              <input type="url" className="form-control" placeholder="Enter your amount" />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-lg-3">
              <label htmlFor="websiteUrl" className="form-label">
                Public Mint IOU
              </label>
            </div>
            <div className="col-lg-9">
              {/* <select className="form-control">
                <option defaultChecked>False</option>
                <option>True</option>
              </select> */}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-lg-3">
              <label htmlFor="dateInput" className="form-label">
                IOU payment deadline
              </label>
            </div>
            <div className="col-lg-9">
              <div className="row">
                <div className="col-lg-6">
                  <input type="date" className="form-control" />
                </div>
                <div className="col-lg-6">
                  <input type="time" className="form-control" />
                </div>
              </div>
            </div>
          </div>
          <div className="text-end">
            <button type="submit" className="btn btn-secondary w-12r">
              Create IOU
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
