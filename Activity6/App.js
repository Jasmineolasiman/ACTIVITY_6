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
  ActivityIndicator,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Create bottom tab navigator
const Tab = createBottomTabNavigator();

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

// Share event information between tabs
function EventProvider({ children }) {
  const [savedEvents, setSavedEvents] = useState([]);
  const [saving, setSaving] = useState(false);

  const addEvent = (event) => {
    if (
      savedEvents.some((item) => item.id === event.id) ||
      saving
    ) {
      return;
    }

    setSaving(true);

    setTimeout(() => {
      setSavedEvents((previous) => [...previous, event]);
      setSaving(false);
    }, 1000);
  };

  const removeEvent = (id) => {
    setSavedEvents((previous) =>
      previous.filter((event) => event.id !== id)
    );
  };

  return (
    <EventContext.Provider
      value={{ savedEvents, saving, addEvent, removeEvent }}
    >
      {children}
    </EventContext.Provider>
  );
}

function EventCard({ event }) {
  const { savedEvents, saving, addEvent } = useContext(EventContext);

  const isSaved = savedEvents.some(
    (item) => item.id === event.id
  );

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{event.title}</Text>
      <Text style={styles.description}>{event.date}</Text>
      <Text style={styles.description}>{event.location}</Text>

      <TouchableOpacity
        style={[styles.button, isSaved && styles.savedButton]}
        onPress={() => addEvent(event)}
        disabled={isSaved || saving}
      >
        {saving && !isSaved ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>
            {isSaved ? 'Added to Schedule' : 'Add to Schedule'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

function DiscoverScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>Discover Events</Text>
      <Text style={styles.subtitle}>
        Find activities happening around campus.
      </Text>

      {campusEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </ScrollView>
  );
}

function ScheduleScreen() {
  const { savedEvents, removeEvent } = useContext(EventContext);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>My Schedule</Text>
      <Text style={styles.subtitle}>
        Manage your saved campus events.
      </Text>

      {savedEvents.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="calendar-outline" size={45} color="#9B83C9" />
          <Text style={styles.emptyTitle}>No Events Yet</Text>
          <Text style={styles.description}>
            Add an event from the Discover tab.
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

function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#6C3FC5',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            height: 65,
            paddingBottom: 8,
            paddingTop: 8,
            backgroundColor: '#FFFFFF',
          },
          tabBarIcon: ({ color, size }) => {
            const iconName =
              route.name === 'Discover'
                ? 'compass-outline'
                : 'calendar-outline';

            return (
              <Ionicons name={iconName} size={size} color={color} />
            );
          },
        })}
      >
        <Tab.Screen name="Discover" component={DiscoverScreen} />
        <Tab.Screen name="My Schedule" component={ScheduleScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <EventProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0FF" />
      <AppNavigator />
    </EventProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#6C3FC5',
  },
  subtitle: {
    fontSize: 15,
    color: '#777',
    marginTop: 8,
    marginBottom: 22,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    marginBottom: 15,
    elevation: 3,
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
    padding: 13,
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
  emptyCard: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#6C3FC5',
    marginTop: 12,
  },
});