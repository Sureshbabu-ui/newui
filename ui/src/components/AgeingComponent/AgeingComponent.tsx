import { useTranslation } from "react-i18next"
import { getAgeing } from "../../helpers/formats"
interface props {
    dateString: string | null,
    label?: string | null
}
const AgeingComponent = (props: props) => {
    const { t } = useTranslation()
    return (
        <div className="py-2">
            <p>
                <span className="text-muted">{t(props.label ?? '')}</span>
                <span className="fw-bold">{getAgeing(props.dateString ?? '')}</span></p>
        </div>
    )
}

export default AgeingComponent