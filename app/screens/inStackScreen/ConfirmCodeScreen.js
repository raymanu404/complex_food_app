import React, {useRef, useState, useContext} from 'react';

import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableHighlight,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import colors from '../../../config/colors/colors';
import api_axios from '../../../config/api/api_axios';
import {Icon} from 'react-native-elements';
import RenderConfirmImage from '../../components/RenderConfirmImage';
import RenderToastMessage from '../../components/RenderToastMessage';

const width = Dimensions.get('screen').width;

function ConfirmCode({navigation, route}) {
  const idUser = route.params.idUser;
  const forgotPassword = route.params.forgotPassword;
  const [codeLetters, setCodeLetters] = useState({
    l1: '',
    l2: '',
    l3: '',
    l4: '',
    l5: '',
    l6: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [showRenderToast, setShowRenderToast] = useState({
    success: false,
    fail: false,
  });

  const letter1 = useRef(null);
  const letter2 = useRef(null);
  const letter3 = useRef(null);
  const letter4 = useRef(null);
  const letter5 = useRef(null);
  const letter6 = useRef(null);

  //renderToastMessage props
  const RenderToastSuccess = props => {
    return (
      <RenderToastMessage
        multiplier={0.77}
        showComponent={props.showComponent}
        status={'success'}
        title_message={'Succes!'}
        message={'Contul este verificat cu succes!'}
      />
    );
  };

  const RenderToastFail = props => {
    return (
      <RenderToastMessage
        multiplier={0.77}
        showComponent={props.showComponent}
        status={'fail'}
        title_message={'Eroare!'}
        message={'Codul de validare este gresit!'}
      />
    );
  };

  const letter1Handler = val => {
    if (val.length !== 0) {
      setCodeLetters({
        ...codeLetters,
        l1: val,
      });

      // setCode(code.concat(val));
      letter2.current.focus();
    } else {
      setCodeLetters({
        ...codeLetters,
        l1: val,
      });
    }
    setShowRenderToast({
      ...showRenderToast,
      success: false,
      fail: false,
    });
  };

  const letter2Handler = val => {
    if (val.length !== 0) {
      setCodeLetters({
        ...codeLetters,
        l2: val,
      });
      letter3.current.focus();
    } else {
      setCodeLetters({
        ...codeLetters,
        l2: val,
      });
      letter1.current.focus();
    }
    setShowRenderToast({
      ...showRenderToast,
      success: false,
      fail: false,
    });
  };

  const letter3Handler = val => {
    if (val.length !== 0) {
      setCodeLetters({
        ...codeLetters,
        l3: val,
      });
      letter4.current.focus();
    } else {
      setCodeLetters({
        ...codeLetters,
        l3: val,
      });
      letter2.current.focus();
    }
    setShowRenderToast({
      ...showRenderToast,
      success: false,
      fail: false,
    });
  };

  const letter4Handler = val => {
    if (val.length !== 0) {
      setCodeLetters({
        ...codeLetters,
        l4: val,
      });
      letter5.current.focus();
    } else {
      setCodeLetters({
        ...codeLetters,
        l4: val,
      });
      letter3.current.focus();
    }
    setShowRenderToast({
      ...showRenderToast,
      success: false,
      fail: false,
    });
  };

  const letter5Handler = val => {
    if (val.length !== 0) {
      setCodeLetters({
        ...codeLetters,
        l5: val,
      });
      letter6.current.focus();
    } else {
      setCodeLetters({
        ...codeLetters,
        l5: val,
      });
      letter4.current.focus();
    }
    setShowRenderToast({
      ...showRenderToast,
      success: false,
      fail: false,
    });
  };

  const letter6Handler = val => {
    if (val.length !== 0) {
      setCodeLetters({
        ...codeLetters,
        l6: val,
      });
      Keyboard.dismiss();
    } else {
      setCodeLetters({
        ...codeLetters,
        l6: val,
      });

      letter5.current.focus();
    }
    setShowRenderToast({
      ...showRenderToast,
      success: false,
      fail: false,
    });
  };

  const letter1HandleKeyPress = ({nativeEvent: {key: keyValue}}) => {
    console.log(keyValue);
    if (keyValue === 'Backspace') {
      Keyboard.dismiss();
    }
  };
  const letter2HandleKeyPress = ({nativeEvent: {key: keyValue}}) => {
    console.log(keyValue);
    if (keyValue === 'Backspace') {
      letter1.current.focus();
    }
  };
  const letter3HandleKeyPress = ({nativeEvent: {key: keyValue}}) => {
    if (keyValue === 'Backspace') {
      letter2.current.focus();
    }
  };
  const letter4HandleKeyPress = ({nativeEvent: {key: keyValue}}) => {
    if (keyValue === 'Backspace') {
      letter3.current.focus();
    }
  };
  const letter5HandleKeyPress = ({nativeEvent: {key: keyValue}}) => {
    if (keyValue === 'Backspace') {
      letter4.current.focus();
    }
  };
  const letter6HandleKeyPress = ({nativeEvent: {key: keyValue}}) => {
    if (keyValue === 'Backspace') {
      letter5.current.focus();
    }
  };

  const confirmHandler = async () => {
    let letters = codeLetters.l1
      .concat(codeLetters.l2)
      .concat(codeLetters.l3)
      .concat(codeLetters.l4)
      .concat(codeLetters.l5)
      .concat(codeLetters.l6);

    if (letters.length === 6) {
      setShowRenderToast({
        ...showRenderToast,
        success: false,
        fail: false,
      });
      //api
      try {
        let headers = {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        };
        console.log(letters);
        const code = {
          confirmationCode: letters,
        };

        const response = await api_axios.patch(
          `/buyers/confirm/${idUser}`,
          code,
          headers,
        );
        console.log(response.data);
        if (response.data === 'Buyer-ul a fost confirmat cu succes!') {
          setCodeLetters({
            ...codeLetters,
            l1: '',
            l2: '',
            l3: '',
            l4: '',
            l5: '',
            l6: '',
          });
          setShowRenderToast({
            ...showRenderToast,
            success: true,
            fail: false,
          });
          setTimeout(() => {
            if (forgotPassword) {
              navigation.navigate('ForgotPasswordScreen', {idUser: idUser});
            } else {
              navigation.goBack();
            }
          }, 1000);
        }

        setErrorMessage('');
      } catch (error) {
        console.log(error.response.status);
        if (error.response.status === 404 || error.response.status === 400) {
          setShowRenderToast({
            ...showRenderToast,
            success: false,
            fail: true,
          });
          setErrorMessage('Codul este invalid');
        }
      }
    } else {
      setShowRenderToast({
        ...showRenderToast,
        success: false,
        fail: true,
      });
      setErrorMessage('Codul este invalid!');
    }
  };
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.icon}
            onPress={() => navigation.goBack()}>
            <Icon name={'arrow-left'} type="feather" color={colors.black} />
          </TouchableOpacity>
          <RenderConfirmImage
            title_message={
              forgotPassword
                ? 'Introduceti codul de verificare!'
                : 'Introduceti codul primit din email pentru a va putea confirma contul!'
            }
          />

          <View style={styles.inputLettersContainer}>
            <TextInput
              value={codeLetters.l1}
              style={styles.inputLetterCode}
              maxLength={1}
              autoCapitalize={'none'}
              ref={letter1}
              returnKeyType={'next'}
              onSubmitEditing={() => {
                letter2.current.focus();
              }}
              onKeyPress={e => letter1HandleKeyPress(e)}
              blurOnSubmit={false}
              onChangeText={val => letter1Handler(val)}
            />
            <TextInput
              value={codeLetters.l2}
              style={styles.inputLetterCode}
              maxLength={1}
              autoCapitalize={'none'}
              ref={letter2}
              onSubmitEditing={() => {
                letter3.current.focus();
              }}
              onKeyPress={e => letter2HandleKeyPress(e)}
              blurOnSubmit={false}
              returnKeyType={'next'}
              onChangeText={val => letter2Handler(val)}
            />
            <TextInput
              value={codeLetters.l3}
              style={styles.inputLetterCode}
              maxLength={1}
              autoCapitalize={'none'}
              ref={letter3}
              returnKeyType={'next'}
              onSubmitEditing={() => {
                letter4.current.focus();
              }}
              onKeyPress={e => letter3HandleKeyPress(e)}
              blurOnSubmit={false}
              onChangeText={val => letter3Handler(val)}
            />
            <TextInput
              value={codeLetters.l4}
              style={styles.inputLetterCode}
              maxLength={1}
              autoCapitalize={'none'}
              ref={letter4}
              returnKeyType={'next'}
              onSubmitEditing={() => {
                letter5.current.focus();
              }}
              onKeyPress={e => letter4HandleKeyPress(e)}
              blurOnSubmit={false}
              onChangeText={val => letter4Handler(val)}
            />
            <TextInput
              value={codeLetters.l5}
              style={styles.inputLetterCode}
              maxLength={1}
              autoCapitalize={'none'}
              ref={letter5}
              returnKeyType={'next'}
              onSubmitEditing={() => {
                letter6.current.focus();
              }}
              onKeyPress={e => letter5HandleKeyPress(e)}
              blurOnSubmit={false}
              onChangeText={val => letter5Handler(val)}
            />
            <TextInput
              value={codeLetters.l6}
              style={styles.inputLetterCode}
              maxLength={1}
              autoCapitalize={'none'}
              ref={letter6}
              returnKeyType={'done'}
              onKeyPress={e => letter6HandleKeyPress(e)}
              onChangeText={val => letter6Handler(val)}
            />
          </View>
          <Text style={styles.textErorr}>{errorMessage}</Text>
          <View style={styles.button}>
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => confirmHandler()}>
              <View style={styles.confirmButton}>
                <Text style={styles.buttonText}>Confirma contul</Text>
              </View>
            </TouchableOpacity>
          </View>
          {showRenderToast.success ? (
            <RenderToastSuccess showComponent={true} />
          ) : showRenderToast.fail ? (
            <RenderToastFail showComponent={true} />
          ) : null}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundCategories,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  textErorr: {
    textAlign: 'center',
    display: 'flex',
    fontSize: 16,
    color: colors.textError,
    fontWeight: '500',
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
  },
  textInfo: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.white,
    fontWeight: '500',
    letterSpacing: 1,
  },
  inputLettersContainer: {
    paddingBottom: 20,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputLetterCode: {
    width: 40,
    height: 40,
    maxWidth: 40,
    maxHeight: 40,
    backgroundColor: colors.backgroundApp,
    marginRight: 10,
    textAlign: 'center',
    color: colors.backgroundButtonActive,
    fontSize: 26,
    fontWeight: '400',
    borderRadius: 8,
    paddingTop: 5,
    paddingBottom: 5,
    alignContent: 'center',
  },
  confirmButton: {
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
  icon: {
    position: 'absolute',
    top: 10,
    left: 0,
  },
});

export default ConfirmCode;
