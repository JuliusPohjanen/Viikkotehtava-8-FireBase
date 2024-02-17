import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default function Login({ setLogin }) {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

    const login = () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, user, password)
            .then((userCredential) => {
                console.log(userCredential.user);
                setLogin(true);
            }).catch((error) => {
                if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                    console.log('Invalid credentials');
                } else if (error.code === 'auth/too-many-requests') {
                    console.log('Too many attempts to login');
                } else {
                    console.log(error.code + ' ' + error.message);
                }
            });
    }

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.heading}>Login</Text>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.field}
                    keyboardType='email-address'
                    value={user}
                    onChangeText={text => setUser(text)} // Pass text parameter to setUser
                />
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.field}
                    secureTextEntry={true} // Mask password
                    value={password}
                    onChangeText={text => setPassword(text)} // Pass text parameter to setPassword
                />
                <Button title='Login' onPress={login} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    label: {
        fontSize: 16,
        marginBottom: 5
    },
    field: {
        borderWidth: 1,
        borderColor: '#000',
        marginBottom: 20,
        padding: 10,
        fontSize: 18
    }
})
