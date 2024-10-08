import { Link } from "react-router-dom"
import BreadCrumb from "../../../BreadCrumbs/BreadCrumb"
import { ContainerPage } from "../../../ContainerPage/ContainerPage"
import { ApprovalEventList } from "../ApprovalEvent/ApprovalEventList"
import { EventConditionMasterList } from "../EventConditionMasterList/EventConditionMasterList"

const WorkflowConfigurationHome = () => {

  const breadcrumbItems = () => {
    return [
      { Text: 'breadcrumbs_home', Link: '/' },
      { Text: 'breadcrumbs_manage_workflowconfiguration' }
    ];
  }

  return (
    <ContainerPage>
      <BreadCrumb items={breadcrumbItems()} />

      <div className="">
        <div className=" mx-0 px-2" >
          <div className="fw-bold">Define Events</div>
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil consequuntur incidunt doloremque odit non, aperiam inventore consequatur tenetur vero? Dolores, voluptatibus! Voluptatum, illo? Accusamus officiis eos delectus, quia similique molestias!</p>
        </div>
        <div className="row mx-2">
          <div role="button" className="card col-2 rounded-3 bg-secondary-subtle me-3" data-bs-toggle='modal' data-bs-target='#ApprovalEventList'>
            <div className="card-body ">
              <h5 className="card-title text-center">
                <span className="material-symbols-outlined mt-1 fs-3 text-dark">hotel_class</span>
              </h5>
              <h6 className=" mb-2 text-center">Event Groups & Events</h6>
            </div>
          </div>
        </div>
        <div className=" mx-0 px-2 mt-3">
          <div className="fw-bold">Setup Event Condition Master Data</div>
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil consequuntur incidunt doloremque odit non, aperiam inventore consequatur tenetur vero? Dolores, voluptatibus! Voluptatum, illo? Accusamus officiis eos delectus, quia similique molestias!</p>
        </div>
        <div className="row mx-2">
          <div role="button" className="card col-2 rounded-3 bg-secondary-subtle me-3" data-bs-toggle='modal' data-bs-target='#EventConditionMasterList'>
            <div className="card-body ">
              <h5 className="card-title text-center">
                <span className="material-symbols-outlined mt-1 fs-3 text-dark">table</span>
              </h5>
              <h6 className=" mb-2 text-center">Event Condition</h6>
              <h6 className=" mb-2 text-center">Master Tables & Columns</h6>
            </div>
          </div>
          <div className="card col-2 rounded-3  bg-secondary-subtle py-4" >
            <Link role="button" to="/config/workflowconfiguration/approvalworkflow" className="text-decoration-none text-dark">
              <div className="card-body">
                <h5 className="card-title text-center">
                  <span className="material-symbols-outlined mt-1 fs-3 text-dark">device_hub</span>
                </h5>
                <h6 className=" mb-2 text-center">Workflow Groups</h6>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <ApprovalEventList />
      <EventConditionMasterList />
    </ContainerPage>
  )
}
export default WorkflowConfigurationHome