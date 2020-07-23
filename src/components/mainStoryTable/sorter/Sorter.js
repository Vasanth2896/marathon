import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortAmountDown } from '@fortawesome/free-solid-svg-icons';
import './Sorter.scss'

const Sorter = (props) => {
    return (
        <div className={props.className}>
            <FontAwesomeIcon style={{ color: 'dodgerBlue' }}  icon={faSortAmountDown} />
        </div>
    )
}

export default Sorter;