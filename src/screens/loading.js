import React from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import colors from '../../config/colors/colors'

function Loading() {
    return (
        <View style={styles.container}>
            <ActivityIndicator
                size="large"
                color={colors.backgroundButtonActive}
                style={{ marginTop: 10 }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default Loading
