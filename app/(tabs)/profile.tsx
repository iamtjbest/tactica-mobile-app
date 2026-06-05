// app/(tabs)/profile.tsx — Coach's Sandbox
import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Modal, TextInput } from "react-native";
import { api, type SquadPlayer, EUROPEAN_TEAMS } from "@/lib/api";
import { C } from "@/constants/theme";

const FORMATIONS = ["4-3-3","4-2-3-1","4-4-2","3-5-2","3-4-3","5-3-2","5-4-1","4-1-4-1"];
const POS_ORDER  = ["GK","DF","MF","FW"] as const;
const POS_COLOR: Record<string,string> = { GK:C.yellow, DF:"#60a5fa", MF:C.green500, FW:C.red };

function InlineTeamPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = EUROPEAN_TEAMS.filter(t =>
    t.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontSize:12, color:C.muted, marginBottom:6, letterSpacing:0.5 }}>{label}</Text>
      <TouchableOpacity 
        style={{ flexDirection:"row", alignItems:"center", justifyContent:"space-between", backgroundColor:C.card, borderWidth:1, borderColor:C.border, borderRadius:10, paddingHorizontal:14, paddingVertical:12 }} 
        onPress={() => setOpen(true)} 
        activeOpacity={0.8}
      >
        <Text style={{ color:C.text, fontSize:14, fontWeight:"500", flex:1 }}>{value}</Text>
        <Text style={{ color:C.muted, fontSize:12 }}>▼</Text>
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" presentationStyle="pageSheet">
        <View style={{ flex:1, backgroundColor:C.surface }}>
          <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding:16, borderBottomWidth:1, borderBottomColor:C.border }}>
            <Text style={{ fontSize:18, fontWeight:"800", color:C.text, letterSpacing:1 }}>Select Team</Text>
            <TouchableOpacity onPress={() => { setOpen(false); setSearch(""); }}>
              <Text style={{ color: C.muted, fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection:"row", alignItems:"center", margin:12, backgroundColor:C.card, borderRadius:10, paddingHorizontal:12, borderWidth:1, borderColor:C.border }}>
            <TextInput
              style={{ flex:1, paddingVertical:10, color:C.text, fontSize:14 }}
              value={search}
              onChangeText={setSearch}
              placeholder="Search teams…"
              placeholderTextColor={C.muted}
              autoFocus
            />
          </View>
          <FlatList
            data={filtered}
            keyExtractor={t => t}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingHorizontal:16, paddingVertical:14, backgroundColor: item === value ? "rgba(34,197,94,0.1)" : "transparent" }}
                onPress={() => { onChange(item); setOpen(false); setSearch(""); }}
              >
                <Text style={{ color: item === value ? C.green400 : C.text, fontSize:14, fontWeight: item === value ? "600" : "400" }}>{item}</Text>
                {item === value && <Text style={{ color: C.green500 }}>✓</Text>}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={{ height:1, backgroundColor:C.border, opacity:0.4 }} />}
          />
        </View>
      </Modal>
    </View>
  );
}

