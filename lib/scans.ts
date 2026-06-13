import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Scan {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  matchday: string;
  score: string;
  formation?: string;
  date: string;
}

export async function getRecentScans(): Promise<Scan[]> {
  try {
    const val = await AsyncStorage.getItem("@recent_scans");
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
}

export async function addScan(scanData: Omit<Scan, "id" | "date">) {
  try {
    const list = await getRecentScans();
    
    // Check if duplicate scan (same teams analyzed recently)
    const exists = list.some(
      (s) => s.homeTeam === scanData.homeTeam && s.awayTeam === scanData.awayTeam
    );
    if (exists) return; // avoid duplicate stats

    const newScan: Scan = {
      ...scanData,
      id: Math.random().toString(36).substring(7),
      date: new Date().toISOString(),
    };
    const updated = [newScan, ...list].slice(0, 3); // keep last 3
    await AsyncStorage.setItem("@recent_scans", JSON.stringify(updated));

    // Update sets of unique teams and formations
    const teamsVal = await AsyncStorage.getItem("@scanned_teams");
    const teams = teamsVal ? (JSON.parse(teamsVal) as string[]) : [];
    if (!teams.includes(scanData.homeTeam)) teams.push(scanData.homeTeam);
    if (!teams.includes(scanData.awayTeam)) teams.push(scanData.awayTeam);
    await AsyncStorage.setItem("@scanned_teams", JSON.stringify(teams));

    if (scanData.formation) {
      const formationsVal = await AsyncStorage.getItem("@stored_formations");
      const formations = formationsVal ? (JSON.parse(formationsVal) as string[]) : [];
      if (!formations.includes(scanData.formation)) formations.push(scanData.formation);
      await AsyncStorage.setItem("@stored_formations", JSON.stringify(formations));
    }
  } catch (err) {
    console.error(err);
  }
}

export async function getEngineStats() {
  try {
    const teamsVal = await AsyncStorage.getItem("@scanned_teams");
    const teams = teamsVal ? (JSON.parse(teamsVal) as string[]) : [];
    
    const formationsVal = await AsyncStorage.getItem("@stored_formations");
    const formations = formationsVal ? (JSON.parse(formationsVal) as string[]) : [];

    const liveVal = await AsyncStorage.getItem("@live_matches_count");
    const liveMatches = liveVal ? parseInt(liveVal, 10) : 0;

    return {
      teamsScanned: teams.length,
      formationsStored: formations.length,
      liveMatches,
    };
  } catch {
    return { teamsScanned: 0, formationsStored: 0, liveMatches: 0 };
  }
}

export async function updateLiveMatchesCount(count: number) {
  try {
    await AsyncStorage.setItem("@live_matches_count", String(count));
  } catch (err) {
    console.error(err);
  }
}
