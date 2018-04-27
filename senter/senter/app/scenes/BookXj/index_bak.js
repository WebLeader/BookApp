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

import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';//table
import HeaderBar from '../../components/HeaderBar';//头部导航
import HomePage from '../AppMain';//首页

import { getBookPosition , soldOut } from '../../network/BookApi';

var t = 0;//已识别图书数
var c = 0;//识别到图书标签数
var bookArray = new Array();//存放标签

class BookXj extends Component {

    constructor(props) {
        super(props);

        const element = (data, index) => (
            <TouchableOpacity onPress={() => this._alertIndex(index)}>
                <View style={styles.btn}>
                    <Text style={styles.btnText}>全选</Text>
                </View>
            </TouchableOpacity>
        );
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.rendLeftButton = this.rendLeftButton.bind(this);
        this.rendRightButton = this.rendRightButton.bind(this);
        this.backAction = this.backAction.bind(this);//返回
        this.HomePages = this.HomePages.bind(this);//返回首页
        this.scan = this.scan.bind(this);//扫描
        this.clearData = this.clearData.bind(this);//清空
        this.soldOut = this.soldOut.bind(this);//下架
        this.state = {
            title: '图书下架',
            tableHead: ['状态','序号', '图书条码号', '图书名称', '层位信息',element()],
            // tableData: [],
            tableData: [
                    ['1', '2', '3', '4', '4'],
                    ['a', 'b', 'c', 'd', '4'],
                    ['1', '2', '3', '456\n789', '4'],
                    ['a', 'b', 'c', 'd', '4'],
                    ['a', 'b', 'c', 'd', '4'],['1', '2', '3', '4', '4'],
                ['1', '2', '3', '4', '4'],
                ['1', '2', '3', '4', '4'],
                ['1', '2', '3', '4', '4'],
                ['1', '2', '3', '4', '4'],
                ['1', '2', '3', '4', '4'],
                ['1', '2', '3', '4', '4'],
                ['1', '2', '3', '4', '4'],
                ['1', '2', '3', '4', '4'],
                ],
            tt:0
        };
    }
    _alertIndex(index) {
        Alert.alert(`This is row ${index + 1}`);
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
        //     this.getBooks(data);
        // }, (err) => {
        //     alert(err)
        // })
        var data = "019787508647715000100010"
        this.getBooks(data);
    }

    getBooks(data){
        if(data=="00"){
            return;
        }
        var type = data.substr(0,1);//标签类型
        if(type==0){//图书标签
            var bookNo = data.substr(2,17);
            console.warn(bookNo);
            var r = bookArray.indexOf(bookNo);
            if(r==-1){
                bookArray[c] = bookNo;
                c ++;
                getBookPosition({
                    bookNo : bookNo,
                }).then(response => {
                    console.warn(JSON.stringify(response));
                    if(response.meta.success === true){
                        //Alert.alert('提示', response.meta.message);
                        var json = response.data
                        t ++;
                        var html=[];
                        if(json.position!=null){
                            var status = '在馆'; //状态
                            var positionName = json.position.name;//层位信息
                        }else{
                            var status = '新书'; //状态
                            var positionName = '';//层位信息
                        }
                        var bookNo = json.bookNo; //图书条码号
                        var tt = t; //序号
                        var title = json.book.title; //图书名称
                        var input = 0
                        var htmlJson = [status,tt,bookNo,title,positionName,input]
                        html.push(htmlJson)
                        this.setState({tableData: html,tt:tt});
                    }else{
                        Alert.alert('提示', response.meta.message);
                    }
                }).catch(error => {
                    console.warn('发现错误' + JSON.stringify(error));
                });
            }
        }

    }
    //下架
    soldOut(){
        //图书下架接口
        var i = 0;
        var books = new Array();
        // $.each($('input:checkbox:checked'),function(){
        //     var val = $(this).val();
        //     if(val!=''){
        //         books[i] = val;
        //         i ++;
        //     }
        // });
        if(books.length==0){
            Alert.alert('提示', "请勾选要下架的图书！");
            return;
        }
        soldOut({
            books : books.join(',')
        }).then(response => {
            console.warn(JSON.stringify(response));
            if(response.meta.success){
                for(var i in books){
                    $('#'+books[i]).remove();
                    t--;
                    this.setState({tt:t});
                }
                Alert.alert('提示', "下架成功！");
            }else{
                Alert.alert('提示', response.meta.message);
            }

        }).catch(error => {
            console.warn('发现错误' + JSON.stringify(error));
        });
    }
    //清空
    clearData(){
        t = 0;
        c = 0;
        bookArray.splice(0,bookArray.length);
        this.setState({tableData: [],tt:0});
        //断开设备
        NativeModules.BookRfidModule.uninit();
    }

