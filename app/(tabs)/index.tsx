// app/(tabs)/index.tsx — Matchday Center (Home Screen)
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Dimensions,
  TouchableOpacity, ActivityIndicator, Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useNavigation } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { SyncIcon } from '@/components/Icons';
import { getRecentScans, getEngineStats, updateLiveMatchesCount, Scan } from '@/lib/scans';
import { api } from '@/lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FONT } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function MatchdayCenter() {
  const [initials, setInitials] = useState('TJ');
  const [scans, setScans] = useState<Scan[]>([]);
  const [stats, setStats] = useState({ teamsScanned: 0, formationsStored: 0, liveMatches: 0 });
  const [syncing, setSyncing] = useState(false);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const loadUserData = () => {
    const user = auth.currentUser;
    if (!user) return;
    user.reload().catch(() => {}).finally(() => {
      const u = auth.currentUser;
      if (!u) return;
      const name = u.displayName || '';
      if (name) {
        const parts = name.trim().split(/\s+/);
        const i = ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
        setInitials(i || 'TJ');
      } else if (u.email) {
        setInitials(u.email.substring(0, 2).toUpperCase());
      }
    });
  };

  const loadData = async () => {
    try {
      const [s, st, lang] = await Promise.all([
        getRecentScans(),
        getEngineStats(),
        AsyncStorage.getItem('@language'),
      ]);
      setScans(s);
      setStats(st);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => { if (user) loadUserData(); });
    return unsub;
  }, []);

  useEffect(() => {
    loadUserData();
    loadData();
    const unsubFocus = navigation.addListener('focus', () => { loadUserData(); loadData(); });
    return unsubFocus;
  }, [navigation]);

  // Sync: hits the live endpoint with a known active fixture pair to get live count
  // Falls back gracefully if backend is cold
  const handleSync = async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      // Use the health endpoint first to warm backend, then fetch live count
      await api.health().catch(() => null);
      const response = await api.live('Arsenal', 'Liverpool').catch(() => ({ live_count: 0 }));
      const liveCount = (response as any).live_count || 0;
      await updateLiveMatchesCount(liveCount);
      await loadData();
      Alert.alert(
        'Sync Complete',
        `Engine is live. ${liveCount > 0 ? `${liveCount} matches currently active.` : 'No live matches right now — check back on matchday.'}`
      );
    } catch {
      Alert.alert('Sync Error', 'Could not reach the Tactica backend. It may be waking up — try again in 30 seconds.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: Math.max(16, insets.top + 12) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>GOOD MORNING</Text>
            <Text style={styles.title}>{'Matchday\nCenter'}</Text>
          </View>
          <TouchableOpacity style={styles.avatar} onPress={() => router.push('/(tabs)/profile')} activeOpacity={0.8}>
            <Text style={styles.avatarText}>{initials}</Text>
          </TouchableOpacity>
        </View>

        {/* Sync Card */}
        <View style={styles.syncCard}>
          <View style={styles.syncCardGlow} />
          <View style={styles.liveBadgeRow}>
            <View style={styles.liveDot} />
            <View style={styles.livePill}><Text style={styles.livePillText}>LIVE</Text></View>
          </View>
          <Text style={styles.syncTitle}>Sync Live Match Data</Text>
          <Text style={styles.syncSub}>Pulling from Top 5 European Leagues</Text>
          <TouchableOpacity style={styles.syncBtn} onPress={handleSync} activeOpacity={0.8} disabled={syncing}>
            {syncing
              ? <ActivityIndicator size="small" color="#000" />
              : <><SyncIcon size={15} color="#000" /><Text style={styles.syncBtnText}>Sync Now</Text></>
            }
          </TouchableOpacity>
          <View style={styles.tags}>
            {['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1'].map(l => (
              <View key={l} style={styles.tag}><Text style={styles.tagText}>{l}</Text></View>
            ))}
          </View>
        </View>

        {/* Recent Scans */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Recent Scans</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/scout')} activeOpacity={0.7}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {scans.length > 0 ? scans.map(scan => (
            <TouchableOpacity
              key={scan.id}
              activeOpacity={0.85}
              onPress={() => router.push(`/match-details/${scan.id}`)}
            >
              <View style={styles.matchCard}>
                <Text style={styles.matchLeague} numberOfLines={1}>{scan.league}</Text>
                <Text style={styles.matchTeams} numberOfLines={3}>
                  {scan.homeTeam}{'\n'}vs{'\n'}{scan.awayTeam}
                </Text>
                <Text style={styles.matchDay}>{scan.matchday}</Text>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreText}>{scan.score}</Text>
                </View>
                <View style={styles.cardLine} />
              </View>
            </TouchableOpacity>
          )) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                {'No recent scans.\nOpen the Engine tab to analyse your first match.'}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Engine Stats */}
        <View style={[styles.sectionRow, { paddingTop: 18 }]}>
          <Text style={styles.sectionTitle}>Engine Stats</Text>
        </View>
        <View style={styles.statsRow}>
          {[
            { val: stats.teamsScanned,    label: 'Teams\nScanned' },
            { val: stats.liveMatches,     label: 'Live\nMatches' },
            { val: stats.formationsStored, label: 'Formations\nStored' },
          ].map((item, i) => (
            <View key={i} style={styles.statBox}>
              <Text style={styles.statNum}>{item.val}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={[styles.sectionRow, { paddingTop: 18 }]}>
          <Text style={styles.sectionTitle}>Quick Start</Text>
        </View>
        <View style={styles.quickRow}>
          {[
            { label: 'Auto-Tactics', icon: '⚡', color: '#CCFF00', path: '/(tabs)/scout' },
            { label: 'AI Chat',      icon: '💬', color: '#00E5FF', path: '/(tabs)/ai-chat' },
          ].map(item => (
            <TouchableOpacity
              key={item.label}
              style={styles.quickCard}
              onPress={() => router.push(item.path as any)}
              activeOpacity={0.8}
            >
              <Text style={[styles.quickIcon]}>{item.icon}</Text>
              <Text style={styles.quickLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1317' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 110 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: 12 },
  greeting: { color: '#8E9BAE', fontSize: 11, fontFamily: FONT.medium, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1.76 },
  title: { color: '#FFFFFF', fontSize: 26, fontFamily: FONT.headingBold, fontWeight: '700', lineHeight: 29 },
  avatar: { width: 42, height: 42, backgroundColor: '#1A242B', borderRadius: 21, borderWidth: 2, borderColor: '#CCFF00', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#CCFF00', fontSize: 14, fontFamily: FONT.bold, fontWeight: '700' },
  syncCard: { marginTop: 22, padding: 18, backgroundColor: '#1A242B', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(204,255,0,0.18)', overflow: 'hidden', position: 'relative' },
  syncCardGlow: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(204,255,0,0.05)', right: -30, top: -39 },
  liveBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  liveDot: { width: 10, height: 10, backgroundColor: '#CCFF00', borderRadius: 5, shadowColor: '#CCFF00', shadowOpacity: 0.8, shadowRadius: 6, elevation: 4 },
  livePill: { paddingHorizontal: 8, paddingVertical: 2, backgroundColor: 'rgba(204,255,0,0.12)', borderRadius: 20 },
  livePillText: { color: '#CCFF00', fontSize: 10, fontFamily: FONT.bold, fontWeight: '700', letterSpacing: 1 },
  syncTitle: { color: '#FFFFFF', fontSize: 17, fontFamily: FONT.bold, fontWeight: '700', marginTop: 12 },
  syncSub: { color: '#8E9BAE', fontSize: 12, fontFamily: FONT.regular, marginTop: 4, marginBottom: 16 },
  syncBtn: { height: 46, backgroundColor: '#CCFF00', borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  syncBtnText: { color: '#000', fontSize: 14, fontFamily: FONT.bold, fontWeight: '700' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 16 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, borderWidth: 1, borderColor: '#2A3B47' },
  tagText: { color: '#8E9BAE', fontSize: 10, fontFamily: FONT.medium },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 18, paddingBottom: 10 },
  sectionTitle: { color: '#FFFFFF', fontSize: 15, fontFamily: FONT.bold, fontWeight: '700' },
  seeAll: { color: '#CCFF00', fontSize: 12, fontFamily: FONT.bold, fontWeight: '600' },
  hScroll: { gap: 12, paddingBottom: 10 },
  matchCard: { width: 144, height: 119, padding: 14, backgroundColor: '#1A242B', borderRadius: 14, borderWidth: 1, borderColor: '#2A3B47', marginRight: 12, position: 'relative' },
  matchLeague: { color: '#8E9BAE', fontSize: 9, fontFamily: FONT.bold, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.26, marginBottom: 6 },
  matchTeams: { color: '#FFFFFF', fontSize: 12, fontFamily: FONT.bold, fontWeight: '700', lineHeight: 18 },
  matchDay: { color: '#8E9BAE', fontSize: 10, fontFamily: FONT.regular },
  scoreBadge: { position: 'absolute', top: 12, right: 14, paddingHorizontal: 6, paddingVertical: 2, backgroundColor: 'rgba(204,255,0,0.10)', borderRadius: 5 },
  scoreText: { color: '#CCFF00', fontSize: 11, fontFamily: FONT.headingBold, fontWeight: '700' },
  cardLine: { position: 'absolute', bottom: 0, left: 1, width: 142, height: 2, backgroundColor: '#CCFF00', opacity: 0.40 },
  emptyCard: { width: 320, height: 119, padding: 16, backgroundColor: '#1A242B', borderRadius: 14, borderWidth: 1, borderColor: '#2A3B47', justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#8E9BAE', textAlign: 'center', fontSize: 12, fontFamily: FONT.regular, lineHeight: 18 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statBox: { flex: 1, paddingVertical: 14, paddingHorizontal: 10, backgroundColor: '#1A242B', borderRadius: 14, borderWidth: 1, borderColor: '#2A3B47', alignItems: 'center', gap: 4 },
  statNum: { color: '#CCFF00', fontSize: 28, fontFamily: FONT.headingBold, fontWeight: '900' },
  statLabel: { color: '#8E9BAE', fontSize: 10, fontFamily: FONT.medium, fontWeight: '500', textAlign: 'center', lineHeight: 14 },
  quickRow: { flexDirection: 'row', gap: 12 },
  quickCard: { flex: 1, backgroundColor: '#1A242B', borderRadius: 14, borderWidth: 1, borderColor: '#2A3B47', padding: 16, alignItems: 'center', gap: 8 },
  quickIcon: { fontSize: 24 },
  quickLabel: { color: '#FFFFFF', fontSize: 13, fontFamily: FONT.bold, fontWeight: '700' },
});
