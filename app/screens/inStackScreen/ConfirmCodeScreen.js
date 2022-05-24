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
import {UserContext} from '../../../App';
import {Icon} from 'react-native-elements';

const width = Dimensions.get('screen').width;

function ConfirmCode({navigation, route}) {
  const [userDataLogin, setUserDataLogin] = useContext(UserContext);
  const [codeLetters, setCodeLetters] = useState({
    l1: '',
    l2: '',
    l3: '',
    l4: '',
    l5: '',
    l6: '',
    idUser: route.params.idUser,
  });

  const [errorMessage, setErrorMessage] = useState('');

  const letter1 = useRef(null);
  const letter2 = useRef(null);
  const letter3 = useRef(null);
  const letter4 = useRef(null);
  const letter5 = useRef(null);
  const letter6 = useRef(null);

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
    }
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
    }
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
    }
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
    }
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
    }
  };

  const showToastWithGravity = () => {
    ToastAndroid.showWithGravity(
      'Contul dumneavoastra a fost confirmat cu succes!',
      ToastAndroid.LONG,
      ToastAndroid.CENTER,
    );
  };
  const confirmHandler = async () => {
    let letters = codeLetters.l1
      .concat(codeLetters.l2)
      .concat(codeLetters.l3)
      .concat(codeLetters.l4)
      .concat(codeLetters.l5)
      .concat(codeLetters.l6);

    if (letters.length === 6) {
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
          `/buyers/confirm/${codeLetters.idUser}`,
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
          showToastWithGravity();
          navigation.goBack();
        }

        setErrorMessage('');
      } catch (error) {
        console.log(error.response.status);
        if (error.response.status === 404 || error.response.status === 400) {
          setErrorMessage('Codul este invalid');
        }
      }
    } else {
      setErrorMessage('Codul este invalid!');
    }
  };
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => navigation.goBack()}>
          <Icon
            name={'arrow-left'}
            type="feather"
            color={colors.backgroundButtonActive}
          />
        </TouchableOpacity>
        <Text style={styles.textInfo}>
          Introduceti codul primit din email pentru a va putea confirma contul !
        </Text>
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
            onChangeText={val => letter6Handler(val)}
          />
        </View>
        <Text style={styles.textErorr}>{errorMessage}</Text>
        <View style={styles.button}>
          <TouchableHighlight
            onPress={() => confirmHandler()}
            underlayColor={'#FFFFFF'}>
            <View style={styles.confirmButton}>
              <Text style={styles.buttonText}>Confirma contul</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
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
    color: colors.backgroundButtonActive,
    fontWeight: '500',
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
    backgroundColor: colors.backgroundBottomTabInactive,
    marginRight: 10,
    textAlign: 'center',
    color: colors.white,
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
    color: '#FFFFFF',
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
