import React, { useState, useContext, useRef } from 'react'
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
    ToastAndroid
} from 'react-native'
import { RadioButton } from 'react-native-paper'
import { AuthContext } from '../../config/context'
import { Icon } from 'react-native-elements'
import colors from '../../config/colors/colors'
import * as Animatable from 'react-native-animatable'
import api_axios from '../../config/api/api_axios'

const height = Dimensions.get('screen').height
const width = Dimensions.get('screen').width
const MIN_PASSWORD_LENGTH = 8
const MAX_PASSWORD_LENGTH = 40

function Register({ navigation }) {
    const { register } = useContext(AuthContext)

    const goBackLogin = () => {
        navigation.goBack()
    }

    const [onFocusInput, setOnFocusInput] = useState({
        firstNameOnFocus: false,
        lastNameOnFocus: false,
        phoneOnFocus: false,
        emailOnFocus: false,
        passwordOnFocus: false,
        re_passwordOnFocus: false
    })

    const firstNameRef = useRef(null)
    const lastNameRef = useRef(null)
    const phoneRef = useRef(null)
    const genderRef = useRef(null)
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const re_passwordRef = useRef(null)

    const [textError, setTextError] = useState('')
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        gender: '',
        password: '',
        re_password: ''
    })

    const [invalidInput, setInvalidInput] = useState({
        firstNameError: false,
        lastNameError: false,
        phoneError: false,
        genderError: false,
        emailError: false,
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

    // FIRST NAME TEXT HANDLER
    const firstNameTextHandler = (val) => {
        if (String(val).length !== 0) {
            setUserInfo({
                ...userInfo,
                firstName: val
            })

            setInvalidInput({
                ...invalidInput,
                firstNameError: false,
                emptyFiledsError: ''
            })
        } else {
            setUserInfo({
                ...userInfo,
                firstName: val
            })
            setInvalidInput({
                ...invalidInput,
                firstNameError: true
            })
        }
    }

    // LAST NAME TEXT HANDLER
    const lastNameTextHandler = (val) => {
        if (String(val).length !== 0) {
            setUserInfo({
                ...userInfo,
                lastName: val
            })

            setInvalidInput({
                ...invalidInput,
                lastNameError: false,
                emptyFiledsError: ''
            })
        } else {
            setUserInfo({
                ...userInfo,
                lastName: val
            })
            setInvalidInput({
                ...invalidInput,
                lastNameError: true
            })
        }
    }

    // PHONE TEXT HANDLER
    const phoneTextHandler = (val) => {
        if (String(val).length !== 0 && validatePhone(val)) {
            setUserInfo({
                ...userInfo,
                phone: val
            })

            setInvalidInput({
                ...invalidInput,
                phoneError: false,
                emptyFiledsError: ''
            })
        } else {
            setUserInfo({
                ...userInfo,
                phone: val
            })
            setInvalidInput({
                ...invalidInput,
                phoneError: true
            })
        }
        // } else {
        //   setUserInfo({
        //     ...userInfo,
        //     phone: val,
        //   });
        //   setInvalidInput({
        //     ...invalidInput,
        //     phoneError: true,
        //   });
        // }
    }

    // GENDER RADIO HANDLER

    const genderRadioHandler = (val) => {
        if (val !== '') {
            setUserInfo({
                ...userInfo,
                gender: val
            })
            setInvalidInput({
                ...invalidInput,
                genderError: false,
                emptyFiledsError: ''
            })
        } else {
            setUserInfo({
                ...userInfo,
                gender: val
            })
            setInvalidInput({
                ...invalidInput,
                genderError: true
            })
        }
    }

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
                passwordError: true
            })
        }

        onFocusPassword(val, 'password')
    }

    // RE_PASSWORD TEXT HANDLER
    const re_passwordTextHandler = (val) => {
        if (String(val).length !== 0 && String(val) === String(userInfo.password)) {
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
                re_passwordError: true
            })
        }
        onFocusPassword(val, 're_password')
    }

    const onFocusPassword = (val, passowrdType) => {
        switch (passowrdType) {
            case 'password':
                if (!String(val).match(new RegExp(/\d/))) {
                    setInvalidInput({
                        ...invalidInput,
                        passwordError: true,
                        passwordTypeError: 'Parola trebuie sa contina cel putin o cifra!'
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
                        re_passwordTypeError: 'Parolele nu corespund!'
                    })
                }
                break
        }
    }

    const validatePassword = (password) => {
        const regularExpression = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,40}$/
        return String(password).match(regularExpression)
    }

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
    }

    const validatePhone = (phone) => {
        return phone.match(/\d/g).length === 10
    }

    const showToastWithGravity = (message) => {
        ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER)
    }

    const goToLoginScreen = () => {
        navigation.navigate('LoginScreen')
    }

    const registerHandler = async () => {
        try {
            const verifyValidData =
                !invalidInput.emailError &&
                !invalidInput.firstNameError &&
                !invalidInput.lastNameError &&
                !invalidInput.genderError &&
                !invalidInput.phoneError &&
                !invalidInput.passwordError &&
                !invalidInput.re_passwordError

            const emptyFields =
                userInfo.email !== '' &&
                userInfo.firstName !== '' &&
                userInfo.lastName !== '' &&
                userInfo.gender !== '' &&
                userInfo.phone !== '' &&
                userInfo.password !== '' &&
                userInfo.re_password !== ''
            if (verifyValidData && emptyFields) {
                const userDataForRegister = {
                    buyer: {
                        email: userInfo.email,
                        password: userInfo.password,
                        firstName: userInfo.firstName,
                        lastName: userInfo.lastName,
                        phoneNumber: userInfo.phone,
                        gender: userInfo.gender
                    }
                }
                setInvalidInput({
                    ...invalidInput,
                    emptyFiledsError: ''
                })

                await api_axios
                    .post('/buyers/register', userDataForRegister)
                    .then((response) => {
                        if (response.status === 201) {
                            register()
                            showToastWithGravity('Inregistrarea a fost cu succes!')
                            goToLoginScreen()
                        }
                    })
                    .catch((e) => {
                        if (e.response.status === 400 || e.response.status === 500) {
                            showToastWithGravity('Upps. a aparut o eroare!')
                            setInvalidInput({
                                ...invalidInput,
                                emptyFiledsError: 'Campuri invalide pentru inregistrare!'
                            })
                        }
                    })
            } else {
                setInvalidInput({
                    ...invalidInput,
                    emptyFiledsError: 'Campuri goale/invalide!'
                })
            }
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <TouchableWithoutFeedback
            onPress={() => {
                Keyboard.dismiss()
            }}
            style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.textErrorInput}>{textError}</Text>
                <View style={styles.logo_container}>
                    <Animatable.Image
                        animation={'bounceIn'}
                        duration={800}
                        source={require('../assets/undraw_Eating_together_re_ux62-removebg.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.text_logo}>Complex Food</Text>
                    <Text style={styles.textSuggest}>Inregistreaza - te aici!</Text>
                </View>

                <ScrollView
                    style={styles.userInputContainer}
                    keyboardDismissMode="on-drag"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled">
                    <View style={styles.displayColumn}>
                        {/* ------------------------------------- PRENUME -------------------------------------- */}
                        <View
                            style={
                                onFocusInput.firstNameOnFocus
                                    ? styles.textInputContainerOnFocus
                                    : styles.textInputContainer
                            }>
                            <Icon
                                name={'user'}
                                type="ant-design"
                                color={colors.backgroundButtonActive}
                                style={[styles.icon, { paddingLeft: 10 }]}
                            />
                            <TextInput
                                blurOnSubmit={false}
                                ref={firstNameRef}
                                returnKeyType="next"
                                onChangeText={(val) => firstNameTextHandler(val)}
                                value={userInfo.firstName}
                                style={[
                                    !onFocusInput.firstNameOnFocus
                                        ? styles.textInput
                                        : styles.textInputFocusOn,
                                    { fontWeight: '500' }
                                ]}
                                onSubmitEditing={() => lastNameRef.current.focus()}
                                onFocus={() =>
                                    setOnFocusInput({ ...onFocusInput, firstNameOnFocus: true })
                                }
                                onBlur={() =>
                                    setOnFocusInput({
                                        ...onFocusInput,
                                        firstNameOnFocus: false
                                    })
                                }
                                autoCapitalize="none"
                                placeholder="Prenume"
                                placeholderTextColor={colors.backgroundButtonActive}
                            />
                        </View>
                        <Text style={styles.textErrorInput}>
                            {invalidInput.firstNameError ? 'Ex:Ion' : ''}
                        </Text>
                    </View>
                    {/* ------------------------------------- NUME -------------------------------------- */}
                    <View style={styles.displayColumn}>
                        <View
                            style={
                                onFocusInput.lastNameOnFocus
                                    ? styles.textInputContainerOnFocus
                                    : styles.textInputContainer
                            }>
                            <Icon
                                name={'user'}
                                type="feather"
                                color={colors.backgroundButtonActive}
                                style={[styles.icon, { paddingLeft: 10 }]}
                            />
                            <TextInput
                                ref={lastNameRef}
                                onChangeText={(val) => lastNameTextHandler(val)}
                                value={userInfo.lastName}
                                style={[
                                    !onFocusInput.lastNameOnFocus
                                        ? styles.textInput
                                        : styles.textInputFocusOn,
                                    { fontWeight: '500' }
                                ]}
                                returnKeyType={'next'}
                                onSubmitEditing={() => phoneRef.current.focus()}
                                onFocus={() =>
                                    setOnFocusInput({ ...onFocusInput, lastNameOnFocus: true })
                                }
                                onBlur={() =>
                                    setOnFocusInput({ ...onFocusInput, lastNameOnFocus: false })
                                }
                                autoCapitalize="none"
                                placeholder="Nume"
                                placeholderTextColor={colors.backgroundButtonActive}
                            />
                        </View>
                        <Text style={styles.textErrorInput}>
                            {invalidInput.lastNameError ? 'Ex:Popescu' : ''}
                        </Text>
                    </View>

                    {/* ------------------------------------- TELEFON -------------------------------------- */}
                    <View style={styles.displayColumn}>
                        <View
                            style={
                                onFocusInput.phoneOnFocus
                                    ? styles.textInputContainerOnFocus
                                    : styles.textInputContainer
                            }>
                            <Icon
                                name={'phone'}
                                type="ant-design"
                                color={colors.backgroundButtonActive}
                                style={[styles.icon, { paddingLeft: 10 }]}
                            />
                            <TextInput
                                ref={phoneRef}
                                returnKeyType={'next'}
                                onSubmitEditing={() => emailRef.current.focus()}
                                onChangeText={(val) => phoneTextHandler(val)}
                                value={userInfo.phone}
                                keyboardType="phone-pad"
                                style={[
                                    !onFocusInput.phoneOnFocus
                                        ? styles.textInput
                                        : styles.textInputFocusOn,
                                    { fontWeight: '500' }
                                ]}
                                onFocus={() =>
                                    setOnFocusInput({ ...onFocusInput, phoneOnFocus: true })
                                }
                                onBlur={() =>
                                    setOnFocusInput({ ...onFocusInput, phoneOnFocus: false })
                                }
                                autoCapitalize="none"
                                placeholder="Telefon"
                                placeholderTextColor={colors.backgroundButtonActive}
                            />
                        </View>
                        <Text style={styles.textErrorInput}>
                            {invalidInput.phoneError ? '0721 345 211' : ''}
                        </Text>
                    </View>

                    {/* ----------------------------------- GENDER ------------------------------ */}

                    <View style={styles.genderContainerParent}>
                        <RadioButton.Group
                            onValueChange={(newValue) => genderRadioHandler(newValue)}
                            value={userInfo.gender}>
                            <View style={styles.genderContainer}>
                                <View style={styles.genderItem}>
                                    <Text style={styles.genderTextItem}>Masculin</Text>
                                    <RadioButton value="M" color={colors.backgroundButtonActive} />
                                </View>
                                <View style={styles.genderItem}>
                                    <Text style={styles.genderTextItem}>Feminin</Text>
                                    <RadioButton value="F" color={colors.backgroundButtonActive} />
                                </View>
                                <View style={styles.genderItem}>
                                    <Text style={styles.genderTextItem}>Altceva</Text>
                                    <RadioButton value="N" color={colors.backgroundButtonActive} />
                                </View>
                            </View>
                        </RadioButton.Group>
                        <Text style={styles.textErrorInput}>
                            {invalidInput.genderError ? 'Selectati unul din optiuni' : ''}
                        </Text>
                    </View>

                    {/* ---------------------------------- EMAIL ------------------------------- */}
                    <View style={styles.displayColumn}>
                        <View
                            style={
                                onFocusInput.emailOnFocus
                                    ? styles.textInputContainerOnFocus
                                    : styles.textInputContainer
                            }>
                            <Icon
                                name={'mail'}
                                type="ant-design"
                                color={colors.backgroundButtonActive}
                                style={[styles.icon, { paddingLeft: 10 }]}
                            />
                            <TextInput
                                ref={emailRef}
                                returnKeyType="next"
                                onSubmitEditing={() => passwordRef.current.focus()}
                                onChangeText={(val) => emailTextHandler(val)}
                                value={userInfo.email}
                                style={[
                                    !onFocusInput.emailOnFocus
                                        ? styles.textInput
                                        : styles.textInputFocusOn,
                                    { fontWeight: '500' }
                                ]}
                                onFocus={() =>
                                    setOnFocusInput({ ...onFocusInput, emailOnFocus: true })
                                }
                                onBlur={() =>
                                    setOnFocusInput({ ...onFocusInput, emailOnFocus: false })
                                }
                                autoCapitalize="none"
                                placeholder="Email"
                                placeholderTextColor={colors.backgroundButtonActive}
                            />
                        </View>
                        <Text style={styles.textErrorInput}>
                            {invalidInput.emailError ? 'test@test.com' : ''}
                        </Text>
                    </View>
                    {/* ------------------------------------- PAROLA -------------------------------------- */}
                    <View style={styles.displayColumn}>
                        <View
                            style={
                                onFocusInput.passwordOnFocus
                                    ? styles.textInputContainerOnFocus
                                    : styles.textInputContainer
                            }>
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
                                placeholder="Parola"
                                secureTextEntry={passwordVisible.password}
                                placeholderTextColor={colors.backgroundButtonActive}
                            />
                            <TouchableOpacity
                                onPress={() => changePasswordVisibility()}
                                style={[styles.icon, { marginLeft: width * 0.1 }]}>
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
                            }>
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
                                onPress={() => changeRe_passwordVisibility()}>
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
                    <View>
                        <Text
                            style={[
                                styles.textErrorInput,
                                { fontSize: 15, color: colors.recycleBin, textAlign: 'center' }
                            ]}>
                            {invalidInput.emptyFiledsError}
                        </Text>
                    </View>
                    <View style={styles.registerSection}>
                        <TouchableHighlight
                            underlayColor={colors.backgroundApp}
                            onPress={() => registerHandler()}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Inregistrare</Text>
                            </View>
                        </TouchableHighlight>
                        <Text style={[styles.textSuggest, { color: colors.blackGrey }]}>
                            Ai deja un cont?{' '}
                            <Text style={styles.textSuggest} onPress={() => goBackLogin()}>
                                {' '}
                                Intra aici!
                            </Text>
                        </Text>
                    </View>
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.backgroundApp
    },
    header: {
        flex: 1,
        // marginTop: 40,
        // justifyContent: 'center',
        alignItems: 'center'
    },
    userInputContainer: {
        flex: 1
        // marginTop: 20,
        // marginBottom: 10,
        // paddingVertical: 10,
    },
    logo_container: {
        marginBottom: -10,
        justifyContent: 'center',
        alignContent: 'center'
    },
    logo: {
        // marginBottom: -20,
        width: height * 0.23,
        height: height * 0.23
    },
    text_logo: {
        textAlign: 'center',
        fontSize: 24,
        letterSpacing: 4,
        color: colors.backgroundButtonActive,
        fontWeight: '700',
        marginTop: -30
    },
    textInputContainer: {
        // flex: 1,
        display: 'flex',
        width: width * 0.9,
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: '#FFF',
        height: 44,
        shadowColor: '#000000',
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
        backgroundColor: '#FFF',
        height: 46,
        shadowColor: '#000',
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
        color: 'rgba(47, 134, 166, 1)',
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
        color: 'rgba(47, 134, 166, 1)',
        fontSize: 18,
        height: 48
    },
    icon: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center'
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
        backgroundColor: 'rgba(47, 134, 166, 1)',
        shadowColor: '#000000',
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
        color: colors.blackGrey,
        fontWeight: '700'
    },
    genderContainerParent: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginLeft: 2
    },
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 2,
        marginLeft: 5
    },
    genderItem: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginLeft: 5
    },
    genderTextItem: {
        fontSize: 14,
        paddingTop: 6,
        paddingRight: 2,
        color: colors.backgroundButtonActive,
        fontWeight: '600'
    },
    displayColumn: { flexDirection: 'column' }
})

export default Register
