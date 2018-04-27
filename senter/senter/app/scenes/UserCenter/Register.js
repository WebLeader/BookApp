'use strict';
import React, {Component} from 'react';
import {
    Dimensions,
    Image,
    InteractionManager,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Platform,
    Alert,
    Keyboard,
    KeyboardAvoidingView
} from 'react-native';

var {width, height} = Dimensions.get('window');
import {NaviGoBack} from '../../common/NavigatorUtils';//返回
import HeaderBar from '../../components/HeaderBar';//头部导航
import {GetVerifyCode} from '../../network/CommonApi';//获取验证码接口
import {UserRegister} from '../../network/UserCenter';//注册接口
import {UserLogin} from '../../network/UserCenter';//登录接口
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {HOST, REGISTER_ACTION} from '../../common/Request';

var username = '';
var password = '';
var confirm = '';
var telephone = '';
var smsCode = '';
var verifyDelay = 60;

class Register extends Component {
    constructor(props) {
        super(props);

        this.rendLeftButton = this.rendLeftButton.bind(this);
        this.rendRightButton = this.rendLeftButton.bind(this);
        this.backAction = this.backAction.bind(this);//返回
        this.registerAction = this.registerAction.bind(this);//输入验证
        this.getVerifyCode = this.getVerifyCode.bind(this);//验证码
        verifyDelay = 60;
        this.state = {
            title: '注册',
            verifyButton: false,
            verifyTitle: '获取验证码',
            verifyOrigin: '获取验证码',
            keyboardSpace: 0
        };
    }

    backAction() {
        this.interval && clearInterval(this.interval);
        const {navigator} = this.props;
        return NaviGoBack(navigator);
    }


    rendLeftButton() {
        return (
            <TouchableOpacity onPress={() => { this.backAction() }} style={styles.leftViewStyle}>
                <Image source={require('../../assets/imgs/left.png')} style={styles.navImageStyle}/>
            </TouchableOpacity>
        )
    }

