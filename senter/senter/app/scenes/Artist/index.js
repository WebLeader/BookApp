import React, { Component } from 'react';
import {
    View,
    ScrollView,
    InteractionManager,
    StyleSheet
} from 'react-native';
import Card from '../../components/Card';

import CWebView from '../WebView';

export default class Artist extends Component {

    constructor(props) {
        super(props);

        this.state = {
            artists: [],
        };
    }

    componentDidMount() {
        storage.load({ key: 'artistList' }).then(response => {
            this.setState({ artists: response});
        }).catch(error => {
            console.warn(error);
        });
    }

    onItemPress(item) {
        const { navigator } = this.props;
        {/*交互管理器*/}
        InteractionManager.runAfterInteractions(() => {
            navigator.push({
                component: CWebView,
                name: 'CWebView',
                //url: `http://www.igotit.com/Wap/artist?artist_id=${item.artist_id}`,
                url: item.url,
                title: item.title
                })
            console.warn('111',item.url);
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1, backgroundColor: '#efefef' }}>
                    {
                        this.state.artists.map(item => {
                            return (
                                <Card
                                    onPress={() => { this.onItemPress(item) }}
                                              title={item.title}
                                    intro={item.description.trim()} />
                                )
                    })
                    }
                </ScrollView>
            </View>
        )
    }
}