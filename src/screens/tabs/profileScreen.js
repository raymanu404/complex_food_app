import React, { useState, useContext, useEffect } from 'react'
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Alert,
    ToastAndroid,
    Keyboard
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { AuthContext } from '../../../config/context'
import { UserContext } from '../../../App'
import api_axios from '../../../config/api/api_axios'
import UserField from '../../components/UserField'
import colors from '../../../config/colors/colors'
import { Avatar, Icon } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler'
import Loading from '../loading'

const height = Dimensions.get('screen').height
const width = Dimensions.get('screen').width
const menu_container_width = 300
// const colorAvatar = randomColor();
const colorAvatar = '#9BA3EB'

function Profile({ navigation }) {
    const { logout } = useContext(AuthContext)
    const [userDataLogin, setUserDataLogin] = useContext(UserContext)
    const buyerID = userDataLogin.id
    const [dataFromAPI, setDataFromAPI] = useState({})

    const [userData, setUserData] = useState({
        password: String(''),
        new_password: String(''),
        re_password: String('')
    })

    const [settingsMode, setSettingsMode] = useState({
        showBalance: false,
        showTickets: false,
        showSaveButton: false,
        showSettingsMode: false,
        showChangePassword: false
    })

    const [dataSettings, setDataSettings] = useState({
        firstName: dataFromAPI.firstName,
        lastName: dataFromAPI.lastName,
        email: dataFromAPI.email,
        phone: dataFromAPI.phoneNumber
    })

    const [textError, setTextError] = useState({
        passwordTextError: ''
    })

    const [loading, setLoading] = useState(true)
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
                    setDataFromAPI(response.data)
                } catch (error) {
                    console.log(error)
                }
                setLoading(false)
            }

            getUserDataFromApi()
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    )

    if (loading) {
        return <Loading />
    }
    const settingsModeHandler = () => {
        // setSettingsMode({
        //   ...settingsMode,
        //   showSaveButton: !settingsMode.showSaveButton,
        //   showSettingsMode: !settingsMode.showSettingsMode,
        //   showChangePassword: false,
        // });

        if (settingsMode.showSettingsMode) {
            setSettingsMode({
                ...settingsMode,
                showSaveButton: false,
                showSettingsMode: false,
                showChangePassword: false
            })
        } else {
            setSettingsMode({
                ...settingsMode,
                showSaveButton: true,
                showSettingsMode: true,
                showChangePassword: false
            })
        }
    }

    const showHideBalanceHandler = () => {
        setSettingsMode({
            ...settingsMode,
            showBalance: !settingsMode.showBalance
        })
    }

    // const showToastWithGravity = message => {
    //   ToastAndroid.showWithGravity(
    //     message,
    //     ToastAndroid.SHORT,
    //     ToastAndroid.CENTER,
    //   );
    // };

    const showHideTicketsHandler = () => {
        navigation.navigate('CouponsListScreen', {
            buyerID,
            userMode: true
        })
    }

    const logoutHandler = () => {
        Alert.alert('Iesire din aplicatie', 'Doriti sa continuati?', [
            {
                text: 'DA',
                onPress: () => logout(),
                style: 'default'
            },
            {
                text: 'NU',
                onPress: () => console.log('logout'),
                style: 'cancel'
            }
        ])
    }

    const changePasswordHandler = () => {
        if (settingsMode.showChangePassword) {
            // update password
        }

        if (settingsMode.showSettingsMode) {
            setSettingsMode({
                ...settingsMode,
                showSaveButton: true,
                showChangePassword: !settingsMode.showChangePassword
            })
        } else {
            setSettingsMode({
                ...settingsMode,
                showSaveButton: !settingsMode.showSaveButton,
                showChangePassword: !settingsMode.showChangePassword
            })
        }
    }

    const changeBalanceHandler = (newBalance) => {
        const updateBalance = Number(dataFromAPI.balance + newBalance).toFixed(2)
        setDataFromAPI({
            ...dataFromAPI,
            balance: updateBalance
        })
    }

    const depunereHandler = () => {
        const userInfoObj = {
            buyerId: buyerID,
            email: dataFromAPI.email,
            firstName: dataFromAPI.firstName,
            lastName: dataFromAPI.lastName,
            phoneNumber: dataFromAPI.phoneNumber
        }

        navigation.navigate('PayDeskScreen', {
            userInfo: userInfoObj,
            onGoBack: changeBalanceHandler
        })
    }

    const saveSettingsHandler = async () => {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
            }
            if (settingsMode.showSettingsMode) {
                const userDataUpdate = {
                    firstName: dataSettings.firstName,
                    lastName: dataSettings.lastName,
                    phoneNumber: dataSettings.phone
                }

                const response = await api_axios.put(
                    `/buyers/update/${buyerID}`,
                    userDataUpdate,
                    headers
                )

                console.log('status update : ', response.status)
                if (response.status === 200) {
                    setDataFromAPI({
                        ...dataFromAPI,
                        firstName: dataSettings.firstName,
                        lastName: dataSettings.lastName,
                        phoneNumber: dataSettings.phone
                    })

                    setSettingsMode({
                        ...settingsMode,
                        showSaveButton: false,
                        showSettingsMode: false,
                        showChangePassword: false
                    })
                    ToastAndroid.show('Datele au fost modificate cu success!', ToastAndroid.CENTER)
                }
            }
            console.log(`${userData.re_password} + ${userData.new_password}`)
            if (settingsMode.showChangePassword) {
                if (String(userData.re_password) === String(userData.new_password)) {
                    console.log(userData.re_password + ' . ' + userData.new_password)
                    setTextError({
                        ...textError,
                        passwordTextError: ''
                    })
                    const changePassword = {
                        oldPassword: userData.password,
                        newPassword: userData.new_password
                    }

                    const reponseChangePassword = await api_axios.patch(
                        `/buyers/update-password/${buyerID}`,
                        changePassword,
                        headers
                    )
                    if (reponseChangePassword.status === 200) {
                        if (reponseChangePassword.data === 'Password was updated successfully!') {
                            setTextError({
                                ...textError,
                                passwordTextError: ''
                            })
                            setSettingsMode({
                                ...settingsMode,
                                showSaveButton: false,
                                showSettingsMode: false,
                                showChangePassword: false
                            })
                        } else {
                            setTextError({
                                ...textError,
                                passwordTextError: 'Parola incorecta!'
                            })
                        }
                    }
                }
            } else {
                setTextError({
                    ...textError,
                    passwordTextError: 'Parolele nu sunt identice'
                })
            }
        } catch (error) {
            console.log(error.response.status)
            setTextError({
                ...textError,
                passwordTextError: 'Datele nu au putut fi actualizate!'
            })
            ToastAndroid.show('Datele nu au putut fi actualizate!', ToastAndroid.CENTER)
        }
    }

    const changeFirstNameValue = (childdata) => {
        setDataSettings({ ...dataSettings, firstName: childdata })
    }
    const changeLastNameValue = (childdata) => {
        setDataSettings({ ...dataSettings, lastName: childdata })
    }
    // const changeEmailValue = childdata => {
    //   setDataSettings({...dataSettings, email: childdata});
    // };
    const changePhoneValue = (childdata) => {
        setDataSettings({ ...dataSettings, phone: childdata })
    }

    const oldPasswordOnBlurMethod = (flag) => {
        if (flag) {
        }
    }
    const newPasswordOnBlurMethod = (flag) => {
        if (flag) {
        }
    }
    const renewPasswordOnBlurMethod = (flag) => {}

    const textInputOldPasswordHandler = (childdata) => {
        if (String(childdata) !== '') {
            setUserData({
                ...userData,
                password: childdata
            })
            setTextError({
                ...textError,
                passwordTextError: ''
            })
        } else {
            setUserData({
                ...userData,
                password: childdata
            })
        }
    }
    const textInputNewPasswordHandler = (childdata) => {
        if (String(childdata) !== '') {
            setUserData({
                ...userData,
                new_password: childdata
            })
            setTextError({
                ...textError,
                passwordTextError: ''
            })
        } else {
            // setTextError({
            //   ...textError,
            //   passwordTextError: '',
            // });
            setUserData({
                ...userData,
                new_password: childdata
            })
        }
    }
    const textInputR_NewPasswordHandler = (childdata) => {
        if (String(childdata) !== '') {
            setUserData({
                ...userData,
                re_password: childdata
            })
            setTextError({
                ...textError,
                passwordTextError: ''
            })
        } else {
            // setTextError({
            //   ...textError,
            //   passwordTextError: 'Parolele nu sunt identice!',
            // });
            setUserData({
                ...userData,
                re_password: childdata
            })
        }
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <View style={styles.avatarContainer}>
                    <Avatar
                        size={120}
                        rounded
                        title={
                            String(dataFromAPI.firstName).charAt(0) +
                            '' +
                            String(dataFromAPI.lastName).charAt(0)
                        }
                        containerStyle={{ backgroundColor: colorAvatar }}
                    />
                </View>
                {/* ----------------------------HEADER -------------------------- */}
                <View style={styles.header}>
                    <>
                        {/* ----------------------------EDIT PROFILE ICON-------------------------- */}
                        <View style={styles.editProfile}>
                            <TouchableOpacity
                                onPress={() => settingsModeHandler()}
                                activeOpacity={0.8}
                            >
                                <UserField
                                    widthStyle={150}
                                    colorBackground={colors.blackGrey}
                                    nameIcon={'settings-outline'}
                                    typeIcon={'ionicon'}
                                    labelField={'Setari'}
                                    sizeIcon={16}
                                />
                            </TouchableOpacity>
                        </View>
                        {/* ------------------------------HEADER RIGHT ------------------------ */}
                        <View style={styles.headerRight}>
                            <View style={styles.centerRow}>
                                <Text style={styles.text_balance}>
                                    SOLD:{' '}
                                    {settingsMode.showBalance
                                        ? `${Number(dataFromAPI.balance).toFixed(2)}`
                                        : '****'}{' '}
                                    RON
                                </Text>
                                <TouchableOpacity
                                    onPress={() => showHideBalanceHandler()}
                                    activeOpacity={0.5}
                                >
                                    <Icon
                                        name={settingsMode.showBalance ? 'eye' : 'eye-off'}
                                        type={'feather'}
                                        color={colors.white}
                                        size={24}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.logoutButton}>
                                <TouchableOpacity
                                    onPress={() => logoutHandler()}
                                    activeOpacity={0.8}
                                >
                                    <UserField
                                        widthStyle={130}
                                        colorBackground={colors.blackGrey}
                                        nameIcon={'exit-outline'}
                                        typeIcon={'ionicon'}
                                        labelField={'Logout'}
                                        sizeIcon={26}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* ----------- USER PROFILE --------------------- */}
                        <ScrollView style={styles.userProfile}>
                            <View style={styles.userDataInfo}>
                                <Text style={styles.textLabel}>Date personale</Text>
                                <>
                                    {!settingsMode.showSettingsMode ? (
                                        <>
                                            <UserField
                                                widthStyle={width - 30}
                                                colorBackground={colors.blackGrey}
                                                nameIcon={'user'}
                                                typeIcon={'antdesign'}
                                                labelField={'Nume'}
                                                dataField={
                                                    dataFromAPI.firstName +
                                                    ' ' +
                                                    dataFromAPI.lastName
                                                }
                                            />
                                            <UserField
                                                widthStyle={width - 30}
                                                colorBackground={colors.blackGrey}
                                                nameIcon={'mail'}
                                                typeIcon={'antdesign'}
                                                labelField={'Email'}
                                                dataField={dataFromAPI.email}
                                            />
                                            <UserField
                                                widthStyle={width - 30}
                                                colorBackground={colors.blackGrey}
                                                nameIcon={'phone'}
                                                typeIcon={'antdesign'}
                                                labelField={'Telefon'}
                                                dataField={dataFromAPI.phoneNumber}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <UserField
                                                widthStyle={width - 30}
                                                colorBackground={colors.black20}
                                                nameIcon={'user'}
                                                typeIcon={'antdesign'}
                                                labelField={'Prenume'}
                                                dataField={' '}
                                                settingsMode={true}
                                                changeTextInput={changeFirstNameValue}
                                            />
                                            <UserField
                                                widthStyle={width - 30}
                                                colorBackground={colors.black20}
                                                nameIcon={'user'}
                                                typeIcon={'feather'}
                                                labelField={'Nume'}
                                                dataField={' '}
                                                settingsMode={true}
                                                changeTextInput={changeLastNameValue}
                                            />
                                            {/* <UserField
                    widthStyle={width - 30}
                    colorBackground={colors.black20}
                    nameIcon={'mail'}
                    typeIcon={'antdesign'}
                    labelField={'Email'}
                    dataField={dataFromAPI.email}
                    settingsMode={true}
                    changeTextInput={changeEmailValue}
                  /> */}
                                            <UserField
                                                widthStyle={width - 30}
                                                colorBackground={colors.black20}
                                                nameIcon={'phone'}
                                                typeIcon={'antdesign'}
                                                labelField={'Telefon'}
                                                dataField={' '}
                                                settingsMode={true}
                                                phoneType={true}
                                                changeTextInput={changePhoneValue}
                                            />
                                        </>
                                    )}
                                </>
                            </View>

                            {/* ------------------------- SETTINGS ACCOUNT --------------------------- */}
                            <View style={styles.userDataInfo}>
                                <Text style={styles.textLabel}>Setari Cont</Text>
                                <TouchableOpacity
                                    onPress={() => changePasswordHandler()}
                                    activeOpacity={0.8}
                                >
                                    <UserField
                                        widthStyle={width - 30}
                                        colorBackground={colors.blackGrey}
                                        nameIcon={'lock-open-outline'}
                                        typeIcon={'ionicon'}
                                        labelField={'Schimbare Parola'}
                                    />
                                </TouchableOpacity>

                                <>
                                    {settingsMode.showChangePassword ? (
                                        <>
                                            <UserField
                                                widthStyle={width - 30}
                                                colorBackground={colors.black20}
                                                nameIcon={'lock-closed-outline'}
                                                typeIcon={'ionicon'}
                                                labelField={'Parola veche'}
                                                dataField={' '}
                                                value={''}
                                                settingsMode={true}
                                                changeTextInput={textInputOldPasswordHandler}
                                                OnBlurMethod={oldPasswordOnBlurMethod}
                                                passwordType={true}
                                                returnKeyTypeBoolean={true}
                                                showEyeForPassword={true}
                                            />
                                            <UserField
                                                widthStyle={width - 30}
                                                colorBackground={colors.black20}
                                                nameIcon={'lock-open-outline'}
                                                typeIcon={'ionicon'}
                                                labelField={'Parola noua'}
                                                dataField={' '}
                                                value={''}
                                                settingsMode={true}
                                                changeTextInput={textInputNewPasswordHandler}
                                                OnBlurMethod={newPasswordOnBlurMethod}
                                                passwordType={true}
                                                returnKeyTypeBoolean={true}
                                                showEyeForPassword={true}
                                            />
                                            <UserField
                                                widthStyle={width - 30}
                                                colorBackground={colors.black20}
                                                nameIcon={'lock-open-outline'}
                                                typeIcon={'ionicon'}
                                                labelField={'Confirmare parola'}
                                                dataField={' '}
                                                value={''}
                                                settingsMode={true}
                                                changeTextInput={textInputR_NewPasswordHandler}
                                                OnBlurMethod={renewPasswordOnBlurMethod}
                                                passwordType={true}
                                                returnKeyTypeBoolean={false}
                                                showEyeForPassword={true}
                                            />

                                            <Text style={styles.textError}>
                                                {textError.passwordTextError}
                                            </Text>
                                        </>
                                    ) : null}
                                </>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => depunereHandler()}
                                >
                                    <UserField
                                        widthStyle={width - 30}
                                        colorBackground={colors.blackGrey}
                                        nameIcon={'creditcard'}
                                        typeIcon={'antdesign'}
                                        labelField={'Depunere'}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => showHideTicketsHandler()}
                                >
                                    <UserField
                                        widthStyle={width - 30}
                                        colorBackground={colors.blackGrey}
                                        nameIcon={'ticket-outline'}
                                        typeIcon={'material-community'}
                                        labelField={'Cupoanele mele'}
                                        sizeIcon={26}
                                    />
                                </TouchableOpacity>
                            </View>

                            <>
                                {settingsMode.showSaveButton ? (
                                    <>
                                        <View style={styles.settingsModeContainer}>
                                            <TouchableOpacity
                                                onPress={() => saveSettingsHandler()}
                                                activeOpacity={0.8}
                                            >
                                                <UserField
                                                    widthStyle={150}
                                                    colorBackground={colors.blackGrey}
                                                    nameIcon={'save-outline'}
                                                    typeIcon={'ionicon'}
                                                    labelField={'Salveaza'}
                                                    sizeIcon={16}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                ) : null}
                            </>
                        </ScrollView>
                    </>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundCategories,
        marginBottom: 60
    },
    avatarContainer: {
        zIndex: 1,
        marginTop: 10,
        marginBottom: -15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    editProfile: {
        // flex: 1,
        // marginRight: width - 160,
        top: 5,
        left: 10,
        position: 'absolute',
        zIndex: 10
    },
    header: {
        flex: 1,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: height * 0.7,
        backgroundColor: colors.backgroundButtonActive
    },
    headerRight: {
        top: 5,
        right: 10,
        position: 'absolute',
        zIndex: 10
    },
    userProfile: {
        marginTop: 50
    },
    text_balance: {
        textAlign: 'center',
        color: colors.white,
        fontSize: 14,
        fontWeight: 'bold',
        paddingRight: 10
    },
    buttonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: width - 30,
        height: 40,
        borderRadius: 10,
        marginTop: 3,
        marginBottom: 3,
        backgroundColor: colors.blackGrey
    },
    userDataInfo: {
        flex: 1,
        marginBottom: 10
    },
    textLabel: {
        marginTop: 10,
        textAlign: 'left',
        fontSize: 20,
        color: colors.black,
        fontWeight: '500'
    },
    settingsModeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: -10
    },
    logoutButton: {
        right: 4,
        position: 'absolute',
        top: 20,
        zIndex: 15
    },
    textError: {
        color: colors.textError,
        fontSize: 14,
        textAlign: 'left',
        fontWeight: '400'
    },
    centerRow: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})

export default Profile
