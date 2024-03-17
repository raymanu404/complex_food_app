import React, { useState, useContext } from 'react'
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
    Alert,
    TouchableHighlight
} from 'react-native'
import colors from '../../config/colors/colors'
import { AuthContext } from '../../config/context'
import * as Animatable from 'react-native-animatable'
import api_axios from '../../config/api/api_axios'
// import {LoginButton, AccessToken} from 'react-native-fbsdk-next';

import { Icon } from 'react-native-elements'
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';

// GoogleSignin.configure({
//   // scopes: ['https://www.googleapis.com/auth/drive.readonly'], // [Android] what API you want to access on behalf of the user, default is email and profile
//   webClientId:
//     '562986888695-eqf2tin1l14kliee4r92lstq30crdki9.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
//   offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
// });

// const signIn = async () => {
//   try {
//     await GoogleSignin.hasPlayServices();
//     const userInfo = await GoogleSignin.signIn();
//     console.log(userInfo);
//   } catch (error) {
//     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//       // user cancelled the login flow
//     } else if (error.code === statusCodes.IN_PROGRESS) {
//       // operation (e.g. sign in) is in progress already
//     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//       // play services not available or outdated
//     } else {
//       // some other error happened
//     }
//   }
// };
const { height } = Dimensions.get('screen')
const width = Dimensions.get('screen').width

