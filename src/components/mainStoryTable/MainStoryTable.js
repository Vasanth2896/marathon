import React, { useState, useEffect } from 'react';
import './MainStoryTable.scss'
import ReactTable from 'react-table-v6';
import Checkbox from 'react-three-state-checkbox'
import { headerStyle } from './headerStyles'
import Pagination from "./pagination/Pagination";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'
// import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
// import Menu from '@material-ui/core/Menu';
// import MenuItem from '@material-ui/core/MenuItem';
import SearchFilter from './searchFilter/SearchFilter';
import Resizer from './resizer/Resizer';
import Sorter from './sorter/Sorter';
import { connect } from 'react-redux';
import { app_onChange, mainTableEdit } from '../../store/appActions';
import { bindActionCreators } from 'redux';
import _ from "lodash"
import { useHistory } from 'react-router-dom';
// import RootRef from '@material-ui/core/RootRef';



const MainStoryTable = (props) => {
    const { state, onChange, mainTableEdit } = props
    const currentState = _.cloneDeep(state);
    const { storyList } = currentState;
    let newStoryList = _.cloneDeep(storyList);
    const history = useHistory();
    const [storyTableState, setStoryTableState] = useState({
        filteredData: [],
        selectAll: false,
        selectAllIndeterminate: false,
        searchInput: '',
        storyIdSort: false,
        storyNameSort: false,
        imageNameSort: false,
        questionCountSort: false
    })

    const { selectAll,
        selectAllIndeterminate,
        searchInput, filteredData, storyIdSort, storyNameSort, imageNameSort, questionCountSort } = storyTableState


    const handleCheckAllChange = (e) => {
        let checked = e.target.checked;
        checked ? newStoryList.map(user => user.select = true) : newStoryList.map(user => user.select = false);
        setStoryTableState({ ...storyTableState, selectAll: !selectAll, selectAllIndeterminate: false });
        onChange('storyList', newStoryList);
    }

    const handleCheckChange = (CheckedUser) => {
        const test = newStoryList.find(user => user.storyId === CheckedUser.storyId);
        if (test) {
            test.select = !test.select;
        }

        if (!(newStoryList.every(user => user.select) || newStoryList.every(user => !user.select))) {
            setStoryTableState({ ...storyTableState, selectAllIndeterminate: true });
        } else {
            const selection = newStoryList.every(user => user.select);
            selection ? setStoryTableState({ ...storyTableState, selectAll: true, selectAllIndeterminate: false }) : setStoryTableState({ ...storyTableState, selectAll: false, selectAllIndeterminate: false });
        }
        onChange('storyList', newStoryList);
    }

    const handleCheckboxes = () => {
        if (newStoryList.every(user => user.select)) {
            setStoryTableState({ ...storyTableState, selectAll: true })
        }
        else if (!(newStoryList.every(user => user.select) || newStoryList.every(user => !user.select))) {
            setStoryTableState({ ...storyTableState, selectAllIndeterminate: true, selectAll: false });
        }
    }

    useEffect(() => {
        let newFilteredData = [];
        if (searchInput) {
            newFilteredData = newStoryList.filter(value => {
                return (
                    value.storyName.toLowerCase().includes(searchInput.toLowerCase()) ||
                    value.imageName.toLowerCase().includes(searchInput.toLowerCase())
                );

            });
        }
        handleCheckboxes();
        setStoryTableState({ ...storyTableState, filteredData: newFilteredData });
    }, [searchInput, selectAll]);

    useEffect(() => {
        handleCheckboxes();
    }, [selectAll]);

    const handleSearchInputChange = (e) => {
        setStoryTableState({ ...storyTableState, searchInput: e.target.value })
    }

    const handleSortChangeStyle = (props) => {
        if (props[0].id !== '') {
            const sortStyle = { ...storyTableState };
            sortStyle[`${props[0].id + 'Sort'}`] = props[0].desc;
            setStoryTableState({ ...sortStyle })
        }
    }

    const handleDeleteData = (index) => {
        newStoryList.splice(index, 1);
        onChange('storyList', newStoryList);
    }

    const handleEditData = (value, index) => {
        mainTableEdit(value, index);
        history.push('/storyform');
    }

    // const [anchorEl, setAnchorEl] = useState(null);
    // const handleClick = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };

    // const handleClose = (e) => {
    //     setAnchorEl(null);
    // };

    const columns = [
        {
            headerStyle: { ...headerStyle, pointerEvents: 'none', paddingLeft: '5px', paddingRight: '24px' },
            Header: (
                <div >
                    <Checkbox
                        style={{ pointerEvents: 'auto' }}
                        indeterminate={selectAllIndeterminate}
                        checked={selectAll || ''}
                        className='checkBoxes'
                        onChange={(e) => handleCheckAllChange(e)}
                    ></Checkbox>
                </div>
            ),
            accessor: "",
            Cell: ({ original }) => {
                return (
                    <input
                        type="checkbox"
                        className='checkBoxes'
                        checked={original.select}
                        onChange={() => handleCheckChange(original)}
                    />
                )
            },
            width: 50,
            resizable: false,
        },
        {
            headerStyle: headerStyle,
            Header: (
                <div style={{ pointerEvents: 'none', display: 'flex', justifyContent: 'space-between' }} >
                    Story ID
                    <Sorter className={storyIdSort ? 'sortIconDown' : 'sortIconUp'} />
                    <Resizer className='rt-resizer' />
                </div >
            ),
            accessor: 'storyId',
            width: 200
        }, {

            headerStyle: headerStyle,
            Header: (
                <div style={{ pointerEvents: 'none', display: 'flex', justifyContent: 'space-between' }}>
                    Story Name
                    <Sorter className={storyNameSort ? 'sortIconDown' : 'sortIconUp'} />
                    <Resizer className='rt-resizer' />
                </div>),
            accessor: 'storyName',
            width: 200
        }, {
            headerStyle: headerStyle,
            Header: (
                <div style={{ pointerEvents: 'none', display: 'flex', justifyContent: 'space-between' }}>
                    Image Name
                    <Sorter className={imageNameSort ? 'sortIconDown' : 'sortIconUp'} />
                    <Resizer className='rt-resizer' />
                </div>),
            accessor: 'imageName',
            width: 200
        }, {

            headerStyle: headerStyle,
            Header: (
                <div style={{ pointerEvents: 'none', display: 'flex', justifyContent: 'space-between' }}>
                    Question Count
                    <Sorter className={questionCountSort ? 'sortIconDown' : 'sortIconUp'} />
                    <Resizer className='rt-resizer' />
                </div>),
            accessor: 'questionCount',
            width: 200
        },
        {
            headerStyle: headerStyle,
            Header: (
                <div style={{ pointerEvents: 'none', display: 'flex', justifyContent: 'space-between' }}>
                    Actions
                </div>),
            accessor: '',
            Cell: ({ value, index }) => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        <FontAwesomeIcon style={{ color: 'blue', cursor: 'pointer' }} icon={faTrash} onClick={() => handleDeleteData(index)} />
                        <FontAwesomeIcon style={{ color: 'blue', cursor: 'pointer' }} icon={faEdit} onClick={() => handleEditData(value, index)} />


                        <div>
                            {/* <FontAwesomeIcon style={{ color: 'blue', cursor: 'pointer' }} icon={faEllipsisV} aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} /> */}
                            {/* <FontAwesomeIcon style={{ color: 'blue', cursor: 'pointer' }} icon={faEllipsisV} aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} /> */}
                            {/* <RootRef rootRef={ref} >
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                // keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => handleEditData(row)}>Edit</MenuItem>
                                <MenuItem onClick={() => { handleDeleteData(row) }}>Delete</MenuItem>
                            </Menu>
                            </RootRef> */}

                        </div>
                    </div>

                );
            },
            resizable: false,
        }
    ];

    return (
        <div className='mainStoryTableContainer'>
            <div className='searchFilterContainer'>
                <h2>Story Details</h2>
                <SearchFilter searchInputValue={searchInput} searchInputChange={handleSearchInputChange} />
            </div>
            {storyList.length > 0 &&
                <div>
                    <ReactTable
                        PaginationComponent={Pagination}
                        columns={columns}
                        data={filteredData.length > 0 ? filteredData : newStoryList}
                        className="-striped -highlight"
                        minRows={0}
                        onSortedChange={(props) => handleSortChangeStyle(props)}
                    />
                </div>
            }
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        onChange: app_onChange,
        mainTableEdit: mainTableEdit
    }, dispatch)
}


const mapStateToProps = (state) => {
    return {
        state: state.appReducer
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainStoryTable);