import React, { useState, useEffect, useRef } from 'react';
import './MainStoryTable.scss'
import ReactTable from 'react-table-v6';
import Checkbox from 'react-three-state-checkbox'
import { headerStyle } from './headerStyles'
import Pagination from "./pagination/Pagination";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faSortAmountDown, faCaretSquareDown } from '@fortawesome/free-solid-svg-icons'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SearchFilter from './searchFilter/SearchFilter';
import Sorter from './sorter/Sorter';
import { connect } from 'react-redux';
import { app_onChange, mainTableEdit } from '../../store/appActions';
import { bindActionCreators } from 'redux';
import _, { filter } from "lodash"
import { useHistory } from 'react-router-dom';
import RootRef from '@material-ui/core/RootRef';



const MainStoryTable = (props) => {

    const { state, onChange, mainTableEdit } = props;
    const currentState = _.cloneDeep(state);
    const { storyList } = currentState;
    let newStoryList = _.cloneDeep(storyList);
    const history = useHistory();
    const [storyTableState, setStoryTableState] = useState({
        filteredData: newStoryList,
        selectAll: false,
        selectAllIndeterminate: false,
        searchInput: '',
        storyIdSort: false,
        storyNameSort: false,
        imageNameSort: false,
        questionCountSort: false,
        storyContentSort: false,
        storyIdColumnDisplay: true,
        storyNameColumnDisplay: true,
        imageNameColumnDisplay: true,
        questionCountColumnDisplay: true,
        storyContentColumnDisplay: true
    });



    const { selectAll, selectAllIndeterminate,
        searchInput, filteredData,
        storyIdSort, storyNameSort, imageNameSort, questionCountSort, storyContentSort,
        storyIdColumnDisplay, storyNameColumnDisplay, imageNameColumnDisplay, questionCountColumnDisplay,
        storyContentColumnDisplay } = storyTableState;

    let newFilteredData = [];


    const handleCheckAllChange = (e) => {
        let checked = e.target.checked;
        checked ? newStoryList.map(user => user.select = true) : newStoryList.map(user => user.select = false);
        onChange('storyList', newStoryList);
        setStoryTableState({ ...storyTableState, selectAll: !selectAll, selectAllIndeterminate: false, filteredData: newStoryList });

        if(searchInput){
            onChange('storyList', newStoryList);
            checked ? filteredData.map(user => user.select = true) : filteredData.map(user => user.select = false);
            setStoryTableState({ ...storyTableState, selectAll: !selectAll, selectAllIndeterminate: false, filteredData });
        }

    }

    const handleCheckChange = (CheckedUser) => {
        const test = newStoryList.find(user => user.storyId === CheckedUser.storyId);
        if (test) {
            test.select = !test.select;
        }

        onChange('storyList', newStoryList);
        if (!(newStoryList.every(user => user.select) || newStoryList.every(user => !user.select))) {
            setStoryTableState({ ...storyTableState, selectAllIndeterminate: true, filteredData: newStoryList });
        } else {
            const selection = newStoryList.every(user => user.select);
            selection ? setStoryTableState({ ...storyTableState, selectAll: true, selectAllIndeterminate: false, filteredData: newStoryList }) : setStoryTableState({ ...storyTableState, selectAll: false, selectAllIndeterminate: false, filteredData: newStoryList });
        }

        if(searchInput){
            const test = filteredData.find(user => user.storyId === CheckedUser.storyId);
            if (test) {
                test.select = !test.select;
            }

            if (!(filteredData.every(user => user.select) || filteredData.every(user => !user.select))) {
                setStoryTableState({ ...storyTableState, selectAllIndeterminate: true, filteredData: filteredData });
            } else {
                const selection = filteredData.every(user => user.select);
                selection ? setStoryTableState({ ...storyTableState, selectAll: true, selectAllIndeterminate: false, filteredData: filteredData }) : setStoryTableState({ ...storyTableState, selectAll: false, selectAllIndeterminate: false, filteredData: filteredData });
            }
            onChange('storyList', newStoryList);
        }


    }


    const globalSearchFilter = () => {
        if (searchInput.length) {
            newFilteredData = newStoryList.filter(value => {
                return (
                    value.storyName.toLowerCase().includes(searchInput.toLowerCase()) ||
                    value.imageName.toLowerCase().includes(searchInput.toLowerCase()) ||
                    value.storyContent.toLowerCase().includes(searchInput.toLowerCase())
                );
            });
            if (newFilteredData.length) {
                setStoryTableState({ ...storyTableState, filteredData: newFilteredData })
            }
            else if (!newFilteredData.length) {
                setStoryTableState({ ...storyTableState, filteredData: [] });
            }
        }

    }

    useEffect(() => {
        if (searchInput) {
            globalSearchFilter();
            console.log(searchInput,filteredData);
        }
        else {
            setStoryTableState({ ...storyTableState, filteredData: newStoryList });
        }

    }, [searchInput]);


    const handleSearchInputChange = (e) => {
        setStoryTableState({ ...storyTableState, searchInput: e.target.value });
    }

    const handleSortChangeStyle = (props) => {
        if (props[0].id !== '') {
            const sortStyle = { ...storyTableState };
            sortStyle[`${props[0].id + 'Sort'}`] = props[0].desc;
            setStoryTableState({ ...sortStyle })
        }
    }

    const handleDeleteData = (value) => {
        const deleteStory = newStoryList.filter(story => JSON.stringify(story) !== JSON.stringify(value));
        deleteStory.map(story => Object.assign(story, { storyId: deleteStory.indexOf(story) + 1 }));
        onChange('storyList', deleteStory);
        setStoryTableState({ ...storyTableState, filteredData: deleteStory, selectAll: deleteStory.every(user => user.select), selectAllIndeterminate: false, searchInput: '' });

    }

    const handleEditData = (value, index) => {
        mainTableEdit(value, index);
        history.push('/storyform');
    }

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleColumnDisplayChange = (e) => {
        setStoryTableState({ ...storyTableState, [e.target.name]: e.target.checked })
    }


    const columns = [
        {
            headerStyle: { outline: 'none', pointerEvents: 'none', borderRight: 'unset' },
            Header: (
                <div style={{ pointerEvents: 'none', display: 'flex', justifyContent: 'space-between' }} >
                    <Checkbox
                        style={{ pointerEvents: 'auto' }}
                        indeterminate={selectAllIndeterminate}
                        checked={selectAll}
                        className='checkBoxes'
                        onChange={(e) => handleCheckAllChange(e)}
                    ></Checkbox>
                    <div style={{ pointerEvents: 'auto', cursor: 'pointer' }}>
                        <FontAwesomeIcon style={{ color: 'dodgerBlue' }} icon={faCaretSquareDown} onClick={handleClick} />
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem>
                                <input name='storyIdColumnDisplay' checked={storyIdColumnDisplay} onChange={handleColumnDisplayChange} type='checkbox' style={{ cursor: 'pointer' }} />
                                Story ID
                                </MenuItem>
                            <MenuItem>
                                <input name='storyNameColumnDisplay' checked={storyNameColumnDisplay} onChange={handleColumnDisplayChange} type='checkbox' style={{ cursor: 'pointer' }} />
                                Story Name
                                </MenuItem>
                            <MenuItem >
                                <input name='imageNameColumnDisplay' checked={imageNameColumnDisplay} onChange={handleColumnDisplayChange} type='checkbox' style={{ cursor: 'pointer' }} />
                                Image Name
                                </MenuItem>
                            <MenuItem >
                                <input name='storyContentColumnDisplay' checked={storyContentColumnDisplay} onChange={handleColumnDisplayChange} type='checkbox' style={{ cursor: 'pointer' }} />
                                story Content
                                </MenuItem>
                            <MenuItem >
                                <input name='questionCountColumnDisplay' checked={questionCountColumnDisplay} onChange={handleColumnDisplayChange} type='checkbox' style={{ cursor: 'pointer' }} />
                                Questions Count
                                </MenuItem>
                        </Menu>
                    </div>
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
            width: 70,
            resizable: false,
            sortable: false
        },
        {
            headerStyle: headerStyle,
            Header: (
                <div style={{ pointerEvents: 'none', display: 'flex', justifyContent: 'space-between' }} >
                    Story id
                    <Sorter className={storyIdSort ? 'sortIconDown' : 'sortIconUp'} />
                </div >
            ),
            accessor: 'storyId',
            width: 120,
            show: storyIdColumnDisplay
        }, {

            headerStyle: headerStyle,
            Header: (
                <div style={{ pointerEvents: 'none', display: 'flex', justifyContent: 'space-between' }}>
                    Story name
                    <Sorter className={storyNameSort ? 'sortIconDown' : 'sortIconUp'} />
                </div>),
            accessor: 'storyName',
            width: 280,
            show: storyNameColumnDisplay
        }, {
            headerStyle: headerStyle,
            Header: (
                <div style={{ pointerEvents: 'none', display: 'flex', justifyContent: 'space-between' }}>
                    Image name
                    <Sorter className={imageNameSort ? 'sortIconDown' : 'sortIconUp'} />
                </div>),
            accessor: 'imageName',
            width: 250,
            show: imageNameColumnDisplay
        },
        {
            headerStyle: headerStyle,
            Header: (
                <div style={{ pointerEvents: 'none', display: 'flex', justifyContent: 'space-between' }}>
                    storyContent
                    <Sorter className={storyContentSort ? 'sortIconDown' : 'sortIconUp'} />
                </div>),
            accessor: 'storyContent',
            width: 320,
            show: storyContentColumnDisplay
        },
        {
            headerStyle: headerStyle,
            Header: (
                <div style={{ pointerEvents: 'none', display: 'flex', justifyContent: 'space-between' }}>
                    Questions Count
                    <Sorter className={questionCountSort ? 'sortIconDown' : 'sortIconUp'} />
                </div>),
            accessor: 'questionCount',
            width: 270,
            show: questionCountColumnDisplay
        },
        {
            headerStyle: headerStyle,
            Header: '',
            accessor: '',
            Cell: ({ value, index }) => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100px' }}>

                        <FontAwesomeIcon style={{ color: 'dodgerblue', cursor: 'pointer' }} icon={faTrash} onClick={() => handleDeleteData(value)} />
                        <FontAwesomeIcon style={{ color: 'dodgerblue', cursor: 'pointer' }} icon={faEdit} onClick={() => handleEditData(value, index)} />
                    </div>
                );
            },
            width: 'auto',
            resizable: false,
            sortable: false
        }
    ];

    return (
        <div className='mainStoryTableContainer'>
            <div className='searchFilterContainer'>
                <h2>Story Details</h2>
                <SearchFilter searchInputValue={searchInput} searchInputChange={handleSearchInputChange} />
            </div>
            {!filteredData.length || !storyList.length ? <div><h1>There is no story</h1></div> :
                <div>
                    <ReactTable
                        PaginationComponent={Pagination}
                        columns={columns}
                        data={filteredData}
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