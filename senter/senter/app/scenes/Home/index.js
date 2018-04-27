'use strict';
import React, {Component} from 'react';

import {
    View,
    Text,
    Dimensions,
    Image,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    TouchableHighlight,
    ScrollView,
    InteractionManager,
    StatusBar,
    Alert
} from 'react-native';
import ViewPager from 'react-native-viewpager';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
//import Toast from 'react-native-root-toast';

import FreeHomeList from '../../components/FreeHomeList';
import PlayList from '../PlayList';//音频
import BlueToothTest from '../BlueToothTest';//蓝牙门禁
import PushStream from '../PushStream';
import PullStream from '../PullStream';
import Live from '../Live';//直播
import ShopWebView from '../Shop';
var {height, width} = Dimensions.get('window');
import TextView from '../../components/MyTextView';

var BANNER_IMGS = [
    // 'https://images.unsplash.com/photo-1441742917377-57f78ee0e582?h=1024',
    // 'https://images.unsplash.com/photo-1441716844725-09cedc13a4e7?h=1024',
    // 'https://images.unsplash.com/photo-1441448770220-76743f9e6af6?h=1024',
    // 'https://images.unsplash.com/photo-1441260038675-7329ab4cc264?h=1024',
    // 'https://images.unsplash.com/photo-1441126270775-739547c8680c?h=1024',
    // 'https://images.unsplash.com/photo-1440964829947-ca3277bd37f8?h=1024',
    // 'https://images.unsplash.com/photo-1440847899694-90043f91c7f9?h=1024'
];

export default class Home extends Component {

    constructor(props) {
        super(props);

        this.pushPlayList = this.pushPlayList.bind(this);
        this.rendPager = this.rendPager.bind(this);
        this.onBannerPress = this.onBannerPress.bind(this);
        this.loadData = this.loadData.bind(this);
        this.centerItemAction = this.centerItemAction.bind(this);

        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
        // 用于构建DataSource对象
        this.dataSource = new ViewPager.DataSource({
            pageHasChanged: (p1, p2) => p1 !== p2,
        });
        // 实际的DataSources存放在state中
        this.state = {
            bannerData: this.dataSource.cloneWithPages(BANNER_IMGS),
            freeList: [],
            peripherals: new Map(),
            form: { id: 1, token: 1 },
        };
    }

    componentDidMount() {
        // this.handlerDiscover = BleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
        InteractionManager.runAfterInteractions(() => {
            this.loadData();

        });
    }

    handleDiscoverPeripheral(peripheral) {
        var peripherals = this.state.peripherals;
        if (!peripherals.has(peripheral.id)) {
            console.warn('Got ble peripheral', peripheral);
            peripherals.set(peripheral.id, peripheral);
            this.setState({peripherals})
        }
    }

