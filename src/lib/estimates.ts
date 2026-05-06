import { collection, addDoc, getDocs, query, where, documentId, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from './firebase';

export async function saveEstimate(name: string, payload: any) {
  if (!auth.currentUser) throw new Error("User not authenticated");
  try {
    const estimatesRef = collection(db, 'estimates');
    await addDoc(estimatesRef, {
      userId: auth.currentUser.uid,
      name,
      type: 'material_calculation',
      payload,
      createdAt: Date.now()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'estimates');
  }
}

export async function getMyEstimates() {
  if (!auth.currentUser) throw new Error("User not authenticated");
  try {
    const q = query(collection(db, 'estimates'), where('userId', '==', auth.currentUser.uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'estimates');
  }
}
