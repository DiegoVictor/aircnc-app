import React from 'react';
import { act } from 'react-native-testing-library';
import { faker } from '@faker-js/faker';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import MockAdapter from 'axios-mock-adapter';
import { format, parseISO } from 'date-fns';
import { create } from 'react-test-renderer';
import { useNavigation } from '@react-navigation/native';

import { emit, subscribe } from '../../mocks/socket.io-client';
import api from '~/services/api';
import factory from '../utils/factory';
import List from '~/pages/List';

jest.mock('@react-navigation/native');

describe('List page', () => {
  const _id = faker.datatype.number();
  const token = faker.datatype.uuid();
  const apiMock = new MockAdapter(api);

  it('should be able to receive a booking confirmation', async () => {
    const booking = await factory.attrs('Booking', { approved: true });
    const tech = faker.random.word();
    const [spot, ...rest] = await factory.attrsMany('Spot', 3, {
      techs: [tech],
    });

    const navigate = jest.fn();
    useNavigation.mockReturnValue({ navigate });
    const alert = jest.spyOn(Alert, 'alert');

    apiMock.onGet('spots', { params: { tech } }).reply(200, [spot, ...rest]);

    await AsyncStorage.setItem('aircnc_techs', tech);
    await AsyncStorage.setItem('aircnc_user', JSON.stringify({ _id, token }));

    await act(async () => {
      create(<List />);
    });

    emit('booking_response', booking);

    const date = format(parseISO(booking.date), "dd'/'MM'/'yyyy");
    expect(alert).toHaveBeenCalledWith(
      `Sua reserva em ${booking.spot.company} para ${date} foi APROVADA`
    );
  });

  it('should be able to receive a booking rejection', async () => {
    const booking = await factory.attrs('Booking', { approved: false });
    const tech = faker.random.word();
    const [spot, ...rest] = await factory.attrsMany('Spot', 3, {
      techs: [tech],
    });

    const navigate = jest.fn();
    useNavigation.mockReturnValue({ navigate });
    const alert = jest.spyOn(Alert, 'alert');

    apiMock.onGet('spots', { params: { tech } }).reply(200, [spot, ...rest]);

    await AsyncStorage.setItem('aircnc_techs', '');
    await AsyncStorage.setItem('aircnc_user', JSON.stringify({ _id }));

    await act(async () => {
      create(<List />);
    });

    emit('booking_response', booking);

    const date = format(parseISO(booking.date), "dd'/'MM'/'yyyy");
    expect(alert).toHaveBeenCalledWith(
      `Sua reserva em ${booking.spot.company} para ${date} foi REJEITADA`
    );
  });
});
