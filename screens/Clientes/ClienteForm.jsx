import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Provider } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInputMask } from 'react-native-masked-text';

export default function ClienteForm({ navigation, route }) {
  const [index, setIndex] = useState(null);

  const schema = Yup.object().shape({
    nome: Yup.string().required('Nome é obrigatório'),
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    telefone: Yup.string()
      .matches(/^\(\d{2}\) \d{5}-\d{4}$/, 'Formato: (XX) XXXXX-XXXX')
      .required('Telefone é obrigatório'),
    cpf: Yup.string()
      .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'Formato: XXX.XXX.XXX-XX')
      .required('CPF é obrigatório'),
    nascimento: Yup.string()
      .matches(/^\d{2}\/\d{2}\/\d{4}$/, 'Formato: DD/MM/AAAA')
      .required('Nascimento é obrigatório'),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (route.params?.index !== undefined) {
      loadCliente(route.params.index);
    }
  }, [route.params]);

  async function loadCliente(idx) {
    const data = await AsyncStorage.getItem('clientes');
    if (data) {
      const clientes = JSON.parse(data);
      const cliente = clientes[idx];
      setIndex(idx);
      for (const key in cliente) {
        setValue(key, cliente[key]);
      }
    }
  }

  async function onSubmit(cliente) {
    const data = await AsyncStorage.getItem('clientes');
    let clientes = data ? JSON.parse(data) : [];

    if (index !== null) {
      clientes[index] = cliente;
    } else {
      clientes.push(cliente);
    }

    await AsyncStorage.setItem('clientes', JSON.stringify(clientes));
    navigation.goBack();
  }

  return (
    <Provider>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 2 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Cadastro de Cliente</Text>

          <Controller
            control={control}
            name="nome"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  label="Nome"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={styles.input}
                  theme={{ colors: { text: '#000' } }}
                />
                {errors.nome && <Text style={styles.error}>{errors.nome.message}</Text>}
              </>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  label="Email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                  style={styles.input}
                  theme={{ colors: { text: '#000' } }}
                />
                {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
              </>
            )}
          />

          <Controller
            control={control}
            name="telefone"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInputMask
                  type={'cel-phone'}
                  options={{
                    maskType: 'BRL',
                    withDDD: true,
                    dddMask: '(99) ',
                  }}
                  value={value}
                  onChangeText={onChange}
                  customTextInput={TextInput}
                  customTextInputProps={{
                    label: 'Telefone',
                    keyboardType: 'numeric',
                    style: styles.input,
                    theme: { colors: { text: '#000' } },
                  }}
                />
                {errors.telefone && <Text style={styles.error}>{errors.telefone.message}</Text>}
              </>
            )}
          />

          <Controller
            control={control}
            name="cpf"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInputMask
                  type={'cpf'}
                  value={value}
                  onChangeText={onChange}
                  customTextInput={TextInput}
                  customTextInputProps={{
                    label: 'CPF',
                    keyboardType: 'numeric',
                    style: styles.input,
                    theme: { colors: { text: '#000' } },
                  }}
                />
                {errors.cpf && <Text style={styles.error}>{errors.cpf.message}</Text>}
              </>
            )}
          />

          <Controller
            control={control}
            name="nascimento"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInputMask
                  type={'datetime'}
                  options={{ format: 'DD/MM/YYYY' }}
                  value={value}
                  onChangeText={onChange}
                  customTextInput={TextInput}
                  customTextInputProps={{
                    label: 'Data de Nascimento',
                    keyboardType: 'numeric',
                    style: styles.input,
                    theme: { colors: { text: '#000' } },
                  }}
                />
                {errors.nascimento && <Text style={styles.error}>{errors.nascimento.message}</Text>}
              </>
            )}
          />

          <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button}>
            Salvar
          </Button>
          <Button onPress={() => navigation.goBack()} style={styles.cancelButton}>
            Cancelar
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff6f00',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    elevation: 2,
  },
  button: {
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: '#ff6f00',
  },
  cancelButton: {
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff6f00',
    backgroundColor: '#ff6f00',
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
});
