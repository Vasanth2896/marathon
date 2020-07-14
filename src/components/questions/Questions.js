import React, { useState } from 'react';
import './Questions.scss';
import ReactTable from 'react-table-v6';
import { app_onChange, questionListManipulation, onQuestionEdit, onQuestionCancel } from '../../store/appActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const Questions = (props) => {
    const { state, onChange, questionListManipulation, onQuestionEdit, onQuestionCancel, } = props;
    const { questionSet, questionSetError } = state;
    const currentQuestionSet = JSON.parse(JSON.stringify(questionSet));
    const { question, answer, questionsList } = currentQuestionSet;
    const currentQuestionSetError = JSON.parse(JSON.stringify(questionSetError));
    const { questionsListError } = currentQuestionSetError;
    const [questionState, setQuestionState] = useState(
        {
            error: {
                questionError: '',
                answerError: '',
                questionListError: ''
            },
            editableIndex: null
        }
    )
    const { error, editableIndex } = questionState
    const { questionError, answerError } = error;
    const pointerEvents = editableIndex !== null ? 'none' : 'auto';

    const handleChange = (e) => {
        const newQuestionSet = { ...currentQuestionSet };
        newQuestionSet[e.target.name] = e.target.value;
        onChange('questionSet', newQuestionSet);
        setQuestionState({ ...questionState, error: { questionError: '', answerError: '' } });
    }

    const addQuestions = () => {
        if (question && answer) {
            let newQuestionsList = [...questionsList];
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
        else {
            if (!question) {
                setQuestionState({ ...questionState, error: { ...error, questionError: 'Please enter the question' } });
            }
            else if (!answer) {
                setQuestionState({ ...questionState, error: { ...error, answerError: 'Please enter the answer' } });
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
        // setQuestionState({ ...questionState, questionsList: newQuestionsList });
    }

    const editQuestion = (questionId, questionIndex) => {
        const currentQuestion = questionsList.find(question => question.id === questionId);
        onQuestionEdit(currentQuestion)
        setQuestionState({ ...questionState, editableIndex: questionIndex });
    }

    const columns = [
        {
            Header: 'Question',
            accessor: 'question'
        }, {
            Header: 'Answer',
            accessor: 'answer',
        }, {
            Header: 'Actions',
            Cell: row => (
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <button onClick={() => editQuestion(row.original.id, row.index)}>Edit</button>
                    <button onClick={() => deleteQuestion(row.original.id)} >Delete</button>
                    <span></span>
                </div>
            )
        }];

    return (
        <div className='questionContainer'>
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
                    >Add</button>
                    <button
                        onClick={() => cancelQuestionOperation()}
                    >Cancel</button>
                </div>
            </div>
            <ReactTable
                columns={columns}
                data={[...questionsList]}
                showPagination={false}
                style={{ height: '250px', backgroundColor: 'white', pointerEvents: pointerEvents }}
                className="-striped -highlight"
                noDataText='No Questions'
            />
            {questionsListError && <span style={{color:'red'}}>{questionsListError}</span>}
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