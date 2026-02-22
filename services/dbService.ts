
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc, 
  doc, 
  limit 
} from "firebase/firestore";
import { db } from "./firebase";
import { Quiz, AdminUser } from "../types";

const QUIZZES_COLLECTION = "quizzes";
const ADMINS_COLLECTION = "admins";

export async function saveQuizToFirestore(quiz: Quiz): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, QUIZZES_COLLECTION), quiz);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

export async function fetchQuizzesFromFirestore(): Promise<Quiz[]> {
  try {
    const q = query(collection(db, QUIZZES_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const quizzes: Quiz[] = [];
    querySnapshot.forEach((doc) => {
      quizzes.push({ id: doc.id, ...doc.data() } as Quiz);
    });
    return quizzes;
  } catch (e) {
    console.error("Error fetching documents: ", e);
    throw e;
  }
}

export async function deleteQuizFromFirestore(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, QUIZZES_COLLECTION, id));
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
}

// Admin Management
export async function fetchAdminsFromFirestore(): Promise<AdminUser[]> {
  try {
    const q = query(collection(db, ADMINS_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const admins: AdminUser[] = [];
    querySnapshot.forEach((doc) => {
      admins.push({ id: doc.id, ...doc.data() } as AdminUser);
    });
    return admins;
  } catch (e) {
    console.error("Error fetching admins: ", e);
    return [];
  }
}

export async function saveAdminToFirestore(admin: Omit<AdminUser, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, ADMINS_COLLECTION), admin);
    return docRef.id;
  } catch (e) {
    console.error("Error adding admin: ", e);
    throw e;
  }
}

export async function deleteAdminFromFirestore(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, ADMINS_COLLECTION, id));
  } catch (e) {
    console.error("Error deleting admin: ", e);
    throw e;
  }
}

export async function checkAdminByUsername(username: string): Promise<AdminUser | null> {
  try {
    // Also allow the hardcoded master admin
    if (username === 'Citadelcbt') {
      return {
        id: 'master',
        username: 'Citadelcbt',
        name: 'Academic Director',
        addedBy: 'system',
        createdAt: 0
      };
    }

    const q = query(collection(db, ADMINS_COLLECTION), orderBy("username"));
    const querySnapshot = await getDocs(q);
    let found: AdminUser | null = null;
    querySnapshot.forEach((doc) => {
      const data = doc.data() as AdminUser;
      if (data.username.toLowerCase() === username.toLowerCase()) {
        found = { id: doc.id, ...data };
      }
    });
    return found;
  } catch (e) {
    console.error("Error checking admin: ", e);
    return null;
  }
}
