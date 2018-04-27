import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';

import FreeItem from './FreeItem';

export default class FreeHomeList extends Component {

    static defaultProps = {
        title: '免费专区',
        onPress: () => {
            console.warn('空定义回调')
        },
        areaList: [],
    }

    static propTypes = {
        title: React.PropTypes.string,
        onPress: React.PropTypes.func,
        areaList: React.PropTypes.array,
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={styles.contariner}>
                <View style={styles.FreeTitle}>
                    <Text style={styles.titleFont}>{this.props.title}</Text>
                </View>
                <View style={{borderColor: '#e6e6e6', borderTopWidth: 1}}></View>
                <View>
                    {
                        this.props.areaList.slice(0, 2).map((item, key) => {
                            return (
                                <FreeItem
                                    title={item.title}
                                    playList={item.subList}
                                    onPress={() => {
                                        this.props.onPress(item)
                                    }}
                                />
                            )
                        })
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    contariner: {
        flex: 1,
        marginVertical: 8,
        paddingVertical: 8,
        paddingHorizontal: 8,
        backgroundColor: '#fff',
    },
    FreeTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6
    },
    titleFont: {
        fontSize: 16,
        fontWeight: 'bold'
    }
});