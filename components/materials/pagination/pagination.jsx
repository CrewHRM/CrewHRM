import React from 'react';
import ReactPaginate from 'react-paginate';

import style from './pagination.module.scss';

export function Pagination({ pageNumber = 3, pageCount = 23 }) {
    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        console.log(event.selected, event);
    };

    return (
        <ReactPaginate
            previousLabel={
                <i className={'ch-icon ch-icon-arrow-left-2 font-size-24'.classNames()}></i>
            }
            nextLabel={
                <i className={'ch-icon ch-icon-arrow-right-2 font-size-24'.classNames()}></i>
            }
            breakLabel={<span>...</span>}
            containerClassName={'container'.classNames(style) + 'd-flex column-gap-10'.classNames()}
            activeClassName={'active'.classNames(style)}
            disabledClassName={'disabled'.classNames(style)}
            pageLinkClassName={'font-size-15 font-weight-700 line-height-20'.classNames()}
            onPageChange={handlePageClick}
            pageRangeDisplayed={2}
            marginPagesDisplayed={2}
            pageCount={pageCount}
            forcePage={pageNumber}
            renderOnZeroPageCount={null}
        />
    );
}
