import React, { useEffect, useState } from 'react';
import { View, Dimensions, ScrollView, StyleSheet, Text } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart } from 'react-native-chart-kit';

export default function Dashboard() {
  const [clientesCount, setClientesCount] = useState(0);
  const [motosCount, setMotosCount] = useState(0);
  const [servicosCount, setServicosCount] = useState(0);
  const [faturamentoTotal, setFaturamentoTotal] = useState(0);
  const [ultimoServico, setUltimoServico] = useState(null);
  const [ticketMedio, setTicketMedio] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const clientesData = await AsyncStorage.getItem('clientes');
    const motosData = await AsyncStorage.getItem('motos');
    const servicosData = await AsyncStorage.getItem('servicos');

    const clientes = clientesData ? JSON.parse(clientesData) : [];
    const motos = motosData ? JSON.parse(motosData) : [];
    const servicos = servicosData ? JSON.parse(servicosData) : [];

    setClientesCount(clientes.length);
    setMotosCount(motos.length);
    setServicosCount(servicos.length);

    const total = servicos.reduce((sum, s) => sum + (parseFloat(s.valor) || 0), 0);
    setFaturamentoTotal(total);

    if (servicos.length > 0) {
      setUltimoServico(servicos[servicos.length - 1]);
      setTicketMedio(total / servicos.length);
    }
  }

  const chartData = [
    {
      name: 'Clientes',
      population: clientesCount,
      color: '#f39c12',
      legendFontColor: '#ffffff',
      legendFontSize: 12,
    },
    {
      name: 'Motos',
      population: motosCount,
      color: '#2980b9',
      legendFontColor: '#ffffff',
      legendFontSize: 12,
    },
    {
      name: 'Serviços',
      population: servicosCount,
      color: '#27ae60',
      legendFontColor: '#ffffff',
      legendFontSize: 12,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.header}>📊 Visão Geral</Title>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>💰 Total de Faturamento</Title>
          <Paragraph style={styles.value}>
            R$ {faturamentoTotal.toFixed(2)}
          </Paragraph>
        </Card.Content>
      </Card>

      {ultimoServico && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>🛠️ Último Serviço</Title>
            <Paragraph style={styles.paragraph}>
              Cliente: <Text style={styles.bold}>{ultimoServico.cliente}</Text>
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              Moto: <Text style={styles.bold}>{ultimoServico.moto}</Text>
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              Valor:{' '}
              <Text style={styles.bold}>
                R$ {parseFloat(ultimoServico.valor).toFixed(2)}
              </Text>
            </Paragraph>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>📈 Ticket Médio</Title>
          <Paragraph style={styles.value}>
            R$ {ticketMedio.toFixed(2)}
          </Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>📊 Resumo em Gráfico</Title>
          <PieChart
            data={chartData}
            width={Dimensions.get('window').width - 48}
            height={220}
            chartConfig={{
              backgroundColor: '#121212',
              backgroundGradientFrom: '#121212',
              backgroundGradientTo: '#121212',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </Card.Content>
      </Card>
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
    color: '#ff6f00',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#121212',
    marginBottom: 16,
    padding: 12,
    borderRadius: 16,
    elevation: 4,
    borderColor: '#ff6f00',
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#ff6f00',
  },
  paragraph: {
    fontSize: 16,
    color: '#f0f0f0',
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#27ae60',
  },
});
