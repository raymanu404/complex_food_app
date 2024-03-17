import React from 'react'
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native'

import colors from '../../config/colors/colors'

const width = Dimensions.get('screen').width
const ticket_container_width = width - 50
const ticket_container_height = 150

function Coupon(props) {
    const typeOfCoupon = (type) => {
        switch (type) {
            case 1:
                return '10% reducere'
            case 2:
                return '20% reducere'
            case 3:
                return '30% reducere'
            default:
                return '10% reducere'
        }
    }
    const getDateFormat = () => {
        const newFormatDate = String(props.dateCreated).split('T')
        const orderDate = newFormatDate[0]
        let orderTime = newFormatDate[1].slice(0, newFormatDate[1].length - 11)
        if (orderTime.length === 4) {
            orderTime = `${orderTime}0`
        }
        if (orderTime.length === 3) {
            orderTime = `${orderTime}00`
        }
        return `Cupon achizitionat: ${orderTime} / ${orderDate}`
    }
    return (
        <View
            style={
                props.type === 1
                    ? styles.ticket_container10
                    : props.type === 2
                    ? styles.ticket_container20
                    : props.type === 3
                    ? styles.ticket_container30
                    : styles.ticket_container10
            }>
            <Text style={styles.text_ticket}>{getDateFormat()}</Text>
            <View style={styles.ticket_info}>
                <Text style={styles.text_reducere}>Tip cupon: {typeOfCoupon(props.type)}</Text>
                <Text style={styles.text_reducere}>
                    Cod cupon: <Text style={styles.text_ticket}>{props.code}</Text>
                </Text>
            </View>
            <TouchableOpacity onPress={props.applyCoupon} activeOpacity={0.8}>
                {!props.userMode ? (
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Aplica cupon</Text>
                    </View>
                ) : null}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    ticket_container10: {
        justifyContent: 'center',
        alignItems: 'center',
        height: ticket_container_height,
        width: ticket_container_width,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 16,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
        backgroundColor: colors.ticket10
    },
    ticket_container20: {
        justifyContent: 'center',
        alignItems: 'center',
        height: ticket_container_height,
        width: ticket_container_width,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 16,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
        backgroundColor: colors.ticket20
    },
    ticket_container30: {
        justifyContent: 'center',
        alignItems: 'center',
        height: ticket_container_height,
        width: ticket_container_width,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 16,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
        backgroundColor: colors.ticket30
    },
    text_ticket: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '700',
        color: colors.white,
        letterSpacing: 1
    },
    text_reducere: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '400',
        color: colors.white,
        letterSpacing: 1
    },
    ticket_info: {
        width: width - 80,
        borderRadius: 16,
        height: 80,
        backgroundColor: colors.backgroundButtonActive,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        alignSelf: 'center',
        justifyContent: 'center',
        width: 150,
        height: 34,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 16,
        backgroundColor: colors.colorBottomInactiveText,
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

export default Coupon
