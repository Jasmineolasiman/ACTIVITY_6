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
  TouchableOpacity,
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

  const addEvent = (event) => {
    if (!savedEvents.some((item) => item.id === event.id)) {
      setSavedEvents((previous) => [...previous, event]);
    }
  };

  const removeEvent = (id) => {
    setSavedEvents((previous) =>
      previous.filter((event) => event.id !== id)
    );
  };

  return (
    <EventContext.Provider
      value={{ savedEvents, addEvent, removeEvent }}
    >
      {children}
    </EventContext.Provider>
  );
}

function DiscoverScreen() {
  const { savedEvents, addEvent } = useContext(EventContext);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Discover Events</Text>
      <Text style={styles.subtitle}>
        Find activities happening around campus.
      </Text>

      {campusEvents.map((event) => {
        const isSaved = savedEvents.some(
          (item) => item.id === event.id
        );

        return (
          <View style={styles.card} key={event.id}>
            <Text style={styles.cardTitle}>{event.title}</Text>
            <Text style={styles.description}>{event.date}</Text>
            <Text style={styles.description}>{event.location}</Text>

            <TouchableOpacity
              style={[styles.button, isSaved && styles.savedButton]}
              onPress={() => addEvent(event)}
              disabled={isSaved}
            >
              <Text style={styles.buttonText}>
                {isSaved ? 'Added to Schedule' : 'Add to Schedule'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

function ScheduleScreen() {
  const { savedEvents, removeEvent } = useContext(EventContext);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Schedule</Text>
      <Text style={styles.subtitle}>
        Manage your saved campus events.
      </Text>

      {savedEvents.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.description}>
            No events saved yet. Visit Discover Events to add one.
          </Text>
        </View>
      ) : (
        savedEvents.map((event) => (
          <View style={styles.card} key={event.id}>
            <Text style={styles.cardTitle}>{event.title}</Text>
            <Text style={styles.description}>{event.date}</Text>
            <Text style={styles.description}>{event.location}</Text>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeEvent(event.id)}
            >
              <Text style={styles.buttonText}>Remove Event</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

function AppContent() {
  const [activeScreen, setActiveScreen] = useState('discover');

  return (
    <View style={styles.appContainer}>
      <View style={styles.tabButtons}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setActiveScreen('discover')}
        >
          <Text style={styles.tabText}>Discover</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setActiveScreen('schedule')}
        >
          <Text style={styles.tabText}>My Schedule</Text>
        </TouchableOpacity>
      </View>

      {activeScreen === 'discover' ? (
        <DiscoverScreen />
      ) : (
        <ScheduleScreen />
      )}
    </View>
  );
}

export default function App() {
  return (
    <EventProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0FF" />
      <AppContent />
    </EventProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 25,
  },
  tabButtons: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginTop: 45,
    marginHorizontal: 15,
    borderRadius: 12,
  },
  tabButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  tabText: {
    color: '#6C3FC5',
    fontWeight: 'bold',
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
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
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
    lineHeight: 21,
  },
  button: {
    backgroundColor: '#7B4BD4',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  savedButton: {
    backgroundColor: '#9B8BB8',
  },
  removeButton: {
    backgroundColor: '#E05B75',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});