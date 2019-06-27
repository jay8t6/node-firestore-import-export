import { ICollection } from '../interfaces/ICollection';
declare const importData: (data: any, startingRef: FirebaseFirestore.Firestore | FirebaseFirestore.CollectionReference | FirebaseFirestore.DocumentReference, mergeWithExisting?: boolean) => Promise<any>;
declare const setDocuments: (data: ICollection, startingRef: FirebaseFirestore.CollectionReference, mergeWithExisting?: boolean) => Promise<any>;
export default importData;
export { setDocuments };
