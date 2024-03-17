import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, Dimensions, FlatList, Image } from 'react-native'
import GestureFlipView from 'react-native-gesture-flip-card'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { Icon } from 'react-native-elements'
import * as Animatable from 'react-native-animatable'
import api_axios from '../../../config/api/api_axios'
import colors from '../../../config/colors/colors'
import RenderEmptyList from '../../components/RenderEmptyList'
import Loading from '../loading'

const height = Dimensions.get('screen').height
const width = Dimensions.get('screen').width
const menu_container_width = width - 50

function OrderItemsScreen({ navigation, route }) {
    const orderId = route.params.orderId
    const totalPrice = route.params.totalPrice
    const [orderItems, setOrderItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getOrderItemAsync = async () => {
            try {
                const headers = {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                }

                const response = await api_axios.get(`/orderItems/${orderId}`, headers)
                if (response.status === 200) {
                    setOrderItems(response.data)
                    console.log(response.data)
                }
            } catch (error) {
                console.log(error.response.status)
            }
            setLoading(false)
        }
        getOrderItemAsync()
    }, [orderId])

    if (loading) {
        return <Loading />
    }

    const renderFront = (props) => {
        return (
            <View style={[styles.image_container, { backgroundColor: colors.white }]}>
                <Image source={{ uri: props.src }} style={styles.image} resizeMode="cover" />
                <Text style={[styles.title_menu, { color: colors.backgroundButtonActive }]}>
                    {props.title}
                </Text>

                <View style={styles.quantityLabel}>
                    <Text
                        style={[
                            styles.title_menu,
                            {
                                color: colors.backgroundButtonActive
                            }
                        ]}
                    >
                        Cantitate:
                        {props.quantity}{' '}
                    </Text>
                    <Text style={[styles.price_menu, { color: colors.backgroundButtonActive }]}>
                        Pret:
                        {props.price} RON
                    </Text>
                </View>
            </View>
        )
    }

    const renderBack = (props) => {
        return (
            <View style={[styles.image_container, { width: menu_container_width }]}>
                <Text style={styles.title_menu}>{props.title}</Text>
                <Text style={styles.price_menu}>{props.price} RON</Text>
                <Text style={[styles.details_text, { fontWeight: '700', marginBottom: -10 }]}>
                    Detalii produs
                </Text>
                <ScrollView>
                    <Text style={styles.details_text}>{props.details} </Text>
                </ScrollView>
            </View>
        )
    }

    const MenuItem = (props) => (
        <GestureFlipView width={menu_container_width} height={height * 0.47}>
            {renderFront(props)}
            {renderBack(props)}
        </GestureFlipView>
    )

    const renderMenuItem = ({ item, index }) => (
        <MenuItem
            src={item.image}
            title={item.title}
            price={item.price}
            details={item.description}
            quantity={item.cantity}
            myIndex={index}
        />
    )

    return (
        <View style={styles.itemsContainer}>
            <View style={styles.backButton}>
                <Icon
                    name="arrowleft"
                    type="ant-design"
                    style={styles.icon}
                    size={26}
                    onPress={() => navigation.goBack()}
                />
            </View>
            <View style={styles.menu_container}>
                {orderItems.length !== 0 ? (
                    <>
                        <FlatList
                            data={orderItems}
                            keyExtractor={(item) => item.orderItemId}
                            renderItem={renderMenuItem}
                        />

                        <View style={styles.button}>
                            <Text style={styles.buttonText}>
                                Total comanda:{' '}
                                <Text style={styles.buttonTextPrice}>{totalPrice} RON</Text>
                            </Text>
                        </View>
                    </>
                ) : (
                    <RenderEmptyList title_message="Nu aveti produse in aceasta comanda!" />
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    itemsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    backButton: {
        position: 'absolute',
        top: 5,
        left: 5
    },
    menu_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 60
    },
    image_container: {
        marginTop: 20,
        flex: 1,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 3,
        marginBottom: 5,
        backgroundColor: colors.backgroundButtonActive
    },
    image: {
        width: menu_container_width,
        height: 260,
        borderRadius: 16
    },
    title_menu: {
        marginTop: 10,
        textAlign: 'center',
        fontSize: 18,
        color: colors.white,
        fontWeight: 'bold'
    },
    price_menu: {
        marginTop: 12,
        textAlign: 'right',
        fontSize: 16,
        color: colors.white,
        fontWeight: '700',
        paddingRight: 10
    },
    details_text: {
        paddingVertical: 10,
        margin: 10,
        textAlign: 'left',
        fontSize: 18,
        color: colors.white,
        fontWeight: '600'
    },
    quantityLabel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10
    },
    button: {
        marginTop: 10,
        marginBottom: 10,
        display: 'flex',
        alignSelf: 'center',
        justifyContent: 'center',
        width: width - 40,
        height: 42,
        borderRadius: 16,
        backgroundColor: colors.backgroundButtonActive,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6
    },
    buttonText: {
        textAlign: 'center',
        color: colors.white,
        fontWeight: '500',
        fontSize: 16,
        letterSpacing: 1
    },
    buttonTextPrice: {
        textAlign: 'center',
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1
    }
})
export default OrderItemsScreen
