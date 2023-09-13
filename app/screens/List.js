import {View, Text, Button, StyleSheet, TextInput, FlatList} from 'react-native';
import React, { useEffect, useState } from 'react';
import { FIRESTORE_DB } from '../../firebaseConfig';
import {doc, deleteDoc, onSnapshot, addDoc, collection, updateDoc } from 'firebase/firestore'; 
import { Entypo, AntDesign } from '@expo/vector-icons'; 

const List = ({ navigation }) => {
    const [items, setItems] = useState([]);
    const [item, setItem] = useState('');
    const itemCollectionRef = collection(FIRESTORE_DB, 'items');

    useEffect(() => {
        const subscriber = onSnapshot(itemCollectionRef, {
            next: (snapshot) => {
                const items = [];
                snapshot.docs.forEach((doc) => {
                    items.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });
                setItems(items)
            }
        });

        return () => subscriber();
    }, []);

    const addItem = async() => {
        const doc = await addDoc(itemCollectionRef, {title: item, quantity: 1});
        setItem('');
    }

    const deleteItem = async(id) => {
        const itemDoc = doc(FIRESTORE_DB, "items", id);
        deleteDoc(itemDoc);
    }

    const changeQuantity = async(id, newQuantity) => {
        const itemDoc = doc(FIRESTORE_DB, "items", id);
        updateDoc(itemDoc, {quantity: newQuantity});
    }

    const renderItem = ({item}) => {

        return (
            <View style={styles.itemContainer}>
                <Text  style={styles.itemText}>{item.title}: {item.quantity}</Text>
                <AntDesign name="plus" size={24} color="black" onPress={() => changeQuantity(item.id, item.quantity + 1)}/>
                <AntDesign name="minus" size={24} color="black" onPress={() => changeQuantity(item.id, Math.max(1, item.quantity - 1))}/>
                <Entypo style={styles.itemRemove} name="trash" size={24} color="black" onPress={() => deleteItem(item.id)} />
            </View>
        )
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <TextInput style={styles.input} placeholder = "Add new item" onChangeText={(text) => setItem(text)} value={item} />
                <Button onPress={() => addItem()} title="Add Item" disabled={item === ''}/>
            </View>
            { items.length > 0 && (
            <View>
                <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                />
            </View>
            )}
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
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 4
    },
    itemText: {
        flex: 1,
        paddingHorizontal: 4
    },
    itemRemove: {
        paddingHorizontal: 2
    }
})