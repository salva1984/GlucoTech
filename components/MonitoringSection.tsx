import { Droplet, Plus, TrendingUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'; // <--- CAMBIO

const ESP32_IP = "http://192.168.1.1";

export function MonitoringSection() {
  const [glucose, setGlucose] = useState(110);
  const [status, setStatus] = useState("Normal");
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState([
    { value: 98, status: "Normal", date: "14 Nov · 20:15" },
    { value: 145, status: "Alta", date: "14 Nov · 14:30" },
    { value: 110, status: "Normal", date: "14 Nov · 08:00" },
  ]);

  // Medición simulada (mantiene la funcionalidad original)
  function medirGlucosa() {
    setIsMeasuring(true);
    setStatus("Midiendo...");

    setTimeout(() => {
      const variacion = Math.floor(Math.random() * 41) - 20;
      const nuevoValor = glucose + variacion;
      let nuevoEstado = "Normal";

      if (nuevoValor < 70) nuevoEstado = "Baja";
      else if (nuevoValor > 140) nuevoEstado = "Alta";

      setGlucose(nuevoValor);
      setStatus(nuevoEstado);
      setIsMeasuring(false);

      const now = new Date();
      const fecha =
        now.getDate() +
        " " +
        now.toLocaleString("es-ES", { month: "short" }) +
        " · " +
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      setHistory(prev => [
        { value: nuevoValor, status: nuevoEstado, date: fecha },
        ...prev,
      ]);
    }, 1500);
  }

  // Nueva función para obtener glucosa del ESP32
  const obtenerGlucosaESP32 = async () => {
    setLoading(true);
    setStatus("Conectando...");
    
    try {
      const response = await fetch(`${ESP32_IP}/glucosa`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Actualizar con los datos reales del ESP32
      setGlucose(data.glucosa);
      
      let estado = "Normal";
      if (data.glucosa < 70) estado = "Baja";
      else if (data.glucosa > 140) estado = "Alta";
      
      setStatus(estado);
      
      // Agregar al historial
      const now = new Date();
      const fecha =
        now.getDate() +
        " " +
        now.toLocaleString("es-ES", { month: "short" }) +
        " · " +
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      setHistory(prev => [
        { value: data.glucosa, status: estado, date: fecha },
        ...prev,
      ]);

      // Feedback visual
      console.log("Datos recibidos del ESP32:", data);
      
    } catch (error) {
      console.error("Error al conectar con ESP32:", error);
      setStatus("Error");
      alert(
        "No se pudo conectar con el dispositivo ESP32.\n\n" +
        "Verifica que:\n" +
        "1. Estés conectado a la red WiFi 'ESP32_AP'\n" +
        "2. El ESP32 esté encendido\n" +
        "3. La IP sea correcta (192.168.1.1)"
      );
    } finally {
      setLoading(false);
    }
  };

  function getStatusColor(status: string) {
    switch (status) {
      case "Alta":
        return "#ef4444";
      case "Baja":
        return "#f59e0b";
      case "Error":
        return "#ef4444";
      case "Conectando...":
        return "#6b7280";
      default:
        return "#10b981";
    }
  }

  return (
   <ScrollView 
      contentContainerStyle={styles.scrollContainer} 
      showsVerticalScrollIndicator={false}
    > 
      {/* Glucosa actual */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Droplet color="#22c55e" size={20} />
          <Text style={styles.cardTitle}>Glucosa Actual</Text>
        </View>

        <View style={styles.glucoseReading}>
          {isMeasuring || loading ? (
            <Text style={styles.measuringText}>
              {loading ? "Conectando..." : "Midiendo..."}
            </Text>
          ) : (
            <>
              <Text style={styles.glucoseValue}>{glucose}</Text>
              <Text style={styles.glucoseUnit}>mg/dL</Text>
            </>
          )}
        </View>

        <Text style={[styles.glucoseStatus, { color: getStatusColor(status) }]}>
          {status}
        </Text>
      </View>

      {/* Historial */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <TrendingUp color="#16a34a" size={20} />
          <Text style={styles.cardTitle}>Historial Reciente</Text>
        </View>

        <View style={{ gap: 12 }}>
          {/* NOTA: Aquí tienes un .slice(0, 5). Si quieres ver toda la lista
             cuando crezca, quita el .slice(0, 5) o aumenta el número.
          */}
          {history.map((item, idx) => (
            <View key={idx} style={styles.historyItem}>
              <View>
                <Text style={styles.historyValue}>{item.value} mg/dL</Text>
                <Text style={styles.historyDate}>{item.date}</Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(item.status) + "22" },
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    { color: getStatusColor(item.status) },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Botones */}
      <TouchableOpacity 
        style={[styles.addButton, styles.esp32Button]} 
        onPress={obtenerGlucosaESP32}
        disabled={loading || isMeasuring}
      >
        <Droplet color="white" size={20} />
        <Text style={styles.addButtonText}>
          {loading ? "Obteniendo..." : "Medir desde ESP32"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={medirGlucosa}
        disabled={loading || isMeasuring}
      >
        <Plus color="white" size={20} />
        <Text style={styles.addButtonText}>
          {isMeasuring ? "Midiendo..." : "Simulación Local"}
        </Text>
      </TouchableOpacity>
      
      {/* Un pequeño espacio extra al final para que el botón no toque el borde */}
      <View style={{ height: 20 }} /> 
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Renombré container a scrollContainer para ser más claro,
  // y agregué paddingVertical para que no toque los bordes superior/inferior al scrollear
  scrollContainer: { 
    gap: 24,
    paddingVertical: 10, 
    paddingHorizontal: 5 // Opcional si quieres margen a los lados
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    elevation: 2,
  },
  // ... resto de estilos igual ...
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#374151' },
  glucoseReading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    gap: 8,
  },
  glucoseValue: { fontSize: 48, fontWeight: 'bold', color: '#1f2937' },
  glucoseUnit: { fontSize: 16, fontWeight: '500', color: '#6b7280' },
  measuringText: { fontSize: 28, fontWeight: '700', color: '#6b7280' },
  glucoseStatus: { textAlign: 'center', fontWeight: '600' },
  historyItem: {
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyValue: { fontSize: 18, fontWeight: '600', color: '#1f2937' },
  historyDate: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusBadgeText: { fontSize: 14, fontWeight: '600' },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#16a34a',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  esp32Button: {
    backgroundColor: '#0ea5e9',
  },
  addButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});