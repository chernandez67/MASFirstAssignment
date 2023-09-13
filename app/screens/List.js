import {View, Text, Button, StyleSheet, TextInput, FlatList} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { FIRESTORE_DB } from '../../firebaseConfig';
import {doc, deleteDoc, onSnapshot, addDoc, collection, updateDoc } from 'firebase/firestore'; 
import { Entypo, AntDesign } from '@expo/vector-icons'; 

const List = ({ navigation }) => {
    const [todos, setTodos] = useState([]);
    const [todo, setTodo] = useState('');
    const todoCollectionRef = collection(FIRESTORE_DB, 'items');

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
        const doc = await addDoc(todoCollectionRef, {title: todo, quantity: 1});
        setTodo('');
    }

    const deleteItem = async(id) => {
        const itemDoc = doc(FIRESTORE_DB, "items", id);
        deleteDoc(itemDoc);
    }

    const changeQuantity = async(id, newQuantity) => {
        const itemDoc = doc(FIRESTORE_DB, "items", id);
        updateDoc(itemDoc, {quantity: newQuantity});
    }

    const renderTodo = ({item}) => {

        return (
            <View style={styles.todoContainer}>
                <Text  style={styles.todoText}>{item.title}: {item.quantity}</Text>
                <AntDesign name="plus" size={24} color="black" onPress={() => changeQuantity(item.id, item.quantity + 1)}/>
                <AntDesign name="minus" size={24} color="black" onPress={() => changeQuantity(item.id, Math.max(1, item.quantity - 1))}/>
                <Entypo name="trash" size={24} color="black" onPress={() => deleteItem(item.id)} />
            </View>
        )
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <TextInput style={styles.input} placeholder = "Add new item" onChangeText={(text) => setTodo(text)} value={todo} />
                <Button onPress={() => addTodo()} title="Add Item" disabled={todo === ''}/>
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