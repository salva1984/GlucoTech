import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { MonitoringSection } from '@/components/MonitoringSection';
import { AlertsSection } from '@/components/AlertsSection';
import { RemindersSection } from '@/components/RemindersSection';
import { Activity, Bell, Clock } from 'lucide-react-native';

type Section = "monitoring" | "alerts" | "reminders";

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>("monitoring");

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>GlucoTech</Text>
          <Text style={styles.headerSubtitle}>
            Tu asistente de monitoreo glucémico
          </Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeSection === "monitoring" && <MonitoringSection />}
          {activeSection === "alerts" && <AlertsSection />}
          {activeSection === "reminders" && <RemindersSection />}
        </View>

        {/* Bottom Navigation */}
        <View style={styles.nav}>
          <TouchableOpacity
            onPress={() => setActiveSection("monitoring")}
            style={[
              styles.navButton,
              activeSection === "monitoring" && styles.activeNavButton,
            ]}
          >
            <Activity color={activeSection === "monitoring" ? "#16a34a" : "#6b7280"} size={24} />
            <Text style={[styles.navText, activeSection === "monitoring" && styles.activeNavText]}>
              Monitoreo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveSection("alerts")}
            style={[styles.navButton, activeSection === "alerts" && styles.activeNavButton]}
          >
            <Bell color={activeSection === "alerts" ? "#16a34a" : "#6b7280"} size={24} />
            <Text style={[styles.navText, activeSection === "alerts" && styles.activeNavText]}>
              Alertas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveSection("reminders")}
            style={[styles.navButton, activeSection === "reminders" && styles.activeNavButton]}
          >
            <Clock color={activeSection === "reminders" ? "#16a34a" : "#6b7280"} size={24} />
            <Text style={[styles.navText, activeSection === "reminders" && styles.activeNavText]}>
              Recordatorios
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0fdf4", // from-green-50
  },
  container: {
    flex: 1,
    paddingBottom: 80, // pb-20
  },
  header: {
    backgroundColor: "#16a34a", // bg-green-600
    padding: 24, // p-6
    elevation: 4, // shadow-lg
  },
  headerTitle: {
    color: "white",
    textAlign: "center",
    fontSize: 24, // Approximation for h1
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#dcfce7", // text-green-100
    textAlign: "center",
    fontSize: 14, // text-sm
    marginTop: 4, // mt-1
  },
  content: {
    paddingHorizontal: 16, // px-4
    paddingVertical: 24, // py-6
  },
  nav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb", // border-gray-200
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12, // py-3
    elevation: 8, // shadow-lg
  },
  navButton: {
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeNavButton: {
    backgroundColor: "#f0fdf4", // bg-green-50
  },
  navText: {
    fontSize: 12, // text-xs
    color: "#6b7280", // text-gray-500
  },
  activeNavText: {
    color: "#16a34a", // text-green-600
  },
});
