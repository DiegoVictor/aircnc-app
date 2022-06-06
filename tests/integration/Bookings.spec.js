import React from 'react';
import { act, fireEvent } from 'react-native-testing-library';
import MockAdapter from 'axios-mock-adapter';
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { faker } from '@faker-js/faker';
import { create } from 'react-test-renderer';

import { emit } from '../../mocks/socket.io-client';
import api from '~/services/api';
import factory from '../utils/factory';
import Bookings from '~/pages/Bookings';

describe('Bookings page', () => {
  const apiMock = new MockAdapter(api);
  const _id = faker.datatype.number();

  it('should be able to see bookings', async () => {
    const spots = await factory.attrsMany('Spot', 3);
    const [booking, ...rest] = await factory.attrsMany('Booking', 3, spots);

    await AsyncStorage.setItem('aircnc_user', JSON.stringify({ _id }));
    apiMock.onGet('bookings').reply(200, [booking, ...rest]);

    let root;
    await act(async () => {
      root = create(<Bookings />);
    });

    const nodes = root.root
      .findAllByType('Text')
      .map((node) => node.children.shift());

    [booking, ...rest].forEach((b) => {
      expect(
        root.root.findByProps({ testID: `booking_status_${b._id}` })
      ).toHaveTextContent(b.approved ? 'Aprovado' : 'Em aprovação');

      expect(
        root.root.findByProps({ testID: `booking_date_${b._id}` })
      ).toHaveTextContent(
        format(parseISO(b.date), "dd'/'MM'/'yyyy", { locale: pt })
      );

      expect(nodes.includes(b.spot.company)).toBeTruthy();

      expect(
        root.root.findByProps({ testID: `booking_price_${b._id}` })
      ).toHaveTextContent(b.spot.price ? `R$ ${b.spot.price}/DIA` : 'GRATUITO');
    });
  });

  it('should be able to cancel a booking', async () => {
    const spot = await factory.attrs('Spot');
    const booking = await factory.attrs('Booking', { spot });

    await AsyncStorage.setItem('aircnc_user', JSON.stringify({ _id }));
    apiMock
      .onGet('bookings')
      .reply(200, [booking])
      .onPost(`bookings/${booking._id}/rejection`)
      .reply(200);

    const alert = jest.spyOn(Alert, 'alert');

    let root;
    await act(async () => {
      root = create(<Bookings />);
    });

    await act(async () => {
      fireEvent.press(
        root.root.findByProps({ testID: `booking_cancel_${booking._id}` })
      );
    });

    expect(alert).toHaveBeenCalledWith('Reserva cancelada');
  });

  it('should be able to catch error while canceling a booking', async () => {
    const spot = await factory.attrs('Spot', { price: null });
    const booking = await factory.attrs('Booking', { spot });

    await AsyncStorage.setItem('aircnc_user', JSON.stringify({ _id }));
    apiMock
      .onGet('bookings')
      .reply(200, [booking])
      .onPost(`bookings/${booking._id}/rejection`)
      .reply(400);

    const alert = jest.spyOn(Alert, 'alert');

    let root;
    await act(async () => {
      root = create(<Bookings />);
    });

    await act(async () => {
      fireEvent.press(
        root.root.findByProps({ testID: `booking_cancel_${booking._id}` })
      );
    });

    expect(alert).toHaveBeenCalledWith(
      'Ops! Não foi possivel cancelar a reserva, tente novamente!'
    );
  });

  it('should be able to receive a booking rejection', async () => {
    const booking = await factory.attrs('Booking', { approved: false });
    const tech = faker.random.word();
    const [spot, ...rest] = await factory.attrsMany('Spot', 3, {
      techs: [tech],
    });

    apiMock.onGet('spots', { params: { tech } }).reply(200, [spot, ...rest]);

    await AsyncStorage.setItem('aircnc_techs', tech);
    await AsyncStorage.setItem('aircnc_user', JSON.stringify({ _id }));

    const alert = jest.spyOn(Alert, 'alert');

    await act(async () => {
      create(<Bookings />);
    });
    emit('booking_response', booking);

    const date = format(parseISO(booking.date), "dd'/'MM'/'yyyy");
    expect(alert).toHaveBeenCalledWith(
      `Sua reserva em ${booking.spot.company} para ${date} foi REJEITADA`
    );
  });

  it('should be able to receive a booking confirmation', async () => {
    const booking = await factory.attrs('Booking', { approved: true });
    const tech = faker.random.word();
    const [spot, ...rest] = await factory.attrsMany('Spot', 3, {
      techs: [tech],
    });

    apiMock.onGet('spots', { params: { tech } }).reply(200, [spot, ...rest]);

    await AsyncStorage.setItem('aircnc_techs', tech);
    await AsyncStorage.setItem('aircnc_user', JSON.stringify({ _id }));

    const alert = jest.spyOn(Alert, 'alert');

    await act(async () => {
      create(<Bookings />);
    });
    emit('booking_response', booking);

    const date = format(parseISO(booking.date), "dd'/'MM'/'yyyy");
    expect(alert).toHaveBeenCalledWith(
      `Sua reserva em ${booking.spot.company} para ${date} foi APROVADA`
    );
  });
});
