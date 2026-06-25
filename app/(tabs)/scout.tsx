// app/(tabs)/scout.tsx — Tactica Engine Hub (4 Modules)
import React, { useState } from "react";
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  ScrollView, Modal, ActivityIndicator, Alert,
  TouchableWithoutFeedback, Dimensions, KeyboardAvoidingView, Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { C, CARD_SHADOW, FONT } from "@/constants/theme";
import { api, CLUB_TEAMS, PredictResponse, LineupResponse, FormResponse } from "@/lib/api";
import { addScan } from "@/lib/scans";

const { width } = Dimensions.get("window");

// ── Types ─────────────────────────────────────────────────────────────────────

type Module = "auto" | "opponent" | "sandbox" | "live";

interface SandboxPlayer {
  name: string;
  pos: string;
  rating: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const getPosColor = (pos: string) => {
  if (pos === "GK") return "#FFB830";
  if (["CB","RB","LB","RWB","LWB","DF"].includes(pos)) return "#60a5fa";
  if (["CM","CDM","CAM","RM","LM","MF"].includes(pos)) return C.volt;
  return C.red;
};

const getFormColor = (res: string) => {
  if (res === "W") return { bg: "rgba(0,230,118,0.15)", tx: C.grn, bd: "rgba(0,230,118,0.3)" };
  if (res === "D") return { bg: "rgba(255,184,48,0.1)", tx: "#FFB830", bd: "rgba(255,184,48,0.25)" };
  return { bg: "rgba(255,71,87,0.1)", tx: C.red, bd: "rgba(255,71,87,0.25)" };
};

const FORMATIONS = ["4-3-3","4-4-2","4-2-3-1","3-5-2","3-4-3","5-3-2","4-1-4-1","4-5-1"];

// ── Team Selector Modal ───────────────────────────────────────────────────────

function TeamSelectorModal({
  visible, onClose, onSelect, title,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (t: string) => void;
  title: string;
}) {
  const [q, setQ] = useState("");
  const filtered = CLUB_TEAMS.filter(t => t.toLowerCase().includes(q.toLowerCase()));
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback>
          <View style={s.modalSheet}>
            <View style={s.modalDrag} />
            <Text style={s.modalTitle}>{title}</Text>
            <View style={s.searchBox}>
              <Ionicons name="search" size={14} color={C.mt} />
              <TextInput
                style={s.searchInput}
                value={q}
                onChangeText={setQ}
                placeholder="Search clubs…"
                placeholderTextColor="rgba(142,155,174,0.4)"
                autoCorrect={false}
              />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {filtered.map(team => (
                <TouchableOpacity key={team} style={s.teamRow} onPress={() => { onSelect(team); setQ(""); }}>
                  <Text style={s.teamRowText}>{team}</Text>
                  <Ionicons name="chevron-forward" size={14} color={C.bd} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}

// ── Module: Auto-Tactics ──────────────────────────────────────────────────────

function AutoTacticsModule() {
  const [team, setTeam] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FormResponse | null>(null);

  const analyse = async () => {
    if (!team) { Alert.alert("Select a team first"); return; }
    setLoading(true);
    try {
      await api.squad(team).catch(() => null);
      const data = await api.form(team);
      setResult(data);
      await addScan({
        league: "Auto-Tactics",
        homeTeam: team,
        awayTeam: "—",
        matchday: "Auto Scan",
        score: data.best_formation || "4-3-3",
        formation: data.best_formation || "4-3-3",
      });
    } catch {
      Alert.alert("Error", "Could not fetch team data. Backend may be waking up — try again in 30s.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setResult(null); setTeam(""); };

  return (
    <ScrollView contentContainerStyle={s.moduleScroll} showsVerticalScrollIndicator={false}>
      <Text style={s.moduleDesc}>
        Select your team to pull last 5 matches and get an AI-recommended formation.
      </Text>

      {!result ? (
        <>
          <TouchableOpacity style={s.selectorBtn} onPress={() => setModalOpen(true)} activeOpacity={0.75}>
            <View style={s.selectorIcon}><Text style={{ fontSize: 16 }}>⚽</Text></View>
            <View style={{ flex: 1, paddingHorizontal: 12 }}>
              <Text style={s.selectorLabel}>Your Team</Text>
              <Text style={[s.selectorValue, team ? { color: C.tx } : {}]}>{team || "Select club…"}</Text>
            </View>
            <Ionicons name="chevron-down" size={16} color={C.mt} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.primaryBtn, !team && s.btnDisabled]}
            onPress={analyse}
            disabled={loading || !team}
            activeOpacity={0.8}
          >
            {loading
              ? <ActivityIndicator size="small" color="#000" />
              : <><Ionicons name="flash" size={16} color="#000" /><Text style={s.primaryBtnText}>Run Auto-Tactics</Text></>
            }
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Best Formation */}
          <View style={s.resultCard}>
            <Text style={s.resultCardLabel}>RECOMMENDED FORMATION</Text>
            <Text style={s.bigFormation}>{result.best_formation || "4-3-3"}</Text>
            <View style={s.statsRow}>
              <View style={s.statPill}>
                <Text style={[s.statPillNum, { color: C.volt }]}>{result.attack}</Text>
                <Text style={s.statPillLabel}>Attack</Text>
              </View>
              <View style={[s.statPill, { borderColor: C.cyan }]}>
                <Text style={[s.statPillNum, { color: C.cyan }]}>{result.defence}</Text>
                <Text style={s.statPillLabel}>Defence</Text>
              </View>
            </View>
          </View>

          {/* Last 5 Form */}
          <Text style={s.sectionLabel}>LAST 5 MATCHES</Text>
          {result.matches.slice(0, 5).map((m, i) => {
            const c = getFormColor(m.result);
            return (
              <View key={i} style={s.formMatchRow}>
                <View style={[s.formBadge, { backgroundColor: c.bg, borderColor: c.bd }]}>
                  <Text style={[s.formBadgeText, { color: c.tx }]}>{m.result}</Text>
                </View>
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                  <Text style={s.formMatchName} numberOfLines={1}>vs {m.opponent}</Text>
                  <Text style={s.formMatchMeta}>{m.competition} · {m.formation}</Text>
                </View>
                <Text style={s.formScore}>{m.scored}–{m.conceded}</Text>
              </View>
            );
          })}

          <TouchableOpacity style={s.resetBtn} onPress={reset} activeOpacity={0.8}>
            <Ionicons name="refresh" size={14} color={C.mt} />
            <Text style={s.resetBtnText}>Analyse Another Team</Text>
          </TouchableOpacity>
        </>
      )}

      <TeamSelectorModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={t => { setTeam(t); setModalOpen(false); }}
        title="Select Your Club"
      />
    </ScrollView>
  );
}

// ── Module: Opponent Analysis ─────────────────────────────────────────────────

function OpponentModule() {
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [side, setSide] = useState<"home" | "away">("home");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"input" | "form" | "lineup">("input");
  const [predictions, setPredictions] = useState<PredictResponse | null>(null);
  const [lineup, setLineup] = useState<LineupResponse | null>(null);
  const [homeForm, setHomeForm] = useState<string[]>([]);
  const [awayForm, setAwayForm] = useState<string[]>([]);

  const openSelector = (s: "home" | "away") => { setSide(s); setModalOpen(true); };

  const analyse = async () => {
    if (!homeTeam || !awayTeam) { Alert.alert("Select both teams"); return; }
    if (homeTeam === awayTeam) { Alert.alert("Invalid", "Teams must be different"); return; }
    setLoading(true);
    try {
      await Promise.all([api.squad(homeTeam).catch(() => null), api.squad(awayTeam).catch(() => null)]);
      const [pred, xi, hf, af] = await Promise.all([
        api.predict({ my_team: homeTeam, opp_team: awayTeam }),
        api.lineup(homeTeam, "4-3-3"),
        api.form(homeTeam).catch(() => null),
        api.form(awayTeam).catch(() => null),
      ]);
      setPredictions(pred);
      setLineup(xi);
      if (hf?.matches) setHomeForm(hf.matches.slice(0, 5).map(m => m.result));
      if (af?.matches) setAwayForm(af.matches.slice(0, 5).map(m => m.result));
      await addScan({
        league: "Opponent Analysis",
        homeTeam, awayTeam,
        matchday: "Scout Report",
        score: "vs",
        formation: pred.best_formation || "4-3-3",
      });
      setView("form");
    } catch {
      Alert.alert("Error", "Analysis failed. Backend may be waking up — try again in 30s.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setView("input"); setPredictions(null); setHomeTeam(""); setAwayTeam(""); };

  return (
    <ScrollView contentContainerStyle={s.moduleScroll} showsVerticalScrollIndicator={false}>
      <Text style={s.moduleDesc}>
        Pick two teams to get a head-to-head scout report, form comparison and AI lineup.
      </Text>

      {view === "input" ? (
        <>
          <View style={s.card}>
            <TouchableOpacity style={s.selectorBtn} onPress={() => openSelector("home")} activeOpacity={0.75}>
              <View style={s.selectorIcon}><Text style={{ fontSize: 16 }}>🏠</Text></View>
              <View style={{ flex: 1, paddingHorizontal: 12 }}>
                <Text style={s.selectorLabel}>Home Team</Text>
                <Text style={[s.selectorValue, homeTeam ? { color: C.tx } : {}]}>{homeTeam || "Select club…"}</Text>
              </View>
              <Ionicons name="chevron-down" size={16} color={C.mt} />
            </TouchableOpacity>
            <View style={s.vsDivider}>
              <View style={s.divLine} /><View style={s.vsBadge}><Text style={s.vsText}>VS</Text></View><View style={s.divLine} />
            </View>
            <TouchableOpacity style={s.selectorBtn} onPress={() => openSelector("away")} activeOpacity={0.75}>
              <View style={s.selectorIcon}><Text style={{ fontSize: 16 }}>✈️</Text></View>
              <View style={{ flex: 1, paddingHorizontal: 12 }}>
                <Text style={s.selectorLabel}>Away Team</Text>
                <Text style={[s.selectorValue, awayTeam ? { color: C.tx } : {}]}>{awayTeam || "Select club…"}</Text>
              </View>
              <Ionicons name="chevron-down" size={16} color={C.mt} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[s.primaryBtn, (!homeTeam || !awayTeam) && s.btnDisabled]}
            onPress={analyse}
            disabled={loading || !homeTeam || !awayTeam}
            activeOpacity={0.8}
          >
            {loading
              ? <ActivityIndicator size="small" color="#000" />
              : <><Ionicons name="analytics" size={16} color="#000" /><Text style={s.primaryBtnText}>Analyse Matchup</Text></>
            }
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Sub-tabs */}
          <View style={s.subTabRow}>
            {(["form","lineup"] as const).map(tab => (
              <TouchableOpacity
                key={tab}
                style={[s.subTab, view === tab && s.subTabActive]}
                onPress={() => setView(tab)}
              >
                <Text style={[s.subTabText, view === tab && { color: C.volt }]}>
                  {tab === "form" ? "Form & Stats" : "AI Lineup XI"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {view === "form" && predictions && (
            <>
              {/* Match summary */}
              <View style={[s.card, s.summaryCard]}>
                <View style={{ flex: 1, alignItems: "center" }}>
                  <Text style={s.summaryTeam} numberOfLines={1}>{homeTeam}</Text>
                  <Text style={s.summaryFormation}>{predictions.best_formation}</Text>
                </View>
                <Text style={s.summaryVs}>VS</Text>
                <View style={{ flex: 1, alignItems: "center" }}>
                  <Text style={s.summaryTeam} numberOfLines={1}>{awayTeam}</Text>
                  <Text style={[s.summaryFormation, { color: C.cyan }]}>Projected</Text>
                </View>
              </View>

              {/* Form dots */}
              <Text style={s.sectionLabel}>LAST 5 FORM</Text>
              <View style={s.card}>
                <View style={s.formRow}>
                  <Text style={s.formTeamLabel} numberOfLines={1}>{homeTeam}</Text>
                  <View style={s.formDots}>
                    {homeForm.map((r, i) => {
                      const c = getFormColor(r);
                      return <View key={i} style={[s.formDot, { backgroundColor: c.bg, borderColor: c.bd }]}><Text style={[s.formDotText, { color: c.tx }]}>{r}</Text></View>;
                    })}
                  </View>
                </View>
                <View style={[s.formRow, { marginTop: 12 }]}>
                  <Text style={s.formTeamLabel} numberOfLines={1}>{awayTeam}</Text>
                  <View style={s.formDots}>
                    {awayForm.map((r, i) => {
                      const c = getFormColor(r);
                      return <View key={i} style={[s.formDot, { backgroundColor: c.bg, borderColor: c.bd }]}><Text style={[s.formDotText, { color: c.tx }]}>{r}</Text></View>;
                    })}
                  </View>
                </View>
              </View>

              {/* Attack vs Defence */}
              <Text style={s.sectionLabel}>ATTACK vs DEFENCE</Text>
              <View style={s.card}>
                {[
                  { label: "⚔️ Attack", home: predictions.my_attack, away: predictions.opp_attack },
                  { label: "🛡️ Defence", home: predictions.my_defence, away: predictions.opp_defence },
                ].map((stat, i) => (
                  <View key={i} style={[s.statCompareRow, i > 0 && { marginTop: 16 }]}>
                    <Text style={[s.statNum, { color: C.volt }]}>{stat.home}</Text>
                    <View style={{ flex: 1, marginHorizontal: 10 }}>
                      <Text style={s.statLabel}>{stat.label}</Text>
                      <View style={s.progressTrack}>
                        <View style={[s.fillHome, { width: `${(stat.home / (stat.home + stat.away)) * 100}%` }]} />
                        <View style={[s.fillAway, { width: `${(stat.away / (stat.home + stat.away)) * 100}%` }]} />
                      </View>
                    </View>
                    <Text style={[s.statNum, { color: C.cyan }]}>{stat.away}</Text>
                  </View>
                ))}
              </View>

              {/* Win probability */}
              <View style={s.card}>
                <Text style={s.sectionLabel}>WIN PROBABILITY</Text>
                <Text style={s.bigFormation}>{predictions.probability}%</Text>
                <Text style={[s.moduleDesc, { textAlign: "center", marginTop: 4 }]}>
                  Estimated win chance for {homeTeam}
                </Text>
              </View>
            </>
          )}

          {view === "lineup" && lineup && (
            <>
              <View style={s.lineupHeader}>
                <Text style={s.sectionLabel}>RECOMMENDED XI — {lineup.formation}</Text>
              </View>
              {lineup.xi.map((p, i) => {
                const col = getPosColor(p.pos);
                return (
                  <View key={i} style={[s.playerRow, { borderLeftColor: col }]}>
                    <Text style={[s.playerPos, { color: col }]}>{p.pos}</Text>
                    <View style={{ flex: 1, paddingHorizontal: 10 }}>
                      <Text style={s.playerName}>{p.name}</Text>
                      <Text style={s.playerMeta}>{p.minutes}min · G/A: {p.g_a}</Text>
                    </View>
                    <View style={s.ratingBadge}>
                      <Text style={s.ratingText}>{p.spec_pos}</Text>
                    </View>
                  </View>
                );
              })}
            </>
          )}

          <TouchableOpacity style={[s.resetBtn, { marginTop: 20 }]} onPress={reset} activeOpacity={0.8}>
            <Ionicons name="lock-open-outline" size={14} color={C.mt} />
            <Text style={s.resetBtnText}>New Matchup</Text>
          </TouchableOpacity>
        </>
      )}

      <TeamSelectorModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={t => { side === "home" ? setHomeTeam(t) : setAwayTeam(t); setModalOpen(false); }}
        title={side === "home" ? "Select Home Team" : "Select Away Team"}
      />
    </ScrollView>
  );
}

// ── Module: Coach's Sandbox ───────────────────────────────────────────────────

function SandboxModule() {
  const [team, setTeam] = useState("");
  const [oppTeam, setOppTeam] = useState("");
  const [formation, setFormation] = useState("4-3-3");
  const [modalOpen, setModalOpen] = useState(false);
  const [side, setSide] = useState<"my" | "opp">("my");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [myAttack, setMyAttack] = useState("75");
  const [myDefence, setMyDefence] = useState("75");

  const run = async () => {
    if (!team || !oppTeam) { Alert.alert("Select both teams"); return; }
    setLoading(true);
    try {
      const data = await api.predict({
        my_team: team,
        opp_team: oppTeam,
        my_att: parseInt(myAttack) || 75,
        my_def: parseInt(myDefence) || 75,
        familiarity_formation: formation,
      });
      setResult(data);
    } catch {
      Alert.alert("Error", "Could not run sandbox. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setResult(null); };

  return (
    <ScrollView contentContainerStyle={s.moduleScroll} showsVerticalScrollIndicator={false}>
      <Text style={s.moduleDesc}>
        Draft your squad manually, set your formation and get an AI win probability.
      </Text>

      {/* Team selectors */}
      <TouchableOpacity style={s.selectorBtn} onPress={() => { setSide("my"); setModalOpen(true); }} activeOpacity={0.75}>
        <View style={s.selectorIcon}><Text style={{ fontSize: 16 }}>🧑‍💼</Text></View>
        <View style={{ flex: 1, paddingHorizontal: 12 }}>
          <Text style={s.selectorLabel}>My Team</Text>
          <Text style={[s.selectorValue, team ? { color: C.tx } : {}]}>{team || "Select club…"}</Text>
        </View>
        <Ionicons name="chevron-down" size={16} color={C.mt} />
      </TouchableOpacity>

      <View style={{ height: 8 }} />

      <TouchableOpacity style={s.selectorBtn} onPress={() => { setSide("opp"); setModalOpen(true); }} activeOpacity={0.75}>
        <View style={s.selectorIcon}><Text style={{ fontSize: 16 }}>🛡️</Text></View>
        <View style={{ flex: 1, paddingHorizontal: 12 }}>
          <Text style={s.selectorLabel}>Opponent</Text>
          <Text style={[s.selectorValue, oppTeam ? { color: C.tx } : {}]}>{oppTeam || "Select club…"}</Text>
        </View>
        <Ionicons name="chevron-down" size={16} color={C.mt} />
      </TouchableOpacity>

      {/* Formation picker */}
      <Text style={[s.sectionLabel, { marginTop: 20 }]}>FORMATION</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
        {FORMATIONS.map(f => (
          <TouchableOpacity
            key={f}
            style={[s.formationChip, formation === f && s.formationChipActive]}
            onPress={() => setFormation(f)}
          >
            <Text style={[s.formationChipText, formation === f && { color: C.volt }]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Manual sliders */}
      <Text style={[s.sectionLabel, { marginTop: 20 }]}>SQUAD RATINGS (MANUAL)</Text>
      <View style={s.card}>
        <View style={s.ratingRow}>
          <Text style={s.ratingRowLabel}>⚔️ My Attack</Text>
          <View style={s.ratingInput}>
            <TextInput
              style={s.ratingInputText}
              value={myAttack}
              onChangeText={v => setMyAttack(v.replace(/[^0-9]/g, ""))}
              keyboardType="numeric"
              maxLength={2}
              selectTextOnFocus
            />
          </View>
        </View>
        <View style={[s.ratingRow, { marginTop: 12 }]}>
          <Text style={s.ratingRowLabel}>🛡️ My Defence</Text>
          <View style={s.ratingInput}>
            <TextInput
              style={s.ratingInputText}
              value={myDefence}
              onChangeText={v => setMyDefence(v.replace(/[^0-9]/g, ""))}
              keyboardType="numeric"
              maxLength={2}
              selectTextOnFocus
            />
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[s.primaryBtn, (!team || !oppTeam) && s.btnDisabled]}
        onPress={run}
        disabled={loading || !team || !oppTeam}
        activeOpacity={0.8}
      >
        {loading
          ? <ActivityIndicator size="small" color="#000" />
          : <><Ionicons name="flask" size={16} color="#000" /><Text style={s.primaryBtnText}>Run Sandbox</Text></>
        }
      </TouchableOpacity>

      {result && (
        <>
          <Text style={[s.sectionLabel, { marginTop: 20 }]}>SANDBOX RESULT</Text>
          <View style={s.resultCard}>
            <Text style={s.resultCardLabel}>WIN PROBABILITY</Text>
            <Text style={s.bigFormation}>{result.probability}%</Text>
            <Text style={[s.moduleDesc, { textAlign: "center", marginTop: 6 }]}>
              Best formation: <Text style={{ color: C.volt, fontFamily: FONT.bold }}>{result.best_formation}</Text>
            </Text>
          </View>

          {/* All formation probabilities */}
          <Text style={s.sectionLabel}>ALL FORMATIONS RANKED</Text>
          {result.all_formations.map((f, i) => (
            <View key={i} style={[s.formMatchRow, { marginBottom: 6 }]}>
              <View style={[s.formBadge, { backgroundColor: "rgba(204,255,0,0.08)", borderColor: "rgba(204,255,0,0.2)" }]}>
                <Text style={[s.formBadgeText, { color: C.volt, fontSize: 8 }]}>{i + 1}</Text>
              </View>
              <Text style={[s.formMatchName, { paddingHorizontal: 10 }]}>{f.formation}</Text>
              <Text style={[s.formScore, { color: C.volt }]}>{f.probability}%</Text>
            </View>
          ))}

          <TouchableOpacity style={[s.resetBtn, { marginTop: 16 }]} onPress={reset} activeOpacity={0.8}>
            <Ionicons name="refresh" size={14} color={C.mt} />
            <Text style={s.resetBtnText}>Reset Sandbox</Text>
          </TouchableOpacity>
        </>
      )}

      <TeamSelectorModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={t => { side === "my" ? setTeam(t) : setOppTeam(t); setModalOpen(false); }}
        title={side === "my" ? "Select My Team" : "Select Opponent"}
      />
    </ScrollView>
  );
}

// ── Module: Live Simulator ────────────────────────────────────────────────────

function LiveSimulatorModule() {
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [homeScore, setHomeScore] = useState("0");
  const [awayScore, setAwayScore] = useState("0");
  const [minute, setMinute] = useState("45");
  const [modalOpen, setModalOpen] = useState(false);
  const [side, setSide] = useState<"home" | "away">("home");
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  const simulate = async () => {
    if (!homeTeam || !awayTeam) { Alert.alert("Select both teams"); return; }
    setLoading(true);
    try {
      const prompt = `LIVE MATCH CONTEXT:\n${homeTeam} ${homeScore}–${awayScore} ${awayTeam}\nMinute: ${minute}'\n\nAs a tactical AI coach, give me 3 specific tactical adjustments I should make RIGHT NOW to change the outcome of this match. Be direct and specific — no fluff.`;
      const res = await api.chat({
        my_team: homeTeam,
        opp_team: awayTeam,
        message: prompt,
        history: [],
        live_context: `Score: ${homeScore}–${awayScore} at ${minute}'`,
      });
      setAdvice(res.reply);
    } catch {
      Alert.alert("Error", "Could not get tactical advice. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setAdvice(null); };

  const ScoreButton = ({ onPress, label }: { onPress: () => void; label: string }) => (
    <TouchableOpacity style={s.scoreBtn} onPress={onPress} activeOpacity={0.7}>
      <Text style={s.scoreBtnText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={s.moduleScroll} showsVerticalScrollIndicator={false}>
        <Text style={s.moduleDesc}>
          Enter the live scoreline and minute to get real-time tactical advice from the AI.
        </Text>

        {/* Team selectors */}
        <View style={s.card}>
          <TouchableOpacity style={s.selectorBtn} onPress={() => { setSide("home"); setModalOpen(true); }} activeOpacity={0.75}>
            <View style={s.selectorIcon}><Text style={{ fontSize: 14 }}>🏠</Text></View>
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
              <Text style={s.selectorLabel}>Home</Text>
              <Text style={[s.selectorValue, homeTeam ? { color: C.tx } : {}]} numberOfLines={1}>{homeTeam || "Select…"}</Text>
            </View>
            <Ionicons name="chevron-down" size={14} color={C.mt} />
          </TouchableOpacity>
          <View style={s.vsDivider}>
            <View style={s.divLine} /><View style={s.vsBadge}><Text style={s.vsText}>VS</Text></View><View style={s.divLine} />
          </View>
          <TouchableOpacity style={s.selectorBtn} onPress={() => { setSide("away"); setModalOpen(true); }} activeOpacity={0.75}>
            <View style={s.selectorIcon}><Text style={{ fontSize: 14 }}>✈️</Text></View>
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
              <Text style={s.selectorLabel}>Away</Text>
              <Text style={[s.selectorValue, awayTeam ? { color: C.tx } : {}]} numberOfLines={1}>{awayTeam || "Select…"}</Text>
            </View>
            <Ionicons name="chevron-down" size={14} color={C.mt} />
          </TouchableOpacity>
        </View>

        {/* Score controls */}
        <Text style={[s.sectionLabel, { marginTop: 20 }]}>SCORELINE</Text>
        <View style={s.scoreCard}>
          <View style={s.scoreTeamCol}>
            <Text style={s.scoreTeamName} numberOfLines={1}>{homeTeam || "Home"}</Text>
            <View style={s.scoreControls}>
              <ScoreButton onPress={() => setHomeScore(String(Math.max(0, parseInt(homeScore) - 1)))} label="−" />
              <Text style={s.scoreNum}>{homeScore}</Text>
              <ScoreButton onPress={() => setHomeScore(String(parseInt(homeScore) + 1))} label="+" />
            </View>
          </View>
          <View style={s.scoreDash}><Text style={s.scoreDashText}>–</Text></View>
          <View style={s.scoreTeamCol}>
            <Text style={s.scoreTeamName} numberOfLines={1}>{awayTeam || "Away"}</Text>
            <View style={s.scoreControls}>
              <ScoreButton onPress={() => setAwayScore(String(Math.max(0, parseInt(awayScore) - 1)))} label="−" />
              <Text style={s.scoreNum}>{awayScore}</Text>
              <ScoreButton onPress={() => setAwayScore(String(parseInt(awayScore) + 1))} label="+" />
            </View>
          </View>
        </View>

        {/* Minute */}
        <Text style={[s.sectionLabel, { marginTop: 20 }]}>MATCH MINUTE</Text>
        <View style={s.card}>
          <View style={s.minuteRow}>
            {["15","30","45","60","75","90"].map(m => (
              <TouchableOpacity
                key={m}
                style={[s.minuteChip, minute === m && s.minuteChipActive]}
                onPress={() => setMinute(m)}
              >
                <Text style={[s.minuteChipText, minute === m && { color: C.volt }]}>{m}'</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={[s.ratingInput, { width: "100%", marginTop: 10, height: 40 }]}>
            <TextInput
              style={[s.ratingInputText, { textAlign: "center", fontSize: 16 }]}
              value={minute}
              onChangeText={v => setMinute(v.replace(/[^0-9]/g, ""))}
              keyboardType="numeric"
              maxLength={3}
              placeholder="Custom minute"
              placeholderTextColor={C.mt}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[s.primaryBtn, (!homeTeam || !awayTeam) && s.btnDisabled]}
          onPress={simulate}
          disabled={loading || !homeTeam || !awayTeam}
          activeOpacity={0.8}
        >
          {loading
            ? <ActivityIndicator size="small" color="#000" />
            : <><Ionicons name="pulse" size={16} color="#000" /><Text style={s.primaryBtnText}>Get Tactical Advice</Text></>
          }
        </TouchableOpacity>

        {advice && (
          <>
            <View style={[s.card, { marginTop: 20, borderColor: "rgba(204,255,0,0.2)" }]}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.volt }} />
                <Text style={[s.sectionLabel, { marginTop: 0 }]}>LIVE TACTICAL ADVICE</Text>
              </View>
              <Text style={s.adviceText}>{advice}</Text>
            </View>
            <TouchableOpacity style={[s.resetBtn, { marginTop: 12 }]} onPress={reset} activeOpacity={0.8}>
              <Ionicons name="refresh" size={14} color={C.mt} />
              <Text style={s.resetBtnText}>Reset</Text>
            </TouchableOpacity>
          </>
        )}

        <TeamSelectorModal
          visible={modalOpen}
          onClose={() => setModalOpen(false)}
          onSelect={t => { side === "home" ? setHomeTeam(t) : setAwayTeam(t); setModalOpen(false); }}
          title={side === "home" ? "Select Home Team" : "Select Away Team"}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Root: Engine Hub ──────────────────────────────────────────────────────────

const MODULES: { id: Module; label: string; icon: string; sub: string }[] = [
  { id: "auto",     label: "Auto-Tactics",      icon: "flash",            sub: "Best XI from form" },
  { id: "opponent", label: "Opponent Analysis",  icon: "analytics",        sub: "Head-to-head scout" },
  { id: "sandbox",  label: "Coach's Sandbox",    icon: "construct",        sub: "Manual squad draft" },
  { id: "live",     label: "Live Simulator",     icon: "pulse",            sub: "In-game advice" },
];

export default function EngineHub() {
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState<Module | null>(null);

  const activeModule = MODULES.find(m => m.id === active);

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={[s.header, { paddingTop: Math.max(16, insets.top) }]}>
        {active ? (
          <View style={s.headerInner}>
            <TouchableOpacity onPress={() => setActive(null)} style={s.backBtn} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={20} color={C.tx} />
            </TouchableOpacity>
            <View>
              <Text style={s.eyebrow}>ENGINE</Text>
              <Text style={s.mainTitle}>{activeModule?.label}</Text>
            </View>
          </View>
        ) : (
          <View>
            <Text style={s.eyebrow}>ENGINE</Text>
            <Text style={s.mainTitle}>Tactica Modules</Text>
            <Text style={s.subtitle}>Select a module to begin your analysis.</Text>
          </View>
        )}
      </View>

      {/* Module grid or active module */}
      {!active ? (
        <ScrollView contentContainerStyle={s.grid} showsVerticalScrollIndicator={false}>
          {MODULES.map(mod => (
            <TouchableOpacity
              key={mod.id}
              style={s.moduleCard}
              onPress={() => setActive(mod.id)}
              activeOpacity={0.8}
            >
              <View style={s.moduleIconBox}>
                <Ionicons name={mod.icon as any} size={22} color={C.volt} />
              </View>
              <Text style={s.moduleCardTitle}>{mod.label}</Text>
              <Text style={s.moduleCardSub}>{mod.sub}</Text>
              <View style={s.moduleCardArrow}>
                <Ionicons name="arrow-forward" size={14} color={C.mt} />
              </View>
            </TouchableOpacity>
          ))}

          {/* Quick access to AI Chat */}
          <TouchableOpacity
            style={[s.moduleCard, { borderColor: "rgba(0,229,255,0.2)", width: "100%", flexDirection: "row", alignItems: "center" }]}
            onPress={() => router.push("/(tabs)/ai-chat")}
            activeOpacity={0.8}
          >
            <View style={[s.moduleIconBox, { backgroundColor: "rgba(0,229,255,0.08)" }]}>
              <Ionicons name="chatbubble-ellipses" size={22} color={C.cyan} />
            </View>
            <View style={{ flex: 1, paddingHorizontal: 12 }}>
              <Text style={s.moduleCardTitle}>AI Chat</Text>
              <Text style={s.moduleCardSub}>Ask the tactical AI anything</Text>
            </View>
            <Ionicons name="arrow-forward" size={14} color={C.mt} />
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          {active === "auto"     && <AutoTacticsModule />}
          {active === "opponent" && <OpponentModule />}
          {active === "sandbox"  && <SandboxModule />}
          {active === "live"     && <LiveSimulatorModule />}
        </View>
      )}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: 22, paddingBottom: 14, borderBottomWidth: 1, borderColor: C.bd },
  headerInner: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: { width: 34, height: 34, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 10, justifyContent: "center", alignItems: "center" },
  eyebrow: { fontSize: 10, fontFamily: FONT.bold, color: C.volt, letterSpacing: 2, textTransform: "uppercase" },
  mainTitle: { fontSize: 24, fontFamily: FONT.headingBold, color: C.tx, marginTop: 2 },
  subtitle: { fontSize: 12, fontFamily: FONT.regular, color: C.mt, marginTop: 4 },

  // Module grid
  grid: { padding: 16, paddingBottom: 110, flexDirection: "row", flexWrap: "wrap", gap: 12 },
  moduleCard: {
    width: (width - 44) / 2,
    backgroundColor: C.sur,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.bd,
    padding: 16,
    ...CARD_SHADOW,
  },
  moduleIconBox: { width: 42, height: 42, borderRadius: 12, backgroundColor: "rgba(204,255,0,0.08)", borderWidth: 1, borderColor: "rgba(204,255,0,0.15)", justifyContent: "center", alignItems: "center", marginBottom: 12 },
  moduleCardTitle: { fontSize: 14, fontFamily: FONT.bold, color: C.tx, marginBottom: 4 },
  moduleCardSub: { fontSize: 11, fontFamily: FONT.regular, color: C.mt, lineHeight: 15 },
  moduleCardArrow: { position: "absolute", top: 14, right: 14 },

  // Shared module styles
  moduleScroll: { padding: 16, paddingBottom: 120 },
  moduleDesc: { fontSize: 12, fontFamily: FONT.regular, color: C.mt, lineHeight: 18, marginBottom: 16 },
  card: { backgroundColor: C.sur, borderRadius: 14, borderWidth: 1, borderColor: C.bd, padding: 16, marginBottom: 12 },
  sectionLabel: { fontSize: 10, fontFamily: FONT.bold, color: C.mt, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 },

  // Selector
  selectorBtn: { height: 58, backgroundColor: "rgba(13,19,23,0.6)", borderRadius: 13, borderWidth: 1, borderColor: C.bd, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", marginBottom: 4 },
  selectorIcon: { width: 34, height: 34, borderRadius: 9, backgroundColor: "rgba(204,255,0,0.08)", borderWidth: 1, borderColor: "rgba(204,255,0,0.15)", justifyContent: "center", alignItems: "center" },
  selectorLabel: { fontSize: 10, fontFamily: FONT.bold, color: C.mt, textTransform: "uppercase" },
  selectorValue: { fontSize: 14, fontFamily: FONT.medium, color: "rgba(255,255,255,0.4)", marginTop: 1 },

  // VS divider
  vsDivider: { flexDirection: "row", alignItems: "center", marginVertical: 6 },
  divLine: { flex: 1, height: 1, backgroundColor: C.bd },
  vsBadge: { width: 34, height: 34, borderRadius: 17, backgroundColor: C.sur, borderWidth: 1, borderColor: C.bd, justifyContent: "center", alignItems: "center" },
  vsText: { fontSize: 10, fontFamily: FONT.bold, color: C.mt },

  // Primary button
  primaryBtn: { height: 56, backgroundColor: C.volt, borderRadius: 14, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 8, ...CARD_SHADOW },
  primaryBtnText: { fontSize: 15, fontFamily: FONT.bold, color: "#000" },
  btnDisabled: { opacity: 0.45 },

  // Reset
  resetBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 14 },
  resetBtnText: { fontSize: 13, fontFamily: FONT.medium, color: C.mt },

  // Result card
  resultCard: { backgroundColor: C.sur, borderRadius: 14, borderWidth: 1, borderColor: "rgba(204,255,0,0.2)", padding: 20, alignItems: "center", marginBottom: 20 },
  resultCardLabel: { fontSize: 10, fontFamily: FONT.bold, color: C.mt, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 },
  bigFormation: { fontSize: 42, fontFamily: FONT.headingBold, color: C.volt },
  statsRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  statPill: { flex: 1, borderWidth: 1, borderColor: "rgba(204,255,0,0.25)", borderRadius: 10, paddingVertical: 10, alignItems: "center" },
  statPillNum: { fontSize: 22, fontFamily: FONT.headingBold },
  statPillLabel: { fontSize: 10, fontFamily: FONT.medium, color: C.mt, marginTop: 2 },

  // Form match rows
  formMatchRow: { flexDirection: "row", alignItems: "center", backgroundColor: C.sur, borderRadius: 10, borderWidth: 1, borderColor: C.bd, padding: 12 },
  formBadge: { width: 28, height: 28, borderRadius: 7, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  formBadgeText: { fontSize: 10, fontFamily: FONT.bold },
  formMatchName: { fontSize: 13, fontFamily: FONT.medium, color: C.tx },
  formMatchMeta: { fontSize: 10, fontFamily: FONT.regular, color: C.mt, marginTop: 2 },
  formScore: { fontSize: 13, fontFamily: FONT.bold, color: C.tx },

  // Opponent form view
  summaryCard: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  summaryTeam: { fontSize: 13, fontFamily: FONT.bold, color: C.tx, textAlign: "center" },
  summaryVs: { fontSize: 12, fontFamily: FONT.bold, color: C.mt, paddingHorizontal: 12 },
  summaryFormation: { fontSize: 11, fontFamily: FONT.medium, color: C.volt, marginTop: 4 },
  subTabRow: { flexDirection: "row", backgroundColor: C.sur, borderRadius: 12, borderWidth: 1, borderColor: C.bd, padding: 4, marginBottom: 16, gap: 4 },
  subTab: { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: "center" },
  subTabActive: { backgroundColor: "rgba(204,255,0,0.08)", borderWidth: 1, borderColor: "rgba(204,255,0,0.2)" },
  subTabText: { fontSize: 12, fontFamily: FONT.bold, color: C.mt },
  formRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  formTeamLabel: { fontSize: 11, fontFamily: FONT.bold, color: C.mt, flex: 1 },
  formDots: { flexDirection: "row", gap: 5 },
  formDot: { width: 24, height: 24, borderRadius: 6, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  formDotText: { fontSize: 9, fontFamily: FONT.bold },
  statCompareRow: { flexDirection: "row", alignItems: "center" },
  statNum: { fontSize: 18, fontFamily: FONT.headingBold, width: 36, textAlign: "center" },
  statLabel: { fontSize: 10, fontFamily: FONT.medium, color: C.mt, textAlign: "center", marginBottom: 4 },
  progressTrack: { height: 6, backgroundColor: C.bd, borderRadius: 3, flexDirection: "row", overflow: "hidden" },
  fillHome: { height: "100%", backgroundColor: C.volt },
  fillAway: { height: "100%", backgroundColor: C.cyan, opacity: 0.6 },
  lineupHeader: { marginBottom: 10 },
  playerRow: { flexDirection: "row", alignItems: "center", backgroundColor: C.sur, borderRadius: 12, borderWidth: 1, borderColor: C.bd, borderLeftWidth: 3.5, padding: 11, marginBottom: 6 },
  playerPos: { fontSize: 10, fontFamily: FONT.bold, width: 32, textAlign: "center" },
  playerName: { fontSize: 13, fontFamily: FONT.medium, color: C.tx },
  playerMeta: { fontSize: 10, fontFamily: FONT.regular, color: C.mt, marginTop: 1 },
  ratingBadge: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: "rgba(204,255,0,0.08)", borderRadius: 6, borderWidth: 1, borderColor: "rgba(204,255,0,0.15)" },
  ratingText: { fontSize: 10, fontFamily: FONT.bold, color: C.volt },

  // Sandbox
  formationChip: { paddingHorizontal: 12, paddingVertical: 7, backgroundColor: C.sur, borderRadius: 20, borderWidth: 1, borderColor: C.bd },
  formationChipActive: { backgroundColor: "rgba(204,255,0,0.08)", borderColor: "rgba(204,255,0,0.25)" },
  formationChipText: { fontSize: 12, fontFamily: FONT.medium, color: C.mt },
  ratingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  ratingRowLabel: { fontSize: 13, fontFamily: FONT.medium, color: C.tx },
  ratingInput: { width: 70, height: 44, backgroundColor: C.bg, borderRadius: 10, borderWidth: 1, borderColor: C.bd, justifyContent: "center", alignItems: "center" },
  ratingInputText: { fontSize: 18, fontFamily: FONT.bold, color: C.volt, textAlign: "center", width: "100%" },

  // Live Simulator
  scoreCard: { backgroundColor: C.sur, borderRadius: 14, borderWidth: 1, borderColor: C.bd, padding: 20, flexDirection: "row", alignItems: "center", marginBottom: 8 },
  scoreTeamCol: { flex: 1, alignItems: "center" },
  scoreTeamName: { fontSize: 12, fontFamily: FONT.bold, color: C.mt, marginBottom: 10, textAlign: "center" },
  scoreControls: { flexDirection: "row", alignItems: "center", gap: 12 },
  scoreBtn: { width: 34, height: 34, backgroundColor: C.bg, borderRadius: 8, borderWidth: 1, borderColor: C.bd, justifyContent: "center", alignItems: "center" },
  scoreBtnText: { fontSize: 20, color: C.tx, lineHeight: 24 },
  scoreNum: { fontSize: 32, fontFamily: FONT.headingBold, color: C.volt, minWidth: 28, textAlign: "center" },
  scoreDash: { paddingHorizontal: 12 },
  scoreDashText: { fontSize: 24, color: C.mt, fontFamily: FONT.headingBold },
  minuteRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  minuteChip: { paddingHorizontal: 14, paddingVertical: 7, backgroundColor: C.bg, borderRadius: 20, borderWidth: 1, borderColor: C.bd },
  minuteChipActive: { backgroundColor: "rgba(204,255,0,0.08)", borderColor: "rgba(204,255,0,0.25)" },
  minuteChipText: { fontSize: 12, fontFamily: FONT.medium, color: C.mt },
  adviceText: { fontSize: 13, fontFamily: FONT.regular, color: C.tx, lineHeight: 22 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(13,19,23,0.85)", justifyContent: "flex-end" },
  modalSheet: { height: "72%", backgroundColor: C.sur, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, borderColor: C.bd, padding: 22 },
  modalDrag: { width: 38, height: 4, backgroundColor: C.bd, borderRadius: 2, alignSelf: "center", marginBottom: 16 },
  modalTitle: { fontSize: 18, fontFamily: FONT.headingBold, color: C.tx, marginBottom: 14 },
  searchBox: { height: 46, backgroundColor: C.bg, borderRadius: 11, borderWidth: 1, borderColor: C.bd, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, gap: 8, marginBottom: 14 },
  searchInput: { flex: 1, color: C.tx, fontFamily: FONT.regular, fontSize: 13, height: "100%" },
  teamRow: { paddingVertical: 14, borderBottomWidth: 1, borderColor: "rgba(42,59,71,0.3)", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  teamRowText: { fontSize: 14, fontFamily: FONT.medium, color: C.tx },
});
