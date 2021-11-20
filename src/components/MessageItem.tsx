import React from 'react';
import { View, Text } from 'react-native';
import { Message } from '../types/message';

type Props = {
    userId?: string;
    item: Message
}

export const MessageItem = ({ item, userId }: Props) => (
    <View
        style={
            userId === item.useId
                ? {
                    alignSelf: 'flex-end',
                    backgroundColor: '#007AFF',
                    padding: 5,
                    borderRadius: 5,
                    borderTopRightRadius: 0,
                    marginBottom: 5
                } : {
                    alignSelf: 'flex-start',
                    backgroundColor: '#fff',
                    padding: 5,
                    borderRadius: 5,
                    borderTopLeftRadius: 0,
                    marginBottom: 5
                }
        }>
        <Text style={userId == item.useId ? { color: '#fff' } : {}}>
            {item.text}
        </Text>
    </View>
)
