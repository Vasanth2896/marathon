import React, { useState, useRef } from 'react';
import './Story.scss'
import { connect } from 'react-redux';
import { app_onChange, addWord, deleteWord, addImage } from '../../store/appActions';
import { bindActionCreators } from 'redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'

const Story = (props) => {
    const { state, onChange, addWord, deleteWord, addImage } = props;
    const { story, storyError } = state;
    const currentStory = JSON.parse(JSON.stringify(story));
    const currentStoryError = JSON.parse(JSON.stringify(storyError));
    const { storyName, storyContent, keyword, keywordList,bannerImage } = currentStory;
    const { storyNameError, storyContentError, keywordListError,bannerImageError } = currentStoryError;
    const [storyState, setStoryState] = useState(
        {
            keywordError: '',
            localBannerImageError: '',
        }
    )
    const { keywordError,localBannerImageError } = storyState;

    const fileInputRef = useRef();

    const handleChange = (e) => {
        currentStory[e.target.name] = e.target.value;
        onChange('story', currentStory);
        currentStoryError[`${e.target.name}Error`] = ''
        onChange('storyError', currentStoryError);
        if (e.target.name === 'keyword') {
            currentStoryError[`${e.target.name}ListError`] = '';
            setStoryState({ ...storyState, keywordError: '' });
        }
    }

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            if (!keywordList.find(word => word === e.target.value.trim())) {
                addWord(e.target.value.trim());
            }
            else {
                setStoryState({ ...storyState, keywordError: 'The keyword already exists' })
            }
        }
    }

    const handlePreview = (e) => {
        e.preventDefault();
        let file = e.target.files[0];
        let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        if (!allowedExtensions.exec(file.name)) {
            setStoryState({ ...state, localBannerImageError: 'Please upload Image' });
        }
        else {
            setStoryState({ ...state, localBannerImageError: '' });
        }

        // let reader = new FileReader();
        // if (e.target.files.length === 0) {
        //     return;
        // }

        // currentStoryError[`${e.target.name}Error`] = ''
        // onChange('storyError', currentStoryError);

        // reader.onloadend = (e) => {
        //     addImage([reader.result]);
        // }
        // reader.readAsDataURL(file);
    }

    const handleDelete = (existingWord) => {
        const newWordList = keywordList.filter(word => word !== existingWord)
        deleteWord(newWordList);
    }

    return (
        <div>
            <h1 style={{ textAlign: 'Center' }}>Story Form</h1>
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
                        <button onClick={() => fileInputRef.current.click()}>
                            <FontAwesomeIcon icon={faUpload} />
                            Banner Image
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => handlePreview(e)}
                        />
                        {localBannerImageError && <span style={{ color: 'red' }}>{localBannerImageError}</span>}
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
                    <input type='text'
                        name='keyword'
                        value={keyword}
                        onChange={(e) => handleChange(e)}
                        onKeyDown={(e) => handleKeyDown(e)}
                        className='keywordContent'
                        placeholder='keywords'>
                    </input>
                    {keywordList.length > 0 &&
                        <div style={{ display: 'flex', marginTop: '20px' }}>
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

                    {keywordError && <span style={{ color: 'red' }}>{keywordError}</span>}
                    {keywordListError && <span style={{ color: 'red' }}>{keywordListError}</span>}

                </div>
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