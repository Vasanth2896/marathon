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
        let newStory = JSON.parse(JSON.stringify(story));
        newStory.bannerImage = image;
        dispatch(app_onChange('story', newStory));
    }
}

export function addWord() {
    return (dispatch, getState) => {
        const { story, storyError } = getState().appReducer;
        let newStory = JSON.parse(JSON.stringify(story));
        let { keywordList, keyword } = newStory;
        keywordList.push(keyword);
        newStory.keyword = '';
        let newStoryError = { ...storyError };
        newStoryError.keywordListError = '';
        dispatch(app_onChange('storyError', newStoryError));
        dispatch(app_onChange('story', newStory));
    }
}

export function deleteWord(existingWordList) {
    return (dispatch, getState) => {
        const { story } = getState().appReducer;
        let newStory = JSON.parse(JSON.stringify(story));
        newStory.keywordList = existingWordList;
        dispatch(app_onChange('story', newStory));
    }
}

export function questionListManipulation(newQuestionsList) {
    return (dispatch, getState) => {
        const { questionSet, questionSetError } = getState().appReducer;
        let newQuestionSet = JSON.parse(JSON.stringify(questionSet));
        newQuestionSet.questionsList = newQuestionsList;
        newQuestionSet.question = '';
        newQuestionSet.answer = '';
        let newQuestionSetError = JSON.parse(JSON.stringify(questionSetError));
        newQuestionSetError.questionsListError = ''
        dispatch(app_onChange('questionSetError', newQuestionSetError));
        dispatch(app_onChange('questionSet', newQuestionSet));
    }
}

export function onQuestionCancel() {
    return (dispatch, getState) => {
        const { questionSet } = getState().appReducer;
        let newQuestionSet = JSON.parse(JSON.stringify(questionSet));
        newQuestionSet.question = '';
        newQuestionSet.answer = '';
        dispatch(app_onChange('questionSet', newQuestionSet));
    }

}

export function onQuestionEdit(currentQuestion) {
    return (dispatch, getState) => {
        const { questionSet } = getState().appReducer;
        let newQuestionSet = JSON.parse(JSON.stringify(questionSet));
        newQuestionSet.question = currentQuestion.question;
        newQuestionSet.answer = currentQuestion.answer;
        dispatch(app_onChange('questionSet', newQuestionSet));
    }
}

export function onSave() {
    return (dispatch, getState) => {
        const valid = dispatch(errorValidation());
        if (valid) {
            const { userList, story, questionSet } = getState().appReducer;
            userList.push({
                id: userList.length + 1, bannerImage: story.bannerImage,
                keywordList: story.keywordList,
                questionsList: questionSet.questionsList, storyName: story.storyName
            });
            dispatch(app_onChange('userList', userList));
            dispatch(app_onChange('story', {
                bannerImage: '',
                storyName: '',
                storyContent: '',
                keyword: '',
                keywordList: [],
            }))
            dispatch(app_onChange('questionSet', {
                question: '',
                answer: '',
                questionsList: [],
            }))
            dispatch(app_onChange('storyError', {
                storyNameError: '',
                storyContentError: '',
                keywordListError: ''
            }))
            dispatch(app_onChange('questionSetError', {
                questionsListError: ''
            },
            ))
        }
    }
}

export function onCancel() {
    return (dispatch, getState) => {
        dispatch(app_onChange('story', {
            bannerImage: '',
            storyName: '',
            storyContent: '',
            keyword: '',
            keywordList: [],
        }))
        dispatch(app_onChange('questionSet', {
            question: '',
            answer: '',
            questionsList: [],
        }))
        dispatch(app_onChange('storyError', {
            storyNameError: '',
            storyContentError: '',
            keywordListError: ''
        }))
        dispatch(app_onChange('questionSetError', {
            questionsListError: ''
        }))
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
