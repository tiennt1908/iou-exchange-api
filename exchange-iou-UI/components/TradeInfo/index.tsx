import React from "react";

type Props = {};

export default function TradeInfo({}: Props) {
  return (
    <div className="row">
      <div className="col-xl-3 col-sm-6">
        <div className="card card-animate">
          <div className="card-body">
            <div className="d-flex">
              <div className="flex-grow-1">
                <h6 className="text-muted mb-3">Total Buy</h6>
                <h2 className="mb-0">
                  $
                  <span className="counter-value" data-target={243}>
                    243
                  </span>
                  <small className="text-muted fs-13">.10k</small>
                </h2>
              </div>
              <div className="flex-shrink-0 avatar-sm">
                <div className="avatar-title bg-soft-danger text-danger fs-22 rounded">
                  <i className="ri-shopping-bag-line" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*end card*/}
      </div>
      {/*end col*/}
      <div className="col-xl-3 col-sm-6">
        <div className="card card-animate">
          <div className="card-body">
            <div className="d-flex">
              <div className="flex-grow-1">
                <h6 className="text-muted mb-3">Total Sell</h6>
                <h2 className="mb-0">
                  $
                  <span className="counter-value" data-target={658}>
                    658
                  </span>
                  <small className="text-muted fs-13">.00k</small>
                </h2>
              </div>
              <div className="flex-shrink-0 avatar-sm">
                <div className="avatar-title bg-soft-info text-info fs-22 rounded">
                  <i className="ri-funds-line" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*end card*/}
      </div>
      {/*end col*/}
      <div className="col-xl-3 col-sm-6">
        <div className="card card-animate">
          <div className="card-body">
            <div className="d-flex">
              <div className="flex-grow-1">
                <h6 className="text-muted mb-3">Todays Buy</h6>
                <h2 className="mb-0">
                  $
                  <span className="counter-value" data-target={104}>
                    104
                  </span>
                  <small className="text-muted fs-13">.85k</small>
                </h2>
              </div>
              <div className="flex-shrink-0 avatar-sm">
                <div className="avatar-title bg-soft-warning text-warning fs-22 rounded">
                  <i className="ri-arrow-left-down-fill" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*end card*/}
      </div>
      {/*end col*/}
      <div className="col-xl-3 col-sm-6">
        <div className="card card-animate">
          <div className="card-body">
            <div className="d-flex">
              <div className="flex-grow-1">
                <h6 className="text-muted mb-3">Todays Sell</h6>
                <h2 className="mb-0">
                  $
                  <span className="counter-value" data-target={87}>
                    87
                  </span>
                  <small className="text-muted fs-13">.35k</small>
                </h2>
              </div>
              <div className="flex-shrink-0 avatar-sm">
                <div className="avatar-title bg-soft-success text-success fs-22 rounded">
                  <i className="ri-arrow-right-up-fill" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*end card*/}
      </div>
      {/*end col*/}
    </div>
  );
}
