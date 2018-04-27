'use strict';
import React, { Component } from 'react';
import {
    Dimensions,
    Image,
    InteractionManager,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Alert,
    TextInput
} from 'react-native';

var {width,height} = Dimensions.get('window');

import { NaviGoBack } from '../../common/NavigatorUtils';
import { FormLabel, FormInput, FormValidationMessage, Button, Icon } from 'react-native-elements';

import { UserLogin } from '../../network/UserCenter';//登录接口
import HeaderBar from '../../components/HeaderBar';//头部导航
import { WechatOAuth, QQOAuth } from '../../network/OAuthApi';//微信、QQ登录接口
import Register from './Register';//跳转注册界面

var telephone = '';
var password = '';

var openid = '';

class Login extends Component {

    constructor(props) {
        super(props);
        this.rendLeftButton = this.rendLeftButton.bind(this);
        this.loginAction = this.loginAction.bind(this);//登录绑定
        this.registerAction = this.registerAction.bind(this);//注册绑定
        this.backAction = this.backAction.bind(this);//返回
        this.thirdPartLoginAction = this.thirdPartLoginAction.bind(this);//第三方登录

        this.state = {
            title: '登录'
        };
    }
    //返回
    backAction() {
        const { navigator } = this.props;
        return navigator.popToTop();
    }

    rendLeftButton() {
        return (
            <TouchableOpacity onPress={() => { this.backAction() }} style={styles.leftViewStyle}>
                <Image source={require('../../assets/imgs/left.png')} style={styles.navImageStyle}/>
            </TouchableOpacity>
        )
    }

    componentDidMount() {
    }
    //登录
    loginAction() {
        //去除空格
        telephone = telephone.replace(/(^\s*)|(\s*$)/g, "");
        password = password.replace(/(^\s*)|(\s*$)/g, "");
        //用户登录
        if (telephone === '') {
            Alert.alert('登录', '手机号码不能为空!');
            return;
        }
        if (!(/^1[23456789]\d{9}$/.test(telephone))) {
            Alert.alert('登录', '手机号码有误,请重新输入');
            return;
        }
        if (password === '') {
            Alert.alert('登录', '密码不能为空!');
            return;
        }
        UserLogin({
            telephone: telephone,
            password: password,
            device: `${Platform.OS}:${information.version[Platform.OS]}`
        }).then(response => {
            switch (parseInt(response.status)) {
                case 200:
                    storage.save({
                        key: 'currentLogin',//保存的key值
                        rawData: response.data,
                        expires: 3600 * 24 * 15//有效时间
                    }).then(() => {
                        Alert.alert('登录', response.message);
                        this.props.upLogin(true);
                        this.backAction();
                    }).catch();
                    break;
                default:
                    Alert.alert('登录', response.message);
            }
        }).catch(error => { });
    }
    //其它登录方式
    thirdPartLoginAction(position) {
        switch (position) {
            case 1:
                WeChat.isWXAppInstalled().then(promise => {
                    //console.warn(JSON.stringify(promise))
                    if (promise) {
                        //console.warn('登录', promise)
                        //发送授权请求
                        WeChat.sendAuthRequest('snsapi_userinfo', 'wechat').then(promise => {
                            console.warn(JSON.stringify(promise))
                            //返回code码，通过code获取access_token
                            console.warn('登录', promise.code)
                            WechatOAuth({
                                code: promise.code,
                                device: `${Platform.OS}:${information.version[Platform.OS]}`
                            }).then(response => {
                                console.warn(JSON.stringify(response))
                                switch (response.status) {
                                    case 200:
                                        //Alert.alert('登录', '411');
                                        storage.save({
                                            key: 'currentLogin',
                                            rawData: response.data,
                                            expires: 3600 * 24 * 15
                                        }).then(() => {
                                            Alert.alert('登录', response.message);
                                            this.props.upLogin(true);
                                            this.backAction();
                                        }).catch();
                                        break;
                                    case 201:
                                        Alert.alert('微信登录', '该微信尚未绑定任何账户，是否绑定？', [
                                            {
                                                text: '注册并绑定', onPress: () => {
                                                const { navigator } = this.props;
                                                InteractionManager.runAfterInteractions(() => {
                                                    navigator.push({
                                                        component: Register,
                                                        name: 'Register',
                                                        upLogin: this.props.upLogin,
                                                        openid: response.data.openid,
                                                        type: 'wechat'
                                                    });
                                                });
                                            }
                                            },
                                            {
                                                text: '登录并绑定', onPress: () => {
                                                type = 'wechat';
                                                openid = response.data.openid;
                                            }
                                            },
                                        ])
                                        break;
                                    default:
                                        Alert.alert('微信登录', response.message, [
                                            { text: '稍后重试', onPress: () => { } },
                                        ]);
                                        break;
                                }
                            }).catch(error => {
                                console.warn('发现错误' + JSON.stringify(error));
                            });
                        }).catch(error => {console.warn('发现错误1' + JSON.stringify(error)); });
                    } else {
                        Alert.alert('登录', '微信APP尚未安装，无法进行微信登录！', [
                            { text: '我知道了', style: 'default', onPress: () => { } },
                            // { text: '前去下载', style: 'default', onPress: () => { } },
                            // { text: '我不需要', style: 'cancel', onPress: () => { } }
                        ]);
                    }
                });

                break;
            case 2:
                QQAPI.login('get_simple_userinfo').then(promise => {
                    console.warn(JSON.stringify(promise));
                    QQOAuth({
                        openid: promise.openid,
                        device: `${Platform.OS}:${information.version[Platform.OS]}`,
                        access_token: promise.access_token,
                        oauth_consumer_key:promise.oauth_consumer_key
                    }).then(response => {
                        console.warn(JSON.stringify(response));
                        switch (response.status) {
                            case 200:
                                storage.save({
                                    key: 'currentLogin',
                                    rawData: response.data,
                                    expires: 3600 * 24 * 15
                                }).then(() => {
                                    Alert.alert('登录', response.message);
                                    this.props.upLogin(true);
                                    this.backAction();
                                }).catch();
                                break;
                            case 201:
                                Alert.alert('QQ登录', '该QQ尚未绑定任何账户，是否绑定？', [
                                    {
                                        text: '注册并绑定', onPress: () => {
                                        const { navigator } = this.props;
                                        InteractionManager.runAfterInteractions(() => {
                                            navigator.push({
                                                component: Register,
                                                name: 'Register',
                                                upLogin: this.props.upLogin,
                                                openid: promise.openid,
                                                type: 'qq'
                                            });
                                        });
                                    }
                                    },
                                    {
                                        text: '登录并绑定', onPress: () => {
                                        type = 'qq';
                                        openid = promise.openid;
                                    }
                                    },
                                ])
                                break;
                            default:
                                Alert.alert('QQ登录', response.message, [
                                    { text: '稍后重试', onPress: () => { } },
                                ]);
                                break;
                        }
                    }).catch(error => {
                        console.warn('发现错误' + JSON.stringify(error));
                    });

                }).catch(error => { });
                break;
            default:
                break;
        }
    }

