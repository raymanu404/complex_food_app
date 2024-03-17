import React, { useState, useRef } from 'react'

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
    Animated,
    Button
} from 'react-native'
import { Icon } from 'react-native-elements'
import * as Animatable from 'react-native-animatable'
import colors from '../../../config/colors/colors'
import api_axios from '../../../config/api/api_axios'
import RenderPasswordImage from '../../components/RenderPasswordImage'
import RenderToastMessage from '../../components/RenderToastMessage'

const height = Dimensions.get('screen').height
const width = Dimensions.get('screen').width
const MIN_PASSWORD_LENGTH = 8
const MAX_PASSWORD_LENGTH = 40

function ForgotPassword({ navigation, route }) {
    const idUser = route.params.idUser

    const [onFocusInput, setOnFocusInput] = useState({
        firstNameOnFocus: false,
        lastNameOnFocus: false,
        phoneOnFocus: false,
        emailOnFocus: false,
        passwordOnFocus: false,
        re_passwordOnFocus: false
    })
    const passwordRef = useRef(null)
    const re_passwordRef = useRef(null)
    const [userInfo, setUserInfo] = useState({
        password: '',
        re_password: ''
    })

    const [invalidInput, setInvalidInput] = useState({
        passwordError: false,
        re_passwordError: false,
        passwordTypeError: '',
        re_passwordTypeError: '',
        emptyFiledsError: ''
    })

    const [passwordVisible, setPasswordVisible] = useState({
        password: true,
        re_password: true
    })
    const [showRenderToast, setShowRenderToast] = useState({
        success: false,
        fail: false
    })

    // renderToastMessage props
    const RenderToastSuccess = (props) => {
        return (
            <RenderToastMessage
                multiplier={0.77}
                showComponent={props.showComponent}
                status={'success'}
                title_message={'Succes!'}
                message={'Parola a fost schimbata cu succes!'}
            />
        )
    }

    const RenderToastFail = (props) => {
        return (
            <RenderToastMessage
                multiplier={0.77}
                showComponent={props.showComponent}
                status={'fail'}
                title_message={'Eroare!'}
                message={props.message}
            />
        )
    }

    // CHANGE PASSWORD AND RE_PASSWORD VISIBILITY
    const changePasswordVisibility = () => {
        setPasswordVisible({
            ...passwordVisible,
            password: !passwordVisible.password
        })
    }

    const changeRe_passwordVisibility = () => {
        setPasswordVisible({
            ...passwordVisible,
            re_password: !passwordVisible.re_password
        })
    }

    // PASSWORD TEXT HANDLER
    const passwordTextHandler = (val) => {
        if (String(val).length !== 0 && validatePassword(val)) {
            setUserInfo({
                ...userInfo,
                password: val
            })

            setInvalidInput({
                ...invalidInput,
                passwordError: false,
                passwordTypeError: '',
                emptyFiledsError: ''
            })
        } else {
            setUserInfo({
                ...userInfo,
                password: val
            })
            setInvalidInput({
                ...invalidInput,
                passwordError: true,
                emptyFiledsError: ''
            })
        }

        onFocusPassword(val, 'password')
    }

    // RE_PASSWORD TEXT HANDLER
    const re_passwordTextHandler = (val) => {
        if (String(val).length !== 0 /* & String(val) === String(userInfo.password) */) {
            setUserInfo({
                ...userInfo,
                re_password: val
            })

            setInvalidInput({
                ...invalidInput,
                re_passwordError: false,
                re_passwordTypeError: '',
                emptyFiledsError: ''
            })
        } else {
            setUserInfo({
                ...userInfo,
                re_password: val
            })
            setInvalidInput({
                ...invalidInput,
                re_passwordError: true,
                emptyFiledsError: ''
            })
        }
        onFocusPassword(val, 're_password')
    }

    const onFocusPassword = (val, passowrdType) => {
        setShowRenderToast({
            ...showRenderToast,
            success: false,
            fail: false
        })
        switch (passowrdType) {
            case 'password':
                if (!String(val).match(new RegExp(/[0-9]/))) {
                    setInvalidInput({
                        ...invalidInput,
                        passwordError: true,
                        emptyFiledsError: '',
                        passwordTypeError: 'Parola trebuie sa contina cifre'
                    })
                }

                if (
                    String(val).length < MIN_PASSWORD_LENGTH ||
                    String(val).length > MAX_PASSWORD_LENGTH
                ) {
                    setInvalidInput({
                        ...invalidInput,
                        passwordError: true,
                        passwordTypeError: `Parola trebuie sa fie intre ${MIN_PASSWORD_LENGTH} - ${MAX_PASSWORD_LENGTH} caractere`
                    })
                }
                break
            case 're_password':
                if (String(val) !== String(userInfo.password)) {
                    setInvalidInput({
                        ...invalidInput,
                        re_passwordError: true,
                        emptyFiledsError: '',
                        re_passwordTypeError: 'Parolele nu corespund!'
                    })
                }
                break
        }
    }

    const validatePassword = (password) => {
        const regularExpression = /^(?=.*[0-9])(?=.*)[a-zA-Z0-9]{8,40}$/
        return String(password).match(regularExpression)
    }

    const changePasswordHandler = async () => {
        console.log('schimabre parola')
        const conds = Boolean(
            !invalidInput.passwordError &&
                !invalidInput.re_passwordError &&
                String(userInfo.password) === String(userInfo.re_password) &&
                userInfo.password.length !== 0 &&
                userInfo.re_password.length !== 0
        )

        if (String(userInfo.password) !== String(userInfo.re_password)) {
            setInvalidInput({
                ...invalidInput,
                re_passwordError: true,
                emptyFiledsError: '',
                re_passwordTypeError: 'Parolele nu corespund!'
            })
            setShowRenderToast({
                ...showRenderToast,
                success: false,
                fail: true
            })
            return
        }

        if (conds) {
            setShowRenderToast({
                ...showRenderToast,
                success: false,
                fail: false
            })
            setInvalidInput({
                ...invalidInput,
                passwordError: false,
                emptyFiledsError: '',
                re_passwordError: false,
                re_passwordTypeError: '',
                passwordTypeError: ''
            })
            try {
                const headers = {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                }
                const dataToSend = {
                    password: userInfo.password
                }

                const responseChangePassword = await api_axios.patch(
                    `/buyers/change-password/${idUser}`,
                    dataToSend,
                    headers
                )

                if (responseChangePassword.status === 200) {
                    if (
                        String(responseChangePassword.data).startsWith(
                            'Password was updated successfully!'
                        )
                    ) {
                        setShowRenderToast({
                            ...showRenderToast,
                            success: true,
                            fail: false
                        })
                        setTimeout(() => {
                            navigation.navigate('LoginScreen')
                        }, 1000)
                    }
                }
            } catch (error) {
                setShowRenderToast({
                    ...showRenderToast,
                    success: false,
                    fail: true
                })
                console.log(error.response)
            }
        } else {
            setInvalidInput({
                ...invalidInput,
                emptyFiledsError: 'Campuri necompletate!'
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
                <TouchableOpacity style={styles.iconGoBack} onPress={() => navigation.goBack()}>
                    <Icon name={'arrow-left'} type="feather" color={colors.black} />
                </TouchableOpacity>

                <RenderPasswordImage title_message={'Schimbare parola'} />

                {/* ------------------------------------- PAROLA -------------------------------------- */}
                <View style={styles.displayColumn}>
                    <View
                        style={
                            onFocusInput.passwordOnFocus
                                ? styles.textInputContainerOnFocus
                                : styles.textInputContainer
                        }
                    >
                        <Icon
                            name={'lock'}
                            type="feather"
                            color={colors.backgroundButtonActive}
                            style={[styles.icon, { paddingLeft: 10 }]}
                        />
                        <TextInput
                            ref={passwordRef}
                            returnKeyType="next"
                            onSubmitEditing={() => re_passwordRef.current.focus()}
                            onChangeText={(val) => passwordTextHandler(val)}
                            value={userInfo.password}
                            style={[
                                !onFocusInput.passwordOnFocus
                                    ? styles.textInput
                                    : styles.textInputFocusOn,
                                { fontWeight: '500' }
                            ]}
                            onFocus={() =>
                                setOnFocusInput({ ...onFocusInput, passwordOnFocus: true })
                            }
                            onBlur={() =>
                                setOnFocusInput({ ...onFocusInput, passwordOnFocus: false })
                            }
                            autoCapitalize="none"
                            placeholder="Parola noua"
                            secureTextEntry={passwordVisible.password}
                            placeholderTextColor={colors.backgroundButtonActive}
                        />
                        <TouchableOpacity
                            onPress={() => changePasswordVisibility()}
                            style={[styles.icon, { marginLeft: width * 0.1 }]}
                        >
                            <Icon
                                name={passwordVisible.password ? 'eye-off' : 'eye'}
                                type="feather"
                                color={colors.backgroundButtonActive}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.textErrorInput}>
                        {invalidInput.passwordError ? invalidInput.passwordTypeError : ''}
                    </Text>
                </View>

                {/* ------------------------------------- CONFIRMARE PAROLA -------------------------------------- */}
                <View style={styles.displayColumn}>
                    <View
                        style={
                            onFocusInput.re_passwordOnFocus
                                ? styles.textInputContainerOnFocus
                                : styles.textInputContainer
                        }
                    >
                        <Icon
                            name={'unlock'}
                            type="feather"
                            color={colors.backgroundButtonActive}
                            style={[styles.icon, { paddingLeft: 10 }]}
                        />
                        <TextInput
                            ref={re_passwordRef}
                            onChangeText={(val) => re_passwordTextHandler(val)}
                            value={userInfo.re_password}
                            style={[
                                !onFocusInput.re_passwordOnFocus
                                    ? styles.textInput
                                    : styles.textInputFocusOn,
                                { fontWeight: '500' }
                            ]}
                            onFocus={() =>
                                setOnFocusInput({
                                    ...onFocusInput,
                                    re_passwordOnFocus: true
                                })
                            }
                            onBlur={() =>
                                setOnFocusInput({
                                    ...onFocusInput,
                                    re_passwordOnFocus: false
                                })
                            }
                            autoCapitalize="none"
                            placeholder="Confirmare parola"
                            secureTextEntry={passwordVisible.re_password}
                            placeholderTextColor={colors.backgroundButtonActive}
                        />
                        <TouchableOpacity
                            style={[styles.icon, { marginLeft: width * 0.1 }]}
                            onPress={() => changeRe_passwordVisibility()}
                        >
                            <Icon
                                name={passwordVisible.re_password ? 'eye-off' : 'eye'}
                                type="feather"
                                color={colors.backgroundButtonActive}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.textErrorInput}>
                        {invalidInput.re_passwordError ? invalidInput.re_passwordTypeError : ''}
                    </Text>
                </View>
                <Text style={styles.textErrorInput}>{invalidInput.emptyFiledsError}</Text>
                <TouchableOpacity activeOpacity={0.95} onPress={() => changePasswordHandler()}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Schimba parola</Text>
                    </View>
                </TouchableOpacity>
                <>
                    {showRenderToast.success ? (
                        <RenderToastSuccess showComponent={true} />
                    ) : showRenderToast.fail ? (
                        <RenderToastFail
                            showComponent={true}
                            message={
                                invalidInput.emptyFiledsError.length !== 0
                                    ? invalidInput.emptyFiledsError
                                    : invalidInput.re_passwordTypeError.length !== 0
                                    ? invalidInput.re_passwordTypeError
                                    : 'Parola este invalida!'
                            }
                        />
                    ) : null}
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
        width: width * 0.6,
        paddingLeft: 10,
        color: colors.backgroundButtonActive,
        fontSize: 16,
        height: 48
    },
    textInputFocusOn: {
        display: 'flex',
        // textAlignVertical: 'center',
        alignSelf: 'center',
        width: width * 0.6,
        // marginTop: Platform.OS === "android" ? 0 : -12,
        paddingLeft: 10,
        color: colors.backgroundButtonActive,
        fontSize: 18,
        height: 48
    },
    icon: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center'
    },
    iconGoBack: {
        position: 'absolute',
        top: 10,
        left: 0
    },
    registerSection: {
        flex: 1,
        // display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: height * 0.02
    },
    textSuggest: {
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 16,
        color: colors.backgroundButtonActive,
        fontWeight: '700'
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
        fontSize: 14,
        color: colors.textError,
        fontWeight: '700'
    },
    displayColumn: { flexDirection: 'column' }
})

export default ForgotPassword
