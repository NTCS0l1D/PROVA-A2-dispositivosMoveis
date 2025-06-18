// Importação de hooks e componentes necessários
import React, { useEffect, useState } from 'react';
import { View, FlatList, Alert, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, FAB, IconButton, useTheme,} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componente principal: lista de serviços
export default function ServicoList({ navigation }) {
  // Estado que armazena a lista de serviços
  const [servicos, setServicos] = useState([]);

  // Hook para acessar o tema atual (pode ser usado futuramente)
  const theme = useTheme();

  // useEffect para recarregar a lista toda vez que a tela for focada
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadServicos);
    return unsubscribe; // Remove o listener ao desmontar
  }, [navigation]);

  // Função que carrega os serviços do AsyncStorage
  async function loadServicos() {
    const data = await AsyncStorage.getItem('servicos');
    if (data) {
      setServicos(JSON.parse(data)); // Converte o JSON e atualiza o estado
    }
  }

  // Navega para o formulário passando o índice do serviço para edição
  function handleEdit(index) {
    navigation.navigate('ServicoForm', { index });
  }

  // Navega para o formulário para adicionar um novo serviço
  function handleAdd() {
    navigation.navigate('ServicoForm');
  }

  // Exibe alerta para confirmar exclusão e atualiza a lista
  function handleDelete(index) {
    Alert.alert(
      'Confirmação',
      'Deseja excluir este serviço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const updatedServicos = servicos.filter((_, i) => i !== index); // Remove o item pelo índice
            setServicos(updatedServicos); // Atualiza o estado local
            await AsyncStorage.setItem('servicos', JSON.stringify(updatedServicos)); // Atualiza o AsyncStorage
          },
        },
      ],
      { cancelable: true }
    );
  }

  // Função que renderiza cada item da lista de serviços
  const renderItem = ({ item, index }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>Cliente: {item.cliente}</Title>
        <Paragraph style={styles.paragraph}>Modelo: {item.moto}</Paragraph>
        <Paragraph style={styles.paragraph}>Serviço: {item.descricao}</Paragraph>
        <Paragraph style={styles.paragraph}>Data: {item.data}</Paragraph>
        <Paragraph style={styles.paragraph}>
          Valor:{' '}
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(item.valor)}
        </Paragraph>
        <Paragraph style={styles.paragraph}>Status: {item.status}</Paragraph>
      </Card.Content>

      {/* Ações de editar e excluir */}
      <Card.Actions style={styles.actions}>
        <IconButton
          icon="pencil"
          size={22}
          onPress={() => handleEdit(index)}
          iconColor="#ff6f00" // Laranja
        />
        <IconButton
          icon="delete"
          size={22}
          onPress={() => handleDelete(index)}
          iconColor="#ff4444" // Vermelho
        />
      </Card.Actions>
    </Card>
  );

  // Retorno da interface da tela
  return (
    <View style={styles.container}>
      {/* Lista de serviços com FlatList */}
      <FlatList
        data={servicos}
        keyExtractor={(_, index) => index.toString()} // Cada item precisa de uma chave única
        renderItem={renderItem} // Função que renderiza cada card
        contentContainerStyle={styles.listContent}
      />

      {/* Botão flutuante para adicionar novo serviço */}
      <FAB
        icon="plus"
        onPress={handleAdd}
        style={styles.fab}
        color="#fff"
      />
    </View>
  );
}

// Estilos personalizados
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fundo preto
  },
  listContent: {
    paddingBottom: 100,
    paddingTop: 16,
  },
  card: {
    backgroundColor: '#121212', // Card escuro
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 12,
    elevation: 4,
    borderColor: '#ff6f00', // Borda laranja
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6f00', // Texto laranja
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: '#f0f0f0', // Texto claro
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
    backgroundColor: '#ff6f00', // Botão laranja
    borderRadius: 28,
    elevation: 4,
  },
});