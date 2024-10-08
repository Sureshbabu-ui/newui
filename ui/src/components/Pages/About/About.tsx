import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const AboutView = () => {
    
    const [version, setVersion] = useState("");

    useEffect(() => {
        fetchVersion();
    }, []);
    const { t } = useTranslation()

    const fetchVersion = async () => {
        try {
            const response = await axios.get("version/get");
            const data = response.data;
            const versionString = data.toString();
            setVersion(versionString);
        } catch (error) {
            console.error("Error fetching version:", error);
        }
    };

    return (
        <div className="row mx-2 ">
            <div>
                <img className="accel-logo pt-0" src="/images/accel-logo.png" />
            </div>
            <div className="mt-3">
                BeSure & MoBeSure are initiatives from the Accel IT Services to do infrastructure management in a smarter and faster way. The most recent iteration of the application stands at version <span className="fw-bold">{version}</span>. For any inquiries regarding the application, please contact&nbsp;
                <a href="mailto:dharwesh.pr@accelits.com">dharwesh.pr@accelits.com</a>, and for technical support assistance, please get in touch with <a href="mailto:venmanivannan.g@accelits.com">venmanivannan.g@accelits.com</a>.</div>
        </div>
    );
}