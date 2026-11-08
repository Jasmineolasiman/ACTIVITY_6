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
    icon: 'laptop-outline',
    category: 'Technology',
  },
  {
    id: '2',
    title: 'Creative Design Workshop',
    date: 'December 8, 2026',
    location: 'Computer Laboratory',
    icon: 'color-palette-outline',
    category: 'Workshop',
  },
  {
    id: '3',
    title: 'Campus Sports Festival',
    date: 'December 12, 2026',
    location: 'University Gym',
    icon: 'trophy-outline',
    category: 'Sports',
  },
  {
    id: '4',
    title: 'Student Music Night',
    date: 'December 15, 2026',
    location: 'Open Grounds',
    icon: 'musical-notes-outline',
    category: 'Entertainment',
  },
];

// Share event information between screens
function EventProvider({ children }) {
  const [savedEvents, setSavedEvents] = useState([]);
  const [savingEventId, setSavingEventId] = useState(null);

  const addEvent = (event) => {
    if (
      savedEvents.some((item) => item.id === event.id) ||
      savingEventId !== null
    ) {
      return;
    }

    setSavingEventId(event.id);

    // Simulate saving an event
    setTimeout(() => {
      setSavedEvents((previous) => {
        if (previous.some((item) => item.id === event.id)) {
          return previous;
        }

        return [...previous, event];
      });

      setSavingEventId(null);
    }, 1000);
  };

  const removeEvent = (id) => {
    setSavedEvents((previous) =>
      previous.filter((event) => event.id !== id)
    );
  };

  return (
    <EventContext.Provider
      value={{
        savedEvents,
        savingEventId,
        addEvent,
        removeEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

// Display individual event information
function EventCard({ event, showRemove = false }) {
  const {
    savedEvents,
    savingEventId,
    addEvent,
    removeEvent,
  } = useContext(EventContext);

  const isSaved = savedEvents.some(
    (item) => item.id === event.id
  );

  const isSaving = savingEventId === event.id;

  return (
    <View style={styles.card}>
      <View style={styles.eventHeader}>
        <View style={styles.eventIcon}>
          <Ionicons
            name={event.icon}
            size={27}
            color="#7548C8"
          />
        </View>

        <View style={styles.eventInfo}>
          <Text style={styles.category}>{event.category}</Text>
          <Text style={styles.cardTitle}>{event.title}</Text>
        </View>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="calendar-outline" size={17} color="#777" />
        <Text style={styles.description}>{event.date}</Text>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="location-outline" size={17} color="#777" />
        <Text style={styles.description}>{event.location}</Text>
      </View>

      {showRemove ? (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeEvent(event.id)}
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={17} color="#FFFFFF" />
          <Text style={styles.buttonText}>Remove Event</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            styles.button,
            isSaved && styles.savedButton,
          ]}
          onPress={() => addEvent(event)}
          disabled={isSaved || savingEventId !== null}
          activeOpacity={0.8}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>
              {isSaved ? 'Added to Schedule' : 'Add to Schedule'}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

// Discover events tab
function DiscoverScreen() {
  const { savedEvents } = useContext(EventContext);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>WELCOME TO</Text>
        <Text style={styles.title}>Campus Event Planner</Text>
        <Text style={styles.subtitle}>
          Discover activities and make your campus life memorable.
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryNumber}>
            {savedEvents.length}
          </Text>
          <Text style={styles.summaryLabel}>Saved Events</Text>
        </View>

        <Ionicons
          name="calendar"
          size={42}
          color="#FFFFFF"
        />
      </View>

      <Text style={styles.sectionTitle}>Upcoming Events</Text>

      {campusEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </ScrollView>
  );
}

// My schedule tab
function ScheduleScreen() {
  const { savedEvents } = useContext(EventContext);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>My Schedule</Text>
      <Text style={styles.subtitle}>
        Keep track of your saved campus activities.
      </Text>

      <View style={styles.scheduleHeader}>
        <Text style={styles.sectionTitle}>My Saved Events</Text>
        <Text style={styles.countText}>
          {savedEvents.length} Events
        </Text>
      </View>

      {savedEvents.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons
            name="calendar-outline"
            size={60}
            color="#A995D1"
          />

          <Text style={styles.emptyTitle}>No Events Yet</Text>

          <Text style={styles.emptyDescription}>
            You have not added any events to your schedule.
            Visit the Discover tab to explore upcoming activities.
          </Text>
        </View>
      ) : (
        savedEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            showRemove={true}
          />
        ))
      )}
    </ScrollView>
  );
}

// Set up bottom tab navigation
function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#7548C8',
          tabBarInactiveTintColor: '#999999',
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ color, size }) => {
            const iconName =
              route.name === 'Discover'
                ? 'compass-outline'
                : 'calendar-outline';

            return (
              <Ionicons
                name={iconName}
                size={size}
                color={color}
              />
            );
          },
        })}
      >
        <Tab.Screen
          name="Discover"
          component={DiscoverScreen}
        />

        <Tab.Screen
          name="My Schedule"
          component={ScheduleScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Main application
export default function App() {
  return (
    <EventProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F5F0FF"
      />

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
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 35,
  },
  header: {
    marginBottom: 22,
  },
  greeting: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9B83C9',
    letterSpacing: 2,
    marginBottom: 7,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#6C3FC5',
  },
  subtitle: {
    fontSize: 14,
    color: '#777777',
    marginTop: 8,
    lineHeight: 21,
  },
  summaryCard: {
    backgroundColor: '#7548C8',
    padding: 22,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  summaryNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#F0E8FF',
    marginTop: 3,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#493080',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 17,
    borderRadius: 17,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  eventIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F0E9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  category: {
    fontSize: 11,
    color: '#9B83C9',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#493080',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  description: {
    fontSize: 13,
    color: '#777777',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#7548C8',
    padding: 13,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 17,
    minHeight: 45,
  },
  savedButton: {
    backgroundColor: '#9B8BB8',
  },
  removeButton: {
    backgroundColor: '#DF6177',
    padding: 13,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,
    marginTop: 17,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  countText: {
    color: '#7548C8',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 17,
    alignItems: 'center',
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#6C3FC5',
    marginTop: 15,
  },
  emptyDescription: {
    fontSize: 13,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 9,
  },
  tabBar: {
    height: 65,
    paddingTop: 7,
    paddingBottom: 7,
    backgroundColor: '#FFFFFF',
    borderTopColor: '#EAE2F5',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});