    render() {
        const state = this.state;

        const element = (data, index) => (
            <TouchableOpacity onPress={() => this._alertIndex(index)}>
                <View style={styles.btn}>
                    <Text style={styles.btnText}>button</Text>
                </View>
            </TouchableOpacity>
        );

        return (
            <View style={styles.contariner}>
                <HeaderBar title={this.state.title} rendLeftButton={this.rendLeftButton} rendRightButton={this.rendRightButton}/>
                <ScrollView style={styles.container}>
                <View style={styles.BookXj}>
                    <View style={styles.BookText}><Text style={styles.Text}>图书读取</Text></View>
                    <View style={styles.BookText1}>
                        <Text style={styles.Text0}>扫 描 图 书 ：</Text>
                        <Text style={styles.Text1}>{this.state.tt}</Text>
                        <Text style={styles.Text2}>册</Text>
                    </View>
                    {/*table*/}
                    <View style={styles.tableStyle}>
                        <Table borderStyle={{borderColor: 'transparent'}}>
                            <Row data={state.tableHead} style={styles.head} textStyle={styles.textHead}/>
                            {
                                state.tableData.map((rowData, index) => (
                                    <TableWrapper key={index} style={styles.row}>
                                        {
                                            rowData.map((cellData, cellIndex) => (
                                                <Cell key={cellIndex} data={cellIndex === 5 ? element(cellData, index) : cellData} textStyle={styles.text}/>
                                            ))
                                        }
                                    </TableWrapper>
                                ))
                            }
                        </Table>

                    </View>
                    <View style={styles.BookXjBtn}>
                        <Text style={styles.BookXjBtnStyle} activeOpacity={0.5} onPress={() => { this.scan() }}>扫描</Text>
                        <Text style={styles.BookXjBtnStyle} activeOpacity={0.5} onPress={() => { this.soldOut() }}>下架</Text>
                        <Text style={styles.BookXjBtnStyle} activeOpacity={0.5} onPress={() => { this.clearData() }}>清空</Text>
                    </View>
                </View>
                </ScrollView>
            </View>
        );
    }

    allSelect = (isChecked) => { // 全选
        this.setState({
            isAllSelect: !isChecked
        });
        if (isChecked) { // 如果已经勾选了,则取消选中
            let {selectMap} = this.state;
            selectMap = new Map();
            this.setState({selectMap})
        } else { // 没有勾选的, 全部勾选
            let newMap = new Map();
            for (let key = 0; key < collectionArray.length; key++) {
                let value = collectionArray[key].collectItem; // 拿到数组的collectItem
                newMap.set(key, value) // 第一个key, 第二个是value
            }
            this.setState({selectMap: newMap})
        }
    }

    selectItem = (key, value, isChecked) => { // 单选

        this.setState({
            isChecked: !this.state.isChecked,
            // preIndex: key  //  **** 单选逻辑 ****
        }, () => {
            let map = this.state.selectMap;
            if (isChecked) {
                map.delete(key, value) // 再次点击的时候,将map对应的key,value删除
            } else {
                // map = new Map() // ------>   **** 单选逻辑 ****
                map.set(key, value) // 勾选的时候,重置一下map的key和value
            }
            this.setState({selectMap: map})
        })
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
    BookXj:{
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
    BookXjBtn:{
        alignItems:'center',
        justifyContent:'center',
        marginTop:10,
        marginBottom:30,
        flexDirection:'row',
    },
    BookXjBtnStyle:{
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
        marginTop:5
    },
    row: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        height:50
    },
    btn: { width: 58, height: 22, backgroundColor: '#78B7BB',  borderRadius: 8 ,justifyContent:'center',},
    btnText: { textAlign: 'center', color: '#fff', },
    head: {
        height: 50,
        backgroundColor: '#012c4c',
    },
    textHead:{
        color:'#ffffff',
        fontWeight:'bold',
        textAlign: 'center',
        fontSize:12,
    },
    text: {
        margin: 6,
        fontSize:12,
        textAlign: 'center'
    }
});
export default BookXj;