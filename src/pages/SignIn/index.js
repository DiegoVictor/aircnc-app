import React, { useCallback, useState, useEffect } from 'react';
import { Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';

import Logo from '~/assets/logo.png';
import api, { setAuthorization } from '~/services/api';
import {
  Container,
  Form,
  Label,
  Input,
  Error,
  Button,
  WhiteText,
} from './styles';

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Digite um email valido')
    .required('Campo obrigatório'),
  techs: Yup.string().required('Campo obrigatório'),
});

export default () => {
  const { navigate } = useNavigation();
  const [email, setEmail] = useState('');
  const [techs, setTechs] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = useCallback(() => {
    (async () => {
      const { data } = await api.post('sessions', { email });
      const {
        token,
        user: { _id },
      } = data;

      await AsyncStorage.setItem('aircnc_user', JSON.stringify({ token, _id }));
      await AsyncStorage.setItem('aircnc_techs', techs);
      setAuthorization(token);

      navigate('App', { screen: 'List' });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validation = {};

        err.inner.forEach(error => {
          validation[error.path] = error.message;
        });

        setErrors(validation);
      } else {
        Alert.alert('Ops! Alguma coisa deu errado, tente novamente!');
      }
    }
  }, [email, techs]);

  useEffect(() => {
    (async () => {
      const user = JSON.parse(await AsyncStorage.getItem('aircnc_user'));
      if (user) {
        setAuthorization(user.token);
        navigate('App', { screen: 'List' });
      }
    })();
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
        {errors.email && <Error>{errors.email}</Error>}

        <Label>TECNOLOGIAS *</Label>
        <Input
          placeholder="Tecnologias de interesse"
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          value={techs}
          onChangeText={setTechs}
        />
        {errors.techs && <Error>{errors.techs}</Error>}

        <Button testID="submit" onPress={handleSubmit}>
          <WhiteText>Encontrar spots</WhiteText>
        </Button>
      </Form>
    </Container>
  );
};
