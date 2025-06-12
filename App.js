import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet } from 'react-native';

import ClienteList from './screens/Clientes/ClienteList';
import ClienteForm from './screens/Clientes/ClienteForm';

import MotoList from './screens/Motos/MotoList';
import MotoForm from './screens/Motos/MotoForm';

import ServicoList from './screens/Servicos/ServicoList';
import ServicoForm from './screens/Servicos/ServicoForm';

import Dashboard from './screens/Dashboard';
import NoticiasMotos from './screens/NoticiasMotos';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = 'circle';

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
            default:
              iconName = 'circle';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6F00',  // Laranja vibrante
        tabBarInactiveTintColor: '#888',
        tabBarStyle: styles.tabBar,
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Serviços" component={ServicoList} />
      <Tab.Screen name="Motos" component={MotoList} />
      <Tab.Screen name="Clientes" component={ClienteList} />
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Noticias" component={NoticiasMotos} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <>
      <StatusBar backgroundColor="#1C1C1C" barStyle="light-content" />
      <PaperProvider>
        <SafeAreaView style={styles.container}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home" component={TabNavigator} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',  // Fundo neutro
  },
  tabBar: {
    backgroundColor: '#1C1C1C',
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
    paddingBottom: 8,
    paddingTop: 8,
    height: 65,
  },
});
