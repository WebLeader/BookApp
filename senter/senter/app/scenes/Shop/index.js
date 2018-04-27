import React, {Component} from 'react';
import {
    Dimensions,
    Image,
    InteractionManager,
    View,
    Text,
    WebView,
    TouchableOpacity,
    StyleSheet,
    Platform
} from 'react-native';
import {NaviGoBack} from '../../common/NavigatorUtils';

import HeaderBar from '../../components/HeaderBar';

export default class CWebView extends Component {
    static defaultProps = {
        url: 'about:blank',
        title: '春来到商城'
    }

    constructor(props) {
        super(props);
        //this.rendLeftButton = this.rendLeftButton.bind(this);
        this.backAction = this.backAction.bind(this);
        this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
        this.state = {
            title: this.props.title
        };
    }

    backAction() {
        const {navigator} = this.props;
        return NaviGoBack(navigator);
    }

    onNavigationStateChange(navState) {
        this.setState({
            title: navState.title
        })
    }

    // rendLeftButton() {
    //     return (
    //         <TouchableOpacity onPress={() => {this.backAction()}} style={styles.leftViewStyle}>
    //             <Image source={require('../../assets/imgs/left.png')} style={styles.navImageStyle}/>
    //         </TouchableOpacity>
    //     )
    // }

    render() {
        return (
            <View style={{flex: 1}}>
                <HeaderBar title={this.state.title}/>
                {/*<HeaderBar title={this.state.title} rendLeftButton={this.rendLeftButton}/>*/}
                <WebView
                    style={{flex: 1}}
                    source={{uri: this.props.url}}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    // 导航样式
    leftViewStyle: {
        position: 'absolute',
        left: 10,
        bottom: Platform.OS == 'ios' ? 15 : 13
    },
    navImageStyle: {
        width: Platform.OS == 'ios' ? 28 : 24,
        height: Platform.OS == 'ios' ? 28 : 24
    }
})