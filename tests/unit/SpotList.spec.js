import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { act, fireEvent } from 'react-native-testing-library';
import AsyncStorage from '@react-native-community/async-storage';
import faker from 'faker';
import { create } from 'react-test-renderer';
import { useNavigation } from '@react-navigation/native';

import api from '~/services/api';
import factory from '../utils/factory';
import SpotList from '~/components/SpotList';

jest.mock('@react-navigation/native');

describe('SpotList component', () => {
  const token = faker.datatype.uuid();
  const apiMock = new MockAdapter(api);

  it('should be able to see spot list', async () => {
    const tech = faker.random.word();
    const [spot, ...rest] = await factory.attrsMany('Spot', 3, {
      techs: [tech],
    });

    await AsyncStorage.setItem('aircnc_user', JSON.stringify({ token }));
    apiMock.onGet('/spots', { params: { tech } }).reply(200, [spot, ...rest]);

    const navigate = jest.fn();
    useNavigation.mockReturnValue({ navigate });

    let root;
    await act(async () => {
      root = create(<SpotList tech={tech} />);
    });

    const nodes = root.root
      .findAllByType('Text')
      .map((node) => node.children.shift());

    [spot, ...rest].forEach((s) => {
      expect(root.root.findByProps({ testID: `spot_${s._id}` })).toBeTruthy();

      expect(nodes.includes(s.company)).toBeTruthy();
      if (s.price) {
        expect(nodes.includes(`R$ ${s.price}/DIA`)).toBeTruthy();
      }
    });
  });

  it('should be able to book a spot', async () => {
    const tech = faker.random.word();
    const [spot, ...rest] = await factory.attrsMany('Spot', 3, {
      techs: [tech],
      price: null,
    });

    apiMock.onGet('spots', { params: { tech } }).reply(200, [spot, ...rest]);

    const navigate = jest.fn();
    useNavigation.mockReturnValue({ navigate });

    let root;
    await act(async () => {
      root = create(<SpotList tech={tech} />);
    });

    fireEvent.press(root.root.findByProps({ testID: `spot_book_${spot._id}` }));
    expect(navigate).toHaveBeenCalledWith('Book', { id: spot._id });
  });
});
