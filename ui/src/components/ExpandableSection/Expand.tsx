import { useState } from "react";

export const Expand = ({ helpText, maxLength }: { helpText: string, maxLength?: number }) => {
    const [expanded, setExpanded] = useState(false);

    const displayedContent = maxLength ? (expanded ? helpText : helpText.substring(0, maxLength)) : helpText;

    const handleToggle = () => {
        setExpanded(!expanded);
    };

    return (
        <div role="button">
            <span>{displayedContent}</span>
            {maxLength && helpText.length > maxLength && (
                <a className="text-decoration-none" onClick={handleToggle}>{expanded ? '' : ' ...'}</a>
            )}
        </div>
    );
};