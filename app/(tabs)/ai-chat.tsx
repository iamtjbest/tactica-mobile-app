import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

export default function TacticalAIChat() {
  return (
    <SafeAreaView style={styles.container}>
      
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconBox}>
          {/* Mock Back Chevron */}
          <View style={styles.backChevron} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Tactical AI</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Online · Ready</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.menuButton}>
          <View style={styles.menuDot} />
          <View style={styles.menuDot} />
          <View style={styles.menuDot} />
        </TouchableOpacity>
      </View>

      {/* Chat Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.chatScroll} showsVerticalScrollIndicator={false}>
          
          {/* Date Pill */}
          <View style={styles.datePill}>
            <Text style={styles.datePillText}>Today, 9:41 AM</Text>
          </View>

          {/* User Message 1 */}
          <View style={styles.messageRowRight}>
            <View style={styles.bubbleUser}>
              <Text style={styles.textUser}>What are Arsenal's defensive gaps?</Text>
            </View>
            <Text style={styles.timestampText}>9:38 AM</Text>
          </View>

          {/* AI Message 1 */}
          <View style={styles.messageRowLeft}>
            <View style={styles.bubbleAI}>
              <Text style={styles.textAI}>
                Based on the 96-team scan, Villa's main{'\n'}gap is the left channel. Their LB pushes{'\n'}high, leaving space for diagonal runs.{'\n'}65% of goals conceded in last 5 matches came from that zone.
              </Text>
            </View>
            <Text style={styles.timestampText}>9:38 AM</Text>
          </View>

          {/* Action Chips */}
          <View style={styles.actionChipsContainer}>
            <TouchableOpacity style={styles.actionChip}>
              <Text style={styles.actionChipText}>See heatmap</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionChip}>
              <Text style={styles.actionChipText}>Exploit gap</Text>
            </TouchableOpacity>
          </View>

          {/* User Message 2 */}
          <View style={styles.messageRowRight}>
            <View style={styles.bubbleUser}>
              <Text style={styles.textUser}>Suggest a formation to exploit this in a{'\n'}4-3-3.</Text>
            </View>
            <Text style={styles.timestampText}>9:40 AM</Text>
          </View>

          {/* AI Message 2 */}
          <View style={styles.messageRowLeft}>
            <View style={styles.bubbleAI}>
              <Text style={styles.textAI}>
                Push your right winger inside on a half-{'\n'}space run while your RB overlaps. This{'\n'}forces Villa's LB to choose. Your box-to-{'\n'}box CM should time late runs into that{'\n'}pocket.
              </Text>
            </View>
            <Text style={styles.timestampText}>9:41 AM</Text>
          </View>

          {/* Typing Indicator */}
          <View style={styles.typingIndicator}>
            <View style={styles.typingDot} />
            <View style={styles.typingDot} />
            <View style={styles.typingDot} />
          </View>

        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <View style={styles.inputBox}>
            {/* Mock Magnifying Glass / Engine Icon */}
            <View style={styles.inputIconContainer}>
              <View style={styles.inputIcon} />
            </View>
            <TextInput 
              style={styles.textInput} 
              placeholder="Ask the engine…" 
              placeholderTextColor="#8E9BAE"
            />
          </View>
          <TouchableOpacity style={styles.sendButton}>
            <View style={styles.sendIconContainer}>
              {/* Mock Arrow built with borders */}
              <View style={[styles.sendIconLine, { left: 7.79, top: 1.42, width: 7.79, height: 7.79 }]} />
              <View style={[styles.sendIconLine, { left: 1.42, top: 1.42, width: 14.17, height: 14.17, backgroundColor: '#000000' }]} />
            </View>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>

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
  header: {
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#1A242B',
    borderBottomWidth: 1,
    borderBottomColor: '#2A3B47',
    zIndex: 10,
  },
  headerIconBox: {
    width: 34,
    height: 34,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backChevron: {
    width: 6.5,
    height: 6.5,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }, { translateX: 1.5 }, { translateY: -1.5 }],
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    backgroundColor: '#CCFF00',
    borderRadius: 3,
    marginRight: 5,
    shadowColor: '#CCFF00',
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  statusText: {
    color: '#CCFF00',
    fontSize: 11,
    fontWeight: '600',
  },
  menuButton: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  menuDot: {
    width: 4,
    height: 4,
    backgroundColor: '#8E9BAE',
    borderRadius: 2,
  },
  keyboardAvoid: {
    flex: 1,
    marginBottom: 80, // Clearance for bottom navigation
  },
  chatScroll: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 20,
    gap: 16, // Consistent spacing between message blocks
  },
  datePill: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 20,
    marginBottom: 10,
  },
  datePillText: {
    color: '#8E9BAE',
    fontSize: 11,
    fontWeight: '500',
  },
  messageRowRight: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    maxWidth: '85%',
  },
  messageRowLeft: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    maxWidth: '85%',
  },
  bubbleUser: {
    backgroundColor: '#00E5FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 4, // Sharp corner indicating sender
  },
  bubbleAI: {
    backgroundColor: '#1A242B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#2A3B47',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    borderBottomLeftRadius: 4, // Sharp corner indicating sender
  },
  textUser: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21.7,
  },
  textAI: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 22.4,
  },
  timestampText: {
    color: '#8E9BAE',
    fontSize: 10,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  actionChipsContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    gap: 10,
    marginTop: -6, // Pull closer to the AI message
    marginBottom: 4,
  },
  actionChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: 'rgba(0, 229, 255, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.30)',
    borderRadius: 20,
  },
  actionChipText: {
    color: '#00E5FF',
    fontSize: 11,
    fontWeight: '600',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#1A242B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#2A3B47',
    gap: 6,
    marginTop: 8,
  },
  typingDot: {
    width: 6,
    height: 6,
    backgroundColor: '#8E9BAE',
    borderRadius: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#0D1317',
    borderTopWidth: 1,
    borderTopColor: 'rgba(42, 59, 71, 0.50)',
    gap: 10,
  },
  inputBox: {
    flex: 1,
    height: 48,
    backgroundColor: '#1A242B',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2A3B47',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  inputIconContainer: {
    width: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputIcon: {
    width: 11.25,
    height: 11.25,
    borderWidth: 1.13,
    borderColor: '#8E9BAE',
    borderRadius: 5.6,
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },
  sendButton: {
    width: 48,
    height: 48,
    backgroundColor: '#CCFF00',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#CCFF00',
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 4,
  },
  sendIconContainer: {
    width: 17,
    height: 17,
    position: 'relative',
  },
  sendIconLine: {
    position: 'absolute',
    borderWidth: 1.77,
    borderColor: '#000000',
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
    top: 2,
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