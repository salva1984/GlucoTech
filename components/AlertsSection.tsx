import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react-native';

const ESP32_IP = "http://192.168.1.1";

export function AlertsSection() {
  const [alertsData, setAlertsData] = useState([
    {
      id: '1',
      type: 'high',
      title: 'Hiperglucemia Detectada',
      message: 'Nivel de glucosa: 185 mg/dL. Considera tomar acciones.',
      time: 'Hace 15 minutos',
    },
    {
      id: '2',
      type: 'low',
      title: 'Hipoglucemia Leve',
      message: 'Nivel de glucosa: 65 mg/dL. Se recomienda un snack.',
      time: 'Ayer, 9:30 PM',
    },
  ]);
  
  const [loading, setLoading] = useState(false);

  const simularAlertaAlta = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${ESP32_IP}/alerta/alta`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const now = new Date();
      const tiempo = now.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      const nuevaAlerta = {
        id: Date.now().toString(),
        type: 'high',
        title: '⚠️ Hiperglucemia Detectada',
        message: `Nivel de glucosa: ${data.glucosa} mg/dL. ¡Atención requerida inmediata!`,
        time: `Ahora - ${tiempo}`,
      };
      
      setAlertsData(prev => [nuevaAlerta, ...prev]);
      
      Alert.alert(
        '🔴 Alerta Alta',
        `Glucosa: ${data.glucosa} mg/dL\nEstado: ${data.estado}\n\nSe ha registrado un nivel alto de glucosa.`,
        [{ text: 'Entendido', style: 'default' }]
      );
      
      console.log("Alerta Alta desde ESP32:", data);
      
    } catch (error) {
      console.error("Error al conectar con ESP32:", error);
      Alert.alert(
        'Error de Conexión',
        'No se pudo conectar con el ESP32.\n\nVerifica que:\n• Estés conectado a WiFi "ESP32_AP"\n• El dispositivo esté encendido',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const simularAlertaBaja = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${ESP32_IP}/alerta/baja`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const now = new Date();
      const tiempo = now.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      const nuevaAlerta = {
        id: Date.now().toString(),
        type: 'low',
        title: '⚠️ Hipoglucemia Detectada',
        message: `Nivel de glucosa: ${data.glucosa} mg/dL. Tomar azúcar inmediatamente.`,
        time: `Ahora - ${tiempo}`,
      };
      
      setAlertsData(prev => [nuevaAlerta, ...prev]);
      
      Alert.alert(
        '🔵 Alerta Baja',
        `Glucosa: ${data.glucosa} mg/dL\nEstado: ${data.estado}\n\nSe ha registrado un nivel bajo de glucosa.`,
        [{ text: 'Entendido', style: 'default' }]
      );
      
      console.log("Alerta Baja desde ESP32:", data);
      
    } catch (error) {
      console.error("Error al conectar con ESP32:", error);
      Alert.alert(
        'Error de Conexión',
        'No se pudo conectar con el ESP32.\n\nVerifica que:\n• Estés conectado a WiFi "ESP32_AP"\n• El dispositivo esté encendido',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const AlertItem = ({ item }: { item: typeof alertsData[0] }) => {
    const isHigh = item.type === 'high';
    const iconColor = isHigh ? '#ef4444' : '#f97316';
    const containerStyle = isHigh ? styles.highAlert : styles.lowAlert;

    return (
      <View style={[styles.alertCard, containerStyle]}>
        <AlertTriangle color={iconColor} size={24} style={styles.icon} />
        <View style={styles.alertContent}>
          <Text style={styles.alertTitle}>{item.title}</Text>
          <Text style={styles.alertMessage}>{item.message}</Text>
          <Text style={styles.alertTime}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <View>
      <Text style={styles.header}>Alertas Recientes</Text>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Simula alertas desde el ESP32. El dispositivo mostrará la alerta en su pantalla y la enviará a la app.
        </Text>
      </View>

      {/* Botones para simular alertas */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.testButton, styles.highButton]} 
          onPress={simularAlertaAlta}
          disabled={loading}
        >
          <TrendingUp color="white" size={20} />
          <Text style={styles.buttonText}>
            {loading ? "Enviando..." : "Alerta Alta"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.testButton, styles.lowButton]} 
          onPress={simularAlertaBaja}
          disabled={loading}
        >
          <TrendingDown color="white" size={20} />
          <Text style={styles.buttonText}>
            {loading ? "Enviando..." : "Alerta Baja"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={alertsData}
        renderItem={({ item }) => <AlertItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1f2937',
  },
  infoBox: {
    backgroundColor: '#dbeafe',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  infoText: {
    color: '#1e40af',
    fontSize: 13,
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  testButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
    elevation: 2,
  },
  highButton: {
    backgroundColor: '#ef4444',
  },
  lowButton: {
    backgroundColor: '#f97316',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContainer: {
    gap: 16,
    paddingBottom: 20,
  },
  alertCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    borderLeftWidth: 4,
    elevation: 1,
  },
  highAlert: { 
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  lowAlert: { 
    borderColor: '#f97316',
    backgroundColor: '#fff7ed',
  },
  icon: { marginRight: 12 },
  alertContent: { flex: 1 },
  alertTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#1f2937',
    marginBottom: 4,
  },
  alertMessage: { 
    fontSize: 14, 
    color: '#4b5563', 
    marginTop: 4,
    lineHeight: 20,
  },
  alertTime: { 
    fontSize: 12, 
    color: '#9ca3af', 
    marginTop: 8,
    fontStyle: 'italic',
  },
});