    //获取验证码
    getVerifyCode() {
        if (telephone.trim().length != 11) {
            return Alert.alert('注册', '请输入正确的手机号码');
        }

        GetVerifyCode({
            telephone: telephone,
            smsType: 1
        }).then(response => {
            switch (parseInt(response.status)) {
                case 200:
                    this.setState({
                        verifyButton: true
                    });
                    this.interval = setInterval(() => {
                        if (verifyDelay > 0) {
                            verifyDelay--;
                            this.setState({
                                verifyDelay: verifyDelay,
                                verifyTitle: `重新获取(${verifyDelay})`
                            });
                        } else {
                            this.setState({
                                verifyButton: false,
                                verifyDelay: 60,
                                verifyTitle: this.state.verifyOrigin
                            });
                            verifyDelay = 60;
                            this.interval && clearInterval(this.interval);
                        }
                    }, 1000);
                    Alert.alert('注册', response.message);
                    break;
                default:
                    Alert.alert('注册', response.message);
                    break;
            }
        }).catch(error => {

        });
    }
    //注册
    registerAction() {
        const {navigator} = this.props;
        if (username === '') {
            Alert.alert('注册', '用户名不能为空！');
            return;
        }
        if (telephone === '') {
            Alert.alert('注册', '手机号不能为空！');
            return;
        }
        if (password === '') {
            Alert.alert('注册', '密码不能为空！');
            return;
        }
        if (password !== confirm) {
            Alert.alert('注册', '两次输入的密码不一致！');
            return;
        }
        if (password.length > 15 || password.length < 6) {
            Alert.alert('注册', '密码长度小于6位或者超过了15位！');
            return;
        }
        if (smsCode === '') {
            Alert.alert('注册', '验证码不能为空！');
            return;
        }
        const form = {
            username: username,
            telephone: telephone,
            password: password,
            verifyCode: smsCode
        };
        UserRegister(form).then(response => {
            switch (parseInt(response.status)) {
                case 200:
                    UserLogin({
                        telephone: telephone,
                        password: password,
                        device: `${Platform.OS}:${information.version[Platform.OS]}`,
                    }).then(response => {
                        switch (parseInt(response.status)) {
                            case 200:
                                storage.save({
                                    key: 'currentLogin',
                                    rawData: response.data,
                                    expires: 3600 * 24 * 15
                                }).then(() => {
                                    Alert.alert('注册', response.message, [
                                        {
                                            text: '前往我的账户',
                                            onPress: () => {
                                                this.props.upLogin(true);
                                                navigator.popToTop();//注册成功回到最顶层的路由index
                                            },
                                            style: 'default'
                                        }
                                    ]);
                                }).catch(error => {
                                });
                                break;
                            default:
                            //Alert.alert('注册', response.message);
                        }
                    }).catch(error => {
                    });

                default:
                    console.warn(JSON.stringify(response));
                    Alert.alert('注册', response.message);
                    return;
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderBar title={this.state.title} rendLeftButton={this.rendLeftButton}/>
                {/*账号和密码*/}
                <KeyboardAwareScrollView style={{flex: 1}} keyboardShouldPersistTaps={'always'}>
                    <View style={styles.register}>
                        <View style={styles.textInputH}>
                            <TextInput
                                placeholder={'真实姓名（必填）'} style={styles.textInputStyle}
                                placeholderTextColor="#aaaaaa"
                                underlineColorAndroid="transparent"
                                ref={'username'}
                                multiline={false}
                                autoFocus={true}
                                blurOnSubmit={false}
                                returnKeyType={'next'}
                                onChangeText={(text) => {
                                    username = text;
                                }}
                            />
                        </View>
                        <View style={styles.textInputH}>
                            <TextInput
                                placeholder={'请输入手机号码（必填）'} style={styles.textInputStyle}
                                placeholderTextColor="#aaaaaa"
                                underlineColorAndroid="transparent"
                                ref={'telephone'}
                                autoFocus={true}
                                multiline={false}
                                keyboardType={'phone-pad'}
                                onChangeText={(text) => {
                                    telephone = text;
                                }}
                            />
                        </View>
                        <View style={styles.textInputH}>
                            <TextInput
                                placeholder={'请输入验证码（必填）'} style={styles.textInputStyle}
                                placeholderTextColor="#aaaaaa"
                                underlineColorAndroid="transparent"
                                numberOfLines={1}
                                ref={'smsCode'}
                                multiline={false}
                                onChangeText={(text) => {
                                    smsCode = text;
                                }}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    this.getVerifyCode()
                                }}
                                disabled={this.state.verifyButton}
                                style={styles.getVerifyCode}
                            >
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: this.state.verifyButton ? '#aaaaaa' : '#7fc1fe'
                                    }}>{this.state.verifyTitle}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.textInputH}>
                            <TextInput
                                placeholder={'请输入密码（必填）'} password={true} style={styles.textInputStyle}
                                placeholderTextColor="#aaaaaa"
                                underlineColorAndroid="transparent"
                                ref={'password'}
                                multiline={false}
                                secureTextEntry={true}
                                onChangeText={(text) => {
                                    password = text;
                                }}
                            />
                        </View>
                        <View style={styles.textInputH}>
                            <TextInput
                                placeholder={'请再次输入密码（必填）'} password={true} style={styles.textInputStyle}
                                placeholderTextColor="#aaaaaa"
                                underlineColorAndroid="transparent"
                                numberOfLines={1}
                                ref={'confirm'}
                                multiline={false}
                                secureTextEntry={true}
                                onChangeText={(text) => {
                                    confirm = text;
                                }}
                            />
                        </View>
                    </View>
                    {/*注册*/}
                    <TouchableOpacity onPress={() => {
                        this.registerAction()
                    }}
                                      style={styles.registerBtn}>
                        <View style={styles.registerBtntext}>
                            <Text style={{color: 'white'}}>注册</Text>
                        </View>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>

            </View>
        )
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
    //TextInput样式
    register: {
        backgroundColor: '#fff'
    },
    textInputH: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 45,
        borderBottomColor: '#e6e6e6',
        borderBottomWidth: 1
    },
    textInputStyle: {
        height: 40,
        fontSize: 15,
        textAlign: 'left',
        textAlignVertical: 'center',
        flex: 1,
        paddingHorizontal: 15
    },
    registerBtn: {
        justifyContent: 'center',
        marginTop: 13,
        alignItems: 'center'
    },
    registerBtntext: {
        height: 40,
        width: width * 0.9,
        backgroundColor: '#46b6f9',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4
    },
    getVerifyCode: {
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#7fc1fe',
        borderRadius: 4,
        paddingVertical: 8,
        right: 12
    }
});
export default Register;