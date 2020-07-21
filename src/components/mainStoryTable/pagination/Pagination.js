import React from 'react';

const paginationContainerStyle = {
    marginTop: '5px',
    display: 'flex',
    height: '50px',
    alignItems: 'center',
    position: 'absolute',
    right: '0px'
}

const buttonStyles = {
    background: 'white',
    outline: 'none',
    border: 'unset',
    cursor: 'pointer',
    height: '50px',
    width: '50px',
    fontSize: '18px'
}

const selectBoxStyle = {
    height: '20px',
    background: 'gainsboro'
}

const Pagination = (props) => {
    const { page, pages, onPageChange, pageSizeOptions, onPageSizeChange, pageSize, data } = props


    const pageSizeList = pageSizeOptions.map((pageSizes, index) => {
        return (
            <option key={index} value={pageSizes}>
                {pageSizes} Rows
            </option>
        )
    });

    let handlePageSizeChange = (e) => {
        onPageSizeChange(parseInt(e.target.value));
    }

    const handlePageChange = (e) => {
        if (e.target.name === 'nextButton') {
            onPageChange(page + 1)
        }
        else {
            onPageChange(page - 1)
        }
    }

    return (
        <div style={paginationContainerStyle}>
            <div>
                <button disabled={page === 0} style={buttonStyles} name='previousButton' onClick={(e) => handlePageChange(e)} >{'<'}</button>
                <button disabled={page === pages - 1} style={buttonStyles} name='nextButton' onClick={(e) => handlePageChange(e)}>{'>'}</button>
            </div>
            <div>
                <select style={selectBoxStyle} value={pageSize} onChange={(e) => handlePageSizeChange(e)} >{pageSizeList}</select>
            </div>
        </div>
    )
}

export default Pagination