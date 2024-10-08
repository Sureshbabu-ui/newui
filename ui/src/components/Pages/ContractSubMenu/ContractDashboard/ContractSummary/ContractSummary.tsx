
export const ContractSummary = () => {

    return (
        <div className="">
            <div className="me-1 mt-0 mb-4">
                {/* header */}
                <div className="small mb-2 fw-bold">Summary</div>
                {/* header ends */}
                <div className="row">
                    <div className="col-md-4">
                        {/* counts wapper */}
                        <div className="p-0 mt-1 m-0 ">
                            {/* asset count */}
                            <div className=" rounded me-2 p-3 bg-warning-subtle">
                                <div className="h2 fw-bold">123</div>
                                <div className="h5">Asset</div>
                            </div>
                            {/* asset count */}
                        </div>
                    </div>
                    <div className="col-md-4">
                        {/* man power wrapper  */}
                        <div className="p-0 mt-1 m-0 ">
                            <div className=" rounded me-2 p-3 bg-success-subtle">
                                <div className="h2 fw-bold">100</div>
                                <div className="h5">Man Power</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        {/* site wrapper  */}
                        <div className="p-0 mt-1 m-0">
                            <div className=" rounded me-2 p-3 bg-secondary-subtle">
                                <div className="h2 fw-bold">56</div>
                                <div className="h5">Sites</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
