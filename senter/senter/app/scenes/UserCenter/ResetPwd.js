'use strict';
import React, {Component} from 'react';
import{
    View,
    Text,
    BackAndroid,
    TouchableOpacity,
    Image,
    StyleSheet,
    InteractionManager,
    TextInput,
    Alert,
} from 'react-native';

import {NaviGoBack} from '../../utils/CommonUtils';
import ShortLineTwo from '../../component/ShortLineTwo';
import HeaderBar from '../../component/HeaderBar';

import {GetVerifyCode} from '../../network/CommonApi';
import {UserResetPassword} from '../../network/UserCenter';

var telephone = '';
var password = '';
var confirm = '';
var verifyCode = '';
var verifyDelay = 60;
class ResetPwd extends Component {
    constructor(props) {
        super(props);
        this.buttonBackAction = this.buttonBackAction.bind(this);
        this.getVerifyCode = this.getVerifyCode.bind(this);
        this.resetSuccesAction = this.resetSuccesAction.bind(this);
        this.buttonChangeState = this.buttonChangeState.bind(this);
        this.state = {
            verifyButton: false,
            verifyDelay: 60,
            verifyTitle: '获取验证码',
            verifyOrigin: '获取验证码'
        }
    }

    //返回
    buttonBackAction() {
        const {navigator} = this.props;
        return NaviGoBack(navigator);
    }

    buttonChangeState(position) {

    }

    getVerifyCode() {
        if(telephone.trim().length != 11){
            return Alert.alert('重设密码', '请输入正确的手机号码');
        }

        GetVerifyCode({
            telephone: telephone,
            smsType: 2
        }).then(response => {
            switch(parseInt(response.status))
            {
                case 200:
                    this.setState({
                        verifyButton: true
                    });
                    this.interval = setInterval(()=>{
                        if(verifyDelay > 0){
                            verifyDelay--;
                            this.setState({
                                verifyDelay: verifyDelay,
                                verifyTitle: `重新获取(${verifyDelay})`
                            });
                        }else{
                            this.setState({
                                verifyButton: false, 
                                verifyDelay: 60, 
                                verifyTitle: this.state.verifyOrigin
                            });
                            verifyDelay = 60;
                            this.interval&&clearInterval(this.interval);
                        }
                    }, 1000);
                    Alert.alert('重设密码', response.message);
                    break;
                default:
                    Alert('重设密码', response.message);
                    break;
            }
        }).catch(error => {

        });
    }

    resetSuccesAction() {
        if(password != confirm){
            return Alert.alert('重设密码', '两次输入的密码不一致！');
        }

        const form = this.props.form;
        UserResetPassword({
            telephone: telephone,
            password: password,
            smsCode: verifyCode
        }).then(response=>{
            switch(parseInt(response.status)){
                case 200:
                    Alert.alert('重设密码', response.message);
                    InteractionManager.runAfterInteractions(()=>{
                        const {navigator} = this.props;
                        return NaviGoBack(navigator);
                    });
                    break;
                default:
                    Alert.alert('重设密码', response.message);
                    break;
            }
        }).catch(error=>{});
    }

    render() {
        return (
            <View style={{backgroundColor:'#f5f5f5',flex:1}}>
                <HeaderBar title="重设密码" leftButtonAction={() => {this.buttonBackAction()}}/>
                <View style={{backgroundColor:'white',marginTop:13}}>
                    <View style={{flexDirection:'row',height:45,alignItems:'center'}}>
                        <TextInput
                            style={{height:40,fontSize: 15,textAlign: 'left',textAlignVertical:'center',flex:1,paddingHorizontal: 15}}
                            placeholder="请输入手机号码（必填）"
                            placeholderTextColor="#aaaaaa"
                            underlineColorAndroid="transparent"
                            numberOfLines={1}
                            ref={'telephone'}
                            multiline={false}
                            autoFocus={true}
                            keyboardType={'phone-pad'}
                            onChangeText={(text) => {
                               telephone = text;
                            }}
                        />
                    </View>
                    <ShortLineTwo/>
                    <View style={{flexDirection:'row',height:45,alignItems:'center'}}>
                        <TextInput
                            style={{height:40,fontSize: 15,textAlign: 'left',textAlignVertical:'center',flex:1,paddingHorizontal: 15}}
                            placeholder="请输入验证码（必填）"
                            placeholderTextColor="#aaaaaa"
                            underlineColorAndroid="transparent"
                            numberOfLines={1}
                            ref={'verifyCode'}
                            multiline={false}
                            keyboardType={'number-pad'}
                            onChangeText={(text) => {
                               verifyCode = text;
                            }}
                        />
                        <TouchableOpacity   onPress={() => {this.getVerifyCode()}} 
                                            disabled={this.state.verifyButton}
                                            style={{width:100,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor: this.state.verifyButton ? '#aaaaaa' : '#7fc1fe',borderRadius:4,paddingVertical:8,marginRight: 12}}>
                            <Text style={{fontSize:13,color: this.state.verifyButton ? '#aaaaaa' : '#7fc1fe'}}>{this.state.verifyTitle}</Text>
                        </TouchableOpacity>
                    </View>
                    <ShortLineTwo/>
                    <View style={{flexDirection:'row',height:45,alignItems:'center'}}>
                        <TextInput
                            style={{height:40,fontSize: 15,textAlign: 'left',textAlignVertical:'center',flex:1,paddingHorizontal: 15}}
                            placeholder="请输入新密码（必填）"
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
                    </View>
                    <ShortLineTwo/>
                    <View style={{flexDirection:'row',height:45,alignItems:'center'}}>
                        <TextInput
                            style={{height:40,fontSize: 15,textAlign: 'left',textAlignVertical:'center',flex:1,paddingHorizontal: 15}}
                            placeholder="请再输入一次新密码（必填）"
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
                <TouchableOpacity onPress={() => {this.resetSuccesAction()}}
                                  style={{justifyContent:'center',marginTop:13,alignItems:'center'}}>
                    <View
                        style={{width:300,height:40,justifyContent:'center',alignItems:'center',backgroundColor: '#7fc1fe',borderRadius: 4}}>
                        <Text style={{color:'white'}}>确定</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    item_layout: {
        backgroundColor: 'white',
        height: 45,
        justifyContent: 'center'
    }
});
export default ResetPwd;