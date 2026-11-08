
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

import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

// Shared event context
const EventContext = createContext();

// Sample campus events
const campusEvents = [
  {
    id: '1',
    title: 'IT Tech Conference',
    date: 'December 5, 2026',
    location: 'University Auditorium',
    category: 'Technology',
    icon: 'laptop-outline',
  },
  {
    id: '2',
    title: 'Creative Design Workshop',
    date: 'December 8, 2026',
    location: 'Computer Laboratory',
    category: 'Workshop',
    icon: 'color-palette-outline',
  },
  {
    id: '3',
    title: 'Campus Sports Festival',
    date: 'December 12, 2026',
    location: 'University Gym',
    category: 'Sports',
    icon: 'trophy-outline',
  },
  {
    id: '4',
    title: 'Student Music Night',
    date: 'December 15, 2026',
    location: 'Open Grounds',
    category: 'Entertainment',
    icon: 'musical-notes-outline',
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

    // Simulate saving for one second
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

// Reusable event card
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
            color="#5145A5"
          />
        </View>

        <View style={styles.eventInfo}>
          <Text style={styles.category}>
            {event.category}
          </Text>
          <Text style={styles.cardTitle}>
            {event.title}
          </Text>
        </View>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="calendar-outline" size={16} color="#777777" />
        <Text style={styles.description}>{event.date}</Text>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="location-outline" size={16} color="#777777" />
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

// Discover events screen
function DiscoverScreen() {
  const { savedEvents } = useContext(EventContext);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          Campus Event Planner
        </Text>

        <Text style={styles.subtitle}>
          Discover upcoming campus activities!
        </Text>

        <View style={styles.summaryCard}>
          <Ionicons
            name="calendar"
            size={35}
            color="#6C63FF"
          />

          <View style={styles.summaryInfo}>
            <Text style={styles.summaryNumber}>
              {savedEvents.length}
            </Text>
            <Text style={styles.summaryLabel}>
              Saved Events
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Upcoming Events
        </Text>

        {campusEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// My Schedule screen
function ScheduleScreen() {
  const { savedEvents } = useContext(EventContext);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>My Schedule</Text>

        <Text style={styles.subtitle}>
          Manage your saved campus events.
        </Text>

        <Text style={styles.sectionTitle}>
          Saved Activities ({savedEvents.length})
        </Text>

        {savedEvents.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons
              name="calendar-outline"
              size={55}
              color="#6C63FF"
            />

            <Text style={styles.emptyTitle}>
              No Events Yet
            </Text>

            <Text style={styles.emptyDescription}>
              Add an event from the Discover tab to see it here.
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
    </SafeAreaView>
  );
}

// Bottom tab navigation
function AppNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#5145A5',
          tabBarInactiveTintColor: '#999999',

          // Adjust navigation for the phone screen
          tabBarStyle: [
            styles.tabBar,
            {
              height: 60 + insets.bottom,
              paddingBottom: Math.max(insets.bottom, 8),
            },
          ],

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
    <SafeAreaProvider>
      <EventProvider>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#F4F1FF"
        />
        <AppNavigator />
      </EventProvider>
    </SafeAreaProvider>
  );
}

// Activity 5 inspired design
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F1FF',
  },
  content: {
    padding: 15,
    paddingBottom: 60,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#5145A5',
    textAlign: 'center',
    marginTop: 15,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginVertical: 10,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  summaryInfo: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5145A5',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#5145A5',
    marginTop: 20,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#F0EDFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  category: {
    fontSize: 13,
    color: '#6C63FF',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#5145A5',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
    gap: 8,
  },
  description: {
    fontSize: 14,
    color: '#555555',
  },
  button: {
    backgroundColor: '#5145A5',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    minHeight: 44,
  },
  savedButton: {
    backgroundColor: '#8E87C7',
  },
  removeButton: {
    backgroundColor: '#E06B7B',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,
    marginTop: 15,
    minHeight: 44,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#5145A5',
    marginTop: 12,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 21,
  },
  tabBar: {
    paddingTop: 7,
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E5E0F2',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});
