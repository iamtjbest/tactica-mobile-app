import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, ScrollView } from 'react-native';

const { width } = Dimensions.get('window');

// --- PITCH DATA ---
const yellowTeam = [
  { id: '1', left: 159.11, top: 447 },
  { id: '2', left: 44.75, top: 369 },
  { id: '5', left: 115.35, top: 377 },
  { id: '6', left: 202.86, top: 377 },
  { id: '3', left: 273.46, top: 369 },
  { id: '8', left: 76.57, top: 285 },
  { id: '4', left: 159.11, top: 275 },
  { id: '10', left: 241.64, top: 285 },
  { id: '11', left: 62.65, top: 191 },
  { id: '9', left: 159.11, top: 181 },
  { id: '7', left: 255.56, top: 191 },
];

const cyanTeam = [
  { id: '1', left: 159.11, top: 33 },
  { id: '2', left: 38.78, top: 107 },
  { id: '4', left: 115.35, top: 99 },
  { id: '5', left: 202.86, top: 99 },
  { id: '3', left: 279.43, top: 107 },
  { id: '7', left: 54.69, top: 173 },
  { id: '8', left: 126.29, top: 167 },
  { id: '10', left: 191.92, top: 167 },
  { id: '11', left: 263.52, top: 173 },
  { id: '9', left: 124.30, top: 227 },
  { id: '6', left: 193.91, top: 227 },
];

const pitchMarkings = [
  { width: 340.09, height: 474, left: 7.96, top: 22, isOutline: true }, // Main Pitch
  { width: 103.42, height: 104, left: 126.29, top: 207, isOutline: true, borderRadius: 52 }, // Center Circle
  { width: 5.97, height: 6, left: 175.02, top: 256, isOutline: false, borderRadius: 3 }, // Center Dot
  { width: 198.88, height: 82, left: 78.56, top: 22, isOutline: true }, // Top Penalty Box
  { width: 99.44, height: 30, left: 128.28, top: 22, isOutline: true }, // Top Goal Area
  { width: 4.97, height: 5, left: 175.51, top: 79.50, isOutline: false, borderRadius: 2.5 }, // Top Penalty Spot
  { width: 89.50, height: 25.94, left: 133.25, top: 78.06, isOutline: true, borderRadius: 44.75 }, // Top D-curve (Approximated)
  { width: 198.88, height: 82, left: 78.56, top: 414, isOutline: true }, // Bottom Penalty Box
  { width: 99.44, height: 30, left: 128.28, top: 466, isOutline: true }, // Bottom Goal Area
  { width: 4.97, height: 5, left: 175.51, top: 433.50, isOutline: false, borderRadius: 2.5 }, // Bottom Penalty Spot
  { width: 89.50, height: 25.94, left: 133.25, top: 414, isOutline: true, borderRadius: 44.75 }, // Bottom D-curve (Approximated)
];

