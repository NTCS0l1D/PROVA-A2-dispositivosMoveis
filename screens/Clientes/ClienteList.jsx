import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, FAB, IconButton, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componente responsável por exibir a lista de clientes cadastrados
export default function ClienteList({ navigation }) {
  // Estado que armazena os clientes carregados do AsyncStorage
  const [clientes, setClientes] = useState([]);
  const theme = useTheme(); // Hook do Paper para usar cores e temas

  // useEffect que recarrega os dados sempre que a tela ganha foco
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadClientes);
    return unsubscribe;
  }, [navigation]);

  // Função que busca os dados salvos no AsyncStorage e atualiza o estado
  async function loadClientes() {
    const data = await AsyncStorage.getItem('clientes');
    if (data) setClientes(JSON.parse(data));
  }

  // Função chamada ao pressionar o botão de exclusão
  async function handleDelete(index) {
    Alert.alert(
      'Confirmação',
      'Deseja excluir este cliente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            // Remove o cliente do array e atualiza o armazenamento
            const updatedClientes = clientes.filter((_, i) => i !== index);
            setClientes(updatedClientes);
            await AsyncStorage.setItem('clientes', JSON.stringify(updatedClientes));
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  }

  // Função que renderiza cada item da lista
  const renderItem = ({ item, index }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{item.nome}</Title>
        <Paragraph style={styles.paragraph}>Email: {item.email}</Paragraph>
        <Paragraph style={styles.paragraph}>Telefone: {item.telefone}</Paragraph>
        <Paragraph style={styles.paragraph}>CPF: {item.cpf}</Paragraph>
        <Paragraph style={styles.paragraph}>Nascimento: {item.nascimento}</Paragraph>
      </Card.Content>

      {/* Botões de editar e excluir no final do card */}
      <Card.Actions style={styles.actions}>
        <IconButton
          icon="pencil"
          size={22}
          onPress={() => navigation.navigate('ClienteForm', { index })}
          iconColor="#ff6f00"
        />
        <IconButton
          icon="delete"
          size={22}
          onPress={() => handleDelete(index)}
          iconColor="#ff4444"
        />
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Lista dos clientes */}
      <FlatList
        data={clientes}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      {/* Botão flutuante para adicionar novo cliente */}
      <FAB
        icon="plus"
        onPress={() => navigation.navigate('ClienteForm')}
        style={styles.fab}
        color="#fff"
      />
    </View>
  );
}

// Estilos visuais da tela
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  listContent: {
    paddingBottom: 100,
    paddingTop: 16,
  },
  card: {
    backgroundColor: '#121212',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 12,
    elevation: 4,
    borderColor: '#ff6f00',
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6f00',
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: '#f0f0f0',
    marginBottom: 2,
  },
  actions: {
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#ff6f00',
    borderRadius: 28,
    elevation: 4,
  },
});
