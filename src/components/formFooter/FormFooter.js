import React from 'react';
import './FormFooter.scss'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { onSave, onCancel, errorValidation } from '../../store/appActions';
import { useHistory } from 'react-router-dom';


const FormFooter = (props) => {
    const { state, onSave, onCancel, errorValidation } = props;
    const { mainTableEditableIndex } = state
    const history = useHistory();

    const handleSave = async () => {
        const isValid = await errorValidation();
        if (isValid) {
            onSave();
            history.push('/');
        }
    }

    const handleCancel = () => {
        onCancel();
        history.push('/');
    }

    return (
        <footer className='FormFooterContainer'>
            <div className='FormFooterButtonContainer'>
                <button name='cancel' onClick={() => handleCancel()} >CANCEL</button>
                <button id='saveButton' name='add' onClick={() => handleSave()} >
                    { mainTableEditableIndex === null?'SAVE':'UPDATE'}
                </button>
            </div>
        </footer>
    )
}


const mapStateToProps = (state) => {
    return {
        state: state.appReducer
    }
}



const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        onSave: onSave,
        onCancel: onCancel,
        errorValidation: errorValidation
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(FormFooter);
