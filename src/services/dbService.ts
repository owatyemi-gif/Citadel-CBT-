
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
import { db } from "@/services/firebase.ts";
import { Quiz } from "@/types.ts";

const QUIZZES_COLLECTION = "quizzes";

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
