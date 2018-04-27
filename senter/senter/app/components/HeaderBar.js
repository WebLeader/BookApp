import React, { Component } from 'react';
import { PropTypes} from 'prop-types';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Platform
} from 'react-native';

import EvilIcons from 'react-native-vector-icons/EvilIcons';

export default class HeaderBar extends Component {

    static defaultProps = {
        title: '头部标题',
        rendLeftButton: () => { },
        rendRightButton: () => { },
    };

    static propTypes = {
        title: PropTypes.string,
        rendLeftButton: PropTypes.func,
        rendRightButton: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={styles.navOutViewStyle}>
                {/*左边按钮*/}
                {this.props.rendLeftButton()}
                {/*中间title*/}
                <Text style={{ fontWeight: 'bold', fontSize: 20,color:'#fff' }}>{this.props.title}</Text>
                {/*右边文字/按钮*/}
                {this.props.rendRightButton()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    navOutViewStyle:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#012c4c',
        height:Platform.OS == 'ios' ? 64:44,
    },
});