    //用户登录/注册
    registerAction(position) {
        const { navigator } = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigator.push({
                component: Register,
                name: 'Register',
                upLogin: this.props.upLogin
            });
        });
    }
    //无法登录
    /*findPwdAction() {
        const { navigator } = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigator.push({
                component: ResetPwd,
                name: 'ResetPwd'
            });
        });
    }*/

    render() {
        return (
            <View style={styles.container}>
                <HeaderBar title={this.state.title} rendLeftButton={this.rendLeftButton}/>
                    <View style={styles.login}>
                    {/*头像*/}
                        <Image source={require('../../assets/imgs/icon.png')} style={styles.iconStyle}/>
                        {/*账号和密码*/}
                        <TextInput
                            placeholder={'请输入手机号'} style={styles.textInputStyle}
                            placeholderTextColor="#aaaaaa"
                            underlineColorAndroid="transparent"
                            numberOfLines={1}
                            ref={'telephone'}
                            multiline={false}
                            autoFocus={true}
                            onChangeText={(text) => {
                                            telephone = text;
                                        }}
                        />
                        <TextInput
                            placeholder={'请输入密码'}  style={styles.textInputStyle}
                            placeholderTextColor="#aaaaaa"
                            underlineColorAndroid="transparent"
                            numberOfLines={1}
                            ref={'password'}
                            multiline={false}
                            secureTextEntry={true}
                            onChangeText={(text) => {
                                            password = text;
                                        }}
                        />
                        {/*登录*/}
                        <TouchableOpacity onPress={() => { this.loginAction() }}>
                            <View style={styles.loginBtnStyle}>
                                <Text style={{color:'white'}}>登录</Text>
                            </View>
                        </TouchableOpacity>
                        {/*设置*/}
                        <View style={styles.settingStyle}>
                            {/*<TouchableOpacity onPress={() => this.findPwdAction()}>*/}
                                {/*<Text>无法登录</Text>*/}
                            {/*</TouchableOpacity>*/}
                            <TouchableOpacity onPress={() => { this.registerAction() }}>
                                <Text>新用户</Text>
                            </TouchableOpacity>
                        </View>
                        {/*其他的登录方式*/}
                        <View style={styles.otherLoginStyle}>
                            <Text>其他登录方式: </Text>
                            {/*<TouchableOpacity onPress={() => this.thirdPartLoginAction(1)} title='微信登录'>*/}
                                {/*<Image  source={require('../../assets/imgs/icon7.png')}   style={styles.otherImageStyle} />*/}
                            {/*</TouchableOpacity>*/}
                            <TouchableOpacity onPress={() => this.thirdPartLoginAction(2)} title='QQ登录'>
                                <Image  source={require('../../assets/imgs/icon3.png')}  style={styles.otherImageStyle} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#dddddd',
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
    login:{
        flex:1,
        alignItems:'center'
    },
    iconStyle:{
        marginTop:30,
        marginBottom:30,
        width:80,
        height:80,
        borderRadius:40,
        borderWidth:2,
        borderColor:'white'
    },

    textInputStyle:{
        height:38,
        width:width,
        backgroundColor:'white',
        marginBottom:1,
        // 内容居中
        textAlign:'center'
    },

    loginBtnStyle:{
        height:35,
        width:width*0.9,
        backgroundColor:'#46b6f9',
        marginTop:30,
        marginBottom:20,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:8
    },

    settingStyle:{
        // 设置主轴的方向
        flexDirection:'row',
        // 主轴的对齐方式
        width:width*0.9,
        justifyContent:'space-between'
    },

    otherLoginStyle:{
        // 设置主轴的方向
        flexDirection:'row',
        // 设置侧轴的对齐方式
        alignItems:'center',
        // 绝对定位
        position:'absolute',
        bottom:10,
        left:20
    },

    otherImageStyle:{
        width:40,
        height:40,
        borderRadius:20,
        marginLeft:8
    },
    rendRightButton:{
        fontSize: 16,
        marginRight:10,
        color:'#fff'
    }
});
export default Login;