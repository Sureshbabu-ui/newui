import { useState } from 'react';

export const ExpandableSection = ({ initialContent, additionalContent }: { initialContent: string, additionalContent?: string }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpansion = () => {
        setExpanded(!expanded);
    };

    return (
        <div>
            <span className={`${!expanded ? '' : 'd-none'}`}>{initialContent}</span>
            <span className={`${expanded ? '' : 'd-none'}`}>
                {additionalContent}
            </span>
            {additionalContent && (
                <a className='pseudo-link ms-1' onClick={toggleExpansion}>
                    {expanded ? 'Collapse' : 'See More'}
                </a>
            )}
        </div>
    );
};
