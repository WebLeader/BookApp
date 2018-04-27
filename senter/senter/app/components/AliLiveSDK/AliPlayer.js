import React, { Component } from 'react';
import {
    requireNativeComponent,
    View
} from 'react-native';

var RNAliPlayerView = requireNativeComponent('RNAliPlayerView', AliPlayer)

export default class AliPlayer extends Component {

    static propTypes = {
        url: React.PropTypes.string.isRequired
    }

    render() {
        return (
            <RNAliPlayerView {...this.props} />
        )
    }
}