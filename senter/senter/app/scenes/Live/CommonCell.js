'use strict';
import React, {Component} from 'react';

import {
    View,
    Text,
    Dimensions,
    Image,
    StyleSheet,
    Alert,
    TouchableOpacity
} from 'react-native';

var {height, width} = Dimensions.get('window');

export default class CommonCell extends Component {

    static defaultProps = {
        leftTitle: '直播列表标题',
    };

    constructor(props) {
        super(props);

    }

    componentDidMount() {

    }



    render() {
        return (
            <TouchableOpacity>
                <View style={styles.container}>
                    {/*左边*/}
                    <View style={styles.leftViewStyle}>
                        {/*<Image style={styles.imageStyle} source={require('../../assets/imgs/shop.png')} />*/}
                        <Text style={{fontSize:14}}>{this.props.leftTitle}</Text>
                    </View>
                    {/*右边*/}
                    <View style={styles.rightViewStyle}>
                        <Text style={{fontSize:14}}>{this.props.leftTitle}</Text>
                        {/*<Image style={styles.imageStyle} source={require('../../assets/imgs/shop.png')} />*/}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height:44,
        flexDirection:'row',
        backgroundColor:'white',
        alignItems:'center',
        //设置对其方式
        justifyContent:'space-between',
        //设置下划线
        borderBottomWidth:1,
        borderBottomColor:'#e6e6e6'
    },
    leftViewStyle:{
        flexDirection:'row',
        alignItems:'center',
        marginLeft:10
    },
    rightViewStyle:{
        flexDirection:'row',
        alignItems:'center',
        marginRight:10
    }
})