import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    InteractionManager,
    Image,
    Platform
} from 'react-native';

import EvilIcons from 'react-native-vector-icons/EvilIcons';

import { NaviGoBack } from '../../common/NavigatorUtils';

import HeaderBar from '../../components/HeaderBar';
import PlayItem from './PlayItem';
import CWebView from '../WebView';

export default class PlayList extends Component {

    constructor(props) {
        super(props);

        this.rendLeftButton = this.rendLeftButton.bind(this);
        this.backAction = this.backAction.bind(this);
        this.onItemPress = this.onItemPress.bind(this);
        this.onLinkPress = this.onLinkPress.bind(this);

        this.state = {
            nowPlay: 0,
            title: '春来到',
        };
    }

    backAction() {
        const { navigator } = this.props;
        return NaviGoBack(navigator);
    }

    onItemPress(item) {
        this.setState({ nowPlay: item.id });
        this.props.playSound(item.url, item.title);
        this.backAction();
    }

    onLinkPress(item) {
        const { navigator } = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigator.push({
                component: CWebView,
                name: 'CWebView',
                url: `http://www.igotit.com/Wap/media/subtitle?id=${item.media_id}`,
                title: item.title
            });
        });
    }

    rendLeftButton() {
        return (
            <TouchableOpacity onPress={() => { this.backAction() }} style={styles.leftViewStyle}>
                <Image source={require('../../assets/imgs/left.png')} style={styles.navImageStyle}/>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderBar title={this.props.playList.title} rendLeftButton={this.rendLeftButton} />
                <View style={styles.renewal}>
                    <View><Text>已更新{this.props.playList.subList.length}条音频</Text></View>
                </View>
                <ScrollView style={styles.audios}>
                    {
                        this.props.playList.subList.map(item => {
                            return (
                                <PlayItem
                                    playStatus={this.state.nowPlay === item.id}
                                    onPress={() => { this.onItemPress(item) }}
                                    onLinkPress={() => { this.onLinkPress(item) }}
                                    title={item.title}
                                    allowDownload={item.allowDownload}
                                />
                            )
                        })
                    }
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#ffffff'
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
    renewal:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingLeft:10,
        borderColor: '#e6e6e6',
        borderBottomWidth:1
    },
    audios:{
        flex: 1,
        paddingTop: 8
    }
});