export default function TacticalSandbox() {
  return (
    <SafeAreaView style={styles.container}>
      
      {/* Scrollable Content Container */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tactical Sandbox</Text>
          <View style={styles.formationBadge}>
            <Text style={styles.formationText}>4 – 3 – 3</Text>
          </View>
        </View>

        {/* Pitch Area */}
        <View style={styles.pitchContainer}>
          <View style={styles.pitchInner}>
            
            {/* Draw Pitch Markings */}
            {pitchMarkings.map((mark, index) => (
              <View 
                key={`mark-${index}`} 
                style={[
                  styles.pitchMarking, 
                  { 
                    width: mark.width, 
                    height: mark.height, 
                    left: mark.left, 
                    top: mark.top,
                    borderRadius: mark.borderRadius || 0,
                    borderWidth: mark.isOutline ? 1.5 : 0,
                    backgroundColor: mark.isOutline ? 'transparent' : 'rgba(255, 255, 255, 0.18)'
                  }
                ]} 
              />
            ))}

            {/* Draw Cyan Team (Top) */}
            {cyanTeam.map((player, index) => (
              <View key={`cyan-${index}`} style={[styles.playerNode, { left: player.left, top: player.top, backgroundColor: '#00E5FF' }]}>
                <Text style={styles.playerText}>{player.id}</Text>
              </View>
            ))}

            {/* Draw Yellow Team (Bottom) */}
            {yellowTeam.map((player, index) => (
              <View key={`yellow-${index}`} style={[styles.playerNode, { left: player.left, top: player.top, backgroundColor: '#CCFF00' }]}>
                <Text style={styles.playerText}>{player.id}</Text>
              </View>
            ))}

          </View>
        </View>
      </ScrollView>

      {/* Match Bottom Drawer */}
      <View style={styles.bottomDrawer}>
        <View style={styles.drawerHandle} />
        
        <View style={styles.matchMinuteHeader}>
          <Text style={styles.matchMinuteLabel}>MATCH MINUTE</Text>
          <Text style={styles.matchMinuteTime}>75'</Text>
        </View>

        {/* Timeline Progress Bar */}
        <View style={styles.timelineTrack}>
          <View style={styles.timelineFill} />
          <View style={styles.timelineThumb} />
        </View>

        {/* Score Panel */}
        <View style={styles.scorePanel}>
          <Text style={styles.teamName}>Manchester United</Text>
          <Text style={styles.scoreNumber}>3</Text>
          <Text style={styles.scoreDivider}>—</Text>
          <Text style={styles.scoreNumber}>1</Text>
          <Text style={styles.teamName}>Arsenal</Text>
        </View>

        {/* Analyze Button */}
        <View style={styles.analyzeButton}>
          <View style={styles.analyzeIconContainer}>
            <View style={styles.analyzeIcon} />
          </View>
          <Text style={styles.analyzeButtonText}>Analyze Formation</Text>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <View style={[styles.navIconOutline, { width: 15.75, height: 17.50, borderColor: '#8E9BAE' }]} />
          <Text style={styles.navText}>Home</Text>
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
          <View style={[styles.navIconBase, { width: 14, height: 5.25, top: 13.13, backgroundColor: '#CCFF00' }]} />
          <View style={[styles.navIconBase, { width: 7, height: 7, top: 2.63, backgroundColor: '#CCFF00', borderRadius: 3.5 }]} />
          <Text style={[styles.navText, { color: '#CCFF00' }]}>Profile</Text>
          <View style={styles.navActiveDot} />
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
    paddingTop: 64, // Accounts for native status bar
    paddingBottom: 280, // Clearance for drawer + nav
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    marginBottom: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700',
  },
  formationBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: 'rgba(204, 255, 0, 0.12)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.32)',
  },
  formationText: {
    color: '#CCFF00',
    fontSize: 13,
    fontWeight: '700',
  },
  pitchContainer: {
    backgroundColor: '#0D1317',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
    alignItems: 'center', // Centers the pitch inner container
  },
  pitchInner: {
    width: 356, // Slightly wider than pitch outline
    height: 518,
    position: 'relative',
  },
  pitchMarking: {
    position: 'absolute',
    borderColor: 'rgba(255, 255, 255, 0.10)',
  },
  playerNode: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '700',
  },
  bottomDrawer: {
    position: 'absolute',
    bottom: 86, // Above bottom nav
    left: 0,
    right: 0,
    height: 199,
    backgroundColor: '#1A242B',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderTopWidth: 1,
    borderTopColor: '#2A3B47',
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    zIndex: 10,
  },
  drawerHandle: {
    width: 38,
    height: 4,
    backgroundColor: '#2A3B47',
    borderRadius: 2,
    marginBottom: 12,
  },
  matchMinuteHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchMinuteLabel: {
    color: '#8E9BAE',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.10,
  },
  matchMinuteTime: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  timelineTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#2A3B47',
    borderRadius: 2,
    position: 'relative',
    marginBottom: 22,
  },
  timelineFill: {
    width: '78%', // Approximated 284px relative to screen width
    height: 4,
    backgroundColor: '#CCFF00',
    borderRadius: 2,
    shadowColor: '#CCFF00',
    shadowOpacity: 0.50,
    shadowRadius: 8,
    elevation: 3,
  },
  timelineThumb: {
    width: 17,
    height: 17,
    backgroundColor: '#CCFF00',
    borderRadius: 8.5,
    position: 'absolute',
    left: '75%', // Approximated position
    top: -6.5,
    shadowColor: '#CCFF00',
    shadowOpacity: 0.65,
    shadowRadius: 12,
    elevation: 5,
  },
  scorePanel: {
    width: '100%',
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A3B47',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 12,
  },
  teamName: {
    flex: 1,
    textAlign: 'center',
    color: '#8E9BAE',
    fontSize: 11,
    fontWeight: '600',
  },
  scoreNumber: {
    minWidth: 24,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 30,
  },
  scoreDivider: {
    color: '#2A3B47',
    fontSize: 18,
    marginHorizontal: 4,
  },
  analyzeButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#CCFF00',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#CCFF00',
    shadowOpacity: 0.30,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  analyzeIconContainer: {
    width: 15,
    height: 15,
    position: 'relative',
  },
  analyzeIcon: {
    position: 'absolute',
    width: 11.25,
    height: 12.50,
    left: 1.88,
    top: 1.25,
    borderWidth: 1.56,
    borderColor: '#000000',
  },
  analyzeButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
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
    zIndex: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navIconBase: {
    position: 'absolute',
  },
  navIconOutline: {
    position: 'absolute',
    top: 2,
    borderWidth: 1.5,
  },
  navText: {
    color: '#8E9BAE',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 24,
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