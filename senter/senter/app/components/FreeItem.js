import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';

import EvilIcons from 'react-native-vector-icons/EvilIcons';

export default class FreeItem extends Component {

    static defaultProps = {
        title: '项目标题',
        onPress: () => {
            console.warn('空定义回调')
        },
        playList: [{title: '第275期 | 局内人和局外人'}]
    }

    static propTypes = {
        title: React.PropTypes.string,
        onPress: React.PropTypes.func,
        playList: React.PropTypes.array,
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <TouchableWithoutFeedback style={styles.contariner} onPress={this.props.onPress}>
                <View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6}}>
                        <View>
                            <Text style={styles.titleFont}>{this.props.title}</Text>
                        </View>
                        <View>
                            <Text style={styles.more}>查看全部></Text>
                        </View>
                    </View>
                    {
                        this.props.playList.slice(0, 2).map((item, key) => {
                            return (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        paddingVertical: 4
                                    }}>
                                    <EvilIcons name='play' size={18}/>
                                    <Text style={styles.itemFont}>{item.title}</Text>
                                </View>
                            );
                        })
                    }
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    contariner: {
        flex: 1
    },
    titleFont: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    itemFont: {
        fontSize: 12,
    },
    more: {
        fontSize: 12,
        color: '#c6c6c6',
    }
});