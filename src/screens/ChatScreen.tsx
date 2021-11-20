import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text, SafeAreaView,
    TextInput, Button, View, Alert, KeyboardAvoidingView, FlatList
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar'
import firebase from 'firebase';
import { getMessageDocRef, getUserId } from '../lib/firebase';
import { Message } from '../types/message';
import { MessageItem } from '../components/MessageItem';
import * as Haptics from "expo-haptics";

export const ChatScrenn = () => {
    const [text, setText] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [userId, setUserId] = useState<string | undefined>();
    const sendMessage = async (value: string, uid?: string) => {
        if (value != '') {
            try {
                const docRef = await getMessageDocRef();
                const newMessage: Message = {
                    text: value,
                    createdAt: firebase.firestore.Timestamp.now(),
                    useId: uid
                };
                await Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                );
                await docRef.set(newMessage);
                setText('');
            }
            catch (error) {
                throw new Error('I failed you');
            }
        } else {
            Alert.alert('エラー', 'メッセージを入力してください！')
        }
    };

    const getMessages = async () => {
        const messages: Message[] = [];
        try {
            await firebase
                .firestore()
                .collection('messages')
                .orderBy('createdAt')
                .onSnapshot((snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            messages.push(change.doc.data() as Message)
                        }
                        setMessages(messages);
                    })
                });
        } catch (error) {
            throw new Error('I failed you');
        }
    };

    const signin = async () => {
        const uid = await getUserId();
        setUserId(uid);
    }

    useEffect(() => {
        getMessages();
        signin();
    }, [])
    return (
        <SafeAreaView style={styles.container}>
            <ExpoStatusBar style='light' />
            <KeyboardAvoidingView behavior='padding' style={styles.keyboardAvoidingView}>
                <FlatList
                    style={styles.messagesContainer}
                    data={messages}
                    inverted={true}
                    renderItem={
                        ({ item }: { item: Message }) => (
                            <MessageItem userId={userId} item={item} />
                        )
                    }
                    keyExtractor={(_, index) => index.toString()}
                />
                <View style={styles.inputTextContainer}>
                    <TextInput
                        style={styles.inputText}
                        onChangeText={(val) => { setText(val) }}
                        value={text}
                        placeholder="メッセージを入力してください"
                        placeholderTextColor='#777'
                        autoCapitalize='none'
                        autoCorrect={false}
                        returnKeyType='done'
                    />
                    <Button title="send" onPress={() => { sendMessage(text, userId); }} />

                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center'
    },
    keyboardAvoidingView: {
        width: '100%',
        flex: 1
    },
    messagesContainer: {
        width: '100%',
        padding: 10
    },
    inputTextContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputText: {
        color: '#fff',
        borderWidth: 1,
        borderColor: '#999',
        height: 32,
        flex: 1,
        borderRadius: 5,
        paddingHorizontal: 10
    }
})
