import React, { useEffect, useState } from 'react';
import { ScrollView, Linking, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import moment from 'moment';
import 'moment/locale/pt-br';

export default function NoticiasMotos() {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    async function fetchNoticias() {
      try {
        const response = await fetch(
          'https://newsapi.org/v2/everything?q=moto&language=pt&apiKey=c0a60a2a987e46b18574c47f86db9ae3'
        );
        const data = await response.json();
        setNoticias(data.articles);
      } catch (error) {
        console.error('Erro ao buscar notícias:', error);
      }
    }

    fetchNoticias();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.header}>📰 Notícias do Mundo das Motos</Title>
      {noticias.map((noticia, index) => (
        <Card
          key={index}
          style={styles.card}
          onPress={() => Linking.openURL(noticia.url)}
        >
          {noticia.urlToImage && (
            <Card.Cover source={{ uri: noticia.urlToImage }} style={styles.image} />
          )}
          <Card.Content>
            <Title style={styles.title}>{noticia.title}</Title>
            <Paragraph style={styles.date}>
              {moment(noticia.publishedAt).format('D [de] MMMM [de] YYYY, HH:mm')}
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              {noticia.description || 'Clique para ler mais...'}
            </Paragraph>
          </Card.Content>
          <Card.Actions>
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
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#ff6f00',
  },
  card: {
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: '#121212',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ff6f00',
    elevation: 4,
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
