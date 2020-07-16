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
        keywordListError: ''
    },
    questionSet: {
        question: '',
        answer: '',
        questionsList: [],
    },
    questionSetError: {
        questionsListError: ''
    },
    userList: []
};

export function app_onChange(name, value) {
    return { type: UPDATE_STATE, payload: { name: name, value: value } };
}

export function errorValidation() {
    return (dispatch, getState) => {
        const { story, storyError, questionSet, questionSetError } = getState().appReducer;
        let newStory = JSON.parse(JSON.stringify(story));
        let { storyName, storyContent, keywordList } = newStory;
        let newQuestionSet = JSON.parse(JSON.stringify(questionSet));
        let { questionsList } = newQuestionSet;
        let newStoryError = { ...storyError };
        let newQuestionSetError = { ...questionSetError };

        if (!storyName) {
            newStoryError.storyNameError = 'Please enter a story name';
        }
        if (!storyContent) {
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

export function addImage(image) {
    return (dispatch, getState) => {
        const { story } = getState().appReducer;
        const newStory = JSON.parse(JSON.stringify(story));
        Object.assign(newStory, { bannerImage: image })
        dispatch(app_onChange('story', newStory));
    }
}

export function addWord(newKeyword) {
    return (dispatch, getState) => {
        console.log(newKeyword.split(''));
        let { story, storyError } = getState().appReducer;
        let { keywordList } = story;
        let newKeywordList = [...keywordList];
        newKeywordList.push(newKeyword)
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
        const restoreInitialState = JSON.parse(JSON.stringify(initialState));
        if (valid) {
            const { userList, story, questionSet } = getState().appReducer;
            userList.push({
                id: userList.length + 1, bannerImage: story.bannerImage,
                keywordList: story.keywordList,
                questionsList: questionSet.questionsList, storyName: story.storyName
            });
            dispatch(app_onChange('userList', userList));;
            dispatch(app_onChange('story', restoreInitialState.story));
            dispatch(app_onChange('questionSet', restoreInitialState.questionSet));
            dispatch(app_onChange('storyError', restoreInitialState.storyError));
            dispatch(app_onChange('questionSetError', restoreInitialState.questionSetError));
        }
    }

}

export function onCancel() {
    return (dispatch) => {
        const restoreInitialState = JSON.parse(JSON.stringify(initialState));
        console.log(restoreInitialState);
        const { story, questionSet, storyError, questionSetError } = restoreInitialState;
        dispatch(app_onChange('story', story));
        dispatch(app_onChange('questionSet', questionSet));
        dispatch(app_onChange('storyError', storyError));
        dispatch(app_onChange('questionSetError', questionSetError));

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
