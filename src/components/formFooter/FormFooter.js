import React from 'react';
import './FormFooter.scss'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { onSave,onCancel } from '../../store/appActions';

const FormFooter = (props) => {
    const { onSave,onCancel } = props;
    return (
        <footer className='FormFooterContainer'>
            <div className='FormFooterButtonContainer'>
                <button onClick={() => onCancel()} >CANCEL</button>
                <button id='saveButton' onClick={() => onSave()} >SAVE</button>
            </div>
        </footer>
    )
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        onSave: onSave,
        onCancel:onCancel
    }, dispatch)
}

export default connect(null, mapDispatchToProps)(FormFooter);
