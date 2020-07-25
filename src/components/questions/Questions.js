import React, { useState } from 'react';
import './Questions.scss';
import ReactTable from 'react-table-v6';
import { app_onChange, questionListManipulation, onQuestionEdit, onQuestionCancel } from '../../store/appActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faSortAmountDown } from '@fortawesome/free-solid-svg-icons'

const sortIconStyle = {
    color: 'dodgerBlue'
}

const Questions = (props) => {
    const { state, onChange, questionListManipulation, onQuestionEdit, onQuestionCancel, } = props;
    const { questionSet, questionSetError } = state;
    const currentQuestionSet = _.cloneDeep(questionSet);
    const currentQuestionSetError = _.cloneDeep(questionSetError);
    const { question, answer, questionsList } = currentQuestionSet;
    const { questionsListError } = currentQuestionSetError;
    const [questionState, setQuestionState] = useState(
        {
            error: {
                questionError: '',
                answerError: '',
            },
            editableIndex: null
        }
    )
    const { error, editableIndex } = questionState
    const { questionError, answerError } = error;
    const pointerEvents = editableIndex !== null ? 'none' : 'auto';
    const pointerEventCursor =  editableIndex !== null ? 'not-allowed':'default' ;


    let newQuestionsList = [...questionsList];

    const handleChange = (e) => {
        currentQuestionSet[e.target.name] = e.target.value;
        onChange('questionSet', currentQuestionSet);
        if (e.target.name === 'question') {
            setQuestionState({ ...questionState, error: { ...error, questionError: '' } });
        }
        else if (e.target.name === 'answer') {
            setQuestionState({ ...questionState, error: { ...error, answerError: '' } });
        }
    }

    const addQuestions = () => {
        if (question && answer) {
            const questionEmptySpace = question.toString().replace(/\s/g, '');
            const answerEmptySpace = answer.toString().replace(/\s/g, '');
            if (questionEmptySpace.length <= 0 && answerEmptySpace.length <= 0) {
                setQuestionState({ ...questionState, error: { ...error, questionError: 'Please enter the question', answerError: 'Please enter the answer' } });
            }
            else {
                if (editableIndex !== null) {
                    newQuestionsList = newQuestionsList.filter(questionItem => questionItem.question !== questionsList[editableIndex].question);
                    if ((newQuestionsList.find(questionItem => questionItem.question === question))) {
                        setQuestionState({ ...questionState, error: { ...error, questionError: 'The question already exists' } });
                    }
                    else {
                        newQuestionsList.splice(editableIndex, 0, { id: editableIndex + 1, question, answer })
                        questionListManipulation(newQuestionsList);
                        setQuestionState({ ...questionState, error: { questionError: '', answerError: '' }, editableIndex: null });
                    }
                }
                else {
                    if (newQuestionsList.find(questionItem => questionItem.question === question)) {
                        setQuestionState({ ...questionState, error: { ...error, questionError: 'The question already exists' } });
                    }
                    else {
                        newQuestionsList.push({ id: questionsList.length + 1, question, answer });
                        questionListManipulation(newQuestionsList);
                        setQuestionState({ ...questionState, error: { questionError: '', answerError: '' }, editableIndex: null });
                    }
                }
            }
        }
        else {
            if ((!question) && answer) {
                setQuestionState({ ...questionState, error: { ...error, questionError: 'Please enter the question' } });
            }
            else if (question && !answer) {
                setQuestionState({ ...questionState, error: { ...error, answerError: 'Please enter the answer' } });
            }
            else if (!(question && answer)) {
                setQuestionState({ ...questionState, error: { ...error, questionError: 'Please enter the question', answerError: 'Please enter the answer' } });
            }
        }

    }

    const cancelQuestionOperation = () => {
        onQuestionCancel()
        setQuestionState({ editableIndex: null, error: { ...error, questionError: '', answerError: '' } });
    }

    const deleteQuestion = (questionId) => {
        const newQuestionsList = questionsList.filter(item => item.id !== questionId);
        questionListManipulation(newQuestionsList);
    }

    const editQuestion = (questionId, questionIndex) => {
        const currentQuestion = questionsList.find(question => question.id === questionId);
        onQuestionEdit(currentQuestion)
        setQuestionState({ ...questionState, editableIndex: questionIndex });
    }

    const columns = [
        {
            Header: () => {
                return (
                    <div className='columnHeader'>
                        Question
                        <FontAwesomeIcon style={sortIconStyle} icon={faSortAmountDown} />
                    </div>
                )
            },
            accessor: 'question',
            width: 430
        }, {
            Header: () => {
                return (
                    <div className='columnHeader'>
                        Answer
                        <FontAwesomeIcon style={sortIconStyle} icon={faSortAmountDown} />
                    </div>
                )
            },
            accessor: 'answer',
            width: 430
        }, {
            Header: '',
            Cell: row => (
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                    <FontAwesomeIcon style={{ cursor: 'pointer', color: 'grey' }} onClick={() => editQuestion(row.original.id, row.index)} icon={faEdit} />
                    <FontAwesomeIcon style={{ cursor: 'pointer', color: 'grey' }} onClick={() => deleteQuestion(row.original.id)} icon={faTrash} />
                </div>
            ),
            resizable: false,
            width: 100,
            sortable:false

        }];

    return (
        <div className='questionContainer'>
            <h3>Questionnaire</h3>
            <div className='questionAndAnswer'>
                <div>
                    <input
                        type='text'
                        name='question'
                        value={question}
                        onChange={(e) => handleChange(e)}
                        placeholder='Question'
                    ></input>
                    {questionError && <span style={{ color: 'red' }}>{questionError}</span>}
                </div>
                <div>
                    <input
                        type='text'
                        name='answer'
                        value={answer}
                        onChange={(e) => handleChange(e)}
                        placeholder='Answer'
                    ></input>
                    {answerError && <span style={{ color: 'red' }} >Please Enter answer</span>}
                </div>
            </div>
            <div>
                <div className='questionBtnContainer'>
                    <button
                        id='addBtn'
                        onClick={() => addQuestions()}
                    >{editableIndex !== null ? 'Update' : 'Add'}</button>
                    <button
                        onClick={() => cancelQuestionOperation()}
                    >Cancel</button>
                </div>
            </div>
            {questionsList.length > 0 &&
                <div style={{cursor:pointerEventCursor}} >
                    <ReactTable
                        columns={columns}
                        data={[...questionsList]}
                        minRows={0}
                        showPagination={false}
                        style={{ backgroundColor: 'white',pointerEvents:pointerEvents }}
                        className="-striped -highlight"
                        noDataText='No Questions'
                    />
                </div>
            }

            {questionsListError && <span style={{ color: 'red' }}>{questionsListError}</span>}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        state: state.appReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        onChange: app_onChange,
        questionListManipulation: questionListManipulation,
        onQuestionEdit: onQuestionEdit,
        onQuestionCancel: onQuestionCancel
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Questions);