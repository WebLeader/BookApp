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
    InteractionManager,
    NativeModules,
    ScrollView
} from 'react-native';
var { height, width } = Dimensions.get('window');

import { Table, Row, Rows } from 'react-native-table-component';//table
import HeaderBar from '../../components/HeaderBar';//头部导航
import HomePage from '../AppMain';//首页

import { getBookPositionStateList , getPositionBookState, putaway } from '../../network/BookApi';

var t = 0;//已识别图书数
var c = 0;//识别到图书标签数
var bookArray = new Array();//存放所有图书标签
var eNum = 0;//错架图书标签数
var errBookArray = new Array();//存放错架图书标签
var nNum = 0;//新书图书标签数
var newBookArray = new Array();//存放新书图书标签
var existNum = 0;//在架图书标签数
var existBookArray = new Array();//存放在架图书标签
var p = 0;//识别到层位标签数
var positionNo= "";//层位编码
var positionArray = new Array();//存放层位标签

class BookSj extends Component {

    constructor(props) {
        super(props);
        this.rendLeftButton = this.rendLeftButton.bind(this);
        this.rendRightButton = this.rendRightButton.bind(this);
        this.backAction = this.backAction.bind(this);//返回
        this.HomePages = this.HomePages.bind(this);//返回首页
        this.scan = this.scan.bind(this);//扫描
        this.confirm = this.confirm.bind(this);//上架询问
        this.clearData = this.clearData.bind(this);//清空
        this.putaway = this.putaway.bind(this);//上架
        this.putAll = this.putAll.bind(this);//确定
        this.putNew = this.putNew.bind(this);//取消
        this.state = {
            title: '图书上架',
            tableHead: ['序号', '图书条码号', '图书名称', '层位信息', '状态'],
            // tableData: [
            //     ['1', '2', '3', '4', '4'],
            //     ['a', 'b', 'c', 'd', '4'],
            //     ['1', '2', '3', '456\n789', '4'],
            //     ['a', 'b', 'c', 'd', '4'],
            //     ['a', 'b', 'c', 'd', '4']
            // ]
            tableData: [],
            tt:0,//扫描图书总数
            positionName:'',//层位

        };
    }

    componentDidMount() {
    }