function Login({ navigation }) {
    const [userInfo, setUserInfo] = useState({
        email: '',
        password: ''
    })

    const [textError, setTextError] = useState('')
    const [invalidInput, setInvalidInput] = useState({
        emailError: false,
        passwordError: false,
        passwordTypeError: ''
    })
    const [onFocusInput, setOnFocusInput] = useState({
        emailFocus: false,
        passwordFocus: false
    })

    const [passwordVisible, setPasswordVisible] = useState(true)
    const { login } = useContext(AuthContext)

    const goToRegister = () => {
        navigation.navigate('RegisterScreen')
    }

    const goToConfirmCode = (IDUSER) => {
        navigation.navigate('ConfirmCodeScreen', {
            idUser: IDUSER,
            forgotPassword: false
        })
    }
    const changePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible)
    }

    const forgotPasswordHandler = () => {
        navigation.navigate('SendEmailScreen')
    }

    const loginHandler = async () => {
        if (
            !invalidInput.emailError &&
            !invalidInput.passwordError &&
            String(userInfo.email).length !== 0 &&
            String(userInfo.password).length !== 0
        ) {
            // api
            try {
                const loginData = JSON.stringify({
                    Email: userInfo.email,
                    Password: userInfo.password
                })

                const headers = {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                }

                const response = await api_axios.post('/buyers/login', loginData, {
                    headers
                })
                if (response.status === 200) {
                    const result = response.data
                    const emailFromAPI = String(result.email)
                    const passwordFromAPI = String(result.password)
                    const genderFromAPI = String(result.gender)
                    const firstnameFromAPI = String(result.firstName)
                    const lastnameFromAPI = String(result.lastName)
                    const phonenumberFromAPI = String(result.phoneNumber)
                    const balanceFromAPI = Number(result.balance)
                    const confirmed = result.confirmed

                    const sendUserData = {
                        id: result.id,
                        email: emailFromAPI,
                        firstName: firstnameFromAPI,
                        lastName: lastnameFromAPI,
                        phoneNumber: phonenumberFromAPI,
                        gender: genderFromAPI,
                        password: passwordFromAPI,
                        confirmed,
                        balance: balanceFromAPI
                    }

                    if (confirmed) {
                        setTextError('')
                        login(sendUserData)
                        console.log('login')
                    } else {
                        // apare fereastra daca vrea sa isi confirme
                        Alert.alert(
                            'Cont neconfirmat',
                            'Contul dumneavoastra nu este confirmat! Doriti sa va confirmati contul?',
                            [
                                {
                                    text: 'NU',
                                    style: 'cancel'
                                },
                                {
                                    text: 'DA',
                                    onPress: () => {
                                        goToConfirmCode(sendUserData.id)
                                    }
                                }
                            ]
                        )
                    }
                }
            } catch (e) {
                console.log(e.response.status)
                if (e.response.status === 404) {
                    setTextError('Emailul sau parola nu sunt corecte!')
                }
            }
        } else {
            if (String(userInfo.email).length === 0 || String(userInfo.password).length === 0) {
                setTextError('Campurile sunt necompletate!')
            }
        }
    }

    const emailTextHandler = (val) => {
        setTextError('')
        if (String(val).length !== 0 && validateEmail(val)) {
            setUserInfo({
                ...userInfo,
                email: val
            })

            setInvalidInput({
                ...invalidInput,
                emailError: false
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

    const passwordTextHandler = (val) => {
        setTextError('')
        if (String(val).length !== 0 && validatePassword(val)) {
            setUserInfo({
                ...userInfo,
                password: val
            })

            setInvalidInput({
                ...invalidInput,
                passwordError: false,
                passwordTypeError: ''
            })
        } else {
            setUserInfo({
                ...userInfo,
                password: val,
                passwordError: true
            })
        }

        onFocusPassword(val)
    }

    const onFocusPassword = (val) => {
        // if (!String(val).match(new RegExp(/[!@#$%^&*]/))) {
        //   setInvalidInput({
        //     ...invalidInput,
        //     passwordError: true,
        //     passwordTypeError: 'Parola trebuie sa contina !@#$%^&*',
        //   });
        // }
        if (!String(val).match(new RegExp(/[0-9]/))) {
            setInvalidInput({
                ...invalidInput,
                passwordError: true,
                passwordTypeError: 'Parola trebuie sa contina [0-9]'
            })
        }

        if (String(val).length < 8 || String(val).length > 255) {
            setInvalidInput({
                ...invalidInput,
                passwordError: true,
                passwordTypeError: 'Parola trebuie sa fie intre 8-255 caractere'
            })
        }
    }

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
    }

    const validatePassword = (password) => {
        const regularExpression = /^(?=.*[0-9])(?=.*)[a-zA-Z0-9]{8,255}$/
        return String(password).match(regularExpression)
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style={styles.container}>
            <View style={styles.header}>
                <Animatable.Image
                    animation={'bounceIn'}
                    duration={800}
                    source={require('../assets/complex_food_logo-removebg.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.text_logo}>Complex Food</Text>
                <Animatable.View style={styles.footer} animation={'fadeInUpBig'}>
                    <Text style={styles.textErorr}>{textError}</Text>

                    {/* ------------------------- EMAIL  ---------------------- */}
                    <View style={{ flexDirection: 'column', marginVertical: 10 }}>
                        <View
                            style={
                                onFocusInput.emailFocus
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
                                onChangeText={(val) => emailTextHandler(val)}
                                value={userInfo.email}
                                style={[
                                    !onFocusInput.emailFocus
                                        ? styles.textInput
                                        : styles.textInputFocusOn,
                                    { fontWeight: '500' }
                                ]}
                                onFocus={() =>
                                    setOnFocusInput({ ...onFocusInput, emailFocus: true })
                                }
                                onBlur={() =>
                                    setOnFocusInput({ ...onFocusInput, emailFocus: false })
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

                    {/* -------------------------PASSWORD  ---------------------- */}
                    <View style={{ flexDirection: 'column', marginVertical: 10 }}>
                        <View
                            style={
                                onFocusInput.passwordFocus
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
                                onChangeText={(val) => passwordTextHandler(val)}
                                value={userInfo.password}
                                style={[
                                    !onFocusInput.passwordFocus
                                        ? styles.textInput
                                        : styles.textInputFocusOn,
                                    { width: width - 100, fontWeight: '500' }
                                ]}
                                onBlur={() =>
                                    setOnFocusInput({ ...onFocusInput, passwordFocus: false })
                                }
                                onFocus={() =>
                                    setOnFocusInput({ ...onFocusInput, passwordFocus: true })
                                }
                                autoCapitalize="none"
                                placeholder="Parola"
                                secureTextEntry={passwordVisible}
                                placeholderTextColor={colors.backgroundButtonActive}
                            />

                            <TouchableOpacity
                                style={[styles.icon, { paddingRight: 10 }]}
                                onPress={() => changePasswordVisibility()}>
                                <Icon
                                    name={passwordVisible ? 'eye-off' : 'eye'}
                                    type="feather"
                                    color={colors.backgroundButtonActive}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.textErrorInput}>
                            {invalidInput.passwordError ? invalidInput.passwordTypeError : ''}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => forgotPasswordHandler()}
                        style={{ marginTop: -18 }}>
                        <Text style={styles.text}>Ai uitat parola?</Text>
                    </TouchableOpacity>
                    <View style={styles.loginButtonsContainer}>
                        <TouchableHighlight
                            onPress={() => loginHandler()}
                            underlayColor={colors.white}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Login</Text>
                            </View>
                        </TouchableHighlight>
                        {/* <Text style={styles.textCenter}>-sau-</Text> */}
                        {/* <TouchableHighlight
              onPress={() => console.log()}
              underlayColor={colors.white}>
              <View style={[styles.button, {backgroundColor: '#0778E9 '}]}>
                <Icon name={'facebook'} type={'font-awesome'} />
                <Text style={styles.buttonText}>
                  Conecteaza-te prin Facebook
                </Text>
              </View>
            </TouchableHighlight> */}
                        {/* <TouchableHighlight
              onPress={() => signIn()}
              underlayColor={colors.white}>
              <View
                style={[
                  styles.button,
                  {backgroundColor: 'rgba(217, 48, 37, 0.8)'},
                  styles.buttonInside,
                ]}>
                <Icon
                  name="gmail"
                  type={'material-community'}
                  style={{left: 0}}
                  color={colors.white}
                />
                <Text style={styles.buttonText}>Conecteaza-te prin Gmail</Text>
              </View>
            </TouchableHighlight> */}
                        {/* <GoogleSigninButton
              onPress={signIn}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              style={{width: 100, height: 50}}
            /> */}
                        <Text style={[styles.textSuggest, { color: colors.blackGrey }]}>
                            Nu te-ai inregistrat deja?{' '}
                            <Text onPress={() => goToRegister()} style={styles.textSuggest}>
                                {' '}
                                Înregistreaza-te aici!
                            </Text>
                        </Text>
                    </View>
                </Animatable.View>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.backgroundApp
    },
    header: {
        flex: 1,
        marginTop: 40,
        // justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: height * 0.23,
        height: height * 0.23
    },
    footer: {
        flex: 1,
        width: '100%',
        backgroundColor: colors.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 4,
        paddingHorizontal: 30,
        marginTop: 0
    },
    textInputContainer: {
        display: 'flex',
        width: width - 30,
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 10,
        backgroundColor: '#EDEEEE',
        height: 50,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
        borderRadius: 20
    },
    textInputContainerOnFocus: {
        display: 'flex',
        width: width - 30,
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 10,
        backgroundColor: '#EDEEEE',
        height: 50,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 7
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,

        elevation: 14,
        borderRadius: 20
    },
    textInput: {
        // flex: 1,
        display: 'flex',
        alignSelf: 'center',
        paddingLeft: 10,
        color: 'rgba(47, 134, 166, 1)',
        fontSize: 18,
        width: width - 84,
        height: 48
    },
    textInputFocusOn: {
        display: 'flex',
        alignSelf: 'center',
        paddingLeft: 10,
        color: 'rgba(47, 134, 166, 1)',
        fontSize: 22,
        width: width - 84,
        height: 48
    },
    icon: {
        flex: 1,
        justifyContent: 'center'
    },
    loginButtonsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textErorr: {
        textAlign: 'center',
        display: 'flex',
        // marginBottom: 30,
        fontSize: 16,
        color: 'rgba(255,0,0,0.8)',
        fontWeight: '500'
    },
    textErrorInput: {
        color: colors.blackGrey,
        fontWeight: '500',
        marginTop: 5,
        fontSize: 14,
        marginLeft: 5
    },
    textCenter: {
        fontSize: 14,
        color: colors.blackGrey,
        fontWeight: '500',
        textAlign: 'center'
    },
    text: {
        color: colors.backgroundButtonActive,
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'left'
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
    buttonInside: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    buttonText: {
        textAlign: 'center',
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1
    },
    textSuggest: {
        textAlign: 'center',
        fontSize: 16,
        color: colors.backgroundButtonActive,
        fontWeight: '700'
    },
    text_logo: {
        textAlign: 'center',
        fontSize: 24,
        letterSpacing: 4,
        color: colors.backgroundButtonActive,
        fontWeight: '700',
        marginTop: -30
    }
})

export default Login
