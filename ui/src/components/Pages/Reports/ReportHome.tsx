import BreadCrumb from "../../BreadCrumbs/BreadCrumb";
import { ContainerPage } from "../../ContainerPage/ContainerPage";
import { items } from '../../../reports.json';
import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { SuspensePreloader } from "../../SuspensePreloader/SuspensePreloader";
import { useTranslation } from "react-i18next";


export const ReportHome = () => {
    const { t } = useTranslation();
    const [selectedTabName, setSelectedTabName] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    interface ReportItem {
        Id: number;
        Name: string;
        DisplayText: string;
        Component: string;
        Description: string;
        Tags: string;
    }
    const [tags, setTags] = useState<string[]>([]);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [filteredData, setFilteredData] = useState<ReportItem[]>([]);
    const [showAllTags, setShowAllTags] = useState(false);

    useEffect(() => {
        const processTags = () => {
            try {
                const allTags = new Set<string>();
                items.forEach(item => {
                    const tagsArray = item.Tags.split(',').map(tag => tag.trim());
                    tagsArray.forEach(tag => {
                        if (tag) {
                            allTags.add(tag);
                        }
                    });
                });
                const sortedTags = Array.from(allTags).sort((a, b) => a.localeCompare(b));
                setTags(sortedTags);
            } catch (error) {
                return;
            }
        };

        processTags();
    }, [items]);

    useEffect(() => {
        let filtered = items;

        if (selectedTag) {
            filtered = filtered.filter(item =>
                item.Tags.split(',').map(tag => tag.trim()).includes(selectedTag)
            );
        }

        if (searchQuery) {
            filtered = filtered.filter(item =>
                item.DisplayText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.Description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredData(filtered);
    }, [selectedTag, searchQuery, items]);

    const getTagItemCount = (tag: string) => {
        return items.filter(item =>
            item.Tags.split(',').map(t => t.trim()).includes(tag)
        ).length;
    };

    const handleTagClick = (tag: string) => {
        setTags(prevTags => {
            const updatedTags = prevTags.filter(t => t !== tag);
            updatedTags.unshift(tag);
            return updatedTags;
        });
        setSelectedTag(tag);
    };

    const handleShowMore = () => {
        setShowAllTags(true);
        setSelectedTabName(null)
    };

    const handleTabClick = (tabName: string) => {
        setSelectedTabName(tabName);
    }

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    }

    const filteredItems = items.filter(item =>
        item.DisplayText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.Description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const memoizedLazyComponents = useMemo(() => {
        return items.reduce((memo, tab) => {
            if (tab.Name === selectedTabName) {
                memo[tab.Id] = lazy(() => import(`../Reports/ReportsSubmenu/${tab.Component}`));
            }
            return memo;
        }, {});
    }, [items, selectedTabName]);

    const breadcrumbItems = useMemo(() => {
        const baseItems = [
            { Text: 'breadcrumbs_home', Link: '/' },
            { Text: 'breadcrumbs_reports', Link: '/reports' }
        ];
        if (selectedTabName) {
            const selectedTab = items.find(item => item.Name === selectedTabName);
            if (selectedTab) {
                baseItems.push({ Text: selectedTab.DisplayText, Link: '#' });
            }
        }
        return baseItems;
    }, [selectedTabName]);

    return (
        <div className="px-3">
            <ContainerPage>
                <BreadCrumb items={breadcrumbItems} />
                <div className="row m-0 p-0">
                    {/* Reports List */}
                    <div className="col-md-5 p-0">
                        <div className="col-md-11 pt-1 p-0 m-0">
                            <input
                                className="form-control"
                                placeholder={t('reporthome_placeholder_search') ?? ''}
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>

                        {/* Tag Badges */}
                        <div className="mt-2 row">
                            <div className="col d-flex align-items-center flex-wrap">
                                <span
                                    className={`text-truncate ${selectedTag === null ? 'fw-bold border-bottom border-2 border-secondary' : ''} d-flex text-size-12 mx-2 py-1  `}
                                    role="button"
                                    onClick={() => {
                                        setSelectedTag(null);
                                        setSearchQuery('');
                                    }}
                                >
                                    All Reports <span className="text-size-12"> ({items.length}) </span>
                                </span>
                                {tags.slice(0, 3).map((tag, index) => (
                                    <div className="">
                                        <span
                                            role="button"
                                            className={`d-flex  ${selectedTag === tag ? ' fw-bold border-bottom border-2 border-secondary ' : ' '} text-size-12 mx-2 py-1`}
                                            key={index}
                                            onClick={() => handleTagClick(tag)}
                                        >
                                            {tag} <span className="text-size-12"> ({getTagItemCount(tag)}) </span>
                                        </span>
                                    </div>
                                ))}
                                {selectedTabName && (
                                    <span
                                        className="d-flex float-end align-items-center"
                                        onClick={handleShowMore}
                                    >
                                        <span className="material-symbols-outlined">more_horiz</span>
                                    </span> 
                                )}
                            </div>
                        </div>


                        {/* Filtered Items data Display */}
                        <div className="mt-4">
                            {filteredData.length > 0 ? (
                                filteredData.map((reportItem, index) => (
                                    <button
                                        className={`ps-1 hover mt-2 mb-2  py-2 text-start nav-link ${reportItem.Name === selectedTabName ? 'border-start border-3 border-primary' : ''}`}
                                        onClick={() => handleTabClick(reportItem.Name)}
                                        key={index}
                                    >
                                        <div className="fw-bold ps-1 text-size-13">{t(reportItem.DisplayText)}</div>
                                        <div className="ps-1"><small className="text-muted  text-size-12">{t(reportItem.Description)}</small></div>
                                    </button>
                                ))
                            ) : (
                                <p>{t('reporthome_placeholder_search')}</p>
                            )}
                        </div>
                    </div>

                    {/* Report Filters */}

                    <div className="col-md-7 p-0">

                        {
                            selectedTabName == null && 
                            <div className="row m-0 mt-5">
                                {
                                    tags.slice(3).map((tag, index) => (
                                    <div className="rounded col-md-3 bg-light mx-2 px-3 py-2" role="button" key={index} onClick={() => handleTagClick(tag)}>                                
                                        <div className="fs-5 text-muted"> { getTagItemCount(tag) }</div>
                                        <div className="text-size-12"> { tag } </div>
                                    </div>
                                    ))
                                }

                            </div>
                        }

                        <div className="position-fixed-custom">
                            {items.map((tab) => {
                                const LazyComponent = memoizedLazyComponents[tab.Id];
                                return (
                                    tab.Name === selectedTabName && (
                                        <Suspense key={tab.Id} fallback={<div><SuspensePreloader /></div>}>
                                            <div>
                                                <div className="ps-2 pt-2 mb-3 fw-bold text-size-14">{t(tab.DisplayText)}</div>
                                                {LazyComponent ? <LazyComponent /> : null}
                                            </div>
                                        </Suspense>
                                    )
                                );
                            })}
                        </div>
                    </div>
                </div>
            </ContainerPage>
        </div>
    );
}
