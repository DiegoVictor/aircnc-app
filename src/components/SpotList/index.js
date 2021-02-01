import React, { useEffect, useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, View } from 'react-native';
import PropTypes from 'prop-types';

import api from '~/services/api';
import {
  Container,
  Title,
  Bold,
  List,
  Spot,
  Thumbnail,
  Company,
  Price,
  Button,
  WhiteText,
} from './styles';

export default function SpotList({ tech, ...props }) {
  const { navigate } = useNavigation();
  const [spots, setSpots] = useState([]);

  const handleNavigate = useCallback(spot => {
    navigate('Book', { id: spot._id });
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('spots', {
        params: { tech },
      });

      setSpots(data);
    })();
  }, [tech]);

  if (spots.length === 0) {
    return <View />;
  }

  return (
    <Container {...props}>
      <Title>
        Empresas que usam <Bold>{tech}</Bold>
      </Title>

      <ScrollView>
        <List
          data={spots}
          keyExtractor={spot => spot._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: spot }) => (
            <Spot testID={`spot_${spot._id}`}>
              <Thumbnail
                resizeMode="cover"
                source={{ uri: spot.thumbnail_url }}
              />
              <Company>{spot.company}</Company>
              <Price>{spot.price ? `R$ ${spot.price}/DIA` : 'GRATUITO'}</Price>
              <Button
                testID={`spot_book_${spot._id}`}
                onPress={() => handleNavigate(spot)}
              >
                <WhiteText>Solicitar reserva</WhiteText>
              </Button>
            </Spot>
          )}
        />
      </ScrollView>
    </Container>
  );
}

SpotList.propTypes = {
  tech: PropTypes.string.isRequired,
};
