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
    ListView,
    NativeModules,
    ScrollView
} from 'react-native';
var { height, width } = Dimensions.get('window');

import { Table, Row, Rows } from 'react-native-table-component';//table
import HeaderBar from '../../components/HeaderBar';//头部导航
import HomePage from '../AppMain';//首页
import { getBookPositionState,getPositionBookState ,check} from '../../network/BookApi';

var total = 0;
var borrow = 0;
var news = 0;

var t = 0;//已识别图书数
var c = 0;//识别到图书标签数
var bookArray = new Array();//存放标签

var err = 0;
var errBookArray = new Array();//存放错架/未排架标签

var exist = 0;//在架数量
var ex = 0;//应在架数量
var existBooksArray = new Array();//应在架图书标签

var br = 0;//识别到架位标签数
var bookrackNo= "";//架位编码
var bookrackArray = new Array();//存放层位标签

var p = 1;//识别到层位标签数
var positionNo= "";//层位编码
var positionArray = new Array();//存放层位标签

class BookPd extends Component {

    constructor(props) {
        super(props);
        this.rendLeftButton = this.rendLeftButton.bind(this);
        this.rendRightButton = this.rendRightButton.bind(this);
        this.backAction = this.backAction.bind(this);//返回
        this.HomePages = this.HomePages.bind(this);//返回首页
        this.scan = this.scan.bind(this);//扫描
        this.clearErr = this.clearErr.bind(this);//整架
        this.save = this.save.bind(this);//保存
        this.clearData = this.clearData.bind(this);//清空
        this.state = {
            title: '图书盘点',
            tableHead: ['序号', '图书条码号', '图书名称', '层位信息', '状态'],
            tableData: [],
            color:0,
            errNum:0,//错架图书
            tt:0,//序号
            exist:0,//在架数量
            borrow:0,//外借图书
            position:'',//架位信息
            sty:'',//外借样式
            total:0,//应有图书
            bookNo:"97875086477150001"
        };
        //table
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

    //扫描
    scan(){
        NativeModules.BookRfidModule.getUii((name) => {
            Alert.alert('提示', name);
            console.warn(name);
            // var Array=nameSubstring.split(",");
            // console.warn(Array);
            var nameData = JSON.stringify(name);
            Alert.alert('nameData', nameData);
            // for (var i=0;i<nameData.length;i++){
            //     var data = nameData[i]
            //     Alert.alert('data', data);
            // }
        }, (err) => {
            alert(err)
        })
    }
    getBooks(data){
        if(data=="00"){
            return;
        }
        var type = data.substr(0,1);//标签类型
        if(type==0&&p==1){//图书标签
            var bookNo = data.substr(2,17);
            var r = bookArray.indexOf(bookNo);
            if(r==-1){
                bookArray[c] = bookNo;
                c++;
                if(existBooksArray.indexOf(bookNo)!=-1){
                    // $('#'+bookNo).addClass('exist');*
                    // $('#'+bookNo+' td').eq(0).html('在架');*
                    exist ++;
                    this.setState({exist: exist});
                }else{
                    //图书馆藏位置
                    getBookPositionState({
                        books: bookNo,
                        positionNo: positionNo
                    }).then(response => {
                        console.warn(JSON.stringify(response));
                        if(response.meta.success === true){
                            t ++;
                            var html = [];
                            var json = response.data
                            if(json.positionNo != null){//错架
                                var positionName = json.position.name; //层位信息
                            }else{//未排架
                                var common = '条码号【'+bookNo+'】暂未上架';
                            }
                            errBookArray[err] = json.bookNo;
                            err ++;
                            var sty = "errColor";
                            var bookNo = json.bookNo; //图书条码号
                            var status = '错架'; //状态
                            var tt = t; //序号
                            var title = json.book.title; //图书名称
                            var htmlJson = [tt,bookNo,title,positionName,status]
                            html.push(htmlJson)
                            this.setState({tableData: html,tt:tt,errNum:err,sty:sty});
                        }
                    });
                }
            }
        }
        else if(type==3 && br==0){//层位
            var r = positionArray.indexOf(data);
            if(r==-1&&p==0){
                positionArray[p] = data;
                p++;
                positionNo = data.substr(1,10);
                //获取指定层位图书状态
                getPositionBookState({
                    positionNo:positionNo
                }).then(response => {
                    console.warn(JSON.stringify(response));
                    if(response.meta.success === true){
                        var po = response.data.p;
                        if(po!=''){
                            this.setState({position: po.name});
                        }
                        var html = [];
                        var json = response.data.br;
                        for(var i in json){
                            var sty = "";
                            var status ="";
                            if(json[i].state=='W'){
                                sty = "borrow";
                                status = "外借";
                                borrow ++;
                            }else{
                                existBooksArray[ex] = json[i].bookNo;
                                ex ++;
                            }
                            t ++;
                            var positionName = '';
                            if(json[i].position!=null){
                                positionName = json[i].position.name;
                            }
                            var tt = t; //序号
                            var bookNo = json[i].bookNo
                            var title = json.book.title; //图书名称
                            var htmlJson = [tt,bookNo,title,positionName,status]
                            html.push(htmlJson)
                        }
                        this.setState({tableData: html,tt:tt,total:t,sty:sty});
                    }else{
                        Alert.alert('提示', response.meta.message);

                    }
                });


            }
        }
    }

    //整架
    clearErr(){
        var tableDataArray = []
        for(var i=0;i<errBookArray.length;i++){
            var bookNo = errBookArray[i];
            var tableData = this.state.tableData;
            for(var j=0;j<tableData.length;j++){
                var dataArry = tableData[j]
                console.warn(dataArry);
                if(dataArry.indexOf(bookNo) == -1){
                    var arr = tableData[j]
                    console.warn(arr);
                }
                tableDataArray.push(arr)
                console.warn(tableDataArray);
            }


            bookArray.splice(bookArray.indexOf(bookNo),1);
            t --;
            //$("#"+bookNo).remove(); //对应的行，删除*
        }
        err = 0;
        errBookArray.splice(0,errBookArray.length);//错架记录
        this.setState({errNum: 0 ,tableData:tableDataArray});
    }
    //保存
    save(){
        if(bookArray.length==0){
            Alert.alert('提示', "没有在架图书！");
            return;
        }
        check({
            books : bookArray.join(','),
            positionNo : positionNo
        }).then(response => {
            console.warn(JSON.stringify(response));
            console.warn(bookArray);
            if(response.meta.success === true){
                Alert.alert('提示', "保存成功！");
                for(var i in bookArray){
                    // $('#'+bookArray[i]).addClass('exist');*
                    // $('#'+bookArray[i]+' td').eq(0).html('在架');*
                    console.warn(errBookArray.indexOf(bookNo))
                    if(errBookArray.indexOf(bookNo) !=-1){
                        exist ++;
                        err --;
                        this.setState({exist:exist,errNum:err});
                    }
                }
            }else{
                Alert.alert('提示', response.meta.message);
            }
        });

    }
    //清空
    clearData(){
        c = 0;//识别到图书标签数
        t = 0;//图书记录
        bookArray.splice(0,bookArray.length);//存放标签
        exist = 0;
        existBooksArray.splice(0,existBooksArray.length);//原有图书
        err = 0;
        errBookArray.splice(0,errBookArray.length);//错架记录
        borrow = 0;
        br = 0;//识别到架位标签数
        bookrackNo= "";//架位编码
        bookrackArray.splice(0,bookrackArray.length);//存放层位标签
        p = 0;//识别到层位标签数
        positionNo= "";//层位编码
        positionArray.splice(0,positionArray.length);//存放层位标签
        this.setState({tableData: '',exist:0,errNum:0,total:0,borrow:0,position:''});
        //断开设备
        NativeModules.BookRfidModule.uninit();
    }

    render() {
        const state = this.state;
        return (
            <View style={styles.contariner}>
                <HeaderBar title={this.state.title} rendLeftButton={this.rendLeftButton} rendRightButton={this.rendRightButton}/>
                <ScrollView style={styles.container}>
                <View style={styles.BookPd}>
                    <View style={styles.BookText}>
                        <Text style={styles.PdBtn} activeOpacity={0.5} onPress={() => { this.scan() }}>扫 描</Text>
                        <Text style={styles.PdBtn} activeOpacity={0.5} onPress={() => { this.save() }}>保 存</Text>
                        <Text style={styles.PdBtn} activeOpacity={0.5} onPress={() => { this.clearErr() }}>整 架</Text>
                        <Text style={styles.PdBtn} activeOpacity={0.5} onPress={() => { this.clearData() }}>清 空</Text>
                    </View>
                    <View style={styles.PdTextStyle}>
                        <View style={styles.PdText}>
                            <Text style={styles.PdTextC}>架位信息</Text>
                            <Text style={styles.PdTextC}>应有图书</Text>
                            <Text style={styles.PdTextC}>在架图书</Text>
                            <Text style={styles.PdTextC}>外借图书</Text>
                            <Text style={styles.PdTextC}>错架图书</Text>
                        </View>
                        <View style={styles.PdTextNember}>
                            <View style={styles.PdTextB}>
                                {/*<Text style={styles.PdText0}>人文5555</Text>*/}
                                <Text style={styles.PdText3}>{this.state.position}</Text>
                            </View>
                            <View style={styles.PdTextB}>
                                <Text style={styles.PdText2}>{this.state.total}</Text>
                                <Text style={styles.PdText1}>册</Text>
                            </View>
                            <View style={styles.PdTextB}>
                                <Text style={styles.PdText2}>{this.state.exist}</Text>
                                <Text style={styles.PdText1}>册</Text>
                            </View>
                            <View style={styles.PdTextB}>
                                <Text style={styles.PdText2}>{this.state.borrow}</Text>
                                <Text style={styles.PdText1}>册</Text>
                            </View>
                            <View>
                                <Text style={styles.PdText2}>{this.state.errNum}</Text>
                                <Text style={styles.PdText1}>册</Text>
                            </View>
                        </View>
                    </View>
                    {/*table*/}
                    <View style={styles.tableStyle}>
                        <Table borderStyle={{borderWidth: 1, borderColor: '#b3b3b3'}}>
                            <Row data={state.tableHead} style={styles.head} textStyle={styles.textHead}/>
                            {/*<Rows data={state.tableData} style={styles.textStyle} textStyle={[styles.text,state.sty == 'errColor' ? styles.errColor : '',state.sty == 'borrow' ? styles.borrow : '']}/>*/}
                            {
                                state.tableData.map((rowData, index) => (
                                    <Row
                                        key={index}
                                        data={rowData}
                                        style={styles.textStyle}
                                        textStyle={[styles.text,state.sty == "errColor" ? styles.errColor : '',state.sty == 'borrow' ? styles.borrow : '']}
                                    />
                                ))
                            }
                        </Table>
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
        overflow:'scroll'
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
    BookPd:{
        padding:10
    },
    BookText:{
        backgroundColor:'#b3b3b3',
        borderRadius:8,
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'center',
    },
    PdBtn:{
        backgroundColor:'#012c4c',
        fontSize:18,
        color:'#ffffff',
        fontWeight:'bold',
        borderRadius:8,
        paddingTop:5,
        paddingBottom:5,
        margin:5,
        width:(width - 80)/4,
        textAlign:'center'
    },
    PdBtnActive:{
        backgroundColor:'#012c4c',
        fontSize:18,
        color:'#df9329',
        fontWeight:'bold',
        borderRadius:8,
    },
    PdTextStyle:{
        marginTop:10,
        backgroundColor:'#012c4c',
        borderRadius:8,
    },
    PdText:{
        flexDirection:'row',
        justifyContent:'space-around',
        paddingTop:5
    },
    PdTextC:{
        color:'#ffffff',
        fontSize:10,
        width:(width - 80)/5,
        textAlign:'center'
    },
    PdTextNember:{
        flexDirection:'row',
        justifyContent:'space-around',
        paddingBottom:10,
        marginTop:5,
    },
    PdTextB:{
        borderRightWidth: 1,
        borderRightColor: '#ffffff',
        width:(width - 100)/5
    },
    PdText0:{
        marginTop:10,
        color:'#df9329',
        fontSize:12,
    },
    PdText1:{
        marginTop:10,
        color:'#df9329',
        fontSize:12,
    },
    PdText2:{
        marginTop:10,
        color:'#df9329',
        fontSize:30,
        fontWeight:'bold',

    },
    PdText3:{
        marginTop:10,
        color:'#df9329',
        fontSize:12,
    },
    //table
    tableStyle:{
        marginTop:5
    },
    head: {
        height: 50,
        backgroundColor: '#012c4c',
    },
    textHead:{
        color:'#ffffff',
        fontWeight:'bold',
        textAlign:'center',
        fontSize:12
    },
    textStyle:{
        backgroundColor:'#ffffff',
        height:50
    },
    text: {
        margin: 6,
        fontSize:12,
        textAlign:'center'
    },
    greenText:{
        margin: 6,
        fontSize:12,
        color:'green'
    },
    redText:{
        margin: 6,
        fontSize:12,
        color:'red'
    },
    borrow:{
        color:'#093'
    },
    errColor:{
        color:'#FF0000'
    }
});
export default BookPd;