    componentWillUnmount() {

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

    //扫描获取UII
    scan(){
        // NativeModules.BookRfidModule.getUii((data) => {
        //     console.warn(data);
        //     var data = "397875502737710001"
        //     this.getBooks(data);
        // }, (err) => {
        //     alert(err)
        // })
        var data = "319787508647715000100010"
        this.getBooks(data);
    }

    getBooks(data){
        if(data=="00"){
            return;
        }
        var type = data.substr(0,1);//标签类型
        if(type==0){//图书标签
            var bookNo = data.substr(2,17);
            var r = bookArray.indexOf(bookNo);
            if(r==-1&&p==1){
                bookArray[c] = bookNo;
                c++;
                getBookPositionStateList({
                    bookNo : bookNo,
                    positionNo : positionNo
                }).then(response => {
                    console.warn(JSON.stringify(response));
                    if(response.meta.success === true){
                        var json = response.data
                        var html=[];
                        for(var i in json){
                            t ++;
                            if(json[i].position!=null){
                                if(json[i].positionNo!=positionNo){
                                    var common = "错架";
                                    errBookArray[eNum] = json[i].bookNo;
                                    eNum ++;
                                }else{
                                    existBookArray[existNum] = json[i].bookNo;
                                    existNum ++;
                                }
                                var status = '在馆'; //状态
                                var positionName = json[i].position.name;//层位信息
                            }else{
                                var status = '新书'; //状态
                                var positionName = '';//层位信息
                                newBookArray[nNum] = json[i].bookNo;
                                nNum ++;
                            }
                            var bookNo = json[i].bookNo; //图书条码号
                            var tt = t; //序号
                            var title = json[i].book.title; //图书名称
                            var htmlJson = [tt,bookNo,title,positionName,status]
                            html.push(htmlJson)
                        }
                        this.setState({tableData: html,tt:tt});
                    }else{
                        Alert.alert('提示', response.meta.message);
                    }

                }).catch(error => {
                    console.warn('发现错误' + JSON.stringify(error));
                });
            }
        }else if(type==3){//层位
            var r = positionArray.indexOf(data);
            if(r==-1&&p==0){
                positionArray[p] = data;
                p++;
                positionNo = Number(data.substr(1,10));
                getPositionBookState({
                    positionNo : positionNo
                }).then(response => {
                    console.warn(JSON.stringify(response));
                    if (response.meta.success === true) {
                        this.setState({positionName: response.data.p.name});
                    } else {
                        Alert.alert('提示', response.meta.message);
                    }
                }).catch(error => {
                    console.warn('发现错误' + JSON.stringify(error));
                });
            }
        }

    }
    //上架询问
    confirm(){
        if(bookArray.length==0){
            Alert.alert('上架', '请扫描上架图书');
            return;
        }
        if(positionNo==""){
            Alert.alert('上架', '请扫描上架层位');
            return;
        }
        if(errBookArray.length>0){//询问是否将错架图书上架
            Alert.alert('错架提示', '将错架图书重新上架到该层位上？', [
                { text: '确定', onPress: () => { this.putAll() }, style: 'default' },
                { text: '取消', onPress: () => { this.putNew() }, style: 'cancel' }
            ]);
        }else{
            this.putaway(newBookArray.join(","),existBookArray.join(","),'',positionNo);
        }
    }
    putAll(){
        //新书、错架上架
        this.putaway(newBookArray.join(","),existBookArray.join(","),errBookArray.join(","),positionNo);
    }

    putNew(){
        //新书上架
        this.putaway(newBookArray.join(","),existBookArray.join(","),'',positionNo);
    }
    //上架
    putaway(newBooks,existBooks,errBooks,positionNo){
        //图书上架接口
        putaway({
            newBooks : newBooks,
            existBooks : existBooks,
            errBooks : errBooks,
            positionNo : positionNo
        }).then(response => {
            console.warn(JSON.stringify(response));
            if(response.meta.success === true){
                if(newBooks!=''){
                    var nbooks = newBooks.split(',');
                    for(var i in nbooks){
                        // $('#'+nbooks[i]).addClass("exist")
                        // $('#'+nbooks[i]+' td').eq(0).html('成功');
                    }
                }
                if(existBooks!=''){
                    var exBooks = existBooks.split(',');
                    for(var i=0;i<exBooks.length;i++){
                        // $('#'+exBooks[i]).addClass("exist")
                        // $('#'+exBooks[i]+' td').eq(0).html('成功');
                    }
                }
                if(errBooks!=''){
                    var ebooks = errBooks.split(',')
                    for(var i=0;i<ebooks.length;i++){
                        // $('#'+ebooks[i]).addClass("exist")
                        // $('#'+ebooks[i]+' td').eq(0).html('成功');
                        // $('#'+ebooks[i]+' td').eq(5).html('');
                    }
                }

                c = 0;
                eNum = 0;
                existNum = 0;
                nNum = 0;
                bookArray.splice(0,bookArray.length);
                newBookArray.splice(0,newBookArray.length);
                existBookArray.splice(0,newBookArray.length);
                errBookArray.splice(0,newBookArray.errBookArray);
                if(response.data>0){
                    Alert.alert('提示', '图书上架成功！', [
                        { text: '确定', onPress: () => { }, style: 'default' }
                    ]);
                }
            }else{
                Alert.alert('上架', response.meta.message);
            }

        }).catch(error => {
            console.warn('发现错误' + JSON.stringify(error));
        });
    }
    //清空
    clearData(){
        p = 0;
        t = 0;
        c = 0;
        eNum = 0;
        nNum = 0;
        existNum = 0;
        bookArray.splice(0,bookArray.length);
        newBookArray.splice(0,newBookArray.length);
        existBookArray.splice(0,newBookArray.length);
        errBookArray.splice(0,newBookArray.errBookArray);
        positionArray.splice(0,positionArray.length);
        positionNo = '';
        this.setState({tableData: '',tt:c,positionName:''});
        //断开设备
        NativeModules.BookRfidModule.uninit();
    }

    render() {
        const state = this.state;
        return (
            <View style={styles.contariner}>
                <HeaderBar title={this.state.title} rendLeftButton={this.rendLeftButton} rendRightButton={this.rendRightButton}/>
                <ScrollView style={styles.container}>
                <View style={styles.BookSj}>
                    <View style={styles.BookText}><Text style={styles.Text}>图书读取</Text></View>
                    <View style={styles.BookText1}>
                        <Text style={styles.Text0}>扫 描 图 书 ：</Text>
                        <Text style={styles.Text1}>{this.state.tt}</Text>
                        <Text style={styles.Text2}>册</Text>
                    </View>
                    <View style={styles.BookText1}>
                        <Text style={styles.Text0}>层 位 ：</Text>
                        <Text style={styles.Text2}>{this.state.positionName}</Text>
                    </View>
                    {/*table*/}
                    <View style={styles.tableStyle}>
                        <Table borderStyle={{borderWidth: 1, borderColor: '#b3b3b3'}}>
                            <Row data={state.tableHead} style={styles.head} textStyle={styles.textHead}/>
                            {/*<Rows data={state.tableData} style={styles.textStyle} textStyle={styles.text}/>*/}
                            {
                                state.tableData.map((rowData, index) => (
                                    <Row
                                        key={index}
                                        data={rowData}
                                        style={styles.textStyle}
                                        textStyle={[styles.text,state.sty == 'errColor' ? styles.errColor : '',state.sty == 'borrow' ? styles.borrow : '']}
                                    />
                                ))
                            }
                        </Table>
                    </View>
                    <View style={styles.BookSjBtn}>
                        <Text style={styles.BookSjBtnStyle} activeOpacity={0.5} onPress={() => { this.scan() }}>扫描</Text>
                        <Text style={styles.BookSjBtnStyle} activeOpacity={0.5} onPress={() => { this.confirm() }}>上架</Text>
                        <Text style={styles.BookSjBtnStyle} activeOpacity={0.5} onPress={() => { this.clearData() }}>清空</Text>
                    </View>
                </View>
                </ScrollView>
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
    //内容
    BookSj:{
        padding:10
    },
    BookText:{
        backgroundColor:'#012c4c',
        borderRadius:8,
        alignItems:'center'
    },
    Text:{
        fontSize:16,
        color:'#df9329',
        fontWeight:'bold',
        margin:8
    },
    BookText1:{
        backgroundColor:'#012c4c',
        borderRadius:8,
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'center',
        marginTop:5,
        height:height/11
    },
    Text0:{
        color:'#ffffff',
        fontSize:20,
    },
    Text1:{
        fontSize:30,
        fontWeight:'bold',
        color:'#df9329',
        marginLeft:30,
        marginRight:15
    },
    Text2:{
        color:'#df9329',
        fontSize:16,
    },
    BookSjBtn:{
        alignItems:'center',
        justifyContent:'center',
        marginTop:10,
        marginBottom:30,
        flexDirection:'row',
    },
    BookSjBtnStyle:{
        borderRadius:8,
        color:'#ffffff',
        backgroundColor:'#012c4c',
        alignItems:'center',
        justifyContent:'center',
        fontSize:20,
        paddingTop:5,
        paddingBottom:5,
        margin:5,
        width:(width-80)/3,
        textAlign:'center'

    },
    //table
    tableStyle:{
        marginTop:10
    },
    head: {
        height: 50,
        backgroundColor: '#012c4c',
    },
    textHead:{
        color:'#ffffff',
        fontWeight:'bold',
        textAlign:'center',
        fontSize:12,
    },
    textStyle:{
        backgroundColor:'#ffffff',
        height:50
    },
    text: {
        margin: 6,
        fontSize:12,
        textAlign:'center'
    }
});
export default BookSj;