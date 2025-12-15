import React, { useState } from 'react';
// 1. Importamos ScrollView y quitamos FlatList (ya no es necesario)
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView
} from 'react-native';
import { Pill, Droplet, Plus, Trash2, Edit3, Send } from 'lucide-react-native';

const ESP32_IP = "http://192.168.1.1";

const initialReminders = [
  { id: '1', type: 'medication', title: 'Tomar Metformina', time: '08:00', enabled: true },
  { id: '2', type: 'measurement', title: 'Medir glucosa (antes de almorzar)', time: '13:30', enabled: true },
  { id: '3', type: 'medication', title: 'Tomar Metformina', time: '20:00', enabled: false },
];

const ReminderIcon = ({ type }: { type: string }) => {
  return type === 'medication'
    ? <Pill color="#a78bfa" size={24} />
    : <Droplet color="#22c55e" size={24} />;
};

export function RemindersSection() {
  const [reminders, setReminders] = useState(initialReminders);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingReminder, setEditingReminder] = useState<any>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formType, setFormType] = useState<"medication" | "measurement">("medication");
  const [sending, setSending] = useState(false);

  // --- Lógica de envío (Exactamente igual que antes) ---
  const enviarRecordatorioESP32 = async (titulo: string, hora: string) => {
    setSending(true);
    try {
      const mensaje = `${titulo} - ${hora}`;
      const url = `${ESP32_IP}/recordatorio?msg=${encodeURIComponent(mensaje)}`;
      console.log("Enviando a:", url);
      const response = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      Alert.alert('✅ Enviado', `El recordatorio se mostró en el ESP32:\n\n"${mensaje}"`, [{ text: 'OK' }]);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert('Error', 'No se pudo conectar con el ESP32.');
    } finally {
      setSending(false);
    }
  };

  const toggleSwitch = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const openCreate = () => {
    setEditingReminder(null);
    setFormTitle("");
    setFormTime("");
    setFormType("medication");
    setModalVisible(true);
  };

  const openEdit = (reminder: any) => {
    setEditingReminder(reminder);
    setFormTitle(reminder.title);
    setFormTime(reminder.time);
    setFormType(reminder.type);
    setModalVisible(true);
  };

  const saveReminder = async () => {
    if (!formTitle.trim() || !formTime.trim()) {
      Alert.alert('Campos vacíos', 'Por favor completa todos los campos');
      return;
    }
    
    // Validar formato de hora 24h (HH:MM)
    const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(formTime.trim())) {
      Alert.alert(
        'Formato incorrecto', 
        'Por favor ingresa la hora en formato 24h\n\nEjemplos válidos:\n• 08:00\n• 14:30\n• 23:45'
      );
      return;
    }
    
    if (editingReminder) {
      setReminders(reminders.map(r => r.id === editingReminder.id ? { ...r, title: formTitle, time: formTime, type: formType } : r));
    } else {
      const newReminder = { id: Date.now().toString(), title: formTitle, time: formTime, type: formType, enabled: true };
      setReminders([...reminders, newReminder]);
      await enviarRecordatorioESP32(formTitle, formTime);
    }
    setModalVisible(false);
  };

  const deleteReminder = (id: string) => {
    Alert.alert('Eliminar', '¿Seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => setReminders(reminders.filter(r => r.id !== id)) }
    ]);
  };

  // Esta función ahora renderiza directamente el JSX, no se pasa al FlatList
  const renderItemContent = (item: any) => (
    <View key={item.id} style={styles.reminderCard}>
      <ReminderIcon type={item.type} />
      <View style={styles.reminderContent}>
        <Text style={styles.reminderTitle}>{item.title}</Text>
        <Text style={styles.reminderTime}>{item.time}</Text>
      </View>

      <TouchableOpacity onPress={() => enviarRecordatorioESP32(item.title, item.time)} disabled={sending} style={styles.sendButton}>
        <Send size={18} color="#3b82f6" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => openEdit(item)}>
        <Edit3 size={20} color="#6b7280" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => deleteReminder(item.id)}>
        <Trash2 size={20} color="#ef4444" />
      </TouchableOpacity>

      <Switch
        trackColor={{ false: '#d1d5db', true: '#81b0ff' }}
        thumbColor={item.enabled ? '#16a34a' : '#f4f3f4'}
        onValueChange={() => toggleSwitch(item.id)}
        value={item.enabled}
      />
    </View>
  );

  return (
    // 2. Usamos ScrollView como raíz
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.header}>Mis Recordatorios</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Los recordatorios se mostrarán en la pantalla del ESP32.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.testReminderButton}
        onPress={() => enviarRecordatorioESP32("Prueba", "Ahora")}
        disabled={sending}
      >
        <Send size={20} color="white" />
        <Text style={styles.testReminderText}>
          {sending ? "Enviando..." : "Enviar Recordatorio de Prueba"}
        </Text>

      </TouchableOpacity>

      {/* BOTÓN AÑADIR */}
      <TouchableOpacity style={styles.addButton} onPress={openCreate}>
        <Plus size={20} color="white" />
        <Text style={styles.addButtonText}>Agregar Recordatorio</Text>
      </TouchableOpacity>


      {/* 3. Reemplazo de FlatList por .map() */}
      <View style={{ gap: 12 }}>
        {reminders.map((item) => renderItemContent(item))}
      </View>



      {/* El Modal DEBE estar aquí, pero no afecta el scroll */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingReminder ? "Editar Recordatorio" : "Nuevo Recordatorio"}
            </Text>
            <TextInput 
              placeholder="Título" 
              style={styles.input} 
              value={formTitle} 
              onChangeText={setFormTitle} 
            />
            <TextInput 
              placeholder="Hora (ej: 14:30)" 
              style={styles.input} 
              value={formTime} 
              onChangeText={setFormTime}
              keyboardType="numbers-and-punctuation"
              maxLength={5}
              autoCapitalize="none"
            />
            <Text style={styles.helpText}>
              Formato 24 horas (Ejemplo: 08:00, 14:30, 23:45)
            </Text>

            <View style={styles.typeSelector}>
              <TouchableOpacity style={[styles.typeButton, formType === 'medication' && styles.typeButtonActive]} onPress={() => setFormType('medication')}>
                <Pill size={20} color={formType === 'medication' ? '#a78bfa' : '#6b7280'} />
                <Text style={styles.typeButtonText}>Medicamento</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.typeButton, formType === 'measurement' && styles.typeButtonActive]} onPress={() => setFormType('measurement')}>
                <Droplet size={20} color={formType === 'measurement' ? '#22c55e' : '#6b7280'} />
                <Text style={styles.typeButtonText}>Medición</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={saveReminder}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Nuevos estilos para el ScrollView
  scrollView: {
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120, // <--- Espacio extra al final para que no se corte
    flexGrow: 1,
  },

  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#1f2937' },
  infoBox: { backgroundColor: '#f0fdf4', padding: 12, borderRadius: 10, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#22c55e' },
  infoText: { color: '#166534', fontSize: 13, lineHeight: 18 },
  testReminderButton: { backgroundColor: '#3b82f6', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 10, marginBottom: 16, gap: 8, elevation: 2 },
  testReminderText: { color: 'white', fontWeight: 'bold', fontSize: 15 },

  reminderCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 12, gap: 12, elevation: 1 },
  reminderContent: { flex: 1 },
  reminderTitle: { fontSize: 16, fontWeight: '500', color: '#374151' },
  reminderTime: { fontSize: 14, color: '#6b7280', marginTop: 4 },

  sendButton: { padding: 6, borderRadius: 6, backgroundColor: '#dbeafe' },
  addButton: { backgroundColor: '#16a34a', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 12, margin: 20, gap: 8, elevation: 2 },
  addButtonText: { color: 'white', fontWeight: 'bold', fontSize: 15 },

  // Estilos del Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', padding: 20, borderTopRightRadius: 20, borderTopLeftRadius: 20, gap: 12 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  input: { backgroundColor: '#f3f4f6', borderRadius: 10, padding: 12, fontSize: 16 },
  helpText: { 
    fontSize: 12, 
    color: '#6b7280', 
    marginTop: -8, 
    marginBottom: 4,
    fontStyle: 'italic' 
  },
  typeSelector: { flexDirection: 'row', gap: 12, marginVertical: 8 },
  typeButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 10, backgroundColor: '#f3f4f6', gap: 8 },
  typeButtonActive: { backgroundColor: '#e0e7ff', borderWidth: 2, borderColor: '#818cf8' },
  typeButtonText: { fontSize: 14, fontWeight: '500', color: '#374151' },
  saveButton: { backgroundColor: '#16a34a', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  cancelText: { textAlign: 'center', color: '#6b7280', fontWeight: '500', marginTop: 8, fontSize: 15 },
});