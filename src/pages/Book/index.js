import React, { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';

import api from '~/services/api';
import { Container, Label, Input, Button, WhiteText, Cancel } from './styles';

export default () => {
  const { navigate } = useNavigation();
  const [showDatepicker, setShowDatepicker] = useState(false);
  const { id } = route.params;

  const handleSubmit = useCallback(() => {
    (async () => {
      const { token } = JSON.parse(await AsyncStorage.getItem('aircnc_user'));
      await api.post(
        `spots/${id}/booking`,
        {
          date,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert('Solicitação de reserva enviada');
      navigate('List');
    })();
  }, [date]);

  const handleCancel = useCallback(() => {
    navigate('List');
  }, []);

  return (
    <Container>
      <Label>DATA DE INTERESSE *</Label>
      {showDatepicker && (
        <DateTimePicker
          testID="datepicker"
          mode="date"
          value={date}
          minimumDate={addDays(new Date(), 1)}
          onChange={(_, selectedDate) => {
            setShowDatepicker(false);
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      )}
      <Input
        testID="date"
        placeholder="Qual data você quer reservar?"
        placeholderTextColor="#999"
        autoCapitalize="words"
        autoCorrect={false}
        value={format(date, "dd'/'MM'/'yyyy")}
        onFocus={() => {
          setShowDatepicker(true);
        }}
      />

      <Button testID="submit" onPress={handleSubmit}>
        <WhiteText>Solicitar reserva</WhiteText>
      </Button>

      <Cancel testID="cancel" onPress={handleCancel}>
        <WhiteText>Cancelar</WhiteText>
      </Cancel>
    </Container>
  );
};
