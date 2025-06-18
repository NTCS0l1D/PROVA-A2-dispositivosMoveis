// Importações essenciais
import 'react-native-gesture-handler'; // Necessário para navegação com gestos
import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; // Gerencia a navegação
import { createStackNavigator } from '@react-navigation/stack'; // Navegação em pilha
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Navegação com abas
import { Provider as PaperProvider } from 'react-native-paper'; // Fornece temas e componentes UI
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Ícones
import { SafeAreaView } from 'react-native-safe-area-context'; // Evita sobreposição com status bar
import { StatusBar, StyleSheet } from 'react-native';

// Importação das telas
import ClienteList from './screens/Clientes/ClienteList';
import ClienteForm from './screens/Clientes/ClienteForm';

import MotoList from './screens/Motos/MotoList';
import MotoForm from './screens/Motos/MotoForm';

import ServicoList from './screens/Servicos/ServicoList';
import ServicoForm from './screens/Servicos/ServicoForm';

import Dashboard from './screens/Dashboard';
import NoticiasMotos from './screens/NoticiasMotos';

// Criação dos navegadores
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Componente que define as abas inferiores
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = 'circle'; // Ícone padrão

          // Ícone específico de cada aba
          switch (route.name) {
            case 'Serviços':
              iconName = 'tools';
              break;
            case 'Motos':
              iconName = 'motorbike';
              break;
            case 'Clientes':
              iconName = 'account';
              break;
            case 'Dashboard':
              iconName = 'chart-bar';
              break;
            case 'Noticias':
              iconName = 'newspaper-variant-multiple-outline';
              break;
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6F00', // Cor ativa (laranja)
        tabBarInactiveTintColor: '#888',  // Cor inativa (cinza)
        tabBarStyle: styles.tabBar,
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      })}
    >
      {/* Definição das rotas das abas */}
      <Tab.Screen name="Serviços" component={ServicoList} />
      <Tab.Screen name="Motos" component={MotoList} />
      <Tab.Screen name="Clientes" component={ClienteList} />
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Noticias" component={NoticiasMotos} />
    </Tab.Navigator>
  );
}

// Componente principal da aplicação
export default function App() {
  return (
    <>
      {/* Personalização da StatusBar */}
      <StatusBar backgroundColor="#1C1C1C" barStyle="light-content"/>

      {/* Provider do React Native Paper */}
      <PaperProvider>
        <SafeAreaView style={styles.container}>
          {/* Container de navegação */}
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {/* Rota principal com abas */}
              <Stack.Screen name="Home" component={TabNavigator} />
              
              {/* Rotas para formulários (acessadas por navegação imperativa) */}
              <Stack.Screen name="ClienteForm" component={ClienteForm} />
              <Stack.Screen name="MotoForm" component={MotoForm} />
              <Stack.Screen name="ServicoForm" component={ServicoForm} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </PaperProvider>
    </>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',  // Fundo claro e neutro
  },
  tabBar: {
    backgroundColor: '#1C1C1C', // Fundo escuro para o tab bar
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8, // Sombra no Android
    paddingBottom: 8,
    paddingTop: 8,
    height: 65,
  },
});
