'use strict';
import React, {Component} from 'react';
import {
    Dimensions,
    View,
    Text,
    Image,
    StyleSheet,
    Alert,
    TouchableOpacity,
    InteractionManager
} from 'react-native';
var { height, width } = Dimensions.get('window');

import Icon from 'react-native-vector-icons/FontAwesome';
import BookPd from '../BookPd';//图书盘点
import BookSj from '../BookSj';//图书上架
import BookTj from '../BookTj';//数据统计
import BookXj from '../BookXj';//图书下架

class AppMain extends Component {

    constructor(props) {
        super(props);
        this.centerItemAction = this.centerItemAction.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    centerItemAction(position) {
        const { navigator } = this.props;
        switch (position) {
            //图书盘点
            case 1:
                InteractionManager.runAfterInteractions(() => {
                    navigator.push({
                        component: BookPd,
                        name: 'BookPd',
                    });
                });
                break;

            //图书上架
            case 2:
                InteractionManager.runAfterInteractions(() => {
                    navigator.push({
                        component: BookSj,
                        name: 'BookSj',
                    });
                });

                break;
            //数据统计
            case 3:
                InteractionManager.runAfterInteractions(() => {
                    navigator.push({
                        component: BookTj,
                        name: 'BookTj',
                    });
                });
                break;
            //图书下架
            case 4:
                InteractionManager.runAfterInteractions(() => {
                    navigator.push({
                        component: BookXj,
                        name: 'BookXj',
                    });
                });
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <View style={styles.contariner}>
                <View style={styles.ViewStyle}>
                    <Text style={styles.TextStyle}>一 手持盘点系统 一</Text>
                </View>
                <View style={styles.styleBtn}>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => { this.centerItemAction(1) }}>
                        <View style={[styles.ViewStyleBtn0,styles.ViewStyleBtn]}>
                            <Image style={styles.icon} source={require('../../assets/imgs/pandian.png')} />
                            <Text style={styles.BtnStyle}>图书盘点</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => { this.centerItemAction(2) }}>
                    <View style={[styles.ViewStyleBtn1,styles.ViewStyleBtn]}>
                        <Image style={styles.icon} source={require('../../assets/imgs/shangjia.png')} />
                        <Text style={styles.BtnStyle}>图书上架</Text>
                    </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => { this.centerItemAction(3) }}>
                    <View style={[styles.ViewStyleBtn2,styles.ViewStyleBtn]}>
                        <Image style={styles.icon} source={require('../../assets/imgs/tongji.png')} />
                        <Text style={styles.BtnStyle}>数据统计</Text>
                    </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => { this.centerItemAction(4) }}>
                    <View style={[styles.ViewStyleBtn3,styles.ViewStyleBtn]}>
                        <Image style={styles.icon} source={require('../../assets/imgs/xiajia.png')} />
                        <Text style={styles.BtnStyle}>图书下架</Text>
                    </View>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    contariner: {
        flex: 1,
        backgroundColor: '#012c4c',
    },
    ViewStyle:{
        //水平和垂直居中
        justifyContent:'center',
        alignItems:'center',
        height:height/6,
    },
    TextStyle:{
        fontSize:28,
        color:'#ffffff',
    },
    styleBtn:{
        alignItems:'center',
    },
    icon:{
        width:height/7 - 30,
        height:height/7 - 30,
        position: 'absolute',
        left:(width - 100)/4 -10
    },
    BtnStyle:{
        fontWeight:'bold',
        fontSize:22,
        color:'#ffffff',
        position: 'absolute',
        right:(width - 100)/4 -20
    },
    ViewStyleBtn:{
        width:width - 100,
        height:height/7,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:8,
        marginBottom:15
    },
    ViewStyleBtn0:{
        backgroundColor:'#6698fc'
    },
    ViewStyleBtn1:{
        backgroundColor:'#509a35'
    },
    ViewStyleBtn2:{
        backgroundColor:'#f1642c'
    },
    ViewStyleBtn3:{
        backgroundColor:'#42ccfc'
    }
});
export default AppMain;