import React, { Component, PropTypes } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Overlay from 'react-native-overlay';
import { BlurView } from 'react-native-blur';

export default class PlayBar extends Component {

    static defaultProps = {
        title: '无文件',
        isVisible: false,
        currentDuration: 0,
        totalDuration: 0,
        switchPlay: () => { },
    };

    static propTypes = {
        title: PropTypes.string,
        isVisible: PropTypes.bool,
        currentDuration: PropTypes.number,
        totalDuration: PropTypes.number,
        switchPlay: PropTypes.func,
    }

    constructor(props) {
        super(props);

        this.rendPlayIcon = this.rendPlayIcon.bind(this);
        this.state = {};
    }

    rendPlayIcon() {
        if (this.props.isPlay) {
            return (
                <View>
                    <FontAwesome name='pause-circle-o' color='orange' size={36} />
                </View>
            );
        }
        return (
            <View>
                <FontAwesome name='play-circle-o' color='orange' size={36} />
            </View>
        )
    }

    render() {
        const { currentDuration, totalDuration } = this.props;
        if (this.props.isVisible) {
            return (
                <BlurView style={styles.bottom} blurType='light'>
                    <View style={styles.content}>
                        <View style={{ marginHorizontal: 16 }}>
                            <TouchableOpacity style={{ flex: 1 }} onPress={this.props.switchPlay}>
                                {this.rendPlayIcon()}
                            </TouchableOpacity>
                        </View>
                        <View>
                            <View><Text>正在播放：<Text>{this.props.title}</Text></Text></View>
                            <View>
                                <Text style={{ fontSize: 12 }}>
                                    {parseInt(currentDuration / 60)}:{parseInt(currentDuration % 60)}/{parseInt(totalDuration / 60)}:{parseInt(totalDuration % 60)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </BlurView>
            );
        } else {
            return (
                <View></View>
            );
        }

    }
}

const styles = StyleSheet.create({
    top: {
        paddingTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottom: {
        position: 'absolute',
        bottom: 49,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
    },
    content: {
        flex: 9,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center'
    },
    dismissButton: {
        flex: 1,
        backgroundColor: '#eeeeee',
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 5,
        justifyContent: 'center',
        height: 30,
        marginRight: 15,
        alignItems: 'center',
    },
    dismissButtonText: {
        color: '#888888',
        fontSize: 12,
    },
});