import React, { useEffect, useState } from 'react';
import { ScrollView, Linking, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, ActivityIndicator } from 'react-native-paper';
import moment from 'moment';
import 'moment/locale/pt-br';

// Componente principal que exibe as notícias sobre motos
export default function NoticiasMotos() {
  const [noticias, setNoticias] = useState([]); // Armazena as notícias
  const [loading, setLoading] = useState(true); // Controla o estado de carregamento

  // useEffect executa a função ao carregar o componente
  useEffect(() => {
    async function fetchNoticias() {
      try {
        // Requisição para buscar notícias relacionadas a "motos"
        const response = await fetch(
          'https://newsapi.org/v2/everything?q=motos&language=pt&apiKey=c0a60a2a987e46b18574c47f86db9ae3'
        );
        const data = await response.json();
        setNoticias(data.articles.slice(0, 10)); // Armazena os 15 primeiros artigos
      } catch (error) {
        console.error('Erro ao buscar notícias:', error); // Loga o erro
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    }

    fetchNoticias(); // Chama a função de busca
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.header}> Notícias do Mundo das Motos</Title>

      {/* Exibe indicador de carregamento enquanto busca dados */}
      {loading ? (
        <ActivityIndicator animating={true} size="large" color="#ff6f00" style={{ marginTop: 32 }} />
      ) : (
        // Mapeia as notícias e exibe cada uma em um Card
        noticias.map((noticia, index) => (
          <Card
            key={index}
            style={styles.card}
            onPress={() => Linking.openURL(noticia.url)} // Abre o link da notícia
          >
            {/* Exibe imagem da notícia se existir */}
            {noticia.urlToImage && (
              <Card.Cover source={{ uri: noticia.urlToImage }} style={styles.image} />
            )}
            <Card.Content>
              <Title style={styles.title}>{noticia.title}</Title>
              {/* Formata a data de publicação */}
              <Paragraph style={styles.date}>
                {moment(noticia.publishedAt).format('D [de] MMMM [de] YYYY, HH:mm')}
              </Paragraph>
              {/* Descrição da notícia ou texto padrão */}
              <Paragraph style={styles.paragraph}>
                {noticia.description || 'Clique para ler mais...'}
              </Paragraph>
            </Card.Content>
            <Card.Actions>
              {/* Botão que abre a notícia no navegador */}
              <Button
                icon="link"
                mode="outlined"
                textColor="#ff6f00"
                onPress={() => Linking.openURL(noticia.url)}
                style={styles.button}
              >
                Ler mais
              </Button>
            </Card.Actions>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

// Estilos visuais da tela
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000', // Fundo escuro
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#ff6f00', // Laranja vibrante
  },
  card: {
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: '#121212',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ff6f00',
    elevation: 4, // Sombra
  },
  image: {
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#ff6f00',
  },
  paragraph: {
    fontSize: 14,
    color: '#f0f0f0',
    marginBottom: 12,
  },
  date: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 4,
  },
  button: {
    marginLeft: 'auto',
    marginRight: 12,
    marginBottom: 12,
    borderColor: '#ff6f00',
  },
});
