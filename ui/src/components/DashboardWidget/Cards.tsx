import { ContractCount } from "../Cards/ContractCountCard";
import { UsersCount } from "../Cards/UserCountCard";

export default function Card() {
  return (
    <>
      <div className="row mx-0">

        <div className="col-lg-3">
          <div className="card bg-light border-0 my-2">
            <div className="card-body app-primary-color">
              <div className="dashboard-widget-count ">0</div>
              <p className="card-text ">
                <small>Open Service Requests</small>
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-3">
          <div className="card bg-light border-0 my-2">
            <div className="card-body app-primary-color">
              <div className="dashboard-widget-count ">0</div>
              <p className="card-text ">
                <small>Pending Approval Requests</small>
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-3">
          <div className="card bg-light border-0 my-2">
            <div className="card-body app-primary-color">
              <div className="dashboard-widget-count ">3128</div>
              <p className="card-text ">
                <small>Active Users</small>
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-3">
          <div className="card bg-light border-0 my-2">
            <div className="card-body app-primary-color">
              <div className="dashboard-widget-count ">11</div>
              <p className="card-text ">
                <small>Active Contracts</small>
              </p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
