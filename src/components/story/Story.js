import React, { useState } from 'react';
import './Story.scss'
import { connect } from 'react-redux';
import { app_onChange, addWord, deleteWord, addImage } from '../../store/appActions';
import { bindActionCreators } from 'redux';

const Story = (props) => {
    const { state, onChange, addWord, deleteWord, addImage } = props;
    const { story, storyError } = state;
    const currentStory = JSON.parse(JSON.stringify(story));
    const currentStoryError = JSON.parse(JSON.stringify(storyError));
    const { storyNameError,storyContentError,keywordListError } = currentStoryError;
    const { storyName, storyContent, keyword, keywordList } = currentStory;
    const [storyState, setStoryState] = useState(
        {
            keywordError: '',
        }
    )
    const { keywordError } = storyState;

    const handleChange = (e) => {
        const newStory = { ...currentStory };
        newStory[e.target.name] = e.target.value;
        onChange('story', newStory);
        const newStoryError = { ...currentStoryError };
        newStoryError[`${e.target.name}Error`] = ''
        onChange('storyError', newStoryError);
        if (e.target.name === 'keyword') {
            newStoryError[`${e.target.name}ListError`] = '';
            setStoryState({ ...storyState, keywordError: '' });
        }
    }

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            if (!keywordList.find(word => word === e.target.value)) {
                addWord();
            }
            else {
                setStoryState({ ...storyState, keywordError: 'The keyword already exists' })
            }
        }
    }

    const handlePreview = (e) => {
        e.preventDefault();

        let file = e.target.files[0];
        let reader = new FileReader();

        if (e.target.files.length === 0) {
            return;
        }

        reader.onloadend = (e) => {
            addImage([reader.result]);
        }

        reader.readAsDataURL(file);
    }

    const handleDelete = (existingWord) => {
        const newWordList = keywordList.filter(word => word !== existingWord)
        deleteWord(newWordList);
    }

    return (
        <div className='storyContainer'>
            <div className='storyNameContainer'>
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>
                        <input type='text'
                            name='storyName'
                            value={storyName}
                            onChange={(e) => handleChange(e)}
                            placeholder='Base Story Name'
                            className='storyName'></input>
                    </span>
                    {storyNameError && <span style={{ color: 'red' }}>{storyNameError}</span>}
                </span>
                <span>
                    <input type="file" id="img" name="img" accept="image/*" onChange={(e) => handlePreview(e)}></input>
                </span>
            </div>
            <div className='storyContentContainer'>
                <textarea className='storyContent'
                    name='storyContent'
                    value={storyContent}
                    onChange={(e) => handleChange(e)}
                    placeholder='About Story'></textarea>
                    {storyContentError && <span style={{ color: 'red' }}>{storyContentError}</span>}
            </div>
            <div className='keywordContentContainer'>
                {keywordList.length > 0 &&
                    <div style={{ display: 'flex' }}>
                        {keywordList.map((item, index) => {
                            return (
                                <span className='chipItem' key={index}>
                                    {item}
                                    <button className='keywordButton' onClick={() => handleDelete(item)} > &times;</button>
                                </span>
                            )
                        })
                        }
                    </div>
                }
                <input type='text'
                    name='keyword'
                    value={keyword}
                    onChange={(e) => handleChange(e)}
                    onKeyDown={(e) => handleKeyDown(e)}
                    className='keywordContent'
                    placeholder='keywords'></input>
                {keywordError && <span style={{ color: 'red' }}>{keywordError}</span>}
                {keywordListError && <span style={{ color: 'red' }}>{keywordListError}</span>}
                
            </div>
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
        addWord: addWord,
        deleteWord: deleteWord,
        addImage: addImage
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Story);