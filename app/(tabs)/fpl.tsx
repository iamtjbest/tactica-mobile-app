// app/(tabs)/fpl.tsx — FPL Scout (Fantasy Premier League Intelligence)
"use client";
import React, { useState, useCallback } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, Clipboard,
  KeyboardAvoidingView, Platform, Dimensions
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { C, CARD_SHADOW, FONT } from "@/constants/theme";

const { width } = Dimensions.get("window");

const API_BASE =
  process.env.EXPO_PUBLIC_API_URL || "https://tactica-backend-hdbd.onrender.com";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Fixture {
  gameweek: number | null;
  date: string;
  opponent: string;
  venue: "H" | "A";
  opp_defence: number;
  fdr: number;
  fdr_label: string;
  fdr_colour: "green" | "amber" | "red";
}

interface TickerResponse {
  team: string;
  fixtures: Fixture[];
  share_text: string;
  cached: boolean;
}

interface NextFixture {
  opponent: string;
  venue: string;
  date: string;
  fdr: number;
  fdr_label: string;
  fdr_colour: string;
  multiplier: number;
}

interface FplPlayer {
  id?: number;
  name: string;
  team?: string;
  position: string;
  price: number;
  ownership: number;
  ppg: number;
  total_pts: number;
  ep_next: number;
  goals: number;
  assists: number;
  xg90: number;
  xa90: number;
  minutes: number;
  form: number;
  status: string;
  news?: string;
  fpl_score: number;
  weighted_score: number;
  value_score?: number;
  diff_score?: number;
  next_fixture: NextFixture;
  reason: string;
}

interface CaptainResponse {
  team: string;
  recommendation: string;
  next_fixture: NextFixture;
  picks: FplPlayer[];
  share_text: string;
  cached: boolean;
}

interface TransferResponse {
  position: string;
  min_price: number;
  max_price: number;
  total_found: number;
  picks: FplPlayer[];
  share_text: string;
  cached: boolean;
}

interface DiffResponse {
  position: string;
  max_ownership: number;
  max_price: number;
  total_found: number;
  picks: FplPlayer[];
  share_text: string;
  cached: boolean;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PL_TEAMS = [
  "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton",
  "Burnley", "Chelsea", "Crystal Palace", "Everton", "Fulham",
  "Leeds", "Liverpool", "Manchester City", "Manchester United",
  "Newcastle United", "Nottingham Forest", "Sunderland",
  "Tottenham Hotspur", "West Ham United", "Wolverhampton",
].sort();

const POSITIONS = [
  { id: "FWD", label: "⚽ FWD" },
  { id: "MID", label: "🎭 MID" },
  { id: "DEF", label: "🛡️ DEF" },
  { id: "GKP", label: "🧤 GKP" },
];

const POS_LABEL: Record<string, string> = {
  FWD: "Forwards", MID: "Midfielders", DEF: "Defenders", GKP: "Goalkeepers"
};

const FDR_COLORS = {
  green: { bg: "rgba(0,230,118,0.15)", border: "rgba(0,230,118,0.3)", text: "#00E676" },
  amber: { bg: "rgba(255,184,48,0.1)", border: "rgba(255,184,48,0.25)", text: "#FFB830" },
  red:   { bg: "rgba(255,71,87,0.1)",  border: "rgba(255,71,87,0.25)",  text: "#FF4757" },
};

const PRICE_PRESETS = [
  { label: "Budget",  min: 3.5,  max: 6.0  },
  { label: "Mid",     min: 6.0,  max: 9.0  },
  { label: "Premium", min: 9.0,  max: 12.0 },
  { label: "Elite",   min: 12.0, max: 20.0 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const e = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(typeof e?.detail === "string" ? e.detail : `Error ${res.status}`);
  }
  return res.json();
}

// ── Shared Components ─────────────────────────────────────────────────────────

function ShareBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    try {
      await Clipboard.setString(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      Alert.alert("Copy failed", "Could not copy to clipboard");
    }
  }, [text]);

  return (
    <TouchableOpacity style={styles.shareBtn} onPress={handleCopy} activeOpacity={0.8}>
      <Ionicons name={copied ? "checkmark" : "share-outline"} size={14} color={C.volt} />
      <Text style={styles.shareBtnText}>{copied ? "Copied!" : "Copy tweet"}</Text>
    </TouchableOpacity>
  );
}

function FdrBadge({ fdr, label, colour }: { fdr: number; label: string; colour: string }) {
  const c = FDR_COLORS[colour as keyof typeof FDR_COLORS] || FDR_COLORS.amber;
  return (
    <View style={[styles.fdrBadge, { backgroundColor: c.bg, borderColor: c.border }]}>
      <View style={[styles.fdrDot, { backgroundColor: c.text }]} />
      <Text style={[styles.fdrBadgeText, { color: c.text }]}>
        FDR {fdr} · {label}
      </Text>
    </View>
  );
}

