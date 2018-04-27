import React from 'react';
import {
    Dimensions,
    View,
    Text,
    Image,
    StyleSheet,
    Alert,
    TouchableOpacity,
    InteractionManager,
    NativeModules,
    ScrollView,
    WebView,
} from 'react-native';
var { height, width } = Dimensions.get('window');

import HeaderBar from '../../components/HeaderBar';//头部导航
import HomePage from '../AppMain';//首页

export default class Web extends React.Component {

    constructor(props) {
        super(props);
        this.rendLeftButton = this.rendLeftButton.bind(this);
        this.rendRightButton = this.rendRightButton.bind(this);
        this.backAction = this.backAction.bind(this);//返回
        this.HomePages = this.HomePages.bind(this);//返回首页
        this.state = {
            title: '图书上架',
            webViewData: ''
        }
    }

    //返回
    backAction() {
        const { navigator } = this.props;
        return navigator.popToTop();
    }

    //返回首页
    HomePages() {
        const { navigator } = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigator.push({
                component: HomePage,
                name: 'HomePage',
            });
        });
    }
    rendLeftButton() {
        return (
            <TouchableOpacity onPress={() => { this.backAction() }} style={styles.leftViewStyle}>
                <Image source={require('../../assets/imgs/left.png')} style={styles.navImageLeftStyle}/>
            </TouchableOpacity>
        )
    }

    rendRightButton() {
        return (
            <TouchableOpacity onPress={() => { this.HomePages() }} style={styles.rendRightButton}>
                <Image source={require('../../assets/imgs/zhuye.png')} style={styles.navImageRightStyle}/>
            </TouchableOpacity>
        )
    }

    // sendMessage() {
    //     this.refs.webview.postMessage(++this.data);
    // }

    handleMessage(e) {
        this.setState({webViewData: e.nativeEvent.data});
        if(this.state.webViewData == 0){
            NativeModules.BookRfidModule.getUii((name) => {
                //Alert.alert('提示', name);
                this.refs.webview.postMessage(name);
            }, (err) => {
                alert(err)
            })
        }else if(this.state.webViewData == 1){
            NativeModules.BookRfidModule.uninit();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderBar title={this.state.title} rendLeftButton={this.rendLeftButton} rendRightButton={this.rendRightButton}/>
                <ScrollView style={styles.container}>
                <View style={{width: width, height: height}}>
                    <WebView
                        ref={'webview'}
                        source={{uri:"http://www.tquanba.cn/Book/Book_sj.html",method: 'GET'}}
                        style={{width: width, height: width}}
                        onMessage={(e) => {
                          this.handleMessage(e)
                        }}
                    />

                </View>
                </ScrollView>
                {/*<Text>来自webview的数据 : {this.state.webViewData}</Text>*/}
                {/*<Text onPress={() => {this.sendMessage()}}>发送数据到WebView</Text>*/}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    // 导航样式
    leftViewStyle: {
        position: 'absolute',
        left: 10,
        bottom: Platform.OS == 'ios' ? 15 : 3
    },
    navImageLeftStyle: {
        width: Platform.OS == 'ios' ? 28 : 38,
        height: Platform.OS == 'ios' ? 28 : 38,
    },
    navImageRightStyle: {
        width: Platform.OS == 'ios' ? 28 : 30,
        height: Platform.OS == 'ios' ? 28 : 30,
    },
    rendRightButton:{
        position: 'absolute',
        right:10,
        bottom: Platform.OS == 'ios' ? 15 : 8
    },
});