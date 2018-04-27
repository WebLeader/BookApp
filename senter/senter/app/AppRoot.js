//鏍规嵁椤甸潰
'use strict';

import React from 'react';
import {
    StyleSheet,
    View,
    BackAndroid,
    Platform,
    AsyncStorage,
    Linking,
    Alert,
    ToastAndroid
} from 'react-native';

import {Navigator} from 'react-native-deprecated-custom-components';
import Storage from 'react-native-storage';
import Splash from './scenes/Splash';
var _navigator;

//鍏ㄥ眬鍙橀噺global
var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    sync: require('./sync').default
});
global.storage = storage;
global.baseURL = 'http://120.79.2.64/olixf-library/api/bookReservation/';

global.StringToBytes = (str) => {
    var arr = new Array();
    // arr.push(0x2);
    for (i = 0; i < str.length; i++) {
        arr.push(str.charCodeAt(i));
    }
    // arr.push(0x3);
    return arr;
};

class AppRoot extends React.Component {
    constructor(props) {
        super(props);
        this.renderScene = this.renderScene.bind(this);
        this.configureScene = this.configureScene.bind(this);
    }

    componentDidMount() {
    }

    componentWillMount() {
    }

    componentWillUnmount() {
    }

    configureScene(route, routeStack) {
        return Navigator.SceneConfigs.FadeAndroid;
    }

    renderScene(route, navigator) {
        const Component = route.component;
        _navigator = navigator;
        return <Component navigator={navigator} {...route} />;
    }

    render() {
        return (
            <View style={styles.contariner}>
                <Navigator
                    ref='navigator'
                    style={styles.navigator}
                    configureScene={this.configureScene}
                    renderScene={this.renderScene}
                    initialRoute={{
                        component: Splash,
                        name: 'Splash'
                    }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    contariner: {
        flex: 1,
    },
    navigator: {
        flex: 1
    }
});
export default AppRoot;