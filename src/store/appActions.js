import _ from 'lodash';
export const UPDATE_STATE = "UPDATE_STATE";
export const initialState = {
    story: {
        bannerImage: '',
        storyName: '',
        storyContent: '',
        keyword: '',
        keywordList: [],
    },
    storyError: {
        storyNameError: '',
        storyContentError: '',
        keywordListError: '',
        // bannerImageError: ''
    },
    questionSet: {
        question: '',
        answer: '',
        questionsList: [],
    },
    questionSetError: {
        questionsListError: ''
    },
    storyList: [
        {
            storyId: 1,
            imageName: "dummyImage",
            keywordList: [
                "1"
            ],
            questionCount: 1,
            questionSet: [
                {
                    id: 1,
                    question: 1,
                    answer: 1
                }
            ],
            storyName: '1',
            storyContent: '1',
            select: false
        },
        {
            storyId: 2,
            imageName: "dummyImage",
            keywordList: [
                "2"
            ],
            questionCount: 1,
            questionSet: [
                {
                    id: 1,
                    question: "2",
                    answer: "2",
                }
            ],
            storyName: '2',
            storyContent: "2",
            select: false
        }
    ],
    mainTableEditableIndex: null
};

export function app_onChange(name, value) {
    return { type: UPDATE_STATE, payload: { name: name, value: value } };
}

export function errorValidation() {
    return (dispatch, getState) => {
        const { story, storyError, questionSet, questionSetError } = getState().appReducer;
        let newStory = _.cloneDeep(story);
        let { storyName, storyContent, keywordList, bannerImage } = newStory;
        let newQuestionSet = _.cloneDeep(questionSet);
        let { questionsList } = newQuestionSet;
        let newStoryError = { ...storyError };
        let newQuestionSetError = { ...questionSetError };

        if (!bannerImage) {
            newStoryError.bannerImageError = 'Please upload an image';
        }

        if (!storyName || storyName.replace(/\s/g, '').length <= 0) {
            newStoryError.storyNameError = 'Please enter a story name';
        }
        if (!storyContent || storyContent.replace(/\s/g, '').length <= 0) {
            newStoryError.storyContentError = 'Please enter a story Content';
        }
        if (!keywordList.length) {
            newStoryError.keywordListError = 'There should be atleast one key word';
        }
        if (!questionsList.length) {
            newQuestionSetError.questionsListError = 'There should be atleast one question'

        }

        dispatch(app_onChange('questionSetError', newQuestionSetError));
        dispatch(app_onChange('storyError', newStoryError));

        if (newStoryError.storyNameError === '' && newStoryError.storyContentError === ''
            && newStoryError.keywordListError === '' && newQuestionSetError.questionsListError === '') {
            return true;
        }
        else {
            return false;
        }
    }

}

export function addWord(newKeyword) {
    return (dispatch, getState) => {
        let { story, storyError } = getState().appReducer;
        let { keywordList } = story;
        let newKeywordList = [...keywordList];
        newKeywordList.push(newKeyword);
        Object.assign(story, { keywordList: newKeywordList, keyword: '' });
        Object.assign(storyError, { keywordListError: '' });
        dispatch(app_onChange('story', story));
        dispatch(app_onChange('storyError', storyError));

    }
}

export function deleteWord(existingWordList) {
    return (dispatch, getState) => {
        let { story } = getState().appReducer;
        Object.assign(story, { keywordList: [...existingWordList] });
        dispatch(app_onChange('story', story));
    }
}

export function questionListManipulation(newQuestionsList) {
    return (dispatch, getState) => {
        const { questionSet, questionSetError } = getState().appReducer;
        Object.assign(questionSet, { questionsList: [...newQuestionsList], question: '', answer: '' });
        Object.assign(questionSetError, { questionsListError: '' });
        dispatch(app_onChange('questionSetError', questionSetError));
        dispatch(app_onChange('questionSet', questionSet));
    }
}

export function onQuestionCancel() {
    return (dispatch, getState) => {
        const { questionSet } = getState().appReducer;
        Object.assign(questionSet, { question: '', answer: '' });
        dispatch(app_onChange('questionSet', questionSet));
    }

}
export function onQuestionEdit(currentQuestion) {
    return (dispatch, getState) => {
        const { questionSet } = getState().appReducer;
        const { question, answer } = currentQuestion
        Object.assign(questionSet, { question, answer })
        dispatch(app_onChange('questionSet', questionSet));
    }
}

export function onSave() {
    return (dispatch, getState) => {
        const valid = dispatch(errorValidation());
        const restoreInitialState = _.cloneDeep(initialState);
        if (valid) {
            const { storyList, story, questionSet, mainTableEditableIndex } = getState().appReducer;
            if (mainTableEditableIndex === null) {
                storyList.push({
                    storyId: storyList.length + 1,
                    imageName: story.bannerImage,
                    keywordList: story.keywordList,
                    questionCount: questionSet.questionsList.length,
                    questionSet: questionSet.questionsList,
                    storyName: story.storyName.trim(),
                    storyContent: story.storyContent,
                    select: false
                });
            }
            else {
                const editedStory = {
                    storyId: mainTableEditableIndex + 1, 
                    keywordList: story.keywordList,
                    imageName: story.bannerImage,
                    questionCount: questionSet.questionsList.length,
                    questionSet: questionSet.questionsList,
                    storyName: story.storyName.trim(),
                    storyContent: story.storyContent,
                    select: false
                };
                storyList.splice(mainTableEditableIndex, 1, editedStory);
            }
            dispatch(app_onChange('storyList', storyList));;
            dispatch(app_onChange('story', restoreInitialState.story));
            dispatch(app_onChange('questionSet', restoreInitialState.questionSet));
            dispatch(app_onChange('storyError', restoreInitialState.storyError));
            dispatch(app_onChange('questionSetError', restoreInitialState.questionSetError));
            dispatch(app_onChange('mainTableEditableIndex', null));
        }
    }

}

export function onCancel() {
    return (dispatch) => {
        const restoreInitialState = _.cloneDeep(initialState);
        const { story, questionSet, storyError, questionSetError } = restoreInitialState;
        dispatch(app_onChange('story', story));
        dispatch(app_onChange('questionSet', questionSet));
        dispatch(app_onChange('storyError', storyError));
        dispatch(app_onChange('questionSetError', questionSetError));
        dispatch(app_onChange('mainTableEditableIndex', null));
    }
}

export function mainTableEdit(editableData, mainTableEditableIndex) {
    return (dispatch, getState) => {
        const { story, questionSet } = getState().appReducer;
        let newStory = _.cloneDeep(story);
        let newQuestionSet = _.cloneDeep(questionSet);

        Object.assign(newStory, {
            bannerImage: editableData.imageName, storyName: editableData.storyName,
            storyContent: editableData.storyContent, keywordList: editableData.keywordList
        });
        Object.assign(newQuestionSet, { questionsList: editableData.questionSet });
        dispatch(app_onChange('mainTableEditableIndex', mainTableEditableIndex))
        dispatch(app_onChange('story', newStory));
        dispatch(app_onChange('questionSet', newQuestionSet));
    }
}

export const AppReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_STATE:
            return { ...state, [action.payload.name]: action.payload.value };
        default:
            return state;
    }
};
