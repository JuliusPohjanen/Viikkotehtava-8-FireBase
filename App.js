import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View,Button, SafeAreaView,ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { firestore, collection, addDoc, serverTimestamp,MESSAGES } from './firebase/config';
import { onSnapshot, query, orderBy } from 'firebase/firestore';
import Constants from 'expo-constants';
import { convertFirebaseTimestampToJS } from './helpers/Functions';
import Login from './screen/login';


export default function App() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [logged, setLogged] = useState(false)

  const save = async () => {
    const docRef = await addDoc(collection(firestore, MESSAGES), {
      text: newMessage,
      created: serverTimestamp()
    }).catch(error => console.log(error))
    setNewMessage('');
    console.log('Message saved.')
  }

  useEffect(() => {
    const q = query(collection(firestore, MESSAGES), orderBy('created', 'desc'))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tempMessages = []

        querySnapshot.forEach((doc) => {
          // Create and format message object based on the retrieved data from database.
          const messageObject = {
            id: doc.id,
            text: doc.data().text,
            created: convertFirebaseTimestampToJS(doc.data().created)
          }
          tempMessages.push(messageObject)
        })
        setMessages(tempMessages)
      })
      return () => {
        unsubscribe()
      }
  }, [])

  if (logged) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      {
        messages.map((message) => (
          <View style={styles.message} key={message.id}>
            <Text style={styles.messageInfo}>{message.created}</Text>
            <Text>{message.text}</Text>
          </View>
        ))
      }
      </ScrollView>
    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
      <TextInput style={{flex: 0.75}} placeholder='Send message...' value={newMessage} onChangeText={setNewMessage} />
      <Button style={{flex: 0.25}} title='Send' type="button" onPress={save} />
    </View>
    </SafeAreaView>
  )
} else {
  return <Login setLogin={setLogged}/>
}
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: '#fff',
  },
  message: {
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  messageInfo: {
    fontSize: 12
  }
});
