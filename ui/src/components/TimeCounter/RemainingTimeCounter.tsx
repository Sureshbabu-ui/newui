import { useEffect, useState } from 'react';
import { getSLAExpiresOn } from "../../helpers/formats";

const RemainingTimeCounter = ({ reportedDateString, resolutionTime }) => {
    const [remainingTime, setRemainingTime] = useState(getSLAExpiresOn(reportedDateString, resolutionTime).toString()); // Convert initialTime to a string
    useEffect(() => {
        const intervalId = setInterval(() => {
            setRemainingTime(
                getSLAExpiresOn(reportedDateString, resolutionTime).toString()
            );
        }, 1000);

        return () => clearInterval(intervalId);
    }, [reportedDateString, resolutionTime]);

    const isPositive = remainingTime.charAt(0) !== "-";
    const textClass = isPositive ? "text-success" : "text-danger";

    return (
        <div>
            <span className={`text-size-12 text-center ${textClass}`}>{remainingTime}</span>
        </div>
    );
};

export default RemainingTimeCounter