    //本地加载所有的反应
    loadData() {
        storage.load({key: 'albums', id: 1}).then(response => {
            this.setState({
                freeList: response
            })
        }).catch(error => {
        });
        // 读取
        storage.load({key: 'bannerList'}).then(response => {
            this.setState({
                bannerData: this.dataSource.cloneWithPages(response)
            })
        }).catch(error => {
        });
    }
    //音频播放
    pushPlayList(list = []) {
        const {navigator} = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigator.push({
                component: PlayList,
                name: 'PlayList',
                playList: list,
                playSound: this.props.playSound
            });
        });
    }

    onBannerPress(bannerId) {

    }

    //轮播图片
    rendPager(data, pageID) {
        return (
            <TouchableWithoutFeedback onPress={() => { this.onBannerPress(pageID) }}>
                <View>
                    <Image style={{ width: width, height: width / 2 }} source={{ uri: data.image }}/>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    centerItemAction(position) {
        switch (position) {
            //蓝牙门禁
            case 1:
                storage.load({ key: 'currentLogin' }).then(response => {
                    storage.save({ key: 'currentLogin', rawData: response });
                    this.setState({ form: response });
                    const { navigator } = this.props;
                    InteractionManager.runAfterInteractions(() => {
                        navigator.push({
                            component: BlueToothTest,
                            name: 'BlueToothTest',
                            form: this.state.form,
                        });
                    });
                }).catch(error => {
                    Alert.alert('门禁', '您尚未登录春来到APP，请登录后进行开锁！', [
                        { text: '前去登录', onPress: () => { this.props.goToLogin() }, style: 'default' },
                        { text: '稍后再说', onPress: () => { }, style: 'cancel' }
                    ]);
                });
                break;
                //直播
            case 2:
                storage.load({ key: 'currentLogin' }).then(response => {
                    storage.save({ key: 'currentLogin', rawData: response });
                    this.setState({ form: response });
                    const { navigator } = this.props;
                    InteractionManager.runAfterInteractions(() => {
                        navigator.push({
                            component: Live,
                            name: '直播',
                            form: this.state.form,
                        });
                    });
                }).catch(error => {
                    Alert.alert('门禁', '您尚未登录春来到APP，请登录后进入直播！', [
                        { text: '前去登录', onPress: () => { this.props.goToLogin() }, style: 'default' },
                        { text: '稍后再说', onPress: () => { }, style: 'cancel' }
                    ]);
                });
                break;
                //商城
            case 3:
                const { navigator } = this.props;
                InteractionManager.runAfterInteractions(() => {
                    navigator.push({
                        component: ShopWebView,
                        name: 'ShopWebView',
                        url: `http://m.chunld.cn`
                    });
                });
                break;
                //客服电话
            case 4:
                break;
                //设置
            case 5:
                break;
            default:
                Alert.alert('春来到', '您尚未登录春来到APP，请登录后进入！', [
                    { text: '前去登录', onPress: () => { }, style: 'default' },
                    { text: '稍后再说', onPress: () => { }, style: 'cancel' }
                ]);
                // Toast.show('功能正在开发中，敬请期待！', {
                //     duration: Toast.durations.SHORT,
                //     position: -80,
                //     shadow: true,
                //     animation: true,
                //     hideOnPress: true,
                // });
                break;
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.container}>
                    {/*轮播图*/}
                    <ViewPager style={styles.bannerPager}
                               dataSource={this.state.bannerData}
                               renderPage={this.rendPager}
                               isLoop={true}
                               autoPlay={true}/>
                    {/*菜单*/}
                    <View style={styles.iconText}>
                        <TouchableOpacity activeOpacity={0.5} onPress={() => { this.centerItemAction(1) }}>
                            <View style={styles.innerViewStyle}>
                                <Image style={styles.icon} source={require('../../assets/imgs/key.png')} />
                                <Text style={styles.TextStyle}>蓝牙门禁</Text>
                            </View>
                        </TouchableOpacity>
                        {/*<TouchableOpacity activeOpacity={0.5} onPress={() => { this.centerItemAction(2) }}>*/}
                            {/*<View style={styles.innerViewStyle}>*/}
                                {/*<Image style={styles.icon} source={require('../../assets/imgs/live.png')} />*/}
                                {/*<Text style={styles.TextStyle}>直播</Text>*/}
                            {/*</View>*/}
                        {/*</TouchableOpacity>*/}
                        <TouchableOpacity activeOpacity={0.5} onPress={() => { this.centerItemAction(3) }}>
                            <View style={styles.innerViewStyle}>
                                <Image style={styles.icon} source={require('../../assets/imgs/shop.png')} />
                                <Text style={styles.TextStyle}>商城</Text>
                            </View>
                        </TouchableOpacity>
                        {/*<TouchableOpacity activeOpacity={0.5} onPress={() => { this.centerItemAction(4) }}>*/}
                            {/*<View style={styles.innerViewStyle}>*/}
                                {/*<Image style={styles.icon} source={require('../../assets/imgs/phone.png')} />*/}
                                {/*<Text style={styles.TextStyle}>客服电话</Text>*/}
                            {/*</View>*/}
                        {/*</TouchableOpacity>*/}
                        {/*<TouchableOpacity activeOpacity={0.5} onPress={() => { this.centerItemAction(5) }}>*/}
                            {/*<View style={styles.innerViewStyle}>*/}
                                {/*<Image style={styles.icon} source={require('../../assets/imgs/setting.png')} />*/}
                                {/*<Text style={styles.TextStyle}>设置</Text>*/}
                            {/*</View>*/}
                        {/*</TouchableOpacity>*/}
                    </View>
                    {/*免费专区*/}
                    <FreeHomeList title='免费专区' onPress={this.pushPlayList} areaList={this.state.freeList}/>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
    },
    bannerPager: {
        width: width,
        height: width / 2,
    },
    iconText:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#ffffff',
        justifyContent:'space-around'
    },
    innerViewStyle:{
        width:70,
        height:70,
        //水平和垂直居中
        justifyContent:'center',
        alignItems:'center'
    },
    icon: {
        width: 32,
        height: 32,
        marginBottom:3
    },
    TextStyle:{
        fontSize:12
    }
})