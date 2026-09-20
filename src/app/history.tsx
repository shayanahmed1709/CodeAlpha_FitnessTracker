import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const STORAGE_KEY = "fitness_logs";

type LogEntry = {
  id: number;
  date: string; // YYYY-MM-DD
  type: string;
  durationMin: number;
  calories: number;
  steps: number;
};

function last7Days() {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

function dayLabel(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

export default function History() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
        if (saved) setLogs(JSON.parse(saved));
      });
    }, []),
  );

  async function handleDelete(id: number) {
    Alert.alert("Delete this log?", undefined, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updated = logs.filter((l) => l.id !== id);
          setLogs(updated);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        },
      },
    ]);
  }

  const days = last7Days();
  const caloriesByDay = days.map((day) =>
    logs.filter((l) => l.date === day).reduce((sum, l) => sum + l.calories, 0),
  );
  const maxCalories = Math.max(...caloriesByDay, 1);

  const sortedLogs = [...logs].sort((a, b) => b.id - a.id);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Last 7 Days (Calories)</Text>
      <View style={styles.chartCard}>
        <View style={styles.chartRow}>
          {days.map((day, i) => (
            <View key={day} style={styles.barColumn}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    { height: `${(caloriesByDay[i] / maxCalories) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{dayLabel(day)}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.sectionTitle}>All Activity</Text>
      <FlatList
        data={sortedLogs}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No activity logged yet.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowType}>{item.type}</Text>
              <Text style={styles.rowDetails}>
                {item.date} · {item.durationMin} min · {item.calories} kcal ·{" "}
                {item.steps} steps
              </Text>
            </View>
            <Pressable
              onPress={() => handleDelete(item.id)}
              style={styles.deleteButton}
            >
              <Text>🗑️</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 10,
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    height: 160,
  },
  chartRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  barColumn: { alignItems: "center", flex: 1 },
  barTrack: {
    width: 18,
    height: 100,
    justifyContent: "flex-end",
  },
  bar: {
    width: 18,
    backgroundColor: "#4a6cf7",
    borderRadius: 4,
    minHeight: 2,
  },
  barLabel: { fontSize: 11, color: "#888", marginTop: 6 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  rowType: { fontSize: 15, fontWeight: "600", color: "#222" },
  rowDetails: { fontSize: 12, color: "#888", marginTop: 3 },
  deleteButton: { padding: 8 },
  emptyText: { textAlign: "center", color: "#888", marginTop: 30 },
});
