'use strict';
import React, {Component} from 'react';

import {
    View,
    Text,
    Dimensions,
    Image,
    StyleSheet,
    Alert,
    ScrollView,
    TouchableOpacity
} from 'react-native';

var {height, width} = Dimensions.get('window');
import TabNavigator from 'react-native-tab-navigator';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LiveItem from './LiveItem';//直播首页
import PushStream from '../PushStream'//推流

export default class Live extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTab: 'LiveItem',
        };
    }

    componentDidMount() {

    }



    render() {
        return (
            <View style={styles.container}>
                {/*底部菜单*/}
                <TabNavigator tabBarStyle={styles.TabNavigator}>
                    <TabNavigator.Item
                        title='首页'
                        selected={this.state.selectedTab === 'LiveItem'}
                        selectedTitleStyle={styles.selectedTextStyle}
                        titleStyle={styles.textStyle}
                        renderIcon={() => <FontAwesome name='joomla' color='#777' size={24} />}
                        renderSelectedIcon={() => <FontAwesome name='joomla' color='orange' size={24} />}
                        onPress={() => this.setState({ selectedTab: 'LiveItem' })}>
                        <LiveItem {...this.props} upLogin={this.upLogin} goToLogin={this.goToLogin} />
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        title='开始直播'
                        selected={this.state.selectedTab === 'artist'}
                        selectedTitleStyle={styles.selectedTextStyle}
                        titleStyle={styles.textStyle}
                        renderIcon={() => <FontAwesome name='newspaper-o' color='#777' size={24} />}
                        renderSelectedIcon={() => <FontAwesome name='newspaper-o' color='orange' size={24} />}
                        onPress={() => this.setState({ selectedTab: 'artist' })}>
                        <PushStream {...this.props} upLogin={this.upLogin} goToLogin={this.goToLogin} />
                    </TabNavigator.Item>
                </TabNavigator>
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
    },
    scrollViewStyle:{
        flexDirection:'row',
        backgroundColor:'white',
        padding:10
    },
    itemViewStyle:{
        margin:8
    },
    imageStyle:{
        width:120,
        height:100,
        borderRadius:4
    },
    liveName:{
        //绝对定位
        position:'absolute',
        left:0,
        bottom:10,
        backgroundColor:'red',
        color:'white',
        padding:2
    },
    liveTitle:{
        textAlign:'center',
        marginTop:5
    },
    // 底部菜单
    tabBarStyle: {
        backgroundColor: '#fff'
    },
    textStyle: {
        color: '#777',
    },
    selectedTextStyle: {
        color: 'orange',
    }
})