import React, { Component, PropTypes } from 'react';
import {
    View,
    Text,
    Image,
    TouchableWithoutFeedback,
    StyleSheet,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Avatar } from 'react-native-elements';

export default class Card extends Component {

    static defaultProps = {
        title: '春来到',
        date: 'Jan 1st, 1970',
        intro: '春来到好牛逼的',
        goods: 0,
        comments: 0,
        trans: 0,
    }

    static propTypes = {
        title: PropTypes.string,
        date: PropTypes.string,
        intro: PropTypes.string,
        goods: PropTypes.number,
        comments: PropTypes.number,
        trans: PropTypes.number,
    }

    render() {
        return (
            <TouchableWithoutFeedback {...this.props}>
                <View style={{ backgroundColor: '#fff', marginHorizontal: 12, marginVertical: 6, padding: 12, borderRadius: 4 }}>
                    <View style={{ flex: 1, flexDirection: 'row', paddingBottom: 8, alignItems: 'center' }}>
                        <View style={{ width: 36 }}>
                            <Image
                                source={{ uri: 'http://img1.skqkw.cn:888/2014/12/06/08/21ofdtyslqn-62877.jpg' }}
                                style={{ width: 36, height: 36 }}
                            />
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', marginLeft: 12 }}>
                            <View><Text style={{ fontSize: 20 }}>{this.props.title}</Text></View>
                            <View><Text style={{ fontSize: 12, color: '#999' }}>{this.props.date}</Text></View>
                        </View>
                    </View>
                    <View style={{ paddingTop: 8 }}>
                        {/*<View><Image style={{width: 300, height: 168}} source={{ uri: 'http://www.gdrrc.com.cn/upload/front/project/20170711/1499759222030017001.jpg' }} /></View>*/}
                        <View><Text style={{ fontSize: 16 }}>{this.props.intro}</Text></View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12 }}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesome name='thumbs-o-up' size={20} />
                                <Text style={{ fontSize: 18 }}>  {this.props.goods}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesome name='comments-o' size={20} />
                                <Text style={{ fontSize: 18 }}>  {this.props.goods}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesome name='share-square-o' size={20} />
                                <Text style={{ fontSize: 18 }}>  {this.props.goods}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}