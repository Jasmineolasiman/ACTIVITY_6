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
  ScrollView,
} from 'react-native';

// Create shared event context
const EventContext = createContext();

// Sample campus events
const campusEvents = [
  {
    id: '1',
    title: 'IT Tech Conference',
    date: 'December 5, 2026',
    location: 'University Auditorium',
  },
  {
    id: '2',
    title: 'Creative Design Workshop',
    date: 'December 8, 2026',
    location: 'Computer Laboratory',
  },
  {
    id: '3',
    title: 'Campus Sports Festival',
    date: 'December 12, 2026',
    location: 'University Gym',
  },
  {
    id: '4',
    title: 'Student Music Night',
    date: 'December 15, 2026',
    location: 'Open Grounds',
  },
];

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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Campus Event Planner</Text>
      <Text style={styles.subtitle}>
        Discover upcoming campus events.
      </Text>

      <Text style={styles.sectionTitle}>Upcoming Events</Text>

      {campusEvents.map((event) => (
        <View style={styles.card} key={event.id}>
          <Text style={styles.cardTitle}>{event.title}</Text>
          <Text style={styles.description}>{event.date}</Text>
          <Text style={styles.description}>{event.location}</Text>
        </View>
      ))}

      <Text style={styles.savedText}>
        Saved Events: {savedEvents.length}
      </Text>
    </ScrollView>
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
    padding: 20,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#493080',
    marginTop: 28,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#6C3FC5',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 7,
  },
  savedText: {
    color: '#6C3FC5',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 20,
  },
});