import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, View, ScrollView, TouchableOpacity, Text, StyleSheet,} from 'react-native';
import { TextInput, Button, HelperText, List, Menu, Provider} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componente principal do formulário de cadastro de serviço
export default function ServicoForm({ navigation, route }) {
  // Estado inicial do formulário
  const [servico, setServico] = useState({
    cliente: '',
    moto: '',
    placa: '',
    kilometragem: '',
    data: '',
    descricao: '',
    status: '',
    valor: '',
  });

  const [index, setIndex] = useState(null); // Index do serviço (para edição)
  const [errors, setErrors] = useState({}); // Armazena erros de validação

  const [motos, setMotos] = useState([]); // Lista de motos salvas
  const [clientes, setClientes] = useState([]); // Lista de clientes salvos
  const [placaSugestoes, setPlacaSugestoes] = useState([]); // Sugestões de placas
  const [clienteSugestoes, setClienteSugestoes] = useState([]); // Sugestões de clientes

  const [statusMenuVisible, setStatusMenuVisible] = useState(false); // Visibilidade do menu de status

  // Carrega dados ao abrir o formulário
  useEffect(() => {
    loadMotos();
    loadClientes();
    if (route.params?.index !== undefined) {
      loadServico(route.params.index); // Carrega serviço para edição, se aplicável
    }
  }, [route.params]);

  // Carrega a lista de motos do AsyncStorage
  async function loadMotos() {
    const data = await AsyncStorage.getItem('motos');
    const listaMotos = data ? JSON.parse(data) : [];
    setMotos(listaMotos);
  }

  // Carrega a lista de clientes do AsyncStorage
  async function loadClientes() {
    const data = await AsyncStorage.getItem('clientes');
    const listaClientes = data ? JSON.parse(data) : [];
    setClientes(listaClientes);
  }

  // Carrega um serviço específico para edição
  async function loadServico(idx) {
    const data = await AsyncStorage.getItem('servicos');
    if (data) {
      const servicos = JSON.parse(data);
      setServico(servicos[idx]);
      setIndex(idx);
    }
  }

  // Validação dos campos obrigatórios
  function validate() {
    const newErrors = {};
    if (!servico.cliente) newErrors.cliente = 'Informe o cliente';
    if (!servico.moto) newErrors.moto = 'Informe a moto';
    if (!servico.placa) newErrors.placa = 'Informe a placa';
    if (!servico.kilometragem) newErrors.kilometragem = 'Informe a kilometragem';
    if (!servico.data) newErrors.data = 'Informe a data';
    if (!servico.descricao) newErrors.descricao = 'Informe a descrição';
    if (!servico.status) newErrors.status = 'Informe o status';
    if (!servico.valor) newErrors.valor = 'Informe o valor';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Salva ou atualiza o serviço no AsyncStorage
  async function save() {
    if (!validate()) return;

    const data = await AsyncStorage.getItem('servicos');
    let servicos = data ? JSON.parse(data) : [];

    if (index !== null) {
      servicos[index] = servico; // Atualiza
    } else {
      servicos.push(servico); // Novo
    }

    await AsyncStorage.setItem('servicos', JSON.stringify(servicos));
    navigation.goBack(); // Volta para tela anterior
  }

  // Ao digitar a placa, filtra sugestões e preenche moto se existir
  function onChangePlaca(text) {
    setServico({ ...servico, placa: text });

    const sugeridas = motos.filter((m) =>
      m.placa.toLowerCase().includes(text.toLowerCase())
    );
    setPlacaSugestoes(sugeridas);

    const motoSelecionada = motos.find(
      (m) => m.placa.toLowerCase() === text.toLowerCase()
    );
    if (motoSelecionada) {
      setServico((s) => ({ ...s, moto: motoSelecionada.modelo }));
    }
  }

  // Ao selecionar uma placa da sugestão
  function selecionarPlaca(placa) {
    setServico((s) => ({ ...s, placa }));

    const moto = motos.find((m) => m.placa === placa);
    if (moto) {
      setServico((s) => ({ ...s, moto: moto.modelo }));
    }

    setPlacaSugestoes([]);
  }

  // Ao digitar o cliente, exibe sugestões
  function onChangeCliente(text) {
    setServico({ ...servico, cliente: text });

    const sugeridas = clientes.filter((c) =>
      c.nome.toLowerCase().includes(text.toLowerCase())
    );
    setClienteSugestoes(sugeridas);
  }

  // Ao selecionar cliente da sugestão
  function selecionarCliente(nome) {
    setServico((s) => ({ ...s, cliente: nome }));
    setClienteSugestoes([]);
  }

  // Máscara para campo de data no formato DD/MM/AAAA
  function mascaraData(text) {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 2) {
      cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    if (cleaned.length > 5) {
      cleaned = cleaned.slice(0, 5) + '/' + cleaned.slice(5);
    }
    return cleaned.slice(0, 10);
  }

  return (
    <Provider>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 2 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Cadastro de Serviço:</Text>

          {/* Campo Cliente com sugestões */}
          <TextInput
            label="Cliente"
            value={servico.cliente}
            onChangeText={onChangeCliente}
            style={styles.input}
            error={!!errors.cliente}
            theme={{ colors: { text: '#000' } }}
          />
          <HelperText type="error" visible={!!errors.cliente}>
            {errors.cliente}
          </HelperText>
          {clienteSugestoes.map((c, idx) => (
            <TouchableOpacity key={idx} onPress={() => selecionarCliente(c.nome)}>
              <List.Item title={c.nome} description={c.telefone} style={styles.suggestionItem} />
            </TouchableOpacity>
          ))}

          {/* Campo Placa com sugestões */}
          <TextInput
            label="Placa"
            value={servico.placa}
            onChangeText={onChangePlaca}
            style={styles.input}
            error={!!errors.placa}
            theme={{ colors: { text: '#000' } }}
          />
          <HelperText type="error" visible={!!errors.placa}>
            {errors.placa}
          </HelperText>
          {placaSugestoes.map((m, idx) => (
            <TouchableOpacity key={idx} onPress={() => selecionarPlaca(m.placa)}>
              <List.Item title={m.placa} description={m.modelo} style={styles.suggestionItem} />
            </TouchableOpacity>
          ))}

          {/* Campo Moto (pode ser preenchido automaticamente ou manual) */}
          <TextInput
            label="Moto"
            value={servico.moto}
            onChangeText={(text) => setServico({ ...servico, moto: text })}
            style={styles.input}
            error={!!errors.moto}
            theme={{ colors: { text: 'black' } }}
          />
          <HelperText type="error" visible={!!errors.moto}>
            {errors.moto}
          </HelperText>

          {/* Campo Kilometragem */}
          <TextInput
            label="Kilometragem"
            value={servico.kilometragem}
            onChangeText={(text) => setServico({ ...servico, kilometragem: text })}
            keyboardType="numeric"
            style={styles.input}
            error={!!errors.kilometragem}
            theme={{ colors: { text: '#000' } }}
          />
          <HelperText type="error" visible={!!errors.kilometragem}>
            {errors.kilometragem}
          </HelperText>

          {/* Campo Data com máscara */}
          <TextInput
            label="Data"
            value={servico.data}
            onChangeText={(text) =>
              setServico({ ...servico, data: mascaraData(text) })
            }
            keyboardType="numeric"
            placeholder="DD/MM/AAAA"
            style={styles.input}
            error={!!errors.data}
            theme={{ colors: { text: '#000' } }}
          />
          <HelperText type="error" visible={!!errors.data}>
            {errors.data}
          </HelperText>

          {/* Campo Descrição */}
          <TextInput
            label="Descrição"
            value={servico.descricao}
            onChangeText={(text) => setServico({ ...servico, descricao: text })}
            multiline
            numberOfLines={3}
            style={styles.input}
            error={!!errors.descricao}
            theme={{ colors: { text: '#000' } }}
          />
          <HelperText type="error" visible={!!errors.descricao}>
            {errors.descricao}
          </HelperText>

          {/* Menu suspenso para status do serviço */}
          <View style={{ marginBottom: 8 }}>
            <Menu
              visible={statusMenuVisible}
              onDismiss={() => setStatusMenuVisible(false)}
              anchor={
                <TouchableOpacity onPress={() => setStatusMenuVisible(true)}>
                  <TextInput
                    label="Status"
                    value={servico.status}
                    editable={false}
                    pointerEvents="none"
                    style={styles.input}
                    right={<TextInput.Icon name="menu-down" />}
                    error={!!errors.status}
                    theme={{ colors: { text: '#000' } }}
                  />
                </TouchableOpacity>
              }
            >
              {['Aberto', 'Pendente', 'Concluído'].map((status, idx) => (
                <Menu.Item
                  key={idx}
                  onPress={() => {
                    setServico({ ...servico, status });
                    setStatusMenuVisible(false);
                  }}
                  title={status}
                />
              ))}
            </Menu>
            <HelperText type="error" visible={!!errors.status}>
              {errors.status}
            </HelperText>
          </View>

          {/* Campo Valor */}
          <TextInput
            label="Valor"
            value={servico.valor}
            onChangeText={(text) => setServico({ ...servico, valor: text })}
            keyboardType="numeric"
            style={styles.input}
            error={!!errors.valor}
            theme={{ colors: { text: '#000' } }}
          />
          <HelperText type="error" visible={!!errors.valor}>
            {errors.valor}
          </HelperText>

          {/* Botões Salvar e Cancelar */}
          <Button mode="contained" onPress={save} style={styles.button}>
            Salvar
          </Button>
          <Button onPress={() => navigation.goBack()} style={styles.button}>
            Cancelar
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </Provider>
  );
}

// Estilos
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
  },
  button: {
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: '#ff6f00',
  },
  cancelButton: {
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff6f00',
    color: '#fff',
  },
  suggestionItem: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderRadius: 6,
    marginBottom: 8,
    elevation: 1,
  },
});