function PlayerCard({ pick, rank, showTeam = false }: {
  pick: FplPlayer; rank: number; showTeam?: boolean;
}) {
  const nf = pick.next_fixture || {};
  const isTop = rank === 1;
  const c = FDR_COLORS[nf.fdr_colour as keyof typeof FDR_COLORS] || FDR_COLORS.amber;

  return (
    <View style={[styles.playerCard, isTop && styles.playerCardTop]}>
      {/* Header */}
      <View style={styles.playerHeader}>
        <View style={[styles.rankBadge, isTop && styles.rankBadgeTop]}>
          <Text style={[styles.rankText, isTop && styles.rankTextTop]}>
            {isTop ? "★" : rank}
          </Text>
        </View>

        <View style={styles.playerInfo}>
          <View style={styles.playerNameRow}>
            <Text style={[styles.playerName, isTop && styles.playerNameTop]} numberOfLines={1}>
              {pick.name}
            </Text>
            <View style={styles.tagRow}>
              <View style={styles.posTag}>
                <Text style={styles.posTagText}>{pick.position}</Text>
              </View>
              {showTeam && pick.team && (
                <View style={styles.teamTag}>
                  <Text style={styles.teamTagText}>{pick.team}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.priceTag}>£{(pick.price ?? 0).toFixed(1)}m</Text>
            <Text style={styles.ownTag}>{(pick.ownership ?? 0).toFixed(1)}% owned</Text>
            {pick.status && pick.status !== "a" && (
              <Text style={styles.statusTag}>
                {pick.status === "d" ? "⚠️ Doubt" : "❌ Out"}
              </Text>
            )}
          </View>

          {pick.news && (
            <Text style={styles.newsText}>{pick.news}</Text>
          )}
          <Text style={styles.reasonText} numberOfLines={2}>{pick.reason}</Text>
        </View>

        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={[styles.scoreValue, isTop && styles.scoreValueTop]}>
            {(pick.weighted_score ?? 0).toFixed(1)}
          </Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {[
          { label: "Pts/G", val: (pick.ppg ?? 0).toFixed(1), hi: (pick.ppg ?? 0) >= 5.0 },
          { label: "xG/90", val: (pick.xg90 ?? 0).toFixed(2), hi: (pick.xg90 ?? 0) >= 0.3 },
          { label: "xA/90", val: (pick.xa90 ?? 0).toFixed(2), hi: (pick.xa90 ?? 0) >= 0.2 },
          { label: "ep_next", val: (pick.ep_next ?? 0).toFixed(1), hi: (pick.ep_next ?? 0) >= 5 },
        ].map(({ label, val, hi }) => (
          <View key={label} style={[styles.statCell, hi && styles.statCellHi]}>
            <Text style={[styles.statCellVal, hi && styles.statCellValHi]}>{val}</Text>
            <Text style={styles.statCellLabel}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Next Fixture */}
      {nf.opponent && nf.opponent !== "Unknown" && nf.fdr_colour && (
        <View style={[styles.fixtureRow, { backgroundColor: c.bg, borderColor: c.border }]}>
          <View style={[styles.fixtureDot, { backgroundColor: c.text }]} />
          <Text style={[styles.fixtureText, { color: c.text }]}>
            <Text style={styles.fixtureBold}>Next:</Text>{" "}
            {nf.venue === "H" ? "Home" : "Away"} vs {nf.opponent}
            {nf.date && <Text style={styles.fixtureDate}> · {nf.date}</Text>}
          </Text>
          <FdrBadge fdr={nf.fdr} label={nf.fdr_label} colour={nf.fdr_colour} />
        </View>
      )}

      {/* Footer */}
      <View style={styles.cardFooter}>
        <Text style={styles.footerText}>
          {pick.total_pts ?? 0} pts · {pick.minutes ?? 0} min
        </Text>
        {pick.value_score != null && (
          <Text style={styles.valueText}>Value: {pick.value_score.toFixed(2)}</Text>
        )}
        {pick.diff_score != null && pick.value_score == null && (
          <Text style={styles.diffText}>Diff: {pick.diff_score.toFixed(2)}</Text>
        )}
      </View>
    </View>
  );
}

// ── Team Selector Modal ───────────────────────────────────────────────────────

function TeamSelector({ visible, onClose, onSelect, title, teams = PL_TEAMS }: {
  visible: boolean; onClose: () => void; onSelect: (t: string) => void;
  title: string; teams?: string[];
}) {
  const [q, setQ] = useState("");
  const filtered = teams.filter(t => t.toLowerCase().includes(q.toLowerCase()));

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <TouchableOpacity style={styles.modalBackdrop} onPress={onClose} activeOpacity={1} />
      <View style={styles.modalSheet}>
        <View style={styles.modalDrag} />
        <Text style={styles.modalTitle}>{title}</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={14} color={C.mt} />
          <TextInput
            style={styles.searchInput}
            value={q}
            onChangeText={setQ}
            placeholder="Search clubs…"
            placeholderTextColor="rgba(142,155,174,0.4)"
            autoCorrect={false}
          />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {filtered.map(team => (
            <TouchableOpacity
              key={team}
              style={styles.teamRow}
              onPress={() => { onSelect(team); setQ(""); }}
              activeOpacity={0.7}
            >
              <Text style={styles.teamRowText}>{team}</Text>
              <Ionicons name="chevron-forward" size={14} color={C.bd} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

// ── Tab 1: Fixture Ticker ─────────────────────────────────────────────────────

function FixtureTicker() {
  const [team, setTeam] = useState("Arsenal");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<TickerResponse | null>(null);

  const fetch_ = async () => {
    setLoading(true); setError(""); setData(null);
    try {
      setData(await apiFetch(`${API_BASE}/api/fpl/fixtures?team=${encodeURIComponent(team)}&gws=38`));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const easy = data?.fixtures.filter(f => f.fdr_colour === "green").length ?? 0;
  const hard = data?.fixtures.filter(f => f.fdr_colour === "red").length ?? 0;
  const total = data?.fixtures.length ?? 0;

  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabDesc}>All fixtures rated by difficulty. Green = buy · Red = sell.</Text>

      <TouchableOpacity style={styles.selectorBtn} onPress={() => setModalOpen(true)} activeOpacity={0.75}>
        <View style={styles.selectorIcon}><Text style={{ fontSize: 16 }}>⚽</Text></View>
        <View style={{ flex: 1, paddingHorizontal: 12 }}>
          <Text style={styles.selectorLabel}>Club</Text>
          <Text style={[styles.selectorValue, team ? { color: C.tx } : {}]}>{team || "Select club…"}</Text>
        </View>
        <Ionicons name="chevron-down" size={16} color={C.mt} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.primaryBtn, !team && styles.btnDisabled]}
        onPress={fetch_}
        disabled={!team || loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <>
            <Ionicons name="calendar" size={16} color="#000" />
            <Text style={styles.primaryBtnText}>Get Fixture Ticker</Text>
          </>
        )}
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {data && (
        <View style={styles.resultsContainer}>
          <View style={styles.resultHeader}>
            <View>
              <Text style={styles.resultTitle}>{data.team}</Text>
              <Text style={styles.resultSub}>{total} fixtures · {easy} easy · {hard} hard</Text>
            </View>
            <View style={styles.resultActions}>
              {data.cached && (
                <View style={styles.cachedBadge}>
                  <Text style={styles.cachedText}>📦 cached</Text>
                </View>
              )}
              <ShareBtn text={data.share_text} />
            </View>
          </View>

          <View style={styles.legendRow}>
            {[
              ["green", "Easy (1–2)"],
              ["amber", "Medium (3)"],
              ["red", "Hard (4–5)"],
            ].map(([c, l]) => (
              <View key={c} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: FDR_COLORS[c as keyof typeof FDR_COLORS]?.text || C.mt }]} />
                <Text style={styles.legendText}>{l}</Text>
              </View>
            ))}
          </View>

          <View style={styles.fixturesList}>
            {data.fixtures.map((fix, i) => {
              const c = FDR_COLORS[fix.fdr_colour] || FDR_COLORS.amber;
              return (
                <View key={i} style={[styles.fixtureItem, { backgroundColor: c.bg, borderColor: c.border }]}>
                  <View style={[styles.fixtureDot, { backgroundColor: c.text }]} />
                  <View style={styles.fixtureGw}>
                    {fix.gameweek != null && (
                      <Text style={styles.fixtureGwText}>GW{fix.gameweek}</Text>
                    )}
                    <Text style={styles.fixtureDate}>{fix.date}</Text>
                  </View>
                  <View style={[styles.venueBadge, fix.venue === "H" ? styles.venueHome : styles.venueAway]}>
                    <Text style={styles.venueText}>{fix.venue}</Text>
                  </View>
                  <Text style={styles.fixtureOpponent} numberOfLines={1}>vs {fix.opponent}</Text>
                  <View style={styles.fixtureDef}>
                    <Text style={styles.fixtureDefLabel}>Def</Text>
                    <Text style={styles.fixtureDefVal}>{fix.opp_defence}</Text>
                  </View>
                  <View style={[styles.fdrBox, { backgroundColor: c.bg, borderColor: c.border }]}>
                    <Text style={[styles.fdrBoxText, { color: c.text }]}>{fix.fdr}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.quickReadCard}>
            <Text style={styles.quickReadLabel}>📊 Quick Read</Text>
            <Text style={styles.quickReadText}>
              {easy >= total * 0.6
                ? `${data.team} have an excellent run — ${easy}/${total} fixtures easy. Strong to hold their attackers.`
                : hard >= total * 0.6
                ? `Tough run for ${data.team} — ${hard}/${total} hard. Be selective.`
                : `${data.team}: ${easy} easy, ${total - easy - hard} medium, ${hard} hard.`}
            </Text>
          </View>
        </View>
      )}

      <TeamSelector
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={t => { setTeam(t); setModalOpen(false); }}
        title="Select Club"
      />
    </View>
  );
}

// ── Tab 2: Captain Pick ───────────────────────────────────────────────────────

function CaptainPick() {
  const [team, setTeam] = useState("Arsenal");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<CaptainResponse | null>(null);
  const [showScoring, setShowScoring] = useState(false);

  const fetch_ = async () => {
    setLoading(true); setError(""); setData(null);
    try {
      setData(await apiFetch(`${API_BASE}/api/fpl/captain?team=${encodeURIComponent(team)}&top=5`));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabDesc}>
        Captain candidates ranked by pts/game × xG × fixture difficulty. Real FPL prices and ownership.
      </Text>

      <TouchableOpacity style={styles.selectorBtn} onPress={() => setModalOpen(true)} activeOpacity={0.75}>
        <View style={styles.selectorIcon}><Text style={{ fontSize: 16 }}>🎯</Text></View>
        <View style={{ flex: 1, paddingHorizontal: 12 }}>
          <Text style={styles.selectorLabel}>Club</Text>
          <Text style={[styles.selectorValue, team ? { color: C.tx } : {}]}>{team || "Select club…"}</Text>
        </View>
        <Ionicons name="chevron-down" size={16} color={C.mt} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.primaryBtn, !team && styles.btnDisabled]}
        onPress={fetch_}
        disabled={!team || loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <>
            <Ionicons name="trophy" size={16} color="#000" />
            <Text style={styles.primaryBtnText}>Get Captain Pick</Text>
          </>
        )}
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {data && (
        <View style={styles.resultsContainer}>
          <View style={styles.resultHeader}>
            <View>
              <Text style={styles.resultTitle}>{data.team}</Text>
              <Text style={styles.resultSub}>Ranked by FPL pts/game × fixture difficulty</Text>
            </View>
            <View style={styles.resultActions}>
              {data.cached && (
                <View style={styles.cachedBadge}>
                  <Text style={styles.cachedText}>📦 cached</Text>
                </View>
              )}
              <ShareBtn text={data.share_text} />
            </View>
          </View>

          <View style={styles.picksList}>
            {data.picks.map((pick, i) => (
              <PlayerCard key={pick.id ?? i} pick={pick} rank={i + 1} />
            ))}
          </View>

          <TouchableOpacity
            style={styles.scoringToggle}
            onPress={() => setShowScoring(!showScoring)}
            activeOpacity={0.8}
          >
            <Text style={styles.scoringToggleText}>
              ⚙️ How scoring works {showScoring ? "▲" : "▼"}
            </Text>
          </TouchableOpacity>

          {showScoring && (
            <View style={styles.scoringCard}>
              <Text style={styles.scoringText}>
                <Text style={styles.scoringBold}>FPL score</Text> = ppg×2 + xG/90×3 + xA/90×2 + form×0.5 + ep_next×0.3{"
"}
                <Text style={styles.scoringBold}>Weighted</Text> = FPL score × fixture multiplier{"
"}
                Real FPL API data — actual prices, ownership %, and expected points.
              </Text>
            </View>
          )}
        </View>
      )}

      <TeamSelector
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={t => { setTeam(t); setModalOpen(false); }}
        title="Select Club"
      />
    </View>
  );
}

// ── Tab 3: Transfer Recommender ───────────────────────────────────────────────

function TransferRecommender() {
  const [position, setPosition] = useState("FWD");
  const [minPrice, setMinPrice] = useState(0.0);
  const [maxPrice, setMaxPrice] = useState(9.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<TransferResponse | null>(null);

  const fetch_ = async () => {
    if (minPrice >= maxPrice) {
      setError("Min price must be less than max.");
      return;
    }
    setLoading(true); setError(""); setData(null);
    try {
      setData(await apiFetch(
        `${API_BASE}/api/fpl/transfers?position=${position}&min_price=${minPrice}&max_price=${maxPrice}&limit=10`
      ));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabDesc}>
        Best transfer targets across all PL clubs. Real FPL prices in £. Ranked by value score.
      </Text>

      {/* Position Selector */}
      <View style={styles.sectionBox}>
        <Text style={styles.sectionLabel}>Position</Text>
        <View style={styles.posRow}>
          {POSITIONS.map(p => (
            <TouchableOpacity
              key={p.id}
              style={[styles.posChip, position === p.id && styles.posChipActive]}
              onPress={() => setPosition(p.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.posChipText, position === p.id && styles.posChipTextActive]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Price Range */}
      <View style={styles.sectionBox}>
        <Text style={styles.sectionLabel}>Price Range (£m)</Text>
        <View style={styles.presetRow}>
          {PRICE_PRESETS.map(p => (
            <TouchableOpacity
              key={p.label}
              style={[styles.presetChip, minPrice === p.min && maxPrice === p.max && styles.presetChipActive]}
              onPress={() => { setMinPrice(p.min); setMaxPrice(p.max); }}
              activeOpacity={0.8}
            >
              <Text style={[styles.presetChipText, minPrice === p.min && maxPrice === p.max && styles.presetChipTextActive]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.priceInputs}>
          <View style={styles.priceInputBox}>
            <Text style={styles.priceSymbol}>£</Text>
            <TextInput
              style={styles.priceInput}
              value={String(minPrice)}
              onChangeText={v => setMinPrice(parseFloat(v) || 0)}
              keyboardType="decimal-pad"
              placeholder="Min"
              placeholderTextColor="rgba(142,155,174,0.4)"
            />
          </View>
          <Text style={styles.priceArrow}>→</Text>
          <View style={styles.priceInputBox}>
            <Text style={styles.priceSymbol}>£</Text>
            <TextInput
              style={styles.priceInput}
              value={String(maxPrice)}
              onChangeText={v => setMaxPrice(parseFloat(v) || 15)}
              keyboardType="decimal-pad"
              placeholder="Max"
              placeholderTextColor="rgba(142,155,174,0.4)"
            />
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.primaryBtn, loading && styles.btnDisabled]}
        onPress={fetch_}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <>
            <Ionicons name="swap-horizontal" size={16} color="#000" />
            <Text style={styles.primaryBtnText}>Find Transfer Targets</Text>
          </>
        )}
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {data && (
        <View style={styles.resultsContainer}>
          <View style={styles.resultHeader}>
            <View>
              <Text style={styles.resultTitle}>
                Top {data.picks.length} {POS_LABEL[data.position] ?? data.position}
              </Text>
              <Text style={styles.resultSub}>
                {data.total_found} candidates · £{data.min_price}–£{data.max_price}m · by value score
              </Text>
            </View>
            <View style={styles.resultActions}>
              {data.cached && (
                <View style={styles.cachedBadge}>
                  <Text style={styles.cachedText}>📦 cached</Text>
                </View>
              )}
              <ShareBtn text={data.share_text} />
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>💡</Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>Value score</Text> = (pts/game × fixture) ÷ £price. High output, low price wins.
            </Text>
          </View>

          <View style={styles.picksList}>
            {data.picks.map((pick, i) => (
              <PlayerCard key={pick.id ?? i} pick={pick} rank={i + 1} showTeam />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

// ── Tab 4: Differential Finder ────────────────────────────────────────────────

function DifferentialFinder() {
  const [position, setPosition] = useState("FWD");
  const [maxOwnership, setMaxOwnership] = useState(15.0);
  const [maxPrice, setMaxPrice] = useState(8.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<DiffResponse | null>(null);

  const fetch_ = async () => {
    setLoading(true); setError(""); setData(null);
    try {
      setData(await apiFetch(
        `${API_BASE}/api/fpl/differentials?position=${position}&max_ownership=${maxOwnership}&max_price=${maxPrice}&limit=8`
      ));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.tabContent}>
      <View style={styles.infoBanner}>
        <Text style={styles.infoBannerText}>
          <Text style={styles.infoBannerBold}>What is a differential?</Text>{" "}
          A player with low real FPL ownership % who is in form with an easy fixture.
        </Text>
      </View>

      {/* Position Selector */}
      <View style={styles.sectionBox}>
        <Text style={styles.sectionLabel}>Position</Text>
        <View style={styles.posRow}>
          {POSITIONS.map(p => (
            <TouchableOpacity
              key={p.id}
              style={[styles.posChip, position === p.id && styles.posChipActive]}
              onPress={() => setPosition(p.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.posChipText, position === p.id && styles.posChipTextActive]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Max Ownership */}
      <View style={styles.sectionBox}>
        <Text style={styles.sectionLabel}>Max Ownership %</Text>
        <Text style={styles.sectionSub}>Real FPL selected_by_percent</Text>
        <View style={styles.presetRow}>
          {[5, 10, 15, 20, 25].map(v => (
            <TouchableOpacity
              key={v}
              style={[styles.presetChip, maxOwnership === v && styles.presetChipActive]}
              onPress={() => setMaxOwnership(v)}
              activeOpacity={0.8}
            >
              <Text style={[styles.presetChipText, maxOwnership === v && styles.presetChipTextActive]}>
                &lt;{v}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.priceInputBox}>
          <TextInput
            style={[styles.priceInput, { paddingLeft: 16 }]}
            value={String(maxOwnership)}
            onChangeText={v => setMaxOwnership(parseFloat(v) || 15)}
            keyboardType="decimal-pad"
            placeholder="Max ownership %"
            placeholderTextColor="rgba(142,155,174,0.4)"
          />
          <Text style={[styles.priceSymbol, { right: 16, left: undefined }]}>%</Text>
        </View>
      </View>

      {/* Max Price */}
      <View style={styles.sectionBox}>
        <Text style={styles.sectionLabel}>Max Price (£m)</Text>
        <View style={styles.presetRow}>
          {[5.5, 6.5, 7.5, 8.5, 10.0].map(v => (
            <TouchableOpacity
              key={v}
              style={[styles.presetChip, maxPrice === v && styles.presetChipActive]}
              onPress={() => setMaxPrice(v)}
              activeOpacity={0.8}
            >
              <Text style={[styles.presetChipText, maxPrice === v && styles.presetChipTextActive]}>
                £{v}m
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.priceInputBox}>
          <Text style={styles.priceSymbol}>£</Text>
          <TextInput
            style={styles.priceInput}
            value={String(maxPrice)}
            onChangeText={v => setMaxPrice(parseFloat(v) || 8)}
            keyboardType="decimal-pad"
            placeholder="Max price"
            placeholderTextColor="rgba(142,155,174,0.4)"
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.primaryBtn, loading && styles.btnDisabled]}
        onPress={fetch_}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <>
            <Ionicons name="flash" size={16} color="#000" />
            <Text style={styles.primaryBtnText}>Find Differentials</Text>
          </>
        )}
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {data && (
        <View style={styles.resultsContainer}>
          <View style={styles.resultHeader}>
            <View>
              <Text style={styles.resultTitle}>
                Top Differential {POS_LABEL[data.position] ?? data.position}
              </Text>
              <Text style={styles.resultSub}>
                {data.total_found} candidates · under {data.max_ownership}% owned · under £{data.max_price}m
              </Text>
            </View>
            <View style={styles.resultActions}>
              {data.cached && (
                <View style={styles.cachedBadge}>
                  <Text style={styles.cachedText}>📦 cached</Text>
                </View>
              )}
              <ShareBtn text={data.share_text} />
            </View>
          </View>

          <View style={styles.diffTraits}>
            {[
              { icon: "📉", label: "Low ownership", sub: "Real FPL % data" },
              { icon: "🔥", label: "In form", sub: "High pts/game + xG" },
              { icon: "🟢", label: "Easy fixture", sub: "FDR ≤ 3 only" },
            ].map(({ icon, label, sub }) => (
              <View key={label} style={styles.diffTrait}>
                <Text style={styles.diffTraitIcon}>{icon}</Text>
                <Text style={styles.diffTraitLabel}>{label}</Text>
                <Text style={styles.diffTraitSub}>{sub}</Text>
              </View>
            ))}
          </View>

          <View style={styles.picksList}>
            {data.picks.map((pick, i) => (
              <View key={pick.id ?? i} style={i === 0 ? styles.topDiffWrapper : undefined}>
                {i === 0 && (
                  <View style={styles.topDiffBadge}>
                    <Text style={styles.topDiffBadgeText}>🔥 TOP DIFFERENTIAL</Text>
                  </View>
                )}
                <PlayerCard pick={pick} rank={i + 1} showTeam />
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

// ── Root Screen ───────────────────────────────────────────────────────────────

const TABS = [
  { id: "ticker",   label: "📅 Fixtures" },
  { id: "captain",  label: "🎯 Captain" },
  { id: "transfer", label: "🔄 Transfers" },
  { id: "diff",     label: "💡 Differentials" },
] as const;

type TabId = typeof TABS[number]["id"];

export default function FplScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<TabId>("ticker");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
    >
      <View style={styles.root}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: Math.max(16, insets.top) + 6 }]}>
          <View>
            <Text style={styles.eyebrow}>FPL SCOUT</Text>
            <Text style={styles.mainTitle}>Fantasy Premier League</Text>
            <Text style={styles.subtitle}>Real FPL prices · Real ownership % · Fixture difficulty · AI picks</Text>
          </View>
        </View>

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          {TABS.map(t => (
            <TouchableOpacity
              key={t.id}
              style={[styles.tabBtn, tab === t.id && styles.tabBtnActive]}
              onPress={() => setTab(t.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabBtnText, tab === t.id && styles.tabBtnTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {tab === "ticker" && <FixtureTicker />}
          {tab === "captain" && <CaptainPick />}
          {tab === "transfer" && <TransferRecommender />}
          {tab === "diff" && <DifferentialFinder />}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Root
  root: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: "rgba(42,59,71,0.5)" },
  eyebrow: { fontSize: 10, fontFamily: FONT.bold, color: C.volt, letterSpacing: 2, textTransform: "uppercase" },
  mainTitle: { fontSize: 24, fontFamily: FONT.headingBold, color: C.tx, marginTop: 2 },
  subtitle: { fontSize: 12, fontFamily: FONT.regular, color: C.mt, marginTop: 4, lineHeight: 18 },

  // Tab Bar
  tabBar: { flexDirection: "row", paddingHorizontal: 16, paddingVertical: 10, gap: 8, borderBottomWidth: 1, borderBottomColor: "rgba(42,59,71,0.3)" },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: C.bd, backgroundColor: C.sur, alignItems: "center" },
  tabBtnActive: { backgroundColor: "rgba(204,255,0,0.08)", borderColor: "rgba(204,255,0,0.25)" },
  tabBtnText: { fontSize: 11, fontFamily: FONT.bold, color: C.mt },
  tabBtnTextActive: { color: C.volt },

  // Scroll
  scrollContent: { padding: 16, paddingBottom: 120 },
  tabContent: { gap: 14 },
  tabDesc: { fontSize: 12, fontFamily: FONT.regular, color: C.mt, lineHeight: 18, marginBottom: 2 },

  // Shared UI
  selectorBtn: { height: 58, backgroundColor: "rgba(13,19,23,0.6)", borderRadius: 13, borderWidth: 1, borderColor: C.bd, paddingHorizontal: 14, flexDirection: "row", alignItems: "center" },
  selectorIcon: { width: 34, height: 34, borderRadius: 9, backgroundColor: "rgba(204,255,0,0.08)", borderWidth: 1, borderColor: "rgba(204,255,0,0.15)", justifyContent: "center", alignItems: "center" },
  selectorLabel: { fontSize: 10, fontFamily: FONT.bold, color: C.mt, textTransform: "uppercase" },
  selectorValue: { fontSize: 14, fontFamily: FONT.medium, color: "rgba(255,255,255,0.4)", marginTop: 1 },

  primaryBtn: { height: 56, backgroundColor: C.volt, borderRadius: 14, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 4, ...CARD_SHADOW },
  primaryBtnText: { fontSize: 15, fontFamily: FONT.bold, color: "#000" },
  btnDisabled: { opacity: 0.4 },
  errorText: { color: "#FF4757", fontSize: 13, fontFamily: FONT.medium, textAlign: "center", marginTop: 8 },

  // Results
  resultsContainer: { marginTop: 16, gap: 12 },
  resultHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 },
  resultTitle: { fontSize: 18, fontFamily: FONT.headingBold, color: C.tx },
  resultSub: { fontSize: 11, fontFamily: FONT.regular, color: C.mt, marginTop: 2 },
  resultActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  cachedBadge: { paddingHorizontal: 8, paddingVertical: 3, backgroundColor: "rgba(142,155,174,0.08)", borderRadius: 12, borderWidth: 1, borderColor: C.bd },
  cachedText: { fontSize: 10, fontFamily: FONT.medium, color: C.mt },

  shareBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: "rgba(204,255,0,0.3)", backgroundColor: "rgba(204,255,0,0.08)" },
  shareBtnText: { fontSize: 11, fontFamily: FONT.bold, color: C.volt },

  // FDR
  fdrBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  fdrDot: { width: 6, height: 6, borderRadius: 3 },
  fdrBadgeText: { fontSize: 10, fontFamily: FONT.bold },

  // Player Card
  playerCard: { backgroundColor: C.sur, borderRadius: 14, borderWidth: 1, borderColor: C.bd, padding: 14, gap: 10 },
  playerCardTop: { borderColor: "rgba(204,255,0,0.3)", backgroundColor: "rgba(204,255,0,0.03)" },
  playerHeader: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  rankBadge: { width: 32, height: 32, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: C.bd, justifyContent: "center", alignItems: "center" },
  rankBadgeTop: { backgroundColor: "rgba(204,255,0,0.15)", borderColor: "rgba(204,255,0,0.3)" },
  rankText: { fontSize: 13, fontFamily: FONT.bold, color: C.mt },
  rankTextTop: { color: C.volt, fontSize: 16 },
  playerInfo: { flex: 1, minWidth: 0 },
  playerNameRow: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  playerName: { fontSize: 14, fontFamily: FONT.bold, color: C.tx, flexShrink: 1 },
  playerNameTop: { fontSize: 16, color: "#FFFFFF" },
  tagRow: { flexDirection: "row", gap: 4 },
  posTag: { paddingHorizontal: 6, paddingVertical: 2, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 4, borderWidth: 1, borderColor: C.bd },
  posTagText: { fontSize: 9, fontFamily: FONT.bold, color: C.mt },
  teamTag: { paddingHorizontal: 6, paddingVertical: 2, backgroundColor: "rgba(0,229,255,0.08)", borderRadius: 4, borderWidth: 1, borderColor: "rgba(0,229,255,0.2)" },
  teamTagText: { fontSize: 9, fontFamily: FONT.bold, color: C.cyan },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4, flexWrap: "wrap" },
  priceTag: { fontSize: 10, fontFamily: FONT.bold, color: C.volt, paddingHorizontal: 6, paddingVertical: 2, backgroundColor: "rgba(204,255,0,0.06)", borderRadius: 4, borderWidth: 1, borderColor: "rgba(204,255,0,0.15)" },
  ownTag: { fontSize: 10, fontFamily: FONT.medium, color: C.mt, paddingHorizontal: 6, paddingVertical: 2, backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 4, borderWidth: 1, borderColor: C.bd },
  statusTag: { fontSize: 10, fontFamily: FONT.bold, color: "#FFB830", paddingHorizontal: 6, paddingVertical: 2, backgroundColor: "rgba(255,184,48,0.08)", borderRadius: 4, borderWidth: 1, borderColor: "rgba(255,184,48,0.2)" },
  newsText: { fontSize: 10, fontFamily: FONT.medium, color: "#FFB830", marginTop: 2 },
  reasonText: { fontSize: 11, fontFamily: FONT.regular, color: C.mt, marginTop: 3, lineHeight: 16 },
  scoreBox: { alignItems: "flex-end", flexShrink: 0 },
  scoreLabel: { fontSize: 9, fontFamily: FONT.medium, color: C.mt, textTransform: "uppercase", letterSpacing: 1 },
  scoreValue: { fontSize: 16, fontFamily: FONT.headingBold, color: C.tx },
  scoreValueTop: { fontSize: 20, color: C.volt },

  statsGrid: { flexDirection: "row", gap: 6 },
  statCell: { flex: 1, alignItems: "center", paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: C.bd, backgroundColor: "rgba(255,255,255,0.03)" },
  statCellHi: { borderColor: "rgba(204,255,0,0.3)", backgroundColor: "rgba(204,255,0,0.06)" },
  statCellVal: { fontSize: 14, fontFamily: FONT.headingBold, color: C.tx },
  statCellValHi: { color: C.volt },
  statCellLabel: { fontSize: 9, fontFamily: FONT.medium, color: C.mt, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 },

  fixtureRow: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 10, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8 },
  fixtureDot: { width: 6, height: 6, borderRadius: 3 },
  fixtureText: { flex: 1, fontSize: 11, fontFamily: FONT.medium },
  fixtureBold: { fontFamily: FONT.bold },
  fixtureDate: { opacity: 0.7 },

  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: "rgba(42,59,71,0.3)", paddingTop: 8 },
  footerText: { fontSize: 10, fontFamily: FONT.regular, color: C.mt },
  valueText: { fontSize: 11, fontFamily: FONT.bold, color: C.cyan },
  diffText: { fontSize: 11, fontFamily: FONT.bold, color: C.volt },

  // Sections
  sectionBox: { gap: 8, marginBottom: 4 },
  sectionLabel: { fontSize: 10, fontFamily: FONT.bold, color: C.mt, textTransform: "uppercase", letterSpacing: 1.5 },
  sectionSub: { fontSize: 11, fontFamily: FONT.regular, color: "rgba(142,155,174,0.6)", marginTop: -4 },

  // Position chips
  posRow: { flexDirection: "row", gap: 8 },
  posChip: { flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: C.bd, backgroundColor: C.sur, alignItems: "center" },
  posChipActive: { backgroundColor: "rgba(204,255,0,0.08)", borderColor: "rgba(204,255,0,0.25)" },
  posChipText: { fontSize: 12, fontFamily: FONT.bold, color: C.mt },
  posChipTextActive: { color: C.volt },

  // Price presets
  presetRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  presetChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: C.bd, backgroundColor: C.sur },
  presetChipActive: { backgroundColor: "rgba(204,255,0,0.08)", borderColor: "rgba(204,255,0,0.25)" },
  presetChipText: { fontSize: 11, fontFamily: FONT.bold, color: C.mt },
  presetChipTextActive: { color: C.volt },

  // Price inputs
  priceInputs: { flexDirection: "row", alignItems: "center", gap: 10 },
  priceInputBox: { flex: 1, height: 48, backgroundColor: C.bg, borderRadius: 11, borderWidth: 1, borderColor: C.bd, flexDirection: "row", alignItems: "center", paddingHorizontal: 12 },
  priceSymbol: { fontSize: 14, fontFamily: FONT.bold, color: C.volt, marginRight: 4 },
  priceInput: { flex: 1, color: C.tx, fontSize: 14, fontFamily: FONT.bold, height: "100%" },
  priceArrow: { color: C.mt, fontSize: 14, fontFamily: FONT.bold },

  // Info boxes
  infoBox: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: C.sur, borderRadius: 12, borderWidth: 1, borderColor: C.bd, padding: 12 },
  infoIcon: { fontSize: 16 },
  infoText: { flex: 1, fontSize: 11, fontFamily: FONT.regular, color: C.mt, lineHeight: 16 },
  infoBold: { fontFamily: FONT.bold, color: C.tx },
  infoBanner: { backgroundColor: "rgba(204,255,0,0.05)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(204,255,0,0.15)", padding: 12, marginBottom: 4 },
  infoBannerText: { fontSize: 12, fontFamily: FONT.regular, color: C.mt, lineHeight: 18 },
  infoBannerBold: { fontFamily: FONT.bold, color: C.volt },

  // Scoring toggle
  scoringToggle: { paddingVertical: 12, alignItems: "center" },
  scoringToggleText: { fontSize: 12, fontFamily: FONT.bold, color: C.mt },
  scoringCard: { backgroundColor: C.sur, borderRadius: 12, borderWidth: 1, borderColor: C.bd, padding: 14, gap: 8 },
  scoringText: { fontSize: 11, fontFamily: FONT.regular, color: C.mt, lineHeight: 18 },
  scoringBold: { fontFamily: FONT.bold, color: C.tx },

  // Fixtures list
  fixturesList: { gap: 6 },
  fixtureItem: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10 },
  fixtureGw: { width: 44, flexShrink: 0 },
  fixtureGwText: { fontSize: 9, fontFamily: FONT.bold, color: C.mt, textTransform: "uppercase" },
  fixtureDate: { fontSize: 11, fontFamily: FONT.medium, color: C.tx },
  venueBadge: { width: 28, height: 28, borderRadius: 7, justifyContent: "center", alignItems: "center", borderWidth: 1 },
  venueHome: { backgroundColor: "rgba(204,255,0,0.1)", borderColor: "rgba(204,255,0,0.2)" },
  venueAway: { backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)" },
  venueText: { fontSize: 11, fontFamily: FONT.bold, color: C.tx },
  fixtureOpponent: { flex: 1, fontSize: 13, fontFamily: FONT.medium, color: C.tx, paddingHorizontal: 6 },
  fixtureDef: { alignItems: "center", flexShrink: 0, paddingRight: 6 },
  fixtureDefLabel: { fontSize: 9, fontFamily: FONT.medium, color: C.mt, textTransform: "uppercase" },
  fixtureDefVal: { fontSize: 13, fontFamily: FONT.bold, color: C.tx },
  fdrBox: { width: 32, height: 32, borderRadius: 8, justifyContent: "center", alignItems: "center", borderWidth: 1 },
  fdrBoxText: { fontSize: 16, fontFamily: FONT.headingBold },

  // Legend
  legendRow: { flexDirection: "row", gap: 16, marginTop: 4 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, fontFamily: FONT.medium, color: C.mt },

  // Quick Read
  quickReadCard: { backgroundColor: C.sur, borderRadius: 12, borderWidth: 1, borderColor: "rgba(204,255,0,0.2)", padding: 14 },
  quickReadLabel: { fontSize: 10, fontFamily: FONT.bold, color: C.volt, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
  quickReadText: { fontSize: 13, fontFamily: FONT.medium, color: C.tx, lineHeight: 20 },

  // Picks list
  picksList: { gap: 10 },

  // Differential traits
  diffTraits: { flexDirection: "row", gap: 8 },
  diffTrait: { flex: 1, alignItems: "center", backgroundColor: C.sur, borderRadius: 12, borderWidth: 1, borderColor: C.bd, paddingVertical: 12, paddingHorizontal: 6 },
  diffTraitIcon: { fontSize: 20, marginBottom: 4 },
  diffTraitLabel: { fontSize: 11, fontFamily: FONT.bold, color: C.tx, textAlign: "center" },
  diffTraitSub: { fontSize: 9, fontFamily: FONT.regular, color: C.mt, marginTop: 2, textAlign: "center" },

  // Top differential
  topDiffWrapper: { marginTop: 8 },
  topDiffBadge: { position: "absolute", top: -10, left: 12, zIndex: 10, backgroundColor: C.volt, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
  topDiffBadgeText: { fontSize: 9, fontFamily: FONT.bold, color: "#000" },

  // Modal
  modalOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 100 },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(13,19,23,0.85)" },
  modalSheet: { position: "absolute", bottom: 0, left: 0, right: 0, height: "72%", backgroundColor: C.sur, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, borderColor: C.bd, padding: 22 },
  modalDrag: { width: 38, height: 4, backgroundColor: C.bd, borderRadius: 2, alignSelf: "center", marginBottom: 16 },
  modalTitle: { fontSize: 18, fontFamily: FONT.headingBold, color: C.tx, marginBottom: 14 },
  searchBox: { height: 46, backgroundColor: C.bg, borderRadius: 11, borderWidth: 1, borderColor: C.bd, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, gap: 8, marginBottom: 14 },
  searchInput: { flex: 1, color: C.tx, fontFamily: FONT.regular, fontSize: 13, height: "100%" },
  teamRow: { paddingVertical: 14, borderBottomWidth: 1, borderColor: "rgba(42,59,71,0.3)", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  teamRowText: { fontSize: 14, fontFamily: FONT.medium, color: C.tx },
});
