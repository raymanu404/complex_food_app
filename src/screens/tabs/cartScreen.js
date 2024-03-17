import React, { useState, useContext, useEffect } from 'react'
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    Image,
    TouchableWithoutFeedback,
    Keyboard,
    FlatList
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import GestureFlipView from 'react-native-gesture-flip-card'
import colors from '../../../config/colors/colors'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { Icon } from 'react-native-elements'
import { UserContext } from '../../../App'
import RenderEmptyList from '../../components/RenderEmptyList'
import RenderToastMessage from '../../components/RenderToastMessage'
import ConfirmedOrder from '../../components/ConfirmedOrder'
import api_axios from '../../../config/api/api_axios'
import Loading from '../loading'

const height = Dimensions.get('screen').height
const width = Dimensions.get('screen').width
const menu_container_width = width - 50
const PRICE_OF_COUPON = 10

function Cart({ navigation }) {
    const [menuDataInCart, setMenuDataInCart] = useState([])
    const [loading, setLoading] = useState(true)
    const [userDataLogin, setUserDataLogin] = useContext(UserContext)
    const buyerID = userDataLogin.id || 1
    const [couponCode, setCouponCode] = useState({
        couponCode: 'default',
        typeOfCoupon: 0
    })

    const [totalPrice, setTotalPrice] = useState(0)
    const [originalTotalPrice, setOriginalTotalPrice] = useState(0)
    const [confirmCart, setConfirmCart] = useState({
        confirmed: false,
        orderCode: ''
    })
    const [displayMessage, setDisplayMessage] = useState({
        successTitle: '',
        successMessage: '',
        failTitle: '',
        failMessage: ''
    })
    const [showRenderToast, setShowRenderToast] = useState({
        success: false,
        fail: false
    })

    useFocusEffect(
        React.useCallback(() => {
            const getDataFromCart = async () => {
                try {
                    const headers = {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                    }
                    const response = await api_axios.get(
                        `/shoppingItems/get_items/${buyerID}`,
                        headers
                    )
                    const itemsFromApi = response.data
                    if (response.status === 200) {
                        let sum = 0.0
                        itemsFromApi.map((element) => {
                            sum += element.price * element.cantity
                        })

                        setMenuDataInCart(response.data)
                        setConfirmCart({
                            ...confirmCart,
                            confirmed: false
                        })
                        if (couponCode.typeOfCoupon === 0) {
                            setTotalPrice(sum.toFixed(2))
                            setOriginalTotalPrice(sum.toFixed(2))
                        }
                    }
                } catch (error) {
                    console.log(error.response.status)
                }
                setLoading(false)
            }
            setShowRenderToast({
                ...showRenderToast,
                success: false,
                fail: false
            })
            console.log(String(couponCode.couponCode))

            getDataFromCart()
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    )

    if (loading) {
        return <Loading />
    }

    const RenderToastSuccess = (props) => {
        return (
            <RenderToastMessage
                multiplier={0.8}
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
                multiplier={0.8}
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
            const newDataMenu = Object.assign({}, menuDataInCart)
            newDataMenu[props.myKey].quantity = props.quantity - 1
            setMenuDataInCart(newDataMenu)
            const newTotalPrice =
                totalPrice -
                Number(newDataMenu[props.myKey].quantity) * Number(newDataMenu[props.myKey].price)
            setTotalPrice(newTotalPrice)
        }
    }

    const addToQuantity = (props) => {
        const newDataMenu = Object.assign({}, menuDataInCart)
        for (const i in newDataMenu) {
            if (newDataMenu[i].id === props.myKey) {
                console.log(newDataMenu[i])
                console.log(props)
                newDataMenu[i].cantity = props.quantity + 1

                // let newTotalPrice =
                //   totalPrice -
                //   Number(newDataMenu[i].quantity) * Number(newDataMenu[i].price);
                // setTotalPrice(newTotalPrice);
            }
        }
    }

    // Remove item from cart
    const removeItemFromCart = async (props) => {
        console.log(props)

        try {
            const headers = {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
            }
            const itemToDelete = {
                productId: props.myKey,
                cantity: 0
            }
            const reponseDeleteItem = await api_axios.post(
                `/shoppingItems/create/${buyerID}`,
                itemToDelete,
                headers
            )
            if (
                reponseDeleteItem.status === 200 &&
                reponseDeleteItem.data === 'Item was deleted successesfully!'
            ) {
                setMenuDataInCart((myNewMenu) => myNewMenu.filter((el) => el.id !== props.myKey))

                if (menuDataInCart.length === 0) {
                    setCouponCode({
                        ...couponCode,
                        couponCode: 'default',
                        typeOfCoupon: 0
                    })
                }
                const newTotalPrice = totalPrice - Number(props.price) * Number(props.quantity)
                setTotalPrice(newTotalPrice)
                setDisplayMessage({
                    ...displayMessage,
                    successTitle: 'Succes!',
                    successMessage: 'Produsul a fost sters din cos!'
                })

                setShowRenderToast({
                    ...showRenderToast,
                    success: true,
                    fail: false
                })
            }
        } catch (error) {
            console.log(error.response.status)
        }
    }

    const renderFront = (props) => {
        return (
            <View style={[styles.image_container, { backgroundColor: colors.white }]}>
                <Image source={{ uri: props.src }} style={styles.image} resizeMode="cover" />
                <Text style={[styles.title_menu, { color: colors.backgroundButtonActive }]}>
                    {props.title}
                </Text>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        marginTop: -10
                    }}
                >
                    {/* <View style={styles.buttonsAddRemoveQuantity}>
            <TouchableOpacity activeOpacity={0.8}>
              <View style={styles.buttonAddRemove}>
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
                    fontSize: 28,
                  },
                ]}>
                {props.quantity}{' '}
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.8}>
              <View style={styles.buttonAddRemove}>
                <Icon
                  onPress={() => addToQuantity(props)}
                  name="add-circle-outline"
                  type="ionicon"
                  size={40}
                  color={colors.backgroundButtonActive}
                />
              </View>
            </TouchableOpacity>
          </View> */}
                    <View
                        style={{
                            flexDirection: 'column',
                            justifyContent: 'space-evenly',
                            marginTop: -10
                        }}
                    >
                        <Text style={[styles.price_menu, { color: colors.backgroundButtonActive }]}>
                            Cantitate: {props.quantity}
                        </Text>
                        <Text style={[styles.price_menu, { color: colors.backgroundButtonActive }]}>
                            Sub total produs : {props.price * props.quantity} RON
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.icon_trash} activeOpacity={0.6}>
                        <Icon
                            onPress={() => removeItemFromCart(props)}
                            name={'trash-bin-outline'}
                            type={'ionicon'}
                            size={32}
                            color={colors.recycleBin}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const renderBack = (props) => {
        return (
            <View style={[styles.image_container, { width: menu_container_width }]}>
                <Text style={[styles.title_menu, { color: colors.white }]}>{props.title}</Text>
                <Text style={[styles.price_menu, { textAlign: 'right' }]}>{props.price} RON</Text>
                <Text style={[styles.details_text, { fontWeight: '700', marginBottom: -10 }]}>
                    Detalii Produs
                </Text>
                <ScrollView style={{ flex: 1 }}>
                    <Text style={styles.details_text}>{props.details} </Text>
                </ScrollView>
            </View>
        )
    }

    const MenuItem = (props) => (
        <GestureFlipView width={menu_container_width} height={440}>
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
            myKey={item.id}
            quantity={item.cantity}
            dateCreate={item.dateCreated}
        />
    )

    const setCodeCouponHandler = (code, typeOfDiscount) => {
        console.log(typeOfDiscount)
        let discount = 1
        let newTotalPriceWithDiscount = 0
        switch (Number(typeOfDiscount)) {
            case 1:
                discount = 10
                break
            case 2:
                discount = 20
                break
            case 3:
                discount = 30
                break
            default:
                discount = 10
                break
        }

        newTotalPriceWithDiscount =
            totalPrice - (originalTotalPrice * discount) / 100 - PRICE_OF_COUPON
        setTotalPrice(newTotalPriceWithDiscount)
        setCouponCode({
            ...couponCode,
            couponCode: code,
            typeOfCoupon: typeOfDiscount
        })
    }

    const applyUserCouponHandler = () => {
        if (totalPrice >= 12) {
            navigation.navigate('CouponsListScreen', {
                buyerID,
                onGoBack: setCodeCouponHandler
            })
        } else {
            setDisplayMessage({
                ...displayMessage,
                failTitle: 'Comanda minima!',
                failMessage: 'Pentru aplicarea cupoanelor suma totala este de 12 RON!'
            })

            setShowRenderToast({
                ...showRenderToast,
                success: false,
                fail: true
            })
        }
    }

    const deleteCartHandler = async () => {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
            }

            const response = await api_axios.delete(`/carts/delete/${buyerID}`, headers)
            setCouponCode({
                ...couponCode,
                couponCode: 'default',
                typeOfCoupon: 0
            })

            const responseMessage = response.data
            if (String(responseMessage) === 'Success!') {
                setDisplayMessage({
                    ...displayMessage,
                    successTitle: 'Succes!',
                    successMessage: 'Cosul a fost sters cu succes!'
                })

                setShowRenderToast({
                    ...showRenderToast,
                    success: true,
                    fail: false
                })

                setTimeout(() => {
                    setMenuDataInCart([])
                }, 500)
            }
        } catch (error) {
            console.log(error.response.status)
            setDisplayMessage({
                ...displayMessage,
                failTitle: 'Cos inexistent!',
                failMessage: 'Cosul nu a fost gasit!'
            })

            setShowRenderToast({
                ...showRenderToast,
                success: false,
                fail: true
            })
        }
    }

    const checkoutBalanceRedirectOnPaymentScreen = (balance) => {
        if (balance >= totalPrice) {
            return true
        } else {
            const userInfoObj = {
                buyerId: buyerID,
                email: userDataLogin.email,
                firstName: userDataLogin.firstName,
                lastName: userDataLogin.lastName,
                phoneNumber: userDataLogin.phoneNumber
            }
            navigation.navigate('PayDeskScreen', {
                userInfo: userInfoObj
            })
        }
    }

    const confirmCommandHandler = async () => {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
            }
            if (checkoutBalanceRedirectOnPaymentScreen(userDataLogin.balance)) {
                const couponCodeFromBuyer = {
                    couponCart: couponCode.couponCode
                }

                const response = await api_axios.patch(
                    `/carts/confirm/${buyerID}`,
                    couponCodeFromBuyer,
                    headers
                )

                console.log(response.data)
                const orderCodeFromResponse = response.data
                if (String(orderCodeFromResponse).startsWith('OrderCode')) {
                    const orderCode = String(orderCodeFromResponse).split(':')[1]
                    setCouponCode({
                        ...couponCode,
                        couponCode: 'ordered',
                        typeOfCoupon: 0
                    })
                    setConfirmCart({
                        ...confirmCart,
                        confirmed: true,
                        orderCode
                    })
                    setDisplayMessage({
                        ...displayMessage,
                        successTitle: 'Comanda plasata!',
                        successMessage: 'Comanda dumneavoastra a fost plasata!'
                    })

                    setShowRenderToast({
                        ...showRenderToast,
                        success: true,
                        fail: false
                    })
                    setTimeout(() => {
                        setMenuDataInCart([])
                    }, 1000)
                }
                // navigation.goBack();
            }
        } catch (error) {
            console.log(error.response.status)
            setDisplayMessage({
                ...displayMessage,
                failTitle: 'Eroare!',
                failMessage: 'Eroare la confirmarea cosului!'
            })

            setShowRenderToast({
                ...showRenderToast,
                success: false,
                fail: true
            })
        }
    }
    return (
        <View style={styles.container}>
            {menuDataInCart.length !== 0 ? (
                <View style={styles.menu_container}>
                    <FlatList
                        renderItem={renderMenuItem}
                        keyExtractor={(item) => item.id}
                        data={menuDataInCart}
                    />
                    <View style={styles.payment_container}>
                        <View style={styles.payment_view}>
                            <View style={styles.couponContainer}>
                                <TouchableOpacity activeOpacity={0.8}>
                                    <View style={styles.button}>
                                        <Text
                                            style={styles.buttonText}
                                            onPress={applyUserCouponHandler}
                                        >
                                            Aplica Cupon
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <Text style={styles.textCouponCode}>
                                    {couponCode.typeOfCoupon === 0
                                        ? ''
                                        : String(`Discount: ${couponCode.typeOfCoupon}0% reducere`)}
                                </Text>
                            </View>

                            <View
                                style={[
                                    styles.button,
                                    { backgroundColor: colors.white, width: 160, marginBottom: 30 }
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.buttonText,
                                        { color: colors.black, fontSize: 16 }
                                    ]}
                                >
                                    Total: {totalPrice} RON
                                </Text>
                            </View>
                        </View>

                        <View style={styles.deleteCartIcon}>
                            <Text style={styles.textDeleteCart}>Golire cos</Text>
                            <Icon
                                onPress={() => deleteCartHandler()}
                                name={'cart-remove'}
                                type={'material-community'}
                                size={32}
                                color={colors.recycleBin}
                            />
                        </View>
                        <TouchableOpacity activeOpacity={0.8}>
                            <View style={styles.button}>
                                <Text
                                    style={styles.buttonText}
                                    onPress={() => confirmCommandHandler()}
                                >
                                    Plateste
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : confirmCart.confirmed ? (
                <ConfirmedOrder
                    title_message="Multumim pentru comanda!"
                    orderCode={confirmCart.orderCode}
                />
            ) : (
                <RenderEmptyList title_message={'Cosul este gol!'} />
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
                ) : (
                    <View style={styles.emptyDiv}></View>
                )}
            </>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.backgroundApp
    },
    icon_trash: {
        display: 'flex',
        // left: menu_container_width - 210,
        marginTop: -3
    },
    cart_empty_container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: menu_container_width,
        height: 320,
        backgroundColor: colors.white,
        borderRadius: 16
    },
    menu_container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
        // paddingBottom: 60,
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
        height: 300,
        borderRadius: 16
    },
    title_menu: {
        paddingBottom: 25,
        paddingVertical: 8,
        fontSize: 18,
        textAlign: 'center',
        color: colors.blackGrey,
        fontWeight: '700'
    },
    price_menu: {
        textAlign: 'left',
        fontSize: 17,
        color: colors.white,
        paddingRight: 10,
        fontWeight: '700'
    },
    details_text: {
        paddingVertical: 10,
        paddingBottom: 10,
        margin: 10,
        textAlign: 'left',
        fontSize: 18,
        color: colors.white,
        fontWeight: '600'
    },
    button: {
        alignSelf: 'center',
        justifyContent: 'center',
        width: 140,
        height: 40,
        marginBottom: 10,
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
    payment_container: {
        paddingTop: 2,
        alignItems: 'center'
    },
    payment_view: {
        paddingBottom: 20,
        width: menu_container_width,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center'
    },
    deleteCartIcon: {
        flexDirection: 'row',
        marginTop: -10,
        width: 100,
        marginLeft: width * 0.65,
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    textDeleteCart: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.recycleBin,
        letterSpacing: 1
    },
    couponContainer: {
        // marginTop: 20,
        flexDirection: 'column'
    },
    textCouponCode: {
        textAlign: 'center',
        fontSize: 16,
        color: colors.backgroundButtonActive,
        fontWeight: '500',
        paddingLeft: 5
    },
    buttonsAddRemoveQuantity: {
        marginTop: 4,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    quantityLabel: {
        // width: 60,
        // height: 50,
        // borderColor: colors.backgroundButtonActive,
        // justifyContent: 'flex-start',
        // alignItems: 'center',
    },
    buttonAddRemove: {
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
        shadowRadius: 1.41
    },
    emptyDiv: {
        marginBottom: 60
    }
})

export default Cart
