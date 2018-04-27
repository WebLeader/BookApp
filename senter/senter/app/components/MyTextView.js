import React, { Component } from 'react';
import {
    requireNativeComponent
} from 'react-native';

var MyTextView = requireNativeComponent('MyTextView', TextView)

export default class TextView extends Component {

    static propTypes = {
        text: React.PropTypes.string.isRequired,
        textSize: React.PropTypes.number,
        textColor: React.PropTypes.number,
        isAlpha: React.PropTypes.bool,
    }

    render() {
        return (
            <MyTextView {...this.props} />
        )
    }
}