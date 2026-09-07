import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

// URL de tu servidor backend en Render (Debes reemplazarla)
const BACKEND_URL = 'https://logitrack-backend-6sv3.onrender.com';

export default function App() {
  const [trackingNumber, setTrackingNumber] = useState('TRK-999');
  const [receiverName, setReceiverName] = useState('');
  const [receiverDni, setReceiverDni] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmDelivery = async () => {
    if (!receiverName || !receiverDni) {
      Alert.alert('Error', 'Debe ingresar el Nombre y DNI de quien recibe.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tracking_number: trackingNumber,
          status: 'ENTREGADO',
          receiver_name: receiverName,
          receiver_dni: receiverDni
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('¡Éxito!', `Paquete ${trackingNumber} marcado como entregado.`);
        setReceiverName('');
        setReceiverDni('');
      } else {
        Alert.alert('Error', data.error || 'No se pudo confirmar la entrega.');
      }
    } catch (error) {
      Alert.alert('Error de conexión', 'Verifique su conexión a internet e intente nuevamente.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LogiTrack Driver</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Paquete a Entregar:</Text>
        <Text style={styles.trackingNumber}>{trackingNumber}</Text>

        <Text style={styles.label}>Nombre de quien recibe:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Juan Pérez"
          value={receiverName}
          onChangeText={setReceiverName}
        />

        <Text style={styles.label}>DNI de quien recibe:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 12345678"
          value={receiverDni}
          onChangeText={setReceiverDni}
          keyboardType="numeric"
        />

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleConfirmDelivery}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Confirmar Entrega</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: { backgroundColor: '#0f172a', padding: 20, paddingTop: 50, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  card: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  label: { fontSize: 14, color: '#64748b', marginBottom: 5, marginTop: 15, fontWeight: 'bold' },
  trackingNumber: { fontSize: 24, color: '#2563eb', fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#f8fafc' },
  button: { backgroundColor: '#10b981', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 25 },
  buttonDisabled: { backgroundColor: '#94a3b8' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
