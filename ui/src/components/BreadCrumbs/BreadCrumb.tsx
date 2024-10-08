import { useTranslation } from 'react-i18next';
import { ContainerPage } from '../ContainerPage/ContainerPage';
import { Link } from 'react-router-dom';

const BreadCrumb = ({ items }) => {
    const { t } = useTranslation();
    return (
        <>
            <div className="mb-2">
                <div className="fixed-top breadcrumbs-wrapper bg-white px-3 zindex-2" >
                    <ul className="breadcrumb px-1 pt-2 ">
                        {items.map((item, index) => (
                            <li key={index}>
                                {item.Link ? (
                                    <>
                                        <Link to={item.Link}>{t(item.Text)}</Link>
                                        {index < items.length - 1 && <span> &gt; &nbsp;</span>}
                                    </>
                                ) : (
                                    <>
                                        <span>{t(item.Text)}</span>
                                        {index < items.length - 1 && <span> &gt; </span>}
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default BreadCrumb;