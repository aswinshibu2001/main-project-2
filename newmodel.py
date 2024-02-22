import cv2
import torch
import numpy as np
from facenet_pytorch import MTCNN, InceptionResnetV1, extract_face
from PIL import Image
from firebase_admin import credentials, firestore, initialize_app

cred = credentials.Certificate("D:\Ajce\project\modeltest\prapth-dae1d-firebase-adminsdk-mevkq-3803db7a63.json")
initialize_app(cred)

# Initialize Firestore
db = firestore.client()

def prewhiten(x):
    mean = x.mean().item()
    std = x.std().item()
    std_adj = np.clip(std, a_min=1.0/(float(x.numel())**0.5), a_max=None)
    y = (x - mean) / std_adj
    return y

# Initialize MTCNN for face detection
mtcnn = MTCNN(keep_all=True, device='cpu')

# Initialize Inception Resnet V1 for face recognition
model = InceptionResnetV1(pretrained='vggface2').eval()

def compute_face_encoding(image_path):
    image = Image.open(image_path)

    # Perform face detection
    faces = mtcnn(image)

    # Check if a face is detected in the image
    if faces is not None and len(faces) > 0:
        # Encode the face
        face = prewhiten(faces[0])

        with torch.no_grad():
            face_encoding = model(face.unsqueeze(0))[0].numpy()

        return face_encoding
    else:
        print(f"No face detected in {image_path}")
        return None
    
def handle_form_submission(form_data):
    name = form_data.get('name')
    age = form_data.get('age')
    # Add other form fields as needed

    # Get the path of the uploaded image from the form data
    image_path = "path/to/uploaded/image.jpg"  # Replace with the actual path

    # Compute face encoding
    face_encoding = compute_face_encoding(image_path)

    if face_encoding:
        # Store the details along with the face encoding in Firestore
        db.collection('known_faces').doc(name).set({
            'name': name,
            'age': age,
            'face_encoding': face_encoding.tolist(),
            # Add other details as needed
        })
        print(f"Face encoding for {name} stored in Firestore.")
    else:
        print(f"Skipping storing face encoding for {name} due to no face detected.")

form_data = {
    'name': 'John Doe',
    'age': '30',
    # Add other form fields as needed
}

handle_form_submission(form_data)
