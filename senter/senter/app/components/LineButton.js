import React, { Component, PropTypes } from 'react';

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

import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class LineButton extends Component {

    static defaultProps = {
        title: '条状按钮',
        onPress: () => { },
        rendIcon: () => { },
    };

    static propTypes = {
        title: PropTypes.string,
        onPress: PropTypes.func,
        rendIcon: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {}
    }

    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 12 }}>
                    <View style={{marginHorizontal: 18}}>
                        {this.props.rendIcon()}
                    </View>
                    <View style={{flex: 1}}>
                        <Text size={{fontSize: 18}}>{this.props.title}</Text>
                    </View>
                    <View style={{marginHorizontal: 18}}>
                        <FontAwesome name='chevron-right' size={14} color='#c0c0c0'/>
                    </View>
                </View>

            </TouchableOpacity>
        );
    }
}