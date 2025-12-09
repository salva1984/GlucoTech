import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { AlertTriangle, Info } from 'lucide-react-native';

const alertsData = [
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
];

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

export function AlertsSection() {
  return (
    <FlatList
      data={alertsData}
      renderItem={({ item }) => <AlertItem item={item} />}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={() => (
        <Text style={styles.header}>Alertas Recientes</Text>
      )}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937',
  },
  alertCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    borderLeftWidth: 4,
  },
  highAlert: { borderColor: '#ef4444' },
  lowAlert: { borderColor: '#f97316' },
  icon: { marginRight: 12 },
  alertContent: { flex: 1 },
  alertTitle: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  alertMessage: { fontSize: 14, color: '#4b5563', marginTop: 4 },
  alertTime: { fontSize: 12, color: '#9ca3af', marginTop: 8 },
});