import React, { useCallback, useState, useEffect } from 'react';
import { Image, AsyncStorage } from 'react-native';

import Logo from '../../../assets/logo.png';
import { Container, Form, Label, Input, Button, WhiteText } from './styles';
import api from '../../../services/api';

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [techs, setTechs] = useState('');

  const handleSubmit = useCallback(() => {
    (async () => {
      const response = await api.post('sessions', { email });
      const { _id } = response.data;

      await AsyncStorage.setItem('aircnc_user', _id);
      await AsyncStorage.setItem('aircnc_techs', techs);

      navigation.navigate('List');
    })();
  }, [email, techs]);

  useEffect(() => {
    AsyncStorage.getItem('aircnc_user').then(user => {
      if (user) {
        navigation.navigate('List');
      }
    });
  }, []);

  return (
    <Container behavior="padding">
      <Image source={Logo} />

      <Form>
        <Label>SEU EMAIL *</Label>
        <Input
          placeholder="Seu email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <Label>TECNOLOGIAS *</Label>
        <Input
          placeholder="Tecnologias de interesse"
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          value={techs}
          onChangeText={setTechs}
        />

        <Button onPress={handleSubmit}>
          <WhiteText>Encontrar spots</WhiteText>
        </Button>
      </Form>
    </Container>
  );
}