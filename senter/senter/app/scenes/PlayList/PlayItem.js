import React, { Component, PropTypes } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native';

import EvilIcons from 'react-native-vector-icons/EvilIcons';

export default class PlayItem extends Component {

    static defaultProps = {
        playStatus: false,
        title: '无标题',
        date: '01-01',
        fileSize: 1048576,
        duration: 60,
        onPress: () => { },
        onLinkPress: () => { },
        allowDownload: false,
    };

    static propTypes = {
        playStatus: PropTypes.bool,
        title: PropTypes.string,
        date: PropTypes.string,
        fileSize: PropTypes.number,
        duration: PropTypes.number,
        onPress: PropTypes.func,
        onLinkPress: PropTypes.func,
        allowDownload: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.rendDownloadButton = this.rendDownloadButton.bind(this);

        this.state = {};
    }

    rendDownloadButton() {
        if (this.props.allowDownload)
            return (
                <TouchableWithoutFeedback>
                    <View style={{ paddingRight: 10 }}>
                        <EvilIcons name='arrow-down' size={30} color='#ccc' />
                    </View>
                </TouchableWithoutFeedback>
            )
    }

    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <View style={styles.container}>
                    <View>
                        <EvilIcons name='play' size={35} color='#ccc' />
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <View><Text style={{ fontSize: 14, color: this.props.playStatus ? 'orange' : '#000' }}>{this.props.title}</Text></View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <View style={{ marginRight: 8 }}><Text style={{ fontSize: 12, color: '#ccc' }}>{this.props.date}</Text></View>
                            <View style={{ marginRight: 8 }}><Text style={{ fontSize: 12, color: '#ccc' }}>时长{parseInt(this.props.duration / 60)}:{this.props.duration % 60}</Text></View>
                            <View><Text style={{ fontSize: 12, color: '#ccc' }}>{(this.props.fileSize / 1024 / 1024).toFixed(2)}MB</Text></View>
                        </View>
                    </View>
                    {/*/!*<TouchableWithoutFeedback onPress={this.props.onLinkPress}>*!/*/}
                        {/*/!*<View style={{ paddingRight: 10 }}>*!/*/}
                            {/*/!*<EvilIcons name='link' size={30} color='#ccc' />*!/*/}
                        {/*/!*</View>*!/*/}
                    {/*/!*</TouchableWithoutFeedback>*!/*/}
                    {/*{this.rendDownloadButton()}*/}
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        borderColor: '#e6e6e6',
        borderBottomWidth:1
    }
});