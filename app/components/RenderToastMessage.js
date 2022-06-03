import React, {useRef, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Icon} from 'react-native-elements';
import colors from '../../config/colors/colors';

const RenderToastMessage = props => {
  const [showComponent, setShowComponent] = useState(props.showComponent);
  const windowHeight = Dimensions.get('window').height;
  const popAnim = useRef(new Animated.Value(windowHeight * -1)).current;

  const popIn = () => {
    Animated.timing(popAnim, {
      toValue: windowHeight * props.multiplier * -1,
      duration: 300,
      useNativeDriver: true,
    }).start(popOut());
  };

  const popOut = () => {
    setTimeout(() => {
      Animated.timing(popAnim, {
        toValue: windowHeight * -1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setShowComponent(false);
    }, 5000);
  };

  const instantPopOut = () => {
    Animated.timing(popAnim, {
      toValue: windowHeight * -1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };
  useEffect(() => {
    popIn();
    return () => {
      setShowComponent(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View>
      {showComponent ? (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              transform: [{translateY: popAnim}],
            },
          ]}>
          <View style={styles.toastRow}>
            <Icon
              name={
                props.status === 'success' ? 'checkcircleo' : 'closecircleo'
              }
              type={'antdesign'}
              size={24}
              color={
                props.status === 'success'
                  ? colors.successToastColor
                  : colors.failToastColor
              }
              style={{paddingLeft: 5}}
            />

            <View style={styles.toastText}>
              <Text style={{fontWeight: 'bold', fontSize: 15}}>
                {props.title_message}
              </Text>
              <Text style={{fontSize: 14}}>{props.message}</Text>
            </View>
            <TouchableOpacity onPress={instantPopOut}>
              <Icon
                name={'x-circle'}
                type={'feather'}
                size={24}
                color={colors.blackGrey}
                style={{paddingLeft: 5}}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      ) : (
        <View style={styles.emptyDiv}></View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    height: 60,
    width: 350,
    backgroundColor: colors.backgroundApp,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyDiv: {
    marginBottom: 60,
  },
  toastRow: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  toastText: {
    width: '70%',
    padding: 2,
  },
});
export default RenderToastMessage;
