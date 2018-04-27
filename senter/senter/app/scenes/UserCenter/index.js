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
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Avatar} from 'react-native-elements';

import LineButton from '../../components/LineButton';
import {UserInfo} from '../../network/UserCenter';//调用用户信息接口

var {height, width} = Dimensions.get('window');

export default class UserCenter extends Component {

    constructor(props) {
        super(props);
        this.doBack = this.doBack.bind(this);
        this.itemButtonAction = this.itemButtonAction.bind(this);
        this.state = {
            title: '我的账户',
            form: {id: 1, token: 1},
            user: {
                nickname: '',
                telephone: ''
            }
        };
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.loadUserInfo();
        });
    }

    doBack() {
        InteractionManager.runAfterInteractions(() => {
            this.loadUserInfo();
        });
    }

    loadUserInfo() {
        storage.load({key: 'currentLogin'}).then(response => {
            storage.save({key: 'currentLogin', rawData: response});
            this.setState({form: response});
            UserInfo({
                id: response.id,
                token: response.token
            }).then(response => {
                switch (parseInt(response.status)) {
                    case 200:
                        this.setState({user: response.data});
                        break;
                    default:
                        break;
                }
            }).catch(error => {
            });
        }).catch(error => {
        });
    }

    //注销登录
    itemButtonAction() {
        const {navigator} = this.props;
        storage.remove({key: "currentLogin"});
        this.props.upLogin(false);
        navigator.popToTop();
    }

    render() {
        return (
            <ParallaxScrollView
                backgroundColor="#fff"
                contentBackgroundColor="#efefef"
                parallaxHeaderHeight={width / 2}
                renderBackground={() => (
                    <View style={{height: width / 2, alignItems: 'center', justifyContent: 'center'}}>
                        <Image style={{width: width, height: width / 2}}
                               source={{uri: 'https://images.unsplash.com/photo-1441126270775-739547c8680c?h=1024'}}/>
                    </View>
                )
                }
                renderForeground={() => (

                    <View style={{
                        height: width / 2,
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <TouchableOpacity>
                            <View>
                                <Avatar
                                    large
                                    rounded
                                    source={{uri: this.state.user.headimage}}
                                    activeOpacity={0.7}
                                    style={{width: 74, height: 74}}
                                />
                                <View style={{marginTop: 12, alignItems: 'center'}}>
                                    <Text style={{color: '#fff'}}>{this.state.user.nickname}</Text>
                                    <Text style={{color: '#fff'}}>{this.state.user.telephone}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                )}>
                <View style={{flex: 1}}>
                    {/*<LineButton rendIcon={() => <FontAwesome name='credit-card-alt' size={18} color='orange'/>}*/}
                                {/*title='我的账户'/>*/}
                    {/*<LineButton rendIcon={() => <FontAwesome name='info-circle' size={24} color='orange'/>} title='账号'/>*/}
                    {/*<LineButton rendIcon={() => <FontAwesome name='gear' size={24} color='orange'/>} title='设置'/>*/}
                    {/*<LineButton rendIcon={() => <FontAwesome name='share-square-o' size={24} color='orange'/>}*/}
                                {/*title='推荐给朋友'/>*/}
                    <LineButton onPress={() => {
                        this.itemButtonAction()
                    }} rendIcon={() => <FontAwesome name='share-square-o' size={24} color='orange'/>} title='注销登录'/>
                </View>
            </ParallaxScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
    }
})