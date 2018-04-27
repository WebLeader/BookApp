import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    WebView,
    Dimensions,
    NativeModules,
    Alert
} from 'react-native';
var { height, width } = Dimensions.get('window');
export default class Web extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            webViewData: ''
        }
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
                <View style={{width: width, height: height}}>
                    <WebView
                        ref={'webview'}
                        source={{uri:"http://www.tquanba.cn/Book_pd.html",method: 'GET'}}
                        style={{width: width, height: width}}
                        onMessage={(e) => {
                          this.handleMessage(e)
                        }}
                    />

                </View>
                <Text>来自webview的数据 : {this.state.webViewData}</Text>
                <Text onPress={() => {this.sendMessage()}}>发送数据到WebView</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 22,
        backgroundColor: '#F5FCFF',
    },

});