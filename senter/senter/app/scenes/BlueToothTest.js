import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TouchableOpacity,
    NativeAppEventEmitter,
    NativeEventEmitter,
    NativeModules,
    Platform,
    PermissionsAndroid,
    ListView,
    ScrollView,
    Image,
    Alert
} from 'react-native';
import Dimensions from 'Dimensions';
import BleManager from 'react-native-ble-manager';
import HeaderBar from '../components/HeaderBar';
import TimerMixin from 'react-timer-mixin';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { NaviGoBack } from '../common/NavigatorUtils';
// import reactMixin from 'react-mixin';
import { PostBluetooth } from '../network/Bluetooth';//调用蓝牙开锁接口
const window = Dimensions.get('window');
var { height, width } = Dimensions.get('window');//获取屏幕宽度和高度
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scanning: false,
            peripherals: new Map(),
            opening: false,
            hint: '',//开锁提示
            equipment:false,//设备提示
            form: { id: 1, token: 1 }
        }

        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
        this.handleStopScan = this.handleStopScan.bind(this);
        this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
        this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);
        this.backAction = this.backAction.bind(this);
        this.rendLeftButton = this.rendLeftButton.bind(this);
    }

    componentDidMount() {
        BleManager.start({ showAlert: false, allowDuplicates: false });

        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
        this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan);
        this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral);
        this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic);

        // if (Platform.OS === 'android' && Platform.Version >= 23) {
        //     PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
        //         if (result) {
        //             PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
        //                 if (result) {
        //                     Alert.alert('系统权限', '程序未取得系统授权，蓝牙开锁功能将无法使用！', [
        //                         // { text: '我知道了', style: 'default', onPress: this.backAction() }
        //                     ])
        //                 }
        //             });
        //         }
        //     });
        // }

        //初始化点击开锁
        this.startScan();
    }

    componentWillUnmount() {
        this.handlerDiscover.remove();
        this.handlerStop.remove();
        this.handlerDisconnect.remove();
    }

    backAction() {
        const { navigator } = this.props;
        return NaviGoBack(navigator);
    }

    handleDisconnectedPeripheral(data) {
        let peripherals = this.state.peripherals;
        let peripheral = peripherals.get(data.peripheral);
        if (peripheral) {
            peripheral.connected = false;
            peripherals.set(peripheral.id, peripheral);
            this.setState({ peripherals });
        }
        //console.log('Disconnected from ' + data.peripheral);
    }

    handleUpdateValueForCharacteristic(data) {
        console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
    }

    handleStopScan() {
        if (this.state.peripherals.size == 0) {
            Alert.alert('蓝牙门禁', '附近没有可开的门锁，请到门锁附近后再试！');
            // this.setState({ equipment: true,hint : false });
            // this.timer = setTimeout(
            //     () => { this.backAction(); },
            //     5000
            // );
        }
        this.setState({ scanning: false, peripherals: new Map() });
    }

    startScan() {
        if (!this.state.scanning) {
            BleManager.scan([], 3, true).then((results) => {
                this.setState({ scanning: true });
            });
        }
    }

    handleDiscoverPeripheral(peripheral) {
        console.warn('你好', "11111");
        var peripherals = this.state.peripherals;
        if (!peripherals.has(peripheral.id)) {
            console.warn('Got ble peripheral', peripheral);
            //const regex = 'Chun\-BT.*';
            const regex = 'RCBLE82';
            if (peripheral.name && peripheral.name.match(regex)) {
                peripherals.set(peripheral.id, peripheral);
                this.setState({ peripherals });
                this.test(peripheral);
            }
        }
    }

    test(peripheral) {
        console.warn('你好', peripheral);
        if (peripheral) {
            console.warn('你好', "3333");
            storage.load({ key: 'currentLogin' }).then(response => {
                this.setState({ form: response });
                 console.warn('你好', peripheral.id);
                 console.warn('你好', response.token);
                 console.warn('你好', response.id);
                PostBluetooth({
                    id: response.id,
                    token: response.token,
                    mac:peripheral.id
                }).then(response => {
                    //console.warn(JSON.stringify(response));
                    switch (parseInt(response.status)) {
                        case 200:
                            if (peripheral.connected) {
                                BleManager.disconnect(peripheral.id);
                                this.test(peripheral);
                            } else {
                                BleManager.connect(peripheral.id).then(() => {
                                    let peripherals = this.state.peripherals;
                                    let p = peripherals.get(peripheral.id);
                                    if (p) {
                                        p.connected = true;
                                        peripherals.set(peripheral.id, p);
                                        this.setState({ peripherals });
                                    }
                                    BleManager.retrieveServices(peripheral.id).then((peripheralData) => {
                                        BleManager.startNotification(peripheral.id, 'FFE0', 'FFE1').then(() => {
                                            //const message = StringToBytes('open');
                                            //console.warn("待写入数据" + message);
                                            var message = [0x44, 0x4E, 0x11];
                                            BleManager.write(peripheral.id, 'FFE0', 'FFE1', message).then(() => {
                                                this.resetLocker = setTimeout(() => {
                                                    var message = [0x55, 0x46, 0x10];
                                                    BleManager.write(peripheral.id, 'FFE0', 'FFE1', message).then(() => {
                                                        BleManager.stopNotification(peripheral.id, 'FFE0', 'FFE1').then(() => {
                                                            BleManager.disconnect(peripheral.id).then(() => {
                                                                Alert.alert('蓝牙门禁', '开锁成功！');
                                                                // this.setState({ hint : true,equipment: false });
                                                                // this.timer = setTimeout(
                                                                //     () => { this.backAction(); },
                                                                //     5000
                                                                // );
                                                            });
                                                        });
                                                    });
                                                }, 200);
                                            }).catch(error => {
                                                var message = [0x55, 0x46, 0x10];
                                                BleManager.write(peripheral.id, 'FFE0', 'FFE1', message).then(() => {
                                                    BleManager.stopNotification(peripheral.id, 'FFE0', 'FFE1').then(() => {
                                                        BleManager.disconnect(peripheral.id);
                                                    });
                                                });
                                                console.warn('数据写入失败！', error);
                                            });
                                        }).catch((error) => {
                                            console.warn('通知事件绑定失败！', error);
                                        });
                                    });
                                }).catch((error) => {
                                    console.warn('蓝牙链接失败！', error);
                                });
                            }

                            break;
                        default:
                            break;
                    }
                }).catch(error => { });
             }).catch(error => { });

        }
    }

    rendLeftButton() {
        return (
            <TouchableOpacity onPress={() => { this.backAction() }} style={styles.leftViewStyle}>
                <Image source={require('../assets/imgs/left.png')} style={styles.navImageStyle}/>
            </TouchableOpacity>
        )
    }

    render() {
        const list = Array.from(this.state.peripherals.values());
        const dataSource = ds.cloneWithRows(list);


        return (
            <View style={styles.container}>
                <HeaderBar title='蓝牙测试' rendLeftButton={this.rendLeftButton} />
                <TouchableHighlight style={{ marginTop: 40, margin: 20, padding: 20, backgroundColor: '#ccc', alignItems: 'center'  }} onPress={() => this.startScan()}>
                    <Text>点我开锁哦 ({this.state.scanning ? '开锁中' : '空闲中'})</Text>
                </TouchableHighlight>
                 {/*<ScrollView style={styles.scroll}>*/}
                    {/*{(list.length == 0) &&*/}
                        {/*<View style={{ flex: 1, margin: 20 }}>*/}
                            {/*<Text style={{ textAlign: 'center' }}>没有任何蓝牙设备</Text>*/}
                        {/*</View>*/}
                    {/*}*/}
                    {/*<ListView*/}
                        {/*enableEmptySections={true}*/}
                        {/*dataSource={dataSource}*/}
                        {/*renderRow={(item) => {*/}
                            {/*const color = item.connected ? 'green' : '#fff';*/}
                            {/*return (*/}
                                {/*<TouchableHighlight onPress={() => this.test(item)}>*/}
                                    {/*<View style={[styles.row, { backgroundColor: color }]}>*/}
                                        {/*<Text style={{ fontSize: 12, textAlign: 'center', color: '#333333', padding: 10 }}>{item.name}</Text>*/}
                                        {/*<Text style={{ fontSize: 8, textAlign: 'center', color: '#333333', padding: 10 }}>{item.id}</Text>*/}
                                    {/*</View>*/}
                                {/*</TouchableHighlight>*/}
                            {/*);*/}
                        {/*}*/}
                        {/*}*/}
                    {/*/>*/}
                {/*</ScrollView>*/}

                {/*<Image style={{ flex: 1, width: width, height: height }} source={require('../assets/imgs/timg.jpg')} resizeMode={'cover'}>*/}
                    {/*设备提示*/}
                    {/*<View style={{top: 0,backgroundColor:(this.state.equipment == true) ? '#ff0000' : '#0000ff' }}>*/}
                        {/*<Text style={{ textAlign: 'center',color:'#fff' }}>{(this.state.equipment == true) ? '附近没有可开的门锁，请到门锁附近后再试！' : ''}</Text>*/}
                    {/*</View>*/}
                    {/*开锁提示*/}
                    {/*<View>*/}
                        {/*<Text style={styles.hintText}>{(this.state.hint == true) ? '开锁成功' : '开锁中...'}</Text>*/}
                    {/*</View>*/}
                    {/*<View style={styles.moreView}>*/}
                        {/*<Text>门禁使用小贴士，</Text>*/}
                        {/*<Text style={{ color: '#FFD700',textDecorationLine:'underline',fontWeight:'bold' }}>点此了解></Text>*/}
                    {/*</View>*/}
                    {/*<Text onPress={() => { this.backAction() }} style={styles.closeText}>关闭</Text>*/}
                {/*</Image>*/}

            </View>
        );
    }
}
// reactMixin(App.prototype, TimerMixin);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        width: window.width,
        height: window.height,
    },
    scroll: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        margin: 10,
    },
    row: {
        margin: 10
    },
    hintText:{
        fontSize:24,
        marginTop:300,
        color: '#FFD700',
        textAlign:'center',
        fontWeight:'bold'
    },
    moreView:{
        marginTop:60,
        // 设置主轴的方向
        flexDirection:'row',
        // 垂直居中 ---> 设置侧轴的对齐方式
        alignItems:'center',
        // 主轴方向居中
        justifyContent:'center',
    },
    closeText:{
        margin:30,
        textAlign:'right',
        fontWeight:'bold'
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
});