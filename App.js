import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

const BACKEND_URL = 'https://logitrack-backend-6sv3.onrender.com';

export default function App() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverDni, setReceiverDni] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (statusToSet) => {
    if (!trackingNumber) {
      Alert.alert('Error', 'Debe ingresar un número de tracking.');
      return;
    }

    if (statusToSet === 'ENTREGADO' && (!receiverName || !receiverDni)) {
      Alert.alert('Error', 'Debe ingresar el Nombre y DNI de quien recibe.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tracking_number: trackingNumber.toUpperCase(),
          status: statusToSet,
          receiver_name: receiverName || null,
          receiver_dni: receiverDni || null
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('¡Éxito!', `Paquete marcado como ${statusToSet}`);
        if (statusToSet === 'ENTREGADO') {
          setReceiverName('');
          setReceiverDni('');
          setTrackingNumber('');
        }
      } else {
        Alert.alert('Error', data.error || 'No se pudo actualizar.');
      }
    } catch (error) {
      Alert.alert('Error', 'Verifique su conexión a internet.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LogiTrack Chofer</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Tracking del Envío:</Text>
        <TextInput
          style={styles.inputTracking}
          placeholder="Ej: TRK-1001"
          value={trackingNumber}
          onChangeText={setTrackingNumber}
          autoCapitalize="characters"
        />

        <TouchableOpacity 
          style={[styles.buttonReparto, isLoading && styles.buttonDisabled]} 
          onPress={() => handleStatusChange('EN_REPARTO')}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>🚚 Iniciar Reparto</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.label}>Datos para Entrega Final:</Text>
        <TextInput style={styles.input} placeholder="Nombre (Ej: Juan Pérez)" value={receiverName} onChangeText={setReceiverName} />
        <TextInput style={styles.input} placeholder="DNI (Ej: 12345678)" value={receiverDni} onChangeText={setReceiverDni} keyboardType="numeric" />

        <TouchableOpacity 
          style={[styles.buttonEntrega, isLoading && styles.buttonDisabled]} 
          onPress={() => handleStatusChange('ENTREGADO')}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>✅ Confirmar Entrega</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: { backgroundColor: '#0f172a', padding: 20, paddingTop: 50, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  card: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 10, elevation: 3 },
  label: { fontSize: 14, color: '#64748b', marginBottom: 5, marginTop: 5, fontWeight: 'bold' },
  inputTracking: { borderWidth: 2, borderColor: '#3b82f6', borderRadius: 8, padding: 12, fontSize: 18, backgroundColor: '#eff6ff', marginBottom: 15, fontWeight: 'bold', textTransform: 'uppercase' },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#f8fafc', marginBottom: 10 },
  buttonReparto: { backgroundColor: '#eab308', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonEntrega: { backgroundColor: '#10b981', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  buttonDisabled: { backgroundColor: '#94a3b8' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 20 }
});
