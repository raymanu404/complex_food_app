import React, { useState } from 'react'
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    Image,
    TouchableWithoutFeedback,
    Keyboard,
    FlatList,
    TouchableHighlight,
    ToastAndroid
} from 'react-native'
import { Icon } from 'react-native-elements'
import * as Animatable from 'react-native-animatable'
import colors from '../../../config/colors/colors'
import GestureFlipView from 'react-native-gesture-flip-card'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import RenderEmptyList from '../../components/RenderEmptyList'
import api_axios from '../../../config/api/api_axios'
import RenderToastMessage from '../../components/RenderToastMessage'

const height = Dimensions.get('screen').height
const width = Dimensions.get('screen').width
const menu_container_width = width - 50

function DetailsCategories({ navigation, route }) {
    const data = route.params.menuDataForCategories
    const [dataMenu, setDataMenu] = useState(data)
    const [showRenderToast, setShowRenderToast] = useState({
        success: false,
        fail: false
    })

    const [displayMessage, setDisplayMessage] = useState({
        successTitle: '',
        successMessage: '',
        failTitle: '',
        failMessage: ''
    })

    const buyerId = () => {
        if (data.length !== 0) {
            return data[0].buyerId
        }
        return 1
    }
    const resultBuyerId = buyerId()

    const RenderToastSuccess = (props) => {
        return (
            <RenderToastMessage
                multiplier={0.88}
                showComponent={props.showComponent}
                status={'success'}
                title_message={props.title_message}
                message={props.message}
            />
        )
    }

    const RenderToastFail = (props) => {
        return (
            <RenderToastMessage
                multiplier={0.88}
                showComponent={props.showComponent}
                status={'fail'}
                title_message={props.title_message}
                message={props.message}
            />
        )
    }

    const removeFromQuantity = (props) => {
        console.log(props.quantity)
        if (props.quantity > 0) {
            const newDataMenu = Object.assign({}, dataMenu)
            newDataMenu[props.myIndex].quantity = props.quantity - 1
            setDataMenu(newDataMenu)
        }
        setShowRenderToast({
            ...showRenderToast,
            success: false,
            fail: false
        })
    }

    const addToQuantity = (props) => {
        if (props.quantity < 20) {
            const newDataMenu = Object.assign({}, dataMenu)
            console.log(newDataMenu)
            newDataMenu[props.myIndex].quantity = props.quantity + 1

            setDataMenu(newDataMenu)
        }
        setShowRenderToast({
            ...showRenderToast,
            success: false,
            fail: false
        })
    }

    const addToCard = async (props) => {
        console.log(props.quantity)
        if (props.quantity > 0) {
            const addDetailsMenu = {
                key: dataMenu[props.myIndex].key,
                src: dataMenu[props.myIndex].src,
                title: dataMenu[props.myIndex].title,
                price: dataMenu[props.myIndex].price,
                category: dataMenu[props.myIndex].category,
                details: dataMenu[props.myIndex].details,
                quantity: dataMenu[props.myIndex].quantity + props.quantity
            }
            try {
                const dataToSend = {
                    productId: addDetailsMenu.key,
                    cantity: data[props.myIndex].quantity
                }
                console.log(dataToSend)
                const headers = {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                }
                const response = await api_axios.post(
                    `/shoppingItems/create/${resultBuyerId}`,
                    dataToSend,
                    headers
                )

                console.log(response.data)
                if (response.status === 201 || response.status === 200) {
                    // route.params.onGoBack(response.data);
                    setDisplayMessage({
                        ...displayMessage,
                        successTitle: 'Produs adaugat!',
                        successMessage: 'Produsul a fost adaugat cu succes in cos!'
                    })

                    setShowRenderToast({
                        ...showRenderToast,
                        success: true,
                        fail: false
                    })
                }
            } catch (error) {
                console.log(error.response.status)
                if (error.response.status === 400) {
                    setDisplayMessage({
                        ...displayMessage,
                        failTitle: 'Eroare!',
                        failMessage: 'Fonduri insuficiente!'
                    })

                    setShowRenderToast({
                        ...showRenderToast,
                        success: false,
                        fail: true
                    })
                }
            }
        }
    }

    const renderFront = (props) => {
        return (
            <View style={[styles.image_container, { backgroundColor: colors.white }]}>
                <Image source={{ uri: props.src }} style={styles.image} resizeMode="cover" />
                <Text style={[styles.title_menu, { color: colors.backgroundButtonActive }]}>
                    {props.title}
                </Text>
                <Text
                    style={[
                        styles.price_menu,
                        { color: colors.backgroundButtonActive, marginTop: -10 }
                    ]}
                >
                    {props.price} RON
                </Text>
                <View style={styles.buttonsAddRemoveQuantity}>
                    <TouchableOpacity activeOpacity={0.8}>
                        <View style={styles.button}>
                            <Icon
                                onPress={() => removeFromQuantity(props)}
                                name="remove-circle-outline"
                                type="ionicon"
                                size={40}
                                color={colors.backgroundButtonActive}
                            />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.quantityLabel}>
                        <Text
                            style={[
                                styles.title_menu,
                                {
                                    color: colors.backgroundButtonActive,
                                    fontSize: 28
                                }
                            ]}
                        >
                            {props.quantity}{' '}
                        </Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.8}>
                        <View style={styles.button}>
                            <Icon
                                onPress={() => addToQuantity(props)}
                                name="add-circle-outline"
                                type="ionicon"
                                size={40}
                                color={colors.backgroundButtonActive}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity activeOpacity={0.8}>
                    <View style={styles.buttonForCart}>
                        <Text style={styles.buttonText} onPress={() => addToCard(props)}>
                            Adauga in cos
                        </Text>
                    </View>
                </TouchableOpacity>
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
        <GestureFlipView width={menu_container_width} height={510}>
            {renderFront(props)}
            {renderBack(props)}
        </GestureFlipView>
    )

    const renderMenuItem = ({ item, index }) => (
        <MenuItem
            src={item.src}
            title={item.title}
            price={item.price}
            details={item.details}
            quantity={item.quantity}
            myIndex={index}
        />
    )

    return (
        <View style={styles.container}>
            <View style={{ position: 'absolute', top: 5, left: 5 }}>
                <Icon
                    name="arrowleft"
                    type="ant-design"
                    style={styles.icon}
                    size={26}
                    onPress={() => navigation.goBack()}
                />
            </View>
            <View
                style={[
                    styles.menu_container,
                    {
                        paddingBottom: showRenderToast.success || showRenderToast.fail ? 0 : 60
                    }
                ]}
            >
                {Array.from(data).length === 0 ? (
                    <RenderEmptyList title_message={'Momentan nu exista acest tip de produs!'} />
                ) : (
                    <>
                        <FlatList
                            data={data}
                            renderItem={renderMenuItem}
                            keyExtractor={(item) => item.key}
                        />
                    </>
                )}
                <>
                    {showRenderToast.success ? (
                        <RenderToastSuccess
                            showComponent={true}
                            title_message={displayMessage.successTitle}
                            message={displayMessage.successMessage}
                        />
                    ) : showRenderToast.fail ? (
                        <RenderToastFail
                            showComponent={true}
                            title_message={displayMessage.failTitle}
                            message={displayMessage.failMessage}
                        />
                    ) : null}
                </>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.backgroundApp
    },
    icon: {
        paddingTop: 3,
        paddingRight: width - 50
    },
    menu_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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
        marginBottom: 10,
        backgroundColor: colors.backgroundButtonActive
    },
    image: {
        width: menu_container_width,
        height: 320,
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
    button: {
        // marginTop: 10,
        marginBottom: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 100,
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2
    },
    buttonForCart: {
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        width: 150,
        height: 40,
        borderRadius: 16,
        backgroundColor: 'rgba(47, 134, 166, 1)',
        shadowColor: '#000000',
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
    },
    buttonsAddRemoveQuantity: {
        marginTop: 4,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    quantityLabel: {
        width: 60,
        height: 50,
        borderColor: colors.backgroundButtonActive,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    feedbackMessage: {
        textAlign: 'center',
        fontSize: 14,
        color: colors.backgroundButtonActive,
        fontWeight: '600'
    }
})
export default DetailsCategories
