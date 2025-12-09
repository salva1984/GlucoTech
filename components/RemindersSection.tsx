import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Switch, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Pill, Droplet, Plus, Trash2, Edit3 } from 'lucide-react-native';

const initialReminders = [
  { id: '1', type: 'medication', title: 'Tomar Metformina', time: '8:00 AM', enabled: true },
  { id: '2', type: 'measurement', title: 'Medir glucosa (antes de almorzar)', time: '1:30 PM', enabled: true },
  { id: '3', type: 'medication', title: 'Tomar Metformina', time: '8:00 PM', enabled: false },
];

// ICONOS
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

  const saveReminder = () => {
    if (editingReminder) {
      // EDITAR
      setReminders(reminders.map(r =>
        r.id === editingReminder.id
          ? { ...r, title: formTitle, time: formTime, type: formType }
          : r
      ));
    } else {
      // CREAR
      const newReminder = {
        id: Date.now().toString(),
        title: formTitle,
        time: formTime,
        type: formType,
        enabled: true,
      };
      setReminders([...reminders, newReminder]);
    }
    setModalVisible(false);
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const renderItem = ({ item }: { item: typeof reminders[0] }) => (
    <View style={styles.reminderCard}>
      <ReminderIcon type={item.type} />

      <View style={styles.reminderContent}>
        <Text style={styles.reminderTitle}>{item.title}</Text>
        <Text style={styles.reminderTime}>{item.time}</Text>
      </View>

      {/* EDITAR */}
      <TouchableOpacity onPress={() => openEdit(item)}>
        <Edit3 size={20} color="#6b7280" />
      </TouchableOpacity>

      {/* ELIMINAR */}
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
    <View>
      <Text style={styles.header}>Mis Recordatorios</Text>

      <FlatList
        data={reminders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 12 }}
      />

      {/* BOTÓN AÑADIR */}
      <TouchableOpacity style={styles.addButton} onPress={openCreate}>
        <Plus size={20} color="white" />
        <Text style={styles.addButtonText}>Agregar Recordatorio</Text>
      </TouchableOpacity>

      {/* MODAL */}
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
              placeholder="Hora (ej: 8:00 AM)"
              style={styles.input}
              value={formTime}
              onChangeText={setFormTime}
            />

            <TextInput
              placeholder="Tipo (medication o measurement)"
              style={styles.input}
              value={formType}
              onChangeText={(t) => setFormType(t as any)}
            />

            <TouchableOpacity style={styles.saveButton} onPress={saveReminder}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#1f2937' },

  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    elevation: 1,
  },

  reminderContent: { flex: 1 },
  reminderTitle: { fontSize: 16, fontWeight: '500', color: '#374151' },
  reminderTime: { fontSize: 14, color: '#6b7280' },

  addButton: {
    backgroundColor: '#16a34a',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  addButtonText: { color: 'white', fontWeight: 'bold' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    gap: 12,
  },

  modalTitle: { fontSize: 18, fontWeight: 'bold' },

  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },

  saveButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  cancelText: {
    textAlign: 'center',
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 8,
  },
});
