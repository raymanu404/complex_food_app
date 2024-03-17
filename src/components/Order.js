import React, { memo } from 'react'
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native'
import colors from '../../config/colors/colors'
import { Icon } from 'react-native-elements'

const width = Dimensions.get('screen').width
const order_container_width = width - 50
const order_container_height = 300
const backgroundImageOrder = require('../assets/shopping.png')

function Order(props) {
    const getStatusColor = () => {
        switch (props.status) {
            case 1:
                return colors.statusOrderPlaced
            case 2:
                return colors.statusOrderInProgress
            case 3:
                return colors.statusOrderDone
            default:
                return colors.statusOrderPlaced
        }
    }

    const getStatusOrder = () => {
        switch (props.status) {
            case 1:
                return 'Comanda plasata.'
            case 2:
                return 'Comanda in progres...'
            case 3:
                return 'Comanda este gata!'
            default:
                return 'Comanda plasata.'
        }
    }

    const getDateFormat = () => {
        const newFormatDate = String(props.datePlaced).split('T')
        const orderDate = newFormatDate[0]
        let orderTime = newFormatDate[1].slice(0, newFormatDate[1].length - 11)

        if (orderTime.length === 4) {
            orderTime = `${orderTime}0`
        }
        if (orderTime.length === 3) {
            orderTime = `${orderTime}00`
        }

        return `Data comanda: ${orderTime} / ${orderDate}`
    }
    return (
        <View style={styles.container}>
            {/* ---------------------------- HEADER-------------------- */}
            <View style={styles.header}>
                <Text style={styles.text_order}>{getDateFormat()}</Text>
                <Text style={styles.text_order}>
                    Discount comanda aplicata: {props.discount} % Reducere
                </Text>
            </View>
            <View style={[styles.orderContainer, { backgroundColor: getStatusColor() }]}>
                <ImageBackground
                    style={styles.order_info}
                    source={backgroundImageOrder}
                    resizeMode="cover"
                >
                    <Text style={styles.text_order}>Status comanda: {getStatusOrder()}</Text>
                </ImageBackground>
                <View style={styles.codeContainer}>
                    <Text style={styles.text_code}>
                        Cod comanda: <Text style={styles.text_order}>{props.code}</Text>
                    </Text>
                    <Icon
                        style={{ paddingLeft: 10 }}
                        name={'check-circle'}
                        type={'feather'}
                        color={colors.statusOrderDone}
                        size={26}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => props.goToOrderItems(props.orderId, props.totalPrice)}
                    activeOpacity={0.8}
                >
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Vezi produsele</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.backgroundApp
    },
    header: {
        backgroundColor: colors.backgroundApp,
        width: order_container_width,
        height: 50,
        marginBottom: -15,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16
    },
    orderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: order_container_height,
        width: order_container_width,
        marginTop: 10,
        marginBottom: 20,
        borderRadius: 16,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6
    },
    text_order: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '700',
        color: colors.backgroundButtonActive,
        letterSpacing: 1
    },
    text_code: {
        fontSize: 18,
        textAlign: 'center',
        fontWeight: '400',
        color: colors.blackGrey,
        letterSpacing: 1
    },
    order_info: {
        width: width - 80,
        borderRadius: 20,
        height: 200,
        backgroundColor: colors.backgroundBottomTabInactive,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    codeContainer: {
        paddingTop: 2,
        flexDirection: 'row'
    },
    button: {
        alignSelf: 'center',
        justifyContent: 'center',
        width: 150,
        height: 34,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 16,
        backgroundColor: colors.backgroundButtonActive,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 3
    },
    buttonText: {
        textAlign: 'center',
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1
    }
})

export default memo(Order)
