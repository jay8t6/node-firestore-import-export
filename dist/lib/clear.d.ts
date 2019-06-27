import DocumentReference = FirebaseFirestore.DocumentReference;
declare const clearData: (startingRef: FirebaseFirestore.Firestore | FirebaseFirestore.CollectionReference | DocumentReference) => Promise<object[]>;
export default clearData;
