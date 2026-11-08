import React, {
  createContext,
  useContext,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';

// Create shared event context
const EventContext = createContext();

function EventProvider({ children }) {
  const [savedEvents, setSavedEvents] = useState([]);

  return (
    <EventContext.Provider
      value={{ savedEvents, setSavedEvents }}
    >
      {children}
    </EventContext.Provider>
  );
}

function HomeScreen() {
  const { savedEvents } = useContext(EventContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Campus Event Planner</Text>
      <Text style={styles.subtitle}>
        Organize your campus activities.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>My Events</Text>
        <Text style={styles.description}>
          Saved Events: {savedEvents.length}
        </Text>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <EventProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0FF" />
      <HomeScreen />
    </EventProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FF',
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#6C3FC5',
  },
  subtitle: {
    fontSize: 15,
    color: '#777',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginTop: 30,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C3FC5',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
});