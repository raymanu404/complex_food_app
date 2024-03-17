import React, { useState, useContext, useEffect } from 'react'
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    Image,
    TouchableOpacity,
    TextInput,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    TouchableHighlight,
    ToastAndroid,
    Alert
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import colors from '../../../config/colors/colors'
import Ticket from '../../components/Ticket'
import { UserContext } from '../../../App'
import api_axios from '../../../config/api/api_axios'
import RenderToastMessage from '../../components/RenderToastMessage'

const height = Dimensions.get('screen').height
const width = Dimensions.get('screen').width
const menu_container_width = width - 50

function Tickets({ navigation }) {
    const [userDataLogin, setUserDataLogin] = useContext(UserContext)
    const buyerID = userDataLogin.id
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

    const [userInfo, setUserInfo] = useState({
        balance: 0
    })

    useFocusEffect(
        React.useCallback(() => {
            const getUserDataFromApi = async () => {
                try {
                    const headers = {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                    }
                    const response = await api_axios.get(`/buyers/${buyerID || 2}`, headers)

                    if (response.status === 200) {
                        setUserInfo({
                            ...userInfo,
                            balance: response.data.balance
                        })
                        console.log(response.data.balance)
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            setShowRenderToast({
                ...showRenderToast,
                success: false,
                fail: false
            })
            getUserDataFromApi()
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    )

    const showToastWithGravity = (message) => {
        ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, ToastAndroid.CENTER)
    }

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

    const paymentHandler = (amount, type) => {
        try {
            setShowRenderToast({
                ...showRenderToast,
                success: false,
                fail: false
            })
            const headers = {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
            }

            const total_price = type === 1 ? 10 : type === 2 ? 30 : type === 3 ? 50 : 0
            if (userInfo.balance >= total_price) {
                Alert.alert(
                    'Acceptare tranzactie',
                    `Doriti sa faceti plata pentru ${amount} cupoane in valoare de ${
                        type === 1 ? 10 : type === 2 ? 30 : type === 3 ? 50 : 1
                    } RON`,
                    [
                        {
                            text: 'NU',
                            style: 'cancel'
                        },
                        {
                            text: 'DA',
                            onPress: async () => {
                                const data = {
                                    type
                                }

                                const response = await api_axios.post(
                                    `/coupons/buy_coupons/${buyerID}`,
                                    data,
                                    headers
                                )

                                if (response.status === 201) {
                                    setDisplayMessage({
                                        ...displayMessage,
                                        successTitle: 'Tranzactie reusita!',
                                        successMessage: 'Tranzactia a fost realizata cu succes!'
                                    })

                                    const getBalance = String(response.data).split('!')[1]
                                    setShowRenderToast({
                                        ...showRenderToast,
                                        success: true,
                                        fail: false
                                    })
                                    setUserInfo({
                                        ...userInfo,
                                        balance: Number(getBalance)
                                    })
                                }
                            }
                        }
                    ]
                )
            } else {
                setDisplayMessage({
                    ...displayMessage,
                    failTitle: 'Eroare!',
                    failMessage: 'Fonduri insuficiente pentru aceasta tranzactie!'
                })

                setShowRenderToast({
                    ...showRenderToast,
                    success: false,
                    fail: true
                })
            }
        } catch (error) {
            setDisplayMessage({
                ...displayMessage,
                failTitle: 'Eroare!',
                failMessage: 'Eroare in cumpararea cupoanelor!'
            })

            setShowRenderToast({
                ...showRenderToast,
                success: false,
                fail: true
            })
        }
    }

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                Keyboard.dismiss()
            }}
        >
            <View style={styles.container}>
                <View style={styles.balance_container}>
                    <Text style={styles.text_balance}>
                        Sold disponibil : {Number(userInfo.balance).toFixed(2)} RON
                    </Text>
                </View>
                <ScrollView style={{ marginBottom: 20 }}>
                    {/* TICKET 10 RON  */}
                    <Ticket
                        reducere={10}
                        pret={10}
                        cupoane={'1 Cupon'}
                        payCoupon={() => paymentHandler(1, 1)}
                        type={1}
                    />
                    {/* TICKET 30 RON  */}
                    <Ticket
                        reducere={20}
                        pret={30}
                        cupoane={'3 Cupoane'}
                        payCoupon={() => paymentHandler(3, 2)}
                        type={2}
                    />
                    {/* TICKET 50 RON  */}
                    <Ticket
                        reducere={30}
                        pret={50}
                        cupoane={'5 Cupoane'}
                        payCoupon={() => paymentHandler(5, 3)}
                        type={3}
                    />
                </ScrollView>
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
        </TouchableWithoutFeedback>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height,
        backgroundColor: colors.backgroundApp
    },
    balance_container: {
        flex: 1,
        width,
        height: 50,
        backgroundColor: colors.backgroundBottomTabInactive,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text_balance: {
        fontSize: 20,
        color: colors.white,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    ticket_container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        height: 200,
        width: menu_container_width,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 16,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
        backgroundColor: colors.white
    },
    ticket: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: menu_container_width - 40,
        height: 180,
        backgroundColor: colors.backgroundBottomTabInactive,
        borderRadius: 12
    },
    ticket_inner: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginTop: 10
    },
    text_ticket: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '700'
    },
    ticket_info: {
        width: 150,
        height: 110,
        backgroundColor: colors.blackGrey,
        marginRight: 20,
        justifyContent: 'center'
    },
    ticket_price: {
        width: 110,
        height: 110,
        backgroundColor: colors.white,
        justifyContent: 'center'
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
    text_reducere: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '500',
        color: colors.black
    },
    emptyDiv: {
        marginBottom: 60
    }
})
export default Tickets
