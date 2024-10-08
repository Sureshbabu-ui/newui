import ServerNotFoundSvg from '../../svgs/ServerNotFound.svg'
export const ErrorPage=()=>{

    const onButtonClick=()=>{
      window.location.pathname='login' 
    }
    
    return(
        <>
        <div className='row mt-4'>
          <div className='col d-flex justify-content-center'>
            <img src={ServerNotFoundSvg} className='w-25' />
          </div>
        </div>
        <div className='d-flex justify-content-center mt-3'>
          <button className='btn app-primary-bg-color text-white px-6' onClick={onButtonClick}>Go Back</button>
        </div>
      </>
    )
}