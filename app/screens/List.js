import {View, Text, Button, StyleSheet, TextInput, FlatList} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { FIRESTORE_DB } from '../../firebaseConfig';
import {doc, deleteDoc, onSnapshot, addDoc, collection } from 'firebase/firestore'; 
import { Entypo } from '@expo/vector-icons'; 

const List = ({ navigation }) => {
    const [todos, setTodos] = useState([]);
    const [todo, setTodo] = useState('');
    const todoCollectionRef = collection(FIRESTORE_DB, 'todos');

    useEffect(() => {
        const subscriber = onSnapshot(todoCollectionRef, {
            next: (snapshot) => {
                const todos = [];
                snapshot.docs.forEach((doc) => {
                    todos.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });
                setTodos(todos)
            }
        });

        return () => subscriber();
    }, []);

    const addTodo = async() => {
        const doc = await addDoc(todoCollectionRef, {title: todo, done: false});
        setTodo('');
    }

    const deleteTodo = async(id) => {
        const todoDoc = doc(FIRESTORE_DB, "todos", id);
        deleteDoc(todoDoc);
    }

    const renderTodo = ({item}) => {

        return (
            <View style={styles.todoContainer}>
                <Text  style={styles.todoText}>{item.title} </Text>
                <Entypo name="trash" size={24} color="black" onPress={() => deleteTodo(item.id)} />
            </View>
        )
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <TextInput style={styles.input} placeholder = "Add new todo" onChangeText={(text) => setTodo(text)} value={todo} />
                <Button onPress={() => addTodo()} title="Add Todo" disabled={todo === ''}/>
            </View>
            { todos.length > 0 && (
            <View>
                <FlatList
                data={todos}
                renderItem={renderTodo}
                keyExtractor={(todo) => todo.id}
                />
            </View>
            )}
            {/* <Button onPress={() => navigation.navigate('Details')} title="Open Details" /> */}
        </View>
    )
};

export default List

styles = StyleSheet.create({
    container: {
        marginHorizontal: 20
    },
    form: {
        marginVertical: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'
    },
    todoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 4
    },
    todoText: {
        flex: 1,
        paddingHorizontal: 4
    }
})