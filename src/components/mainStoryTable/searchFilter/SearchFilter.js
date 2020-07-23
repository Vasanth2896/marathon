import React from 'react';
import './SearchFilter.scss'
import { useHistory } from 'react-router-dom';

const SearchFilter = (props) => {
    const history = useHistory()
    const { searchInputChange, searchInputValue } = props;
    return (
        <div className='searchFilter'>
            <span>
                <input value={searchInputValue} onChange={(e) => searchInputChange(e)} className='searchFilterBox' placeholder='Search' type='search' />
            </span>
            <button className='addStoryBtn' onClick={() => history.push('/storyform')} >New story</button>
        </div>
    )
}

export default SearchFilter;


