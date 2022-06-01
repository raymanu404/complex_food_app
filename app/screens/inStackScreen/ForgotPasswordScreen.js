import React, {useState, useRef} from 'react';

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
} from 'react-native';
import {Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import api_axios from '../../config/api/api_axios';
import colors from '../../../config/colors/colors';

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 40;

function ForgotPassword({navigation, route}) {
  const idUser = route.params.idUser;
  const [onFocusInput, setOnFocusInput] = useState({
    firstNameOnFocus: false,
    lastNameOnFocus: false,
    phoneOnFocus: false,
    emailOnFocus: false,
    passwordOnFocus: false,
    re_passwordOnFocus: false,
  });

  const passwordRef = useRef(null);
  const re_passwordRef = useRef(null);

  const [textError, setTextError] = useState('');
  const [userInfo, setUserInfo] = useState({
    password: '',
    re_password: '',
  });

  const [invalidInput, setInvalidInput] = useState({
    passwordError: false,
    re_passwordError: false,
    passwordTypeError: '',
    re_passwordTypeError: '',
    emptyFiledsError: '',
  });

  const [passwordVisible, setPasswordVisible] = useState({
    password: false,
    re_password: false,
  });

  // CHANGE PASSWORD AND RE_PASSWORD VISIBILITY
  const changePasswordVisibility = () => {
    setPasswordVisible({
      ...passwordVisible,
      password: !passwordVisible.password,
    });
  };

  const changeRe_passwordVisibility = () => {
    setPasswordVisible({
      ...passwordVisible,
      re_password: !passwordVisible.re_password,
    });
  };

  // PASSWORD TEXT HANDLER
  const passwordTextHandler = val => {
    if (String(val).length !== 0 && validatePassword(val)) {
      setUserInfo({
        ...userInfo,
        password: val,
      });

      setInvalidInput({
        ...invalidInput,
        passwordError: false,
        passwordTypeError: '',
      });
    } else {
      setUserInfo({
        ...userInfo,
        password: val,
      });
      setInvalidInput({
        ...invalidInput,
        passwordError: true,
      });
    }

    onFocusPassword(val, 'password');
  };

  // RE_PASSWORD TEXT HANDLER
  const re_passwordTextHandler = val => {
    if (String(val).length !== 0 && String(val) === String(userInfo.password)) {
      setUserInfo({
        ...userInfo,
        re_password: val,
      });

      setInvalidInput({
        ...invalidInput,
        re_passwordError: false,
        re_passwordTypeError: '',
      });
    } else {
      setUserInfo({
        ...userInfo,
        re_password: val,
      });
      setInvalidInput({
        ...invalidInput,
        re_passwordError: true,
      });
    }
    onFocusPassword(val, 're_password');
  };

  const onFocusPassword = (val, passowrdType) => {
    switch (passowrdType) {
      case 'password':
        if (!String(val).match(new RegExp(/[0-9]/))) {
          setInvalidInput({
            ...invalidInput,
            passwordError: true,
            passwordTypeError: 'Parola trebuie sa contina [0-9]',
          });
        }

        if (
          String(val).length < MIN_PASSWORD_LENGTH ||
          String(val).length > MAX_PASSWORD_LENGTH
        ) {
          setInvalidInput({
            ...invalidInput,
            passwordError: true,
            passwordTypeError: `Parola trebuie sa fie intre ${MIN_PASSWORD_LENGTH} - ${MAX_PASSWORD_LENGTH} caractere`,
          });
        }
        break;
      case 're_password':
        if (String(val) !== String(userInfo.password)) {
          setInvalidInput({
            ...invalidInput,
            re_passwordError: true,
            re_passwordTypeError: 'Parolele nu corespund!',
          });
        }
        break;
    }
  };

  const validatePassword = password => {
    var regularExpression = /^(?=.*[0-9])(?=.*)[a-zA-Z0-9]{8,40}$/;
    return String(password).match(regularExpression);
  };

  const changePasswordHandler = async () => {
    try {
      let headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      };

      let dataToSend = {
        password: userInfo.password,
      };

      const responseChangePassword = await api_axios.post(
        `/buyers/change-password/${idUser}`,
        dataToSend,
        headers,
      );

      if (responseChangePassword.status === 200) {
        if (
          String(responseChangePassword.data).startsWith(
            'Password was updated successfully!',
          )
        ) {
          //un timer ceva pentru 2 secunde si un mesaj de confirmare
          navigation.navigate('LoginScreen');
        }
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <View style={styles.container}>
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
              style={[styles.icon, {paddingLeft: 10}]}
            />
            <TextInput
              ref={passwordRef}
              returnKeyType="next"
              onSubmitEditing={() => re_passwordRef.current.focus()}
              onChangeText={val => passwordTextHandler(val)}
              value={userInfo.password}
              style={[
                !onFocusInput.passwordOnFocus
                  ? styles.textInput
                  : styles.textInputFocusOn,
                {fontWeight: '500'},
              ]}
              onFocus={() =>
                setOnFocusInput({...onFocusInput, passwordOnFocus: true})
              }
              onBlur={() =>
                setOnFocusInput({...onFocusInput, passwordOnFocus: false})
              }
              autoCapitalize="none"
              placeholder="Parola"
              secureTextEntry={passwordVisible.password}
              placeholderTextColor={colors.backgroundButtonActive}
            />
            <TouchableOpacity
              onPress={() => changePasswordVisibility()}
              style={[styles.icon, {marginLeft: width * 0.1}]}>
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
        {/* ------------------------------------- CONFIRMARE PAROLA --------------------------------------*/}
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
              style={[styles.icon, {paddingLeft: 10}]}
            />
            <TextInput
              ref={re_passwordRef}
              onChangeText={val => re_passwordTextHandler(val)}
              value={userInfo.re_password}
              style={[
                !onFocusInput.re_passwordOnFocus
                  ? styles.textInput
                  : styles.textInputFocusOn,
                {fontWeight: '500'},
              ]}
              onFocus={() =>
                setOnFocusInput({
                  ...onFocusInput,
                  re_passwordOnFocus: true,
                })
              }
              onBlur={() =>
                setOnFocusInput({
                  ...onFocusInput,
                  re_passwordOnFocus: false,
                })
              }
              autoCapitalize="none"
              placeholder="Confirmare parola"
              secureTextEntry={passwordVisible.re_password}
              placeholderTextColor={colors.backgroundButtonActive}
            />
            <TouchableOpacity
              style={[styles.icon, {marginLeft: width * 0.1}]}
              onPress={() => changeRe_passwordVisibility()}>
              <Icon
                name={passwordVisible.re_password ? 'eye-off' : 'eye'}
                type="feather"
                color={colors.backgroundButtonActive}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.textErrorInput}>
            {invalidInput.re_passwordError
              ? invalidInput.re_passwordTypeError
              : ''}
          </Text>
        </View>
        <TouchableHighlight
          underlayColor={colors.backgroundApp}
          onPress={() => changePasswordHandler()}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Schimba parola</Text>
          </View>
        </TouchableHighlight>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    borderRadius: 20,
    marginVertical: 5,
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
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
    borderRadius: 20,
    marginVertical: 5,
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
    height: 48,
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
    height: 48,
  },
  icon: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  registerSection: {
    flex: 1,
    // display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: height * 0.02,
  },
  textSuggest: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 16,
    color: colors.backgroundButtonActive,
    fontWeight: '700',
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
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  buttonText: {
    textAlign: 'center',
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  textErrorInput: {
    paddingLeft: 10,
    textAlign: 'left',
    fontSize: 14,
    color: colors.blackGrey,
    fontWeight: '700',
  },
  displayColumn: {flexDirection: 'column'},
});

export default ForgotPassword;
