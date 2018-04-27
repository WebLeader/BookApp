'use strict';
import React, {Component} from 'react';
import {
    Dimensions,
    View,
    Text,
    Image,
    StyleSheet,
    Alert,
    Platform,
    TouchableOpacity,
    InteractionManager
} from 'react-native';
var { height, width } = Dimensions.get('window');

import HeaderBar from '../../components/HeaderBar';//头部导航
import HomePage from '../AppMain';//首页

import { statistics } from '../../network/BookApi';

class BookTj extends Component {

    constructor(props) {
        super(props);
        this.rendLeftButton = this.rendLeftButton.bind(this);
        this.rendRightButton = this.rendRightButton.bind(this);
        this.backAction = this.backAction.bind(this);//返回
        this.HomePages = this.HomePages.bind(this);//返回首页
        this.statistics = this.statistics.bind(this);
        this.state = {
            title: '数据统计',
            statisticsData:{
                total: '',
                borrowTotal: '',
                existTotal: '',
                errorIsPutTotal: ''
            }
        };
    }

    componentDidMount() {
         this.statistics()
    }

    componentWillUnmount() {
    }

    statistics(){
        statistics({
        }).then(response => {
            console.warn(JSON.stringify(response));
            //var jsonData = eval('(' + response.data + ')');
            if(response.meta.success == true){
                this.setState({statisticsData: response.data});
            }
        }).catch(error => {
            console.warn('发现错误' + JSON.stringify(error));
        });
    }

    //返回
    backAction() {
        const { navigator } = this.props;
        return navigator.popToTop();
    }

    //返回首页
    HomePages() {
        const { navigator } = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigator.push({
                component: HomePage,
                name: 'HomePage',
            });
        });
    }
    rendLeftButton() {
        return (
            <TouchableOpacity onPress={() => { this.backAction() }} style={styles.leftViewStyle}>
                <Image source={require('../../assets/imgs/left.png')} style={styles.navImageLeftStyle}/>
            </TouchableOpacity>
        )
    }

    rendRightButton() {
        return (
            <TouchableOpacity onPress={() => { this.HomePages() }} style={styles.rendRightButton}>
                <Image source={require('../../assets/imgs/zhuye.png')} style={styles.navImageRightStyle}/>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.contariner}>
                <HeaderBar title={this.state.title} rendLeftButton={this.rendLeftButton} rendRightButton={this.rendRightButton}/>
                <View style={styles.ViewStyle}>
                    <View style={[styles.TjStyle,styles.TjStyleBg0]}>
                        <Image style={styles.icon} source={require('../../assets/imgs/guancang.png')} />
                        <Text style={styles.TextStyle0}>馆藏图书</Text>
                        <Text style={styles.TextStyle1}>{this.state.statisticsData.total}</Text>
                        <Text style={styles.TextStyle2}>册</Text>
                    </View>
                    <View style={[styles.TjStyle,styles.TjStyleBg1]}>
                        <Image style={styles.icon} source={require('../../assets/imgs/waijie.png')} />
                        <Text style={styles.TextStyle0}>外借图书</Text>
                        <Text style={styles.TextStyle1}>{this.state.statisticsData.borrowTotal}</Text>
                        <Text style={styles.TextStyle2}>册</Text>
                    </View>
                    <View style={[styles.TjStyle,styles.TjStyleBg2]}>
                        <Image style={styles.icon} source={require('../../assets/imgs/zaiguan.png')} />
                        <Text style={styles.TextStyle0}>在馆图书</Text>
                        <Text style={styles.TextStyle1}>{this.state.statisticsData.existTotal}</Text>
                        <Text style={styles.TextStyle2}>册</Text>
                    </View>
                    <View style={[styles.TjStyle,styles.TjStyleBg3]}>
                        <Image style={styles.icon} source={require('../../assets/imgs/cuojia.png')} />
                        <Text style={styles.TextStyle0}>错架图书</Text>
                        <Text style={styles.TextStyle1}>{this.state.statisticsData.errorIsPutTotal}</Text>
                        <Text style={styles.TextStyle2}>册</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    contariner: {
        flex: 1,
        backgroundColor: '#E6E6E6',
    },
    // 导航样式
    leftViewStyle: {
        position: 'absolute',
        left: 10,
        bottom: Platform.OS == 'ios' ? 15 : 3
    },
    navImageLeftStyle: {
        width: Platform.OS == 'ios' ? 28 : 38,
        height: Platform.OS == 'ios' ? 28 : 38,
    },
    navImageRightStyle: {
        width: Platform.OS == 'ios' ? 28 : 30,
        height: Platform.OS == 'ios' ? 28 : 30,
    },
    rendRightButton:{
        position: 'absolute',
        right:10,
        bottom: Platform.OS == 'ios' ? 15 : 8
    },
    //统计
    ViewStyle:{
        marginTop:10,
    },
    TjStyle:{
        margin:5,
        height:(height - 160)/4,
        borderRadius:6,
        justifyContent:'center',
    },
    TjStyleBg0:{
        backgroundColor:'#96c'
    },
    TjStyleBg1:{
        backgroundColor:'#509a35'
    },
    TjStyleBg2:{
        backgroundColor:'#3498fb'
    },
    TjStyleBg3:{
        backgroundColor:'#f06230'
    },
    icon:{
        left:50,
        width:(height - 160)/4 - 40,
        height:(height - 160)/4 - 40
    },
    TextStyle0:{
        fontSize:16,
        fontWeight:'bold',
        color:'#ffffff',
        left:45
    },
    TextStyle1:{
        position:'absolute',
        top:(height - 160)/16 - 10,
        right:50,
        fontSize:30,
        fontWeight:'bold',
        color:'#ffffff'
    },
    TextStyle2:{
        position:'absolute',
        right:50,
        bottom:(height - 160)/16 -10,
        fontSize:20,
        color:'#ffffff'
    }
});
export default BookTj;