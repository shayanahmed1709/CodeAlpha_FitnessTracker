import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const STORAGE_KEY = "fitness_logs";

const STEP_GOAL = 10000;
const CALORIE_GOAL = 500;
const DURATION_GOAL = 60; // minutes

const ACTIVITY_TYPES = ["Running", "Walking", "Gym", "Cycling", "Other"];

type LogEntry = {
  id: number;
  date: string; // YYYY-MM-DD
  type: string;
  durationMin: number;
  calories: number;
  steps: number;
};

function todayString() {
  return new Date().toISOString().split("T")[0];
}

export default function Index() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [type, setType] = useState(ACTIVITY_TYPES[0]);
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState("");
  const [steps, setSteps] = useState("");

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
        if (saved) setLogs(JSON.parse(saved));
      });
    }, []),
  );

  async function saveLogs(updated: LogEntry[]) {
    setLogs(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function handleAddLog() {
    const durationNum = parseInt(duration) || 0;
    const caloriesNum = parseInt(calories) || 0;
    const stepsNum = parseInt(steps) || 0;

    if (durationNum === 0 && caloriesNum === 0 && stepsNum === 0) {
      return; // nothing entered, ignore
    }

    const newLog: LogEntry = {
      id: Date.now(),
      date: todayString(),
      type,
      durationMin: durationNum,
      calories: caloriesNum,
      steps: stepsNum,
    };

    saveLogs([newLog, ...logs]);
    setDuration("");
    setCalories("");
    setSteps("");
  }

  const todayLogs = logs.filter((log) => log.date === todayString());
  const todaySteps = todayLogs.reduce((sum, l) => sum + l.steps, 0);
  const todayCalories = todayLogs.reduce((sum, l) => sum + l.calories, 0);
  const todayDuration = todayLogs.reduce((sum, l) => sum + l.durationMin, 0);

  function progressPercent(value: number, goal: number) {
    return Math.min(100, Math.round((value / goal) * 100));
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
    >
      <Text style={styles.sectionTitle}>Today's Summary</Text>

      <View style={styles.summaryCard}>
        <SummaryRow label="Steps" value={todaySteps} goal={STEP_GOAL} unit="" />
        <SummaryRow
          label="Calories"
          value={todayCalories}
          goal={CALORIE_GOAL}
          unit="kcal"
        />
        <SummaryRow
          label="Active Minutes"
          value={todayDuration}
          goal={DURATION_GOAL}
          unit="min"
        />
      </View>

      <Text style={styles.sectionTitle}>Log Activity</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Activity Type</Text>
        <View style={styles.typeRow}>
          {ACTIVITY_TYPES.map((t) => (
            <Pressable
              key={t}
              style={[styles.typeChip, type === t && styles.typeChipSelected]}
              onPress={() => setType(t)}
            >
              <Text
                style={[
                  styles.typeChipText,
                  type === t && styles.typeChipTextSelected,
                ]}
              >
                {t}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Duration (minutes)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={duration}
          onChangeText={setDuration}
          placeholder="e.g. 30"
        />

        <Text style={styles.label}>Calories Burned</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={calories}
          onChangeText={setCalories}
          placeholder="e.g. 200"
        />

        <Text style={styles.label}>Steps</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={steps}
          onChangeText={setSteps}
          placeholder="e.g. 3000"
        />

        <Pressable style={styles.saveButton} onPress={handleAddLog}>
          <Text style={styles.saveButtonText}>Save Activity</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function SummaryRow({
  label,
  value,
  goal,
  unit,
}: {
  label: string;
  value: number;
  goal: number;
  unit: string;
}) {
  const percent = Math.min(100, Math.round((value / goal) * 100));
  return (
    <View style={styles.summaryRow}>
      <View style={styles.summaryHeader}>
        <Text style={styles.summaryLabel}>{label}</Text>
        <Text style={styles.summaryValue}>
          {value}
          {unit} / {goal}
          {unit}
        </Text>
      </View>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 10,
    marginTop: 6,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: { marginBottom: 14 },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryLabel: { fontSize: 14, fontWeight: "600", color: "#333" },
  summaryValue: { fontSize: 13, color: "#888" },
  progressBarBg: {
    height: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 10,
    backgroundColor: "#4a6cf7",
    borderRadius: 6,
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
  },
  label: { fontSize: 13, color: "#666", marginBottom: 6, marginTop: 10 },
  typeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  typeChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  typeChipSelected: { backgroundColor: "#4a6cf7" },
  typeChipText: { fontSize: 13, color: "#333" },
  typeChipTextSelected: { color: "#fff", fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: "#4a6cf7",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
