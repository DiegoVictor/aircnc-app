import React, { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDays, format } from 'date-fns';
import { useNavigation, useRoute } from '@react-navigation/native';

import api from '~/services/api';
import { Container, Label, Input, Button, WhiteText, Cancel } from './styles';

export default () => {
  const route = useRoute();
  const { navigate } = useNavigation();
  const [date, setDate] = useState(addDays(new Date(), 1));
  const [showDatepicker, setShowDatepicker] = useState(false);
  const { id } = route.params;

  const handleSubmit = useCallback(async () => {
    try {
      await api.post(`spots/${id}/booking`, {
        date,
      });

      Alert.alert('Solicitação de reserva enviada');
      navigate('List');
    } catch (err) {
      Alert.alert('Ops! Alguma coisa deu errado, tente novamente!');
    }
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
            setDate(selectedDate);
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
