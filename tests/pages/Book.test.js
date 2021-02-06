import React from 'react';
import { render, fireEvent, act } from 'react-native-testing-library';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import MockAdapter from 'axios-mock-adapter';
import faker from 'faker';
import { create } from 'react-test-renderer';
import { useNavigation, useRoute } from '@react-navigation/native';

import api from '~/services/api';
import Book from '~/pages/Book';

jest.mock('@react-navigation/native');

describe('Book page', () => {
  const _id = faker.random.uuid();
  const apiMock = new MockAdapter(api);

  it('should be able to book a spot', async () => {
    const date = faker.date.future();

    await AsyncStorage.setItem('aircnc_user', JSON.stringify({ _id }));
    apiMock.onPost(`spots/${_id}/booking`).reply(({ data }) => {
      const { date: received_date } = JSON.parse(data);
      expect(received_date).toBe(date.toISOString());
      return [200, {}];
    });

    const alert = jest.spyOn(Alert, 'alert');
    const navigate = jest.fn();
    useNavigation.mockReturnValue({ navigate });
    useRoute.mockReturnValue({ params: { id: _id } });

    let root;
    await act(async () => {
      root = create(<Book />);
    });

    await act(async () => {
      fireEvent(root.root.findByProps({ testID: 'date' }), 'onFocus');
    });

    expect(root.root.findByProps({ testID: 'datepicker' })).toBeTruthy();

    await act(async () => {
      fireEvent(
        root.root.findByProps({ testID: 'datepicker' }),
        'onChange',
        {},
        date
      );
    });

    await act(async () => {
      fireEvent.press(root.root.findByProps({ testID: 'submit' }));
    });

    expect(alert).toHaveBeenCalledWith('Solicitação de reserva enviada');
    expect(navigate).toHaveBeenCalledWith('List');
  });

  it('should not be able to book a spot with network error', async () => {
    await AsyncStorage.setItem('aircnc_user', JSON.stringify({ _id }));
    apiMock.onPost(`spots/${_id}/booking`).reply(400);

    const alert = jest.spyOn(Alert, 'alert');
    const navigate = jest.fn();
    useNavigation.mockReturnValue({ navigate });
    useRoute.mockReturnValue({ params: { id: _id } });

    const { getByTestId } = render(<Book />);

    await act(async () => {
      fireEvent.press(getByTestId('submit'));
    });

    expect(alert).toHaveBeenCalledWith(
      'Ops! Alguma coisa deu errado, tente novamente!'
    );
    expect(navigate).not.toHaveBeenCalledWith('List');
  });

  it('should be able to back to List', async () => {
    const navigate = jest.fn();
    useNavigation.mockReturnValue({ navigate });
    useRoute.mockReturnValue({ params: { id: _id } });

    await AsyncStorage.setItem('aircnc_user', JSON.stringify({ _id }));

    const { getByTestId } = render(<Book />);

    await act(async () => {
      fireEvent.press(getByTestId('cancel'));
    });

    expect(navigate).toHaveBeenCalledWith('List');
  });
});
