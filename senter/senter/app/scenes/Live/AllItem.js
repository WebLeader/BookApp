import React, { Component, PropTypes } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

export default class Card extends Component {

    static defaultProps = {
        stream: '直播标题',
    }

    static propTypes = {
        stream: PropTypes.string,
    }

    render() {
        return (
            <TouchableOpacity {...this.props}>
                <View style={styles.itemViewStyle}>
                    <Image style={styles.imageStyle} source={require('../../assets/imgs/timg.jpg')} />
                    {/*<Text style={styles.liveStyle}>直播</Text>*/}
                    <Text style={styles.liveName}>主播名字</Text>
                    <Text style={styles.liveTitle}>{this.props.stream}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    itemViewStyle:{
        margin:3
    },
    imageStyle:{
        width:140,
        height:120,
        borderRadius:3
    },
    liveStyle:{
        //绝对定位
        position:'absolute',
        left:5,
        top:10,
        backgroundColor:'red',
        borderRadius:10,
        color:'white',
        padding:2,
        fontSize:10
    },
    liveName:{
        //绝对定位
        position:'absolute',
        left:0,
        bottom:25,
        backgroundColor:'red',
        color:'white',
        padding:2,
        fontSize:12
    },
    liveTitle:{
        textAlign:'left',
        marginTop:8,
        fontSize:14
    },
})