import React, { useState, useEffect } from 'react'

import {
    View,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    TextInput,
    TouchableHighlight,
    Dimensions,
    TouchableOpacity,
    Animated
} from 'react-native'
import { Icon } from 'react-native-elements'
import * as Animatable from 'react-native-animatable'
import api_axios from '../../../config/api/api_axios'
import colors from '../../../config/colors/colors'
import RenderEmailImage from '../../components/RenderEmailImage'
import RenderToastMessage from '../../components/RenderToastMessage'

const height = Dimensions.get('screen').height
const width = Dimensions.get('screen').width

function SendEmail({ navigation, route }) {
    const [onFocusInput, setOnFocusInput] = useState({
        emailOnFocus: false
    })

    const [userInfo, setUserInfo] = useState({
        email: ''
    })

    const [invalidInput, setInvalidInput] = useState({
        emailError: false,
        emptyFiledsError: ''
    })
    const [showRenderToast, setShowRenderToast] = useState({
        success: false,
        fail: false
    })

    useEffect(() => {
        return () => {
            setUserInfo({
                ...userInfo,
                email: ''
            })
            setShowRenderToast({
                ...showRenderToast,
                success: false,
                fail: false
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // EMAIL TEXT HANDLER
    const emailTextHandler = (val) => {
        if (String(val).length !== 0 && validateEmail(val)) {
            setUserInfo({
                ...userInfo,
                email: val
            })

            setInvalidInput({
                ...invalidInput,
                emailError: false,
                emptyFiledsError: ''
            })
        } else {
            setUserInfo({
                ...userInfo,
                email: val
            })
            setInvalidInput({
                ...invalidInput,
                emailError: true
            })
        }

        if (String(val).length !== 0) {
            setInvalidInput({
                ...invalidInput,
                emailError: false,
                emptyFiledsError: ''
            })
        }
        setShowRenderToast({
            ...showRenderToast,
            success: false,
            fail: false
        })
    }

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
    }

    const RenderToastSuccess = (props) => {
        return (
            <RenderToastMessage
                multiplier={0.72}
                showComponent={props.showComponent}
                status={'success'}
                title_message={'Succes!'}
                message={'Emailul a fost trimis cu succes!'}
            />
        )
    }

    const RenderToastFail = (props) => {
        return (
            <RenderToastMessage
                multiplier={0.72}
                showComponent={props.showComponent}
                status={'fail'}
                title_message={'Eroare!'}
                message={'Emailul este invalid!'}
            />
        )
    }

    const sendEmailHandler = async () => {
        try {
            const verifyValidData = !invalidInput.emailError
            const emptyFields = userInfo.email !== ''
            if (
                verifyValidData &&
                emptyFields &&
                String(userInfo.email).length !== 0 &&
                validateEmail(userInfo.email)
            ) {
                setShowRenderToast({
                    ...showRenderToast,
                    success: false,
                    fail: false
                })

                setInvalidInput({
                    ...invalidInput,
                    emailError: false,
                    emptyFiledsError: ''
                })

                const dataToSend = {
                    email: userInfo.email
                }

                const responseSendEmail = await api_axios.post(
                    '/buyers/forgot-password',
                    dataToSend
                )
                console.log(responseSendEmail.data)

                if (responseSendEmail.status === 200) {
                    if (String(responseSendEmail.data).startsWith('A fost trimis mailul!')) {
                        setShowRenderToast({
                            ...showRenderToast,
                            success: true,
                            fail: false
                        })
                        setUserInfo({
                            ...userInfo,
                            email: ''
                        })
                        setTimeout(() => {
                            const getUserId = String(responseSendEmail.data).split('!')[1]
                            navigation.navigate('ConfirmCodeScreen', {
                                idUser: Number(getUserId),
                                forgotPassword: true
                            })
                        }, 1000)
                    }
                }
            } else {
                setShowRenderToast({
                    ...showRenderToast,
                    success: false,
                    fail: true
                })
                setInvalidInput({
                    ...invalidInput,
                    emailError: true,
                    emptyFiledsError: 'Emailul este necompletat/invalid!'
                })
            }
        } catch (error) {
            setShowRenderToast({
                ...showRenderToast,
                success: false,
                fail: true
            })
            console.log(error.response)
        }
    }

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                Keyboard.dismiss()
            }}
        >
            <View style={styles.container}>
                <TouchableOpacity style={styles.iconBack} onPress={() => navigation.goBack()}>
                    <Icon name={'arrow-left'} type="feather" color={colors.black} />
                </TouchableOpacity>
                <RenderEmailImage title_message={'Introduceti emailul dumneavoastra!'} />
                <View style={styles.displayColumn}>
                    <View
                        style={
                            onFocusInput.emailOnFocus
                                ? styles.textInputContainerOnFocus
                                : styles.textInputContainer
                        }
                    >
                        <Icon
                            name={'mail'}
                            type="ant-design"
                            color={colors.backgroundButtonActive}
                            style={[styles.icon, { paddingLeft: 10 }]}
                        />
                        <TextInput
                            returnKeyType="next"
                            onChangeText={(val) => emailTextHandler(val)}
                            value={userInfo.email}
                            style={[
                                !onFocusInput.emailOnFocus
                                    ? styles.textInput
                                    : styles.textInputFocusOn,
                                { fontWeight: '500' }
                            ]}
                            onFocus={() => setOnFocusInput({ ...onFocusInput, emailOnFocus: true })}
                            onBlur={() => setOnFocusInput({ ...onFocusInput, emailOnFocus: false })}
                            autoCapitalize="none"
                            placeholder="test@email.com"
                            placeholderTextColor={colors.blackGrey}
                        />
                    </View>
                    <Text style={styles.textErrorInput}>
                        {invalidInput.emailError ? invalidInput.emptyFiledsError : ''}
                    </Text>
                </View>
                <TouchableOpacity activeOpacity={0.95} onPress={() => sendEmailHandler()}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Trimite</Text>
                    </View>
                </TouchableOpacity>
                {showRenderToast.success ? (
                    <RenderToastSuccess showComponent={true} />
                ) : showRenderToast.fail ? (
                    <RenderToastFail showComponent={true} />
                ) : null}
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.backgroundCategories
    },
    textInputContainer: {
        // flex: 1,
        display: 'flex',
        width: width * 0.9,
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: colors.white,
        height: 44,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
        borderRadius: 20,
        marginVertical: 5
    },
    textInputContainerOnFocus: {
        display: 'flex',
        width: width * 0.9,
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: colors.white,
        height: 46,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 7
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,
        elevation: 14,
        borderRadius: 20,
        marginVertical: 5
    },
    textInput: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        alignSelf: 'center',
        width: width * 0.8,
        paddingLeft: 10,
        color: colors.backgroundButtonActive,
        fontSize: 16,
        height: 48
    },
    textInputFocusOn: {
        display: 'flex',
        // textAlignVertical: 'center',
        alignSelf: 'center',
        width: width * 0.8,
        // marginTop: Platform.OS === "android" ? 0 : -12,
        paddingLeft: 10,
        color: colors.backgroundButtonActive,
        fontSize: 18,
        height: 48
    },
    iconBack: {
        position: 'absolute',
        top: 10,
        left: 0
    },
    icon: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center'
    },
    textSuggest: {
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 16,
        color: colors.backgroundButtonActive,
        fontWeight: '700',
        letterSpacing: 1
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
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1
    },
    textErrorInput: {
        paddingLeft: 10,
        textAlign: 'left',
        fontSize: 12,
        color: colors.textError,
        fontWeight: '700'
    },
    displayColumn: { flexDirection: 'column' }
})

export default SendEmail
