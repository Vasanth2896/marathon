import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGripVertical } from '@fortawesome/free-solid-svg-icons'

const Resizer = (props) => {

    return (
        <div className={props.className} style={{ pointerEvents: 'auto', top: '15px' }} >
            <FontAwesomeIcon style={{ color: 'blue' }} icon={faGripVertical} />
        </div>
    )

}


export default Resizer;