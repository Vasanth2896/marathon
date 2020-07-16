import React, { useState } from 'react';
import './MainStoryTable.scss'
import ReactTable from 'react-table-v6';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortAmountDown } from '@fortawesome/free-solid-svg-icons'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import { faGripVertical } from '@fortawesome/free-solid-svg-icons'

const MainStoryTable = () => {
    const [state, setState] = useState({
        dummyData: [{
            id: 1,
            storyName: 'Red Riding Hood',
            imageName: 'Hood',
            questions: [{
                id: 1,
                question: 'Who was the villain of the little red riding hood?',
                answer: 'It was a fox'
            }],
            select: false
        },
        {
            id: 2,
            storyName: 'sindbad',
            imageName: 'sindbad',
            questions: [{
                id: 1,
                question: 'How many adventures did sindbad have?',
                answer: 'many'
            }],
            select: false
        }],
        selectAll: false
    })

    const { selectAll, dummyData } = state
    let newDummyData = JSON.parse(JSON.stringify(dummyData));

    const handleCheckAllChange = (e) => {
        let checked = e.target.checked;
        checked ? newDummyData.map(user => user.select = true) : newDummyData.map(user => user.select = false);
        setState({ ...state, dummyData: newDummyData, selectAll: !selectAll });
    }

    const handleCheckChange = (data) => {
        const test = newDummyData.find(user => user.id === data.id);
        if (test) {
            test.select = !test.select;
        }
        const selection = newDummyData.every(user => user.select === true);
        selection ? setState({ ...state, dummyData: newDummyData, selectAll: true }) : setState({ ...state, dummyData: newDummyData, selectAll: false });
    }

    const columnHeaderStyle = {
        display: 'flex',
        justifyContent: 'space-evenly',
    };

    const columns = [
        {
            Header: (
                <div style={{ width: '40px' }}>
                    <input type='checkbox'
                        checked={selectAll}
                        className='checkBoxes'
                        onChange={(e) => handleCheckAllChange(e)}
                    ></input>
                    <div className='rt-resizer' style={{ top: '5px' }} >
                        <FontAwesomeIcon style={{ color: 'blue' }} icon={faGripVertical} />
                    </div>
                </div>
            ),
            id: "checkbox",
            accessor: "",
            Cell: ({ original }) => {
                return (
                    <input
                        type="checkbox"
                        className='checkBoxes'
                        checked={original.select}
                        onChange={() => handleCheckChange(original)}
                    />
                );
            },
        },
        {
            Header: (
                <div style={columnHeaderStyle}>
                    Story ID
                    <FontAwesomeIcon style={{ color: 'blue' }} icon={faSortAmountDown} />
                    <div className='rt-resizer' style={{ top: '5px' }} >
                        <FontAwesomeIcon style={{ color: 'blue' }} icon={faGripVertical} />
                    </div>
                </div>),
            accessor: 'id',

        }, {
            Header: (
                <div style={columnHeaderStyle}>
                    Story Name
                    <FontAwesomeIcon style={{ color: 'blue' }} icon={faSortAmountDown} />
                    <div className='rt-resizer' style={{ top: '5px' }} >
                        <FontAwesomeIcon style={{ color: 'blue' }} icon={faGripVertical} />
                    </div>
                </div>),
            accessor: 'storyName'
        }, {
            Header: (
                <div style={columnHeaderStyle} >
                    Image Name
                    <FontAwesomeIcon style={{ color: 'blue' }} icon={faSortAmountDown} />
                    <div className='rt-resizer' style={{ top: '5px' }} >
                        <FontAwesomeIcon style={{ color: 'blue' }} icon={faGripVertical} />
                    </div>
                </div>),
            accessor: 'imageName'
        }, {
            Header: (
                <div style={columnHeaderStyle}>
                    Question Count
                    <FontAwesomeIcon style={{ color: 'blue' }} icon={faSortAmountDown} />
                    <div className='rt-resizer' style={{ top: '5px' }}  >
                        <FontAwesomeIcon style={{ color: 'blue' }} icon={faGripVertical} />
                    </div>
                </div>),
            accessor: 'questions.length',
        },
        {
            Header: '',
            accessor: '',
            Cell: ({ original }) => {
                return (
                    <div>
                        <FontAwesomeIcon style={{ color: 'blue' }} icon={faEllipsisH} />
                    </div>
                );
            }
        }

    ];

    return (
        <div className='mainStoryTableContainer'>
            <h1>This is the main story table</h1>

            <ReactTable
                columns={columns}
                data={dummyData}
                className="-striped -highlight"

            />
        </div>
    )
}

export default MainStoryTable;