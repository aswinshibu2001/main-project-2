import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";


    // Initialize Firebase with your config
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
    const db = getFirestore(app);
    const auth = getAuth(app);
    const storage = getStorage(app);

    document.addEventListener('DOMContentLoaded', function () {
        const form = document.getElementById('missingPersonForm');

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Retrieve form data
            const name = form.elements.name.value;
            const age = form.elements.age.value;
            const address= form.elements.address.value;
            const  place= form.elements.place.value;
            const days=form.elements.days.value;
            const  email= form.elements.email.value;
            const contact= form.elements.contact.value;
            const details= form.elements.details.value;
            // Add other form fields as needed

            // Retrieve file input
            const fileInput = form.elements.photos;

            // Check if a file is selected
            if (fileInput.files.length > 0) {
                const imageFile = fileInput.files[0];

                // Upload image to Firebase Storage
                const storageRef = firebase.storage().ref(`images/${name}_${Date.now()}`);
                const uploadTask = storageRef.put(imageFile);

                // Handle successful image upload
                uploadTask.then(snapshot => {
                    // Get download URL of the uploaded image
                    return snapshot.ref.getDownloadURL();
                }).then(downloadURL => {
                    // Compute face encoding
                    // (You need to replace the function below with the actual logic for computing face encodings)
                    const faceEncoding = computeFaceEncoding(downloadURL);

                    // Store details in Firestore
                    firebase.firestore().collection('known_faces').doc(name).set({
                        'name': name,
                        'age': age,
                        'face_encoding': faceEncoding,
                        'image_url': downloadURL,
                        // Add other details as needed
                    });

                    console.log(`Details for ${name} stored in Firestore.`);
                }).catch(error => {
                    console.error('Error uploading image: ', error);
                });
            } else {
                console.error('No file selected.');
            }
        });

        // Function to compute face encoding (Replace this with your actual face recognition code)
        function computeFaceEncoding(imageURL) {
            // Add your face recognition logic here
            // This function should return the computed face encoding
            // ...
            return 'dummy_face_encoding';
        }
    });
