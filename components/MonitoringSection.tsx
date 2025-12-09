import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Droplet, TrendingUp, Plus } from 'lucide-react-native';

export function MonitoringSection() {
  const [glucose, setGlucose] = useState(110);
  const [status, setStatus] = useState("Normal");
  const [isMeasuring, setIsMeasuring] = useState(false);

  const [history, setHistory] = useState([
    { value: 98, status: "Normal", date: "14 Nov · 20:15" },
    { value: 145, status: "Alta", date: "14 Nov · 14:30" },
    { value: 110, status: "Normal", date: "14 Nov · 08:00" },
  ]);

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

      // Formatear fecha
      const now = new Date();
      const fecha =
        now.getDate() +
        " " +
        now.toLocaleString("es-ES", { month: "short" }) +
        " · " +
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      // Añadir al historial
      setHistory(prev => [
        { value: nuevoValor, status: nuevoEstado, date: fecha },
        ...prev,
      ]);
    }, 1500);
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "Alta":
        return "#ef4444";
      case "Baja":
        return "#f59e0b";
      default:
        return "#10b981";
    }
  }

  return (
    <View style={styles.container}>
      {/* Glucosa actual */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Droplet color="#22c55e" size={20} />
          <Text style={styles.cardTitle}>Glucosa Actual</Text>
        </View>

        <View style={styles.glucoseReading}>
          {isMeasuring ? (
            <Text style={styles.measuringText}>Midiendo...</Text>
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

      {/* Botón */}
      <TouchableOpacity style={styles.addButton} onPress={medirGlucosa}>
        <Plus color="white" size={20} />
        <Text style={styles.addButtonText}>Registrar Medición</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    elevation: 2,
  },
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
  addButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