export default function SandboxScreen() {
  const [myTeam,    setMyTeam]    = useState("Arsenal");
  const [oppTeam,   setOppTeam]   = useState("Chelsea");
  const [formation, setFormation] = useState("4-3-3");
  const [squad,     setSquad]     = useState<SquadPlayer[]>([]);
  const [selected,  setSelected]  = useState<string[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [fetching,  setFetching]  = useState(false);
  const [prob,      setProb]      = useState<number|null>(null);
  const [error,     setError]     = useState("");

  async function fetchSquad() {
    setFetching(true); setError(""); setSquad([]); setSelected([]);
    try { setSquad((await api.squad(myTeam)).players); }
    catch(e:unknown) { setError(e instanceof Error ? e.message : "Error"); }
    finally { setFetching(false); }
  }

  function toggle(name:string) {
    setSelected(prev =>
      prev.includes(name) ? prev.filter(n=>n!==name)
      : prev.length<11 ? [...prev,name] : prev
    );
  }

  async function analyze() {
    setLoading(true); setError("");
    try {
      const pred = await api.predict({ my_team:myTeam, opp_team:oppTeam });
      setProb(pred.probability);
    } catch(e:unknown) { setError(e instanceof Error ? e.message : "Error"); }
    finally { setLoading(false); }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.pitch }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        {/* Simple inline header replaces PageHeader */}
        <View style={{ flexDirection:"row", alignItems:"center", gap:12, marginBottom:20 }}>
          <Text style={{ fontSize:32 }}>🧠</Text>
          <View>
            <Text style={{ fontSize:26, fontWeight:"800", color:C.green500, letterSpacing:2, textTransform:"uppercase" }}>Sandbox</Text>
            <Text style={{ fontSize:12, color:C.muted, marginTop:2 }}>Draft your XI, get AI probability</Text>
          </View>
        </View>

        {/* InlineTeamPicker replaces TeamPicker */}
        <InlineTeamPicker label="Your Team" value={myTeam} onChange={v=>{setMyTeam(v);setSquad([]);setSelected([]);}} />
        <InlineTeamPicker label="Opponent"  value={oppTeam} onChange={setOppTeam} />

        <Text style={s.label}>Formation</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:12 }}>
          {FORMATIONS.map(f => (
            <TouchableOpacity key={f} onPress={() => setFormation(f)}
              style={[s.fmBtn, formation===f && s.fmBtnActive]}>
              <Text style={[s.fmTxt, formation===f && s.fmTxtActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Inline error box replaces ErrorBox */}
        {error ? (
          <View style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", borderWidth: 1, borderColor: C.red, padding: 12, borderRadius: 10, marginBottom: 12 }}>
            <Text style={{ color: C.red, fontSize: 13, fontWeight: "600" }}>{error}</Text>
          </View>
        ) : null}

        {/* Inline touchable replaces Btn */}
        <TouchableOpacity
          onPress={fetchSquad}
          disabled={fetching}
          style={{
            backgroundColor: C.green500,
            paddingVertical: 12,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            opacity: fetching ? 0.6 : 1,
            marginBottom: 12,
          }}
        >
          <Text style={{ color: "#000", fontWeight: "700", fontSize: 14 }}>
            {fetching ? "Loading squad…" : `📥 Load ${myTeam} Squad`}
          </Text>
        </TouchableOpacity>

        {squad.length > 0 && (
          <View style={{ marginTop:16 }}>
            <View style={s.selectHeader}>
              <Text style={s.secTitle}>Pick Your XI ({selected.length}/11)</Text>
              <TouchableOpacity onPress={() => setSelected([])}>
                <Text style={s.clearTxt}>Clear</Text>
              </TouchableOpacity>
            </View>
            {POS_ORDER.map(pos => {
              const group = squad.filter(p => p.Pos === pos);
              if (!group.length) return null;
              return (
                <View key={pos} style={{ marginBottom:8 }}>
                  <Text style={[s.posLabel, { color: POS_COLOR[pos] }]}>{pos}</Text>
                  {group.map(p => (
                    <TouchableOpacity key={p.Name} onPress={() => toggle(p.Name)}
                      style={[s.playerBtn, selected.includes(p.Name) && s.playerBtnActive]}>
                      <Text style={[s.playerBtnTxt, selected.includes(p.Name) && { color:C.green400 }]}>
                        {p.Name}
                      </Text>
                      {selected.includes(p.Name) && <Text style={{ color:C.green500 }}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </View>
              );
            })}
            <View style={{ marginTop:8 }}>
              {/* Inline touchable replaces Btn */}
              <TouchableOpacity
                onPress={analyze}
                disabled={loading || selected.length < 11}
                style={{
                  backgroundColor: C.green500,
                  paddingVertical: 12,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: (loading || selected.length < 11) ? 0.6 : 1,
                  marginTop: 8,
                }}
              >
                <Text style={{ color: "#000", fontWeight: "700", fontSize: 14 }}>
                  {loading ? "Analysing…" : "⚙️ Analyse Gameplan"}
                </Text>
              </TouchableOpacity>
            </View>
            {prob!==null && (
              <View style={s.probRow}>
                {/* Inline stat box replaces StatBox */}
                <View style={{ flex: 1, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, padding: 12, borderRadius: 10, alignItems: "center" }}>
                  <Text style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Formation</Text>
                  <Text style={{ fontSize: 18, fontWeight: "800", color: C.green400 }}>{formation}</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, padding: 12, borderRadius: 10, alignItems: "center" }}>
                  <Text style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Win Probability</Text>
                  <Text style={{ fontSize: 18, fontWeight: "800", color: C.green400 }}>{`${prob.toFixed(1)}%`}</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  label:        { fontSize:12, color:C.muted, marginBottom:6, letterSpacing:0.5 },
  fmBtn:        { paddingHorizontal:12, paddingVertical:8, borderRadius:8, borderWidth:1, borderColor:C.border, marginRight:6, backgroundColor:C.surface },
  fmBtnActive:  { backgroundColor:C.green900, borderColor:C.green600 },
  fmTxt:        { color:C.muted, fontSize:12, fontWeight:"600" },
  fmTxtActive:  { color:C.green400 },
  selectHeader: { flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom:8 },
  secTitle:     { fontSize:13, fontWeight:"800", color:C.green400, letterSpacing:1, textTransform:"uppercase" },
  clearTxt:     { color:C.muted, fontSize:12 },
  posLabel:     { fontSize:11, fontWeight:"800", letterSpacing:1, textTransform:"uppercase", marginBottom:4 },
  playerBtn:    { flexDirection:"row", justifyContent:"space-between", alignItems:"center", paddingHorizontal:12, paddingVertical:10, backgroundColor:C.surface, borderRadius:8, marginBottom:4, borderWidth:1, borderColor:C.border },
  playerBtnActive:{ backgroundColor:"rgba(34,197,94,0.1)", borderColor:C.green700 },
  playerBtnTxt: { color:C.muted, fontSize:13 },
  probRow:      { flexDirection:"row", gap:8, marginTop:12 },
});