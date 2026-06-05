import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function MatchdayCenter() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.greeting}>GOOD MORNING</Text>
            <Text style={styles.title}>Matchday{'\n'}Center</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>BB</Text>
          </View>
        </View>

        {/* Sync Live Match Data Card */}
        <View style={styles.syncCard}>
          {/* Faux Radial Gradient Background */}
          <View style={styles.syncCardGradient} />
          
          <View style={styles.liveBadgeContainer}>
            <View style={styles.liveDotWrapper}>
              <View style={styles.liveDotInner} />
            </View>
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>
          </View>

          <Text style={styles.syncCardTitle}>Sync Live Match Data</Text>
          <Text style={styles.syncCardSubtitle}>Pulling from Top 5 European Leagues</Text>

          <View style={styles.syncButton}>
            {/* Sync Icon drawn with Views */}
            <View style={styles.syncIconContainer}>
              <View style={[styles.syncIconBox, { left: 0.63, top: 2.50, width: 3.75, height: 3.75 }]} />
              <View style={[styles.syncIconBox, { left: 10.63, top: 8.75, width: 3.75, height: 3.75 }]} />
              <View style={[styles.syncIconBox, { left: 0.63, top: 1.88, width: 13.75, height: 11.25 }]} />
            </View>
            <Text style={styles.syncButtonText}>Sync Now</Text>
          </View>

          {/* League Tags */}
          <View style={styles.tagsContainer}>
            {['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', 'and others.'].map((league, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{league}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Scans Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Scans</Text>
          <Text style={styles.seeAllText}>See All</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {/* Match Card 1 */}
          <View style={styles.matchCard}>
            <Text style={styles.matchLeague}>PREMIER LEAGUE</Text>
            <Text style={styles.matchTeams}>Manchester United{'\n'}vs{'\n'}Arsenal</Text>
            <Text style={styles.matchDay}>Matchday 34</Text>
            <View style={[styles.scoreBadge, { left: 101.98 }]}>
              <Text style={styles.scoreText}>3–1</Text>
            </View>
            <View style={styles.cardBottomLine} />
          </View>

          {/* Match Card 2 */}
          <View style={styles.matchCard}>
            <Text style={styles.matchLeague}>LA LIGA</Text>
            <Text style={styles.matchTeams}>Barcelona{'\n'}vs{'\n'}Atletico Madrid</Text>
            <Text style={styles.matchDay}>Matchday 33</Text>
            <View style={[styles.scoreBadge, { left: 96.95 }]}>
              <Text style={styles.scoreText}>4–0</Text>
            </View>
            <View style={styles.cardBottomLine} />
          </View>

          {/* Match Card 3 */}
          <View style={styles.matchCard}>
            <Text style={styles.matchLeague}>SERIE A</Text>
            <Text style={styles.matchTeams}>Inter{'\n'}vs{'\n'}Juventus</Text>
            <Text style={styles.matchDay}>Matchday 35</Text>
            <View style={[styles.scoreBadge, { left: 104.33 }]}>
              <Text style={styles.scoreText}>1–1</Text>
            </View>
            <View style={styles.cardBottomLine} />
          </View>
        </ScrollView>

        {/* Engine Stats Section */}
        <View style={[styles.sectionHeader, { paddingTop: 18 }]}>
          <Text style={styles.sectionTitle}>Engine Stats</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>96</Text>
            <Text style={styles.statLabel}>Teams{'\n'}Scanned</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Live{'\n'}Matches</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>88</Text>
            <Text style={styles.statLabel}>Formations{'\n'}Stored</Text>
          </View>
        </View>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <View style={[styles.navIconBase, { width: 15.75, height: 17.50, backgroundColor: '#CCFF00' }]} />
          <Text style={[styles.navText, { color: '#CCFF00' }]}>Home</Text>
          <View style={styles.navActiveDot} />
        </View>
        <View style={styles.navItem}>
          <View style={[styles.navIconOutline, { width: 17.50, height: 15.75, borderColor: '#8E9BAE' }]} />
          <Text style={styles.navText}>Pitch</Text>
        </View>
        <View style={styles.navItem}>
          <View style={[styles.navIconOutline, { width: 15.75, height: 15.75, borderColor: '#8E9BAE' }]} />
          <Text style={styles.navText}>AI Chat</Text>
        </View>
        <View style={styles.navItem}>
          <View style={[styles.navIconOutline, { width: 14, height: 5.25, top: 13.13, borderColor: '#8E9BAE' }]} />
          <View style={[styles.navIconOutline, { width: 7, height: 7, top: 2.63, borderColor: '#8E9BAE', borderRadius: 3.5 }]} />
          <Text style={styles.navText}>Profile</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1317',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 64, // Matches your HTML padding to avoid the mock status bar
    paddingBottom: 100, // Extra padding to clear the bottom nav
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 12,
  },
  headerTextContainer: {
    flexDirection: 'column',
    gap: 4,
  },
  greeting: {
    color: '#8E9BAE',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.76,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 28.60,
  },
  avatar: {
    width: 42,
    height: 42,
    backgroundColor: '#1A242B',
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#CCFF00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#CCFF00',
    fontSize: 14,
    fontWeight: '700',
  },
  syncCard: {
    marginTop: 22,
    padding: 18,
    backgroundColor: '#1A242B',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.18)',
    overflow: 'hidden',
    position: 'relative',
  },
  syncCardGradient: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(204, 255, 0, 0.05)', // Approximated radial gradient
    right: -30,
    top: -39,
  },
  liveBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveDotWrapper: {
    width: 10,
    height: 10,
    backgroundColor: '#CCFF00',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#CCFF00',
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  liveDotInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(204, 255, 0, 0.30)',
    position: 'absolute',
  },
  liveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(204, 255, 0, 0.12)',
    borderRadius: 20,
  },
  liveBadgeText: {
    color: '#CCFF00',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  syncCardTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 12,
  },
  syncCardSubtitle: {
    color: '#8E9BAE',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  syncButton: {
    height: 46,
    backgroundColor: '#CCFF00',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#CCFF00',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
    gap: 8,
  },
  syncIconContainer: {
    width: 15,
    height: 15,
    position: 'relative',
  },
  syncIconBox: {
    position: 'absolute',
    borderWidth: 1.56,
    borderColor: '#000000',
  },
  syncButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 16,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A3B47',
  },
  tagText: {
    color: '#8E9BAE',
    fontSize: 10,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 10,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  seeAllText: {
    color: '#CCFF00',
    fontSize: 12,
    fontWeight: '600',
  },
  horizontalScroll: {
    gap: 12,
    paddingBottom: 10,
  },
  matchCard: {
    width: 144,
    height: 119,
    padding: 14,
    backgroundColor: '#1A242B',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A3B47',
    marginRight: 12,
    position: 'relative',
  },
  matchLeague: {
    color: '#8E9BAE',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.26,
    marginBottom: 6,
  },
  matchTeams: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 6,
  },
  matchDay: {
    color: '#8E9BAE',
    fontSize: 10,
  },
  scoreBadge: {
    position: 'absolute',
    top: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(204, 255, 0, 0.10)',
    borderRadius: 5,
  },
  scoreText: {
    color: '#CCFF00',
    fontSize: 11,
    fontWeight: '700',
  },
  cardBottomLine: {
    position: 'absolute',
    bottom: 0,
    left: 1,
    width: 142,
    height: 2,
    backgroundColor: '#CCFF00',
    opacity: 0.40,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#1A242B',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A3B47',
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    color: '#CCFF00',
    fontSize: 28,
    fontWeight: '900',
  },
  statLabel: {
    color: '#8E9BAE',
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 14,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'rgba(26, 36, 43, 0.96)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(42, 59, 71, 0.70)',
    paddingTop: 12,
    paddingBottom: 32,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navIconBase: {
    position: 'absolute',
    top: 2,
  },
  navIconOutline: {
    position: 'absolute',
    borderWidth: 1.5,
  },
  navText: {
    color: '#8E9BAE',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 24, // Push text below absolute positioned faux-icons
  },
  navActiveDot: {
    width: 4,
    height: 4,
    backgroundColor: '#CCFF00',
    borderRadius: 2,
    marginTop: 2,
    shadowColor: '#CCFF00',
    shadowOpacity: 0.8,
    shadowRadius: 4,
  }
});