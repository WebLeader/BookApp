'use strict';
import React, {Component} from 'react';

import {
    View,
    Text,
    Dimensions,
    Image,
    StyleSheet,
    Alert,
    ScrollView,
    TouchableOpacity,
    InteractionManager,
    Platform
} from 'react-native';

var {height, width} = Dimensions.get('window');
import HeaderBar from '../../components/HeaderBar';//头部导航
import CommonCell from './CommonCell';//列表标题
import AllItem from './AllItem'//直播窗口
import PullStream from '../PullStream';//拉流界面

export default class Live extends Component {
    constructor(props) {
        super(props);
        this.rendLeftButton = this.rendLeftButton.bind(this);
        this.backAction = this.backAction.bind(this);//返回
        this.state = {
            title: '直播',
            leftTitle: '直播列表',
            liveitems:[]//创建一个数组
        };
    }

    //返回
    backAction() {
        const { navigator } = this.props;
        return navigator.popToTop();
    }

    rendLeftButton() {
        return (
            <TouchableOpacity onPress={() => { this.backAction() }} style={styles.leftViewStyle}>
                <Image source={require('../../assets/imgs/left.png')} style={styles.navImageStyle}/>
            </TouchableOpacity>
        )
    }

    componentDidMount() {
        storage.load({ key: 'liveitemList' }).then(response => {
            //更新状态机
            this.setState({ liveitems: response });
        }).catch(error => {
            console.warn(error);
        });
    }

    //点击直播传递url,流stream_id参数，跳转拉流页面
    onLiveItemPress(item){
        const { navigator } = this.props;
        {/*交互管理器*/}
        InteractionManager.runAfterInteractions(() => {
            navigator.push({
                component: PullStream,
                name: '拉流',
                stream_id:item.stream_id,
            })

        });
    }


    render() {
        return (
            <View style={styles.container}>
                <HeaderBar title={this.state.title} rendLeftButton={this.rendLeftButton}/>
                <View style={styles.liveItem}>
                    {/*直播分类*/}
                    <CommonCell
                        leftTitle={this.state.leftTitle}
                    />
                    {/*直播窗口*/}
                    <ScrollView
                        style={styles.scrollViewStyle}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    >
                        {
                            this.state.liveitems.map(item => {
                                return (
                                    <AllItem
                                        onPress={() => { this.onLiveItemPress(item) }}
                                        stream_id={item.stream_id}
                                        stream={item.stream}
                                    />
                                )
                            })
                        }
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
    },
    liveItem:{
        marginTop:8,
        backgroundColor:'white'
    },
    // 导航样式
    leftViewStyle: {
        position: 'absolute',
        left: 10,
        bottom: Platform.OS == 'ios' ? 15 : 13
    },
    navImageStyle: {
        width: Platform.OS == 'ios' ? 28 : 24,
        height: Platform.OS == 'ios' ? 28 : 24
    },
    //列表样式
    scrollViewStyle:{
        flexDirection:'row',
        backgroundColor:'white',
        padding:8
    }
})