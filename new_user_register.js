import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getFirestore, collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";


    // Your Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyCzjAdpOcwGcZjTmc8lIu1g5o_bzuIbVyc",
        authDomain: "prapth-dae1d.firebaseapp.com",
        projectId: "prapth-dae1d",
        storageBucket: "prapth-dae1d.appspot.com",
        messagingSenderId: "406083203416",
        appId: "1:406083203416:web:905092c7215732cab8352d",
        measurementId: "G-TZ3NX9RGYM"
    };
  
  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Reference to Firestore database
const db = getFirestore(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('new-user');

    registrationForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = registrationForm.elements.name.value;
        const email = registrationForm.elements.email.value;
        const password = registrationForm.elements.password.value;

        // Create user in Firebase Authentication
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // User registered successfully, now store additional details in Firestore
                const userId = userCredential.user.uid;

                setDoc(doc(collection(db, 'users'), userId), {
                    name: name,
                    email: email
                    // You can add more fields as needed
                })
                .then(() => {
                    console.log("User details added to Firestore");
                    alert("Registration successful!");
                })
                .catch((error) => {
                    console.error("Error adding user details to Firestore: ", error);
                    alert("Error registering user. Please check console for details.");
                });
            })
            .catch((error) => {
                console.error("Error creating user: ", error);
                alert("Error creating user. Please check console for details.");
            });
    });
});