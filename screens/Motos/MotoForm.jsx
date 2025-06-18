import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, HelperText, Provider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import * as Yup from 'yup';

export default function MotoForm({ navigation, route }) {
  // Estado para armazenar os dados da moto
  const [moto, setMoto] = useState({
    codigo: '',
    modelo: '',
    ano: '',
    placa: '',
    cor: '',
    chassi: '',
    observacoes: '',
  });

  const [index, setIndex] = useState(null); // Índice da moto sendo editada

  // Carrega os dados da moto se estiver em modo de edição
  useEffect(() => {
    if (route.params?.index !== undefined) {
      loadMoto(route.params.index);
    }
  }, [route.params]);

  // Busca a moto no AsyncStorage e atualiza o estado
  async function loadMoto(idx) {
    const data = await AsyncStorage.getItem('motos');
    if (data) {
      const motos = JSON.parse(data);
      setMoto(motos[idx]);
      setIndex(idx);
    }
  }

  // Schema de validação com Yup
  const MotoSchema = Yup.object().shape({
    modelo: Yup.string().required('Informe o modelo'),
    ano: Yup.string()
      .matches(/^\d{4}$/, 'Ano deve ter 4 dígitos')
      .required('Informe o ano'),
    placa: Yup.string()
      .matches(/^[A-Z]{3}-\d{4}$/, 'Placa inválida (ex: ABC-1234)')
      .required('Informe a placa'),
    cor: Yup.string().required('Informe a cor'),
    chassi: Yup.string()
      .min(5, 'Chassi muito curto')
      .max(17, 'Chassi deve ter até 17 caracteres')
      .required('Informe o chassi'),
    observacoes: Yup.string().required('Informe as observações'),
  });

  // Gera um novo código automático para a moto
  async function gerarNovoCodigo() {
    const data = await AsyncStorage.getItem('motos');
    let motos = data ? JSON.parse(data) : [];
    if (motos.length === 0) return '1';
    const codigos = motos.map((m) => parseInt(m.codigo, 10) || 0);
    const maiorCodigo = Math.max(...codigos);
    return (maiorCodigo + 1).toString();
  }

  // Salva ou atualiza a moto no AsyncStorage
  async function save(values) {
    const data = await AsyncStorage.getItem('motos');
    let motos = data ? JSON.parse(data) : [];

    if (index !== null) {
      motos[index] = values; // Atualização
    } else {
      values.codigo = await gerarNovoCodigo(); // Novo código
      motos.push(values); // Inserção
    }

    await AsyncStorage.setItem('motos', JSON.stringify(motos));
    navigation.goBack(); // Volta para a tela de listagem
  }

  return (
    <Provider>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 2 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Cadastro de Moto:</Text>

          {/* Formulário controlado pelo Formik */}
          <Formik
            enableReinitialize
            initialValues={moto}
            validationSchema={MotoSchema}
            onSubmit={save}
          >
            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
              <>
                {/* Campo Código (somente leitura) */}
                <TextInput
                  label="Código"
                  value={values.codigo}
                  disabled
                  style={styles.input}
                  theme={{ colors: { text: '#000' } }}
                />
                <HelperText type="error" visible={touched.codigo && !!errors.codigo}>
                  {errors.codigo}
                </HelperText>

                {/* Campo Modelo */}
                <TextInput
                  label="Modelo"
                  value={values.modelo}
                  onChangeText={handleChange('modelo')}
                  onBlur={handleBlur('modelo')}
                  error={touched.modelo && !!errors.modelo}
                  style={styles.input}
                  theme={{ colors: { text: '#000' } }}
                />
                <HelperText type="error" visible={touched.modelo && !!errors.modelo}>
                  {errors.modelo}
                </HelperText>

                {/* Campo Ano (com filtro de apenas 4 dígitos) */}
                <TextInput
                  label="Ano"
                  value={values.ano}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    setFieldValue('ano', text.replace(/[^0-9]/g, '').slice(0, 4))
                  }
                  onBlur={handleBlur('ano')}
                  error={touched.ano && !!errors.ano}
                  style={styles.input}
                  theme={{ colors: { text: '#000' } }}
                />
                <HelperText type="error" visible={touched.ano && !!errors.ano}>
                  {errors.ano}
                </HelperText>

                {/* Campo Placa (com formatação automática) */}
                <TextInput
                  label="Placa"
                  value={values.placa}
                  onChangeText={(text) => {
                    const formatted = text
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, '')
                      .replace(/^([A-Z]{3})(\d{0,4})$/, '$1-$2');
                    setFieldValue('placa', formatted);
                  }}
                  onBlur={handleBlur('placa')}
                  error={touched.placa && !!errors.placa}
                  maxLength={8}
                  style={styles.input}
                  theme={{ colors: { text: '#000' } }}
                />
                <HelperText type="error" visible={touched.placa && !!errors.placa}>
                  {errors.placa}
                </HelperText>

                {/* Campo Cor */}
                <TextInput
                  label="Cor"
                  value={values.cor}
                  onChangeText={handleChange('cor')}
                  onBlur={handleBlur('cor')}
                  error={touched.cor && !!errors.cor}
                  style={styles.input}
                  theme={{ colors: { text: '#000' } }}
                />
                <HelperText type="error" visible={touched.cor && !!errors.cor}>
                  {errors.cor}
                </HelperText>

                {/* Campo Chassi */}
                <TextInput
                  label="Chassi"
                  value={values.chassi}
                  onChangeText={(text) => setFieldValue('chassi', text.slice(0, 17))}
                  onBlur={handleBlur('chassi')}
                  error={touched.chassi && !!errors.chassi}
                  style={styles.input}
                  theme={{ colors: { text: '#000' } }}
                />
                <HelperText type="error" visible={touched.chassi && !!errors.chassi}>
                  {errors.chassi}
                </HelperText>

                {/* Campo Observações */}
                <TextInput
                  label="Observações"
                  value={values.observacoes}
                  onChangeText={handleChange('observacoes')}
                  onBlur={handleBlur('observacoes')}
                  multiline
                  numberOfLines={3}
                  error={touched.observacoes && !!errors.observacoes}
                  style={styles.input}
                  theme={{ colors: { text: '#000' } }}
                />
                <HelperText type="error" visible={touched.observacoes && !!errors.observacoes}>
                  {errors.observacoes}
                </HelperText>

                {/* Botão Salvar */}
                <Button mode="contained" onPress={handleSubmit} style={styles.button}>
                  Salvar
                </Button>

                {/* Botão Cancelar */}
                <Button onPress={() => navigation.goBack()} style={styles.cancelButton}>
                  Cancelar
                </Button>
              </>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </Provider>
  );
}

// Estilos da tela de formulário
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
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 6,
    elevation: 2,
    marginBottom: 8,
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
});
