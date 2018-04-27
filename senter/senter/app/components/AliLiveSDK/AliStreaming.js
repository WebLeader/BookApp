import React, { Component } from 'react';
import {
    requireNativeComponent
} from 'react-native';
//引用AliStreaming组件
var RNAliStreamView = requireNativeComponent('RNAliStreamView', AliStreaming)

export default class AliStreaming extends Component {

    static propTypes = {
        url: React.PropTypes.string.isRequired,//检测url是否为字符串
    }

    render() {
        return (
            <RNAliStreamView {...this.props} />
        )
    }
}