import React, { useEffect, useState } from 'react';
import { View, FlatList, Alert, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, FAB, IconButton, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ServicoList({ navigation }) {
  const [servicos, setServicos] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadServicos);
    return unsubscribe;
  }, [navigation]);

  async function loadServicos() {
    const data = await AsyncStorage.getItem('servicos');
    if (data) setServicos(JSON.parse(data));
  }

  function handleEdit(index) {
    navigation.navigate('ServicoForm', { index });
  }

  function handleAdd() {
    navigation.navigate('ServicoForm');
  }

  function handleDelete(index) {
    Alert.alert(
      'Confirmação',
      'Deseja excluir este serviço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            const updatedServicos = servicos.filter((_, i) => i !== index);
            setServicos(updatedServicos);
            await AsyncStorage.setItem('servicos', JSON.stringify(updatedServicos));
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  }

  const renderItem = ({ item, index }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>Cliente: {item.cliente}</Title>
        <Paragraph style={styles.paragraph}>Modelo: {item.moto}</Paragraph>
        <Paragraph style={styles.paragraph}>Serviço: {item.descricao}</Paragraph>
        <Paragraph style={styles.paragraph}>Data: {item.data}</Paragraph>
        <Paragraph style={styles.paragraph}>
          Valor: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)}
        </Paragraph>
        <Paragraph style={styles.paragraph}>Status: {item.status}</Paragraph>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <IconButton
          icon="pencil"
          size={22}
          onPress={() => handleEdit(index)}
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
      <FlatList
        data={servicos}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      <FAB
        icon="plus"
        onPress={handleAdd}
        style={styles.fab}
        color="#fff"
      />
    </View>
  );
}

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
