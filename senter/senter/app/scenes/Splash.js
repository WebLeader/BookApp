'use strict';

import React from 'react';
import {
    Dimensions,
    Image,
    InteractionManager,
    View,
    Text,
    Platform
} from 'react-native';

import AppMain from './AppMain';
import App from './App';

var { height, width } = Dimensions.get('window');

class Splash extends React.Component {
    constructor(props) {
        super(props);
    }

    // 复杂的操作:定时器\网络请求 组件渲染后，初始化加载
    componentDidMount() {
        const { navigator } = this.props;
        this.timer = setTimeout(() => {
            InteractionManager.runAfterInteractions(() => {
                navigator.resetTo({
                    component: AppMain,// 具体路由的版块
                    name: 'AppMain'
                });
            });
        }, 1000);
        // this.timer = setTimeout(() => {
        //     InteractionManager.runAfterInteractions(() => {
        //         navigator.resetTo({
        //             component: App,// 具体路由的版块
        //             name: 'App'
        //         });
        //     });
        // }, 1000);
    }
    // 组件渲染前
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {/*<Image*/}
                    {/*style={{flex: 1, width: width, height: height}}*/}
                    {/*source={require('../assets/imgs/ic_splash.png')}*/}
                    {/*resizeMode={'cover'}*/}
                {/*/>*/}
            </View>
        );
    }
}
export default Splash;