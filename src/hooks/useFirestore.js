// src/hooks/useFirestore.js
import { useState, useEffect } from 'react';
import {
  collection, doc, onSnapshot,
  query, orderBy, where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * useCollection — real-time listener on a Firestore collection
 * @param {string} collectionName
 * @param {Array}  constraints — array of Firestore query constraints (where, orderBy, etc.)
 */
export function useCollection(collectionName, constraints = []) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!collectionName) return;
    const ref = collection(db, collectionName);
    const q   = constraints.length ? query(ref, ...constraints) : query(ref);

    const unsub = onSnapshot(
      q,
      snap => {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setData(docs);
        setLoading(false);
      },
      err => {
        console.error(`useCollection [${collectionName}]:`, err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsub;
  }, [collectionName]);

  return { data, loading, error };
}

/**
 * useDocument — real-time listener on a single Firestore document
 * @param {string} collectionName
 * @param {string} docId
 */
export function useDocument(collectionName, docId) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!collectionName || !docId) return;
    const ref = doc(db, collectionName, docId);

    const unsub = onSnapshot(
      ref,
      snap => {
        if (snap.exists()) {
          setData({ id: snap.id, ...snap.data() });
        } else {
          setData(null);
        }
        setLoading(false);
      },
      err => {
        console.error(`useDocument [${collectionName}/${docId}]:`, err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsub;
  }, [collectionName, docId]);

  return { data, loading, error };
}

export { orderBy, where };
