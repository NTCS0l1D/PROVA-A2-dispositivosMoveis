import React, { useEffect, useState } from 'react';
import { View, FlatList, Alert, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, FAB, IconButton, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tela que exibe a lista de motos cadastradas
export default function MotoList({ navigation }) {
  const [motos, setMotos] = useState([]); // Estado que armazena a lista de motos
  const theme = useTheme(); // Hook do React Native Paper para acessar o tema

  // useEffect que atualiza a lista de motos sempre que a tela ganha foco
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadMotos);
    return unsubscribe;
  }, [navigation]);

  // Função que carrega as motos do AsyncStorage
  async function loadMotos() {
    const data = await AsyncStorage.getItem('motos');
    if (data) setMotos(JSON.parse(data));
  }

  // Função que lida com a exclusão de uma moto
  async function handleDelete(index) {
    Alert.alert(
      'Confirmação',
      'Deseja excluir esta moto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            const updatedMotos = motos.filter((_, i) => i !== index); // Remove a moto da lista
            setMotos(updatedMotos); // Atualiza o estado
            await AsyncStorage.setItem('motos', JSON.stringify(updatedMotos)); // Salva as mudanças
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  }

  // Função que renderiza cada item da lista de motos
  const renderItem = ({ item, index }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{item.modelo}</Title>
        <Paragraph style={styles.paragraph}>Ano: {item.ano}</Paragraph>
        <Paragraph style={styles.paragraph}>Placa: {item.placa}</Paragraph>
        <Paragraph style={styles.paragraph}>Cor: {item.cor}</Paragraph>
        <Paragraph style={styles.paragraph}>Chassi: {item.chassi}</Paragraph>
        <Paragraph style={styles.paragraph}>Observações: {item.observacoes}</Paragraph>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        {/* Botão de edição */}
        <IconButton
          icon="pencil"
          size={22}
          onPress={() => navigation.navigate('MotoForm', { index })}
          iconColor="#ff6f00"
        />
        {/* Botão de exclusão */}
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
      {/* Lista de motos renderizada com FlatList */}
      <FlatList
        data={motos}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      {/* Botão flutuante para adicionar nova moto */}
      <FAB
        icon="plus"
        onPress={() => navigation.navigate('MotoForm')}
        style={styles.fab}
        color="#fff"
      />
    </View>
  );
}

// Estilização da tela
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fundo escuro
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
