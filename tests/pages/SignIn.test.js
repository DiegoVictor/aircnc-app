import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { render, fireEvent, act } from 'react-native-testing-library';
import faker from 'faker';
import MockAdapter from 'axios-mock-adapter';
import { create } from 'react-test-renderer';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

import api from '~/services/api';
import SignIn from '~/pages/SignIn';

jest.mock('@react-navigation/native');

describe('SignIn page', () => {
  const _id = faker.random.number();
  const token = faker.random.uuid();
  const apiMock = new MockAdapter(api);

  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('should be able to signin', async () => {
    const email = faker.internet.email();
    const tech = faker.random.word();

    apiMock.onPost('sessions').reply(200, { token, user: { _id } });

    const navigate = jest.fn();
    useNavigation.mockReturnValue({ navigate });

    const { getByPlaceholder, getByTestId } = render(<SignIn />);

    fireEvent.changeText(getByPlaceholder('Seu email'), email);
    fireEvent.changeText(getByPlaceholder('Tecnologias de interesse'), tech);

    await act(async () => {
      fireEvent.press(getByTestId('submit'));
    });

    expect(await AsyncStorage.getItem('aircnc_user')).toBe(
      JSON.stringify({ token, _id })
    );
    expect(await AsyncStorage.getItem('aircnc_techs')).toBe(tech);
    expect(navigate).toHaveBeenCalledWith('App', { screen: 'List' });
  });

  it('should not be able to signin with network error', async () => {
    const email = faker.internet.email();
    const tech = faker.random.word();

    apiMock.onPost('sessions').reply(400);

    const navigate = jest.fn();
    useNavigation.mockReturnValue({ navigate });
    const alert = jest.spyOn(Alert, 'alert');

    const { getByPlaceholder, getByTestId } = render(<SignIn />);

    fireEvent.changeText(getByPlaceholder('Seu email'), email);
    fireEvent.changeText(getByPlaceholder('Tecnologias de interesse'), tech);

    await act(async () => {
      fireEvent.press(getByTestId('submit'));
    });

    expect(await AsyncStorage.getItem('aircnc_user')).toBe(null);
    expect(await AsyncStorage.getItem('aircnc_techs')).toBe(null);
    expect(navigate).not.toHaveBeenCalled();
    expect(alert).toHaveBeenCalledWith(
      'Ops! Alguma coisa deu errado, tente novamente!'
    );
  });

  it('should not be able to signin with wrong email and techs', async () => {
    apiMock.onPost('sessions').reply(200, { token, user: { _id } });

    const navigate = jest.fn();
    useNavigation.mockReturnValue({ navigate });

    const { getByText, getByPlaceholder, getByTestId } = render(<SignIn />);

    fireEvent.changeText(getByPlaceholder('Seu email'), 'invalid-email');

    await act(async () => {
      fireEvent.press(getByTestId('submit'));
    });

    expect(await AsyncStorage.getItem('aircnc_user')).toBe(null);
    expect(await AsyncStorage.getItem('aircnc_techs')).toBe(null);
    expect(navigate).not.toHaveBeenCalled();

    expect(getByText('Campo obrigatório')).toBeTruthy();
    expect(getByText('Digite um email valido')).toBeTruthy();
  });

  it('should be redirected to List', async () => {
    const navigate = jest.fn();
    useNavigation.mockReturnValue({ navigate });

    await AsyncStorage.setItem('aircnc_user', JSON.stringify({ _id }));
    await act(async () => {
      create(<SignIn />);
    });

    expect(navigate).toHaveBeenCalledWith('App', { screen: 'List' });
  });
});
