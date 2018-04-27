

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
import AliPlayer from '../components/AliLiveSDK/AliPlayer';
import HeaderBar from '../components/HeaderBar';
import {PostPullStreamList} from '../network/LiveApi'

import { NaviGoBack } from '../common/NavigatorUtils';

export default class extends Component {

    static defaultProps = {
        stream_id: '1'
    }

    constructor() {
        super();

        this.backAction = this.backAction.bind(this);
        this.rendLeftButton = this.rendLeftButton.bind(this);
        this.rendRightButton = this.rendRightButton.bind(this);
        this.state = {
            frontCamera: false,
            form: {id: 1, token: 1},
            pullurlLive:'',
            pullurl:{
                rtmp:{
                    stable:{
                        lld:{
                            title:'流畅',
                            url:'',
                        },
                        lsd:{
                            title:'标清',
                            url:'',
                        },
                        lhd:{
                            title:'高清',
                            url:'',
                        },
                        lud:{
                            title:'超高清',
                            url:'',
                        },
                        origin:{
                            title:'原画',
                            url:'',
                        }
                    }
                },
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
                <Text>刷新</Text>
            </TouchableOpacity>
        )
    }

    //初始化调用拉流接口
    componentDidMount() {
        this.PullStream(1);
    }

    PullStream(type){
        //读取
        storage.load({key: 'currentLogin'}).then(response => {
            //更新状态机
            this.setState({form: response});
            //调用拉流接口
            //console.warn('nihao',response.id);
            //console.warn('nihao',response.token);
            //console.warn('nihao',this.props.stream_id);
            PostPullStreamList({
                //传递用户ID、TOKEN、stream_id参数
                id: response.id,
                token: response.token,
                stream_id:this.props.stream_id
            }).then(response => {
                console.warn(JSON.stringify(response));
                switch (parseInt(response.status)) {
                    case 200:
                        //更新状态机
                        this.setState({pullurl: response.data});
                        //获取清晰度
                        if (type === 1) {
                            this.setState({pullurlLive: this.state.pullurl.rtmp.stable.lld.url});
                            console.warn('kan' ,this.state.pullurlLive);
                            return;
                        }
                        if (type === 2) {
                            this.setState({pullurlLive: this.state.pullurl.rtmp.stable.lsd.url});
                            console.warn('kan' ,this.state.pullurlLive);
                            return;
                        }
                        if (type === 3) {
                            this.setState({pullurlLive: this.state.pullurl.rtmp.stable.lhd.url});
                            console.warn('kan' ,this.state.pullurlLive);
                            return;
                        }
                        if (type === 4) {
                            this.setState({pullurlLive: this.state.pullurl.rtmp.stable.lud.url});
                            console.warn('kan' ,this.state.pullurlLive);
                            return;
                        }
                        if (type === 5) {
                            this.setState({pullurlLive: this.state.pullurl.rtmp.stable.origin.url});
                            console.warn('kan' ,this.state.pullurlLive);
                            return;
                        }
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
                <HeaderBar title='拉流测试' rendLeftButton={() => this.rendLeftButton()} rendRightButton={() => this.rendRightButton()} />
                <View style={{ backgroundColor: 'gray', flexDirection: 'row', flex: 1}}>
                    <AliPlayer
                        style={{width: width, height: width/2}}
                        //url='rtmp://live.hkstv.hk.lxdns.com/live/hks'
                        url={this.state.pullurlLive}
                    />
                    <TouchableOpacity activeOpacity={0.5} onPress={() => { this.GetStable(1) }}>
                        <View>
                            <Text>流畅</Text>
                        </View>
                    </TouchableOpacity>
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