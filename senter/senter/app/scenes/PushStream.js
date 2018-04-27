

import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Image,
    Platform
} from 'react-native';

var { height, width } = Dimensions.get('window');
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AliStreaming from '../components/AliLiveSDK/AliStreaming';
import HeaderBar from '../components/HeaderBar';//导航头部
import {PostPushStreamList} from '../network/LiveApi';//调用推流接口
import { NaviGoBack } from '../common/NavigatorUtils';

export default class extends Component {

    constructor() {
        super();

        this.backAction = this.backAction.bind(this);
        this.rendLeftButton = this.rendLeftButton.bind(this);
        this.rendRightButton = this.rendRightButton.bind(this);
        this.state = {
            frontCamera: false,
            form: {id: 1, token: 1},
            pushurl:{
                streamUrl:'about:blank'
            }
        };

    }

    backAction() {
        const { navigator } = this.props;
        return NaviGoBack(navigator);
    }

    rendLeftButton() {
        return (
            <TouchableOpacity onPress={() => { this.backAction() }} style={styles.leftViewStyle}>
                <Image source={require('../assets/imgs/left.png')} style={styles.navImageStyle}/>
            </TouchableOpacity>
        )
    }

    rendRightButton() {
        return (
            <TouchableOpacity onPress={() => { this.setState({ frontCamera: !this.state.frontCamera }) }} style={styles.rightViewStyle}>
                <Text>调整摄像头</Text>
            </TouchableOpacity>
        )
    }

    //初始化调用拉流接口
    componentDidMount() {
        this.PushStream();
    }

    PushStream(){
        //读取
        storage.load({key: 'currentLogin'}).then(response => {
            //更新状态机
            this.setState({form: response});
            //调用推流接口
            //console.warn('nihao',response.id);
            //console.warn('nihao',response.token);
            PostPushStreamList({
                //传递用户ID、TOKEN参数
                id: response.id,
                token: response.token,
            }).then(response => {
                console.warn(JSON.stringify(response));
                switch (parseInt(response.status)) {
                    case 200:
                        //更新状态机
                        this.setState({pushurl: response.data});
                        break;
                    default:
                        break;
                }
            }).catch(error => {
                console.warn('发现错误1' + JSON.stringify(error));
            });
        }).catch(error => {
            console.warn('发现错误2' + JSON.stringify(error));
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <HeaderBar title='推流测试' rendLeftButton={() => this.rendLeftButton()} rendRightButton={() => this.rendRightButton()} />
                <View style={{ backgroundColor: 'black', flexDirection: 'row', flex: 1 }}>
                    <AliStreaming
                        //url='rtmp://video-center.alivecdn.com/Chunld/Test?vhost=living.chunld.cn&auth_key=1502279331-9fb27401a9519891-0-deab19f51ceb6671e89c70608b81418b'
                        url={this.state.pushurl.streamUrl}
                        frontCamera={this.state.frontCamera}
                        skin={true}
                        skinVlue={1.0}
                        style={{ width: width, height: width * 1.3 }}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        paddingLeft: 5,
        paddingRight: 5,
    },
    // 导航样式
    leftViewStyle: {
        position: 'absolute',
        left: 10,
        bottom: Platform.OS == 'ios' ? 15 : 13
    },
    rightViewStyle:{
        position: 'absolute',
        right: 10,
        bottom: Platform.OS == 'ios' ? 15 : 13
    },
    navImageStyle: {
        width: Platform.OS == 'ios' ? 28 : 24,
        height: Platform.OS == 'ios' ? 28 : 24
    },
});