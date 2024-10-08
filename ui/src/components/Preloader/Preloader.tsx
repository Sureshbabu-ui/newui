import { useStore } from "../../state/storeHooks"
export const Preloader = () => {
    const { isloading } = useStore(({ preloader }) => (preloader));
   return (
        <>
            {
                isloading && (<div className="snippet" >
                    <div className="stage">
                        <div className="dot-pulse"></div>
                    </div>
                </div>)
            }
        </>
    )
}