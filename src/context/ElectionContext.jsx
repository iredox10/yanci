import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { appwriteService, COLLECTION_ID_ELECTIONS, COLLECTION_ID_CANDIDATES, COLLECTION_ID_RESULTS, COLLECTION_ID_FACTCHECKS } from '../lib/appwrite';
import { ELECTION_INFO as SEED_ELECTION, CANDIDATES as SEED_CANDIDATES, FACT_CHECKS as SEED_FACTCHECKS, STATE_RESULTS as SEED_STATE_RESULTS } from '../data/electionData';

const ElectionContext = createContext();

const STORAGE_KEY_ELECTIONS = 'yanci_elections';
const STORAGE_KEY_CANDIDATES = 'yanci_candidates';
const STORAGE_KEY_RESULTS = 'yanci_results';
const STORAGE_KEY_FACTCHECKS = 'yanci_factchecks';

function isAppwriteConfigured() {
  return !!(COLLECTION_ID_ELECTIONS && COLLECTION_ID_CANDIDATES && COLLECTION_ID_RESULTS && COLLECTION_ID_FACTCHECKS);
}

function getLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function setLocal(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

/**
 * Seed Appwrite collections with default election data.
 * Only runs once when collections are empty.
 */
async function seedAppwrite() {
  const defaultElection = {
    name: SEED_ELECTION.name,
    fullName: SEED_ELECTION.fullName,
    date: SEED_ELECTION.date,
    type: SEED_ELECTION.type,
    status: 'active',
    electoralBody: SEED_ELECTION.electoralBody,
    description: '',
    image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200',
    published: true,
  };

  const election = await appwriteService.createElection(defaultElection);
  const electionId = election.$id;

  // Seed candidates
  const candidatePromises = SEED_CANDIDATES.map(c =>
    appwriteService.createCandidate({
      ...c,
      electionId,
      platform: Array.isArray(c.platform) ? c.platform.join('\n') : c.platform,
    })
  );
  await Promise.all(candidatePromises);

  // Seed fact checks
  const factCheckPromises = SEED_FACTCHECKS.map(f =>
    appwriteService.createFactCheck({ ...f, electionId })
  );
  await Promise.all(factCheckPromises);

  // Seed state results
  const resultPromises = SEED_STATE_RESULTS.map(sr =>
    appwriteService.createResult({
      electionId,
      state: sr.state,
      region: sr.region,
      registeredVoters: sr.registeredVoters,
      accreditedVoters: sr.accreditedVoters,
      validVotes: sr.validVotes,
      rejectedVotes: sr.rejectedVotes,
      totalVotesCast: sr.totalVotesCast,
      candidateVotes: JSON.stringify(sr.candidateVotes || {}),
      met25Threshold: JSON.stringify(sr.met25Threshold || []),
      winner: sr.winner || null,
      governor: sr.governor || null,
      senate: JSON.stringify(sr.senate || {}),
    })
  );
  await Promise.all(resultPromises);

  return electionId;
}

/**
 * Deserialize JSON string fields from Appwrite documents.
 */
function deserializeResult(doc) {
  return {
    ...doc,
    candidateVotes: typeof doc.candidateVotes === 'string' ? JSON.parse(doc.candidateVotes) : doc.candidateVotes || {},
    met25Threshold: typeof doc.met25Threshold === 'string' ? JSON.parse(doc.met25Threshold) : doc.met25Threshold || [],
    senate: typeof doc.senate === 'string' ? JSON.parse(doc.senate) : doc.senate || {},
  };
}

export function ElectionProvider({ children }) {
  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [results, setResults] = useState([]);
  const [factChecks, setFactChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (isAppwriteConfigured()) {
        try {
          const [e, c, r, f] = await Promise.all([
            appwriteService.getElections(),
            appwriteService.getCandidates(),
            appwriteService.getResults(),
            appwriteService.getFactChecks(),
          ]);

          if (cancelled) return;

          // If no elections exist, seed the data
          if (e.length === 0) {
            await seedAppwrite();
            // Re-fetch after seeding
            const [e2, c2, r2, f2] = await Promise.all([
              appwriteService.getElections(),
              appwriteService.getCandidates(),
              appwriteService.getResults(),
              appwriteService.getFactChecks(),
            ]);
            setElections(e2);
            setCandidates(c2);
            setResults(r2.map(deserializeResult));
            setFactChecks(f2);
            setSeeded(true);
          } else {
            setElections(e);
            setCandidates(c);
            setResults(r.map(deserializeResult));
            setFactChecks(f);
          }
        } catch (err) {
          console.error('Appwrite init failed, falling back to localStorage:', err);
          loadSeed();
        }
      } else {
        loadSeed();
      }
      setLoading(false);
    };

    init();
    return () => { cancelled = true; };
  }, []);

  function loadSeed() {
    const defaultElection = {
      ...SEED_ELECTION,
      id: 'election-2027',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200',
    };
    setElections([defaultElection]);
    setCandidates(SEED_CANDIDATES.map(c => ({ ...c, electionId: 'election-2027' })));
    setResults([]);
    setFactChecks(SEED_FACTCHECKS.map(f => ({ ...f, electionId: 'election-2027' })));
    setLocal(STORAGE_KEY_ELECTIONS, [defaultElection]);
    setLocal(STORAGE_KEY_CANDIDATES, SEED_CANDIDATES);
    setLocal(STORAGE_KEY_RESULTS, []);
    setLocal(STORAGE_KEY_FACTCHECKS, SEED_FACTCHECKS);
  }

  // ─── Elections ─────────────────────────────────────────────────────────────
  const addElection = useCallback(async (election) => {
    if (isAppwriteConfigured()) {
      const doc = await appwriteService.createElection(election);
      setElections(prev => [doc, ...prev]);
      return doc;
    }
    const newElection = { ...election, id: `election-${Date.now()}` };
    const updated = [newElection, ...elections];
    setElections(updated);
    setLocal(STORAGE_KEY_ELECTIONS, updated);
    return newElection;
  }, [elections]);

  const updateElection = useCallback(async (id, data) => {
    if (isAppwriteConfigured()) {
      const doc = await appwriteService.updateElection(id, data);
      setElections(prev => prev.map(e => e.id === id ? doc : e));
      return doc;
    }
    const updated = elections.map(e => e.id === id ? { ...e, ...data } : e);
    setElections(updated);
    setLocal(STORAGE_KEY_ELECTIONS, updated);
    return updated.find(e => e.id === id);
  }, [elections]);

  const deleteElection = useCallback(async (id) => {
    if (isAppwriteConfigured()) {
      await appwriteService.deleteElection(id);
    }
    setElections(prev => prev.filter(e => e.id !== id));
    setLocal(STORAGE_KEY_ELECTIONS, elections.filter(e => e.id !== id));
  }, [elections]);

  // ─── Candidates ────────────────────────────────────────────────────────────
  const addCandidate = useCallback(async (candidate) => {
    if (isAppwriteConfigured()) {
      const doc = await appwriteService.createCandidate(candidate);
      setCandidates(prev => [doc, ...prev]);
      return doc;
    }
    const newCandidate = { ...candidate, id: `c-${Date.now()}` };
    const updated = [newCandidate, ...candidates];
    setCandidates(updated);
    setLocal(STORAGE_KEY_CANDIDATES, updated);
    return newCandidate;
  }, [candidates]);

  const updateCandidate = useCallback(async (id, data) => {
    if (isAppwriteConfigured()) {
      const doc = await appwriteService.updateCandidate(id, data);
      setCandidates(prev => prev.map(c => c.id === id ? doc : c));
      return doc;
    }
    const updated = candidates.map(c => c.id === id ? { ...c, ...data } : c);
    setCandidates(updated);
    setLocal(STORAGE_KEY_CANDIDATES, updated);
    return updated.find(c => c.id === id);
  }, [candidates]);

  const deleteCandidate = useCallback(async (id) => {
    if (isAppwriteConfigured()) {
      await appwriteService.deleteCandidate(id);
    }
    setCandidates(prev => prev.filter(c => c.id !== id));
    setLocal(STORAGE_KEY_CANDIDATES, candidates.filter(c => c.id !== id));
  }, [candidates]);

  // ─── Results ───────────────────────────────────────────────────────────────
  const addResult = useCallback(async (result) => {
    if (isAppwriteConfigured()) {
      const doc = await appwriteService.createResult({
        ...result,
        candidateVotes: typeof result.candidateVotes === 'object' ? JSON.stringify(result.candidateVotes) : result.candidateVotes,
        met25Threshold: typeof result.met25Threshold === 'object' ? JSON.stringify(result.met25Threshold) : result.met25Threshold,
        senate: typeof result.senate === 'object' ? JSON.stringify(result.senate) : result.senate,
      });
      const deserialized = deserializeResult(doc);
      setResults(prev => [deserialized, ...prev]);
      return deserialized;
    }
    const newResult = { ...result, id: `r-${Date.now()}` };
    const updated = [newResult, ...results];
    setResults(updated);
    setLocal(STORAGE_KEY_RESULTS, updated);
    return newResult;
  }, [results]);

  const updateResult = useCallback(async (id, data) => {
    if (isAppwriteConfigured()) {
      const serialized = {
        ...data,
        candidateVotes: typeof data.candidateVotes === 'object' ? JSON.stringify(data.candidateVotes) : data.candidateVotes,
        met25Threshold: typeof data.met25Threshold === 'object' ? JSON.stringify(data.met25Threshold) : data.met25Threshold,
        senate: typeof data.senate === 'object' ? JSON.stringify(data.senate) : data.senate,
      };
      const doc = await appwriteService.updateResult(id, serialized);
      const deserialized = deserializeResult(doc);
      setResults(prev => prev.map(r => r.id === id ? deserialized : r));
      return deserialized;
    }
    const updated = results.map(r => r.id === id ? { ...r, ...data } : r);
    setResults(updated);
    setLocal(STORAGE_KEY_RESULTS, updated);
    return updated.find(r => r.id === id);
  }, [results]);

  const deleteResult = useCallback(async (id) => {
    if (isAppwriteConfigured()) {
      await appwriteService.deleteResult(id);
    }
    setResults(prev => prev.filter(r => r.id !== id));
    setLocal(STORAGE_KEY_RESULTS, results.filter(r => r.id !== id));
  }, [results]);

  const bulkUpdateResults = useCallback(async (newResults) => {
    if (isAppwriteConfigured()) {
      await appwriteService.bulkCreateResults(newResults.map(r => ({
        ...r,
        candidateVotes: typeof r.candidateVotes === 'object' ? JSON.stringify(r.candidateVotes) : r.candidateVotes,
        met25Threshold: typeof r.met25Threshold === 'object' ? JSON.stringify(r.met25Threshold) : r.met25Threshold,
        senate: typeof r.senate === 'object' ? JSON.stringify(r.senate) : r.senate,
      })));
    }
    setResults(prev => {
      const existing = prev.filter(r => !newResults.find(nr => nr.id === r.id));
      const updated = [...existing, ...newResults];
      setLocal(STORAGE_KEY_RESULTS, updated);
      return updated;
    });
  }, [results]);

  // ─── Fact-Checks ───────────────────────────────────────────────────────────
  const addFactCheck = useCallback(async (factCheck) => {
    if (isAppwriteConfigured()) {
      const doc = await appwriteService.createFactCheck(factCheck);
      setFactChecks(prev => [doc, ...prev]);
      return doc;
    }
    const newFactCheck = { ...factCheck, id: `fc-${Date.now()}` };
    const updated = [newFactCheck, ...factChecks];
    setFactChecks(updated);
    setLocal(STORAGE_KEY_FACTCHECKS, updated);
    return newFactCheck;
  }, [factChecks]);

  const updateFactCheck = useCallback(async (id, data) => {
    if (isAppwriteConfigured()) {
      const doc = await appwriteService.updateFactCheck(id, data);
      setFactChecks(prev => prev.map(f => f.id === id ? doc : f));
      return doc;
    }
    const updated = factChecks.map(f => f.id === id ? { ...f, ...data } : f);
    setFactChecks(updated);
    setLocal(STORAGE_KEY_FACTCHECKS, updated);
    return updated.find(f => f.id === id);
  }, [factChecks]);

  const deleteFactCheck = useCallback(async (id) => {
    if (isAppwriteConfigured()) {
      await appwriteService.deleteFactCheck(id);
    }
    setFactChecks(prev => prev.filter(f => f.id !== id));
    setLocal(STORAGE_KEY_FACTCHECKS, factChecks.filter(f => f.id !== id));
  }, [factChecks]);

  return (
    <ElectionContext.Provider value={{
      elections, candidates, results, factChecks, loading, seeded,
      addElection, updateElection, deleteElection,
      addCandidate, updateCandidate, deleteCandidate,
      addResult, updateResult, deleteResult, bulkUpdateResults,
      addFactCheck, updateFactCheck, deleteFactCheck,
    }}>
      {children}
    </ElectionContext.Provider>
  );
}

export function useElection() {
  const ctx = useContext(ElectionContext);
  if (!ctx) throw new Error('useElection must be used within ElectionProvider');
  return ctx;
}

export default ElectionContext;
