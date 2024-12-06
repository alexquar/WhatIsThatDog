import torch
from torchvision import models, transforms
from PIL import Image
import os

# 1. Load the model
def load_model(model_path, num_classes, dropout_ratio):
    model = models.resnet152(pretrained=False)
    num_ftrs = model.fc.in_features
    model.fc = torch.nn.Sequential(
        torch.nn.Linear(num_ftrs, 256),
        torch.nn.ReLU(),
        torch.nn.Dropout(p=dropout_ratio),
        torch.nn.Linear(256, num_classes)
    )
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    model.eval()
    return model

# 2. Define transformations (match those used during training)
def transform_image(image_path, mean, std):
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=torch.Tensor(mean), std=torch.Tensor(std)),
    ])
    image = Image.open(image_path).convert('RGB')
    return transform(image).unsqueeze(0)

# 3. Predict function
def predict_breed(model, image_tensor, class_names):
    with torch.no_grad():
        outputs = model(image_tensor)
        _, predicted = outputs.max(1)
    return class_names[predicted.item()]

# Main
if __name__ == "__main__":
    # Paths and settings
    model_path = "models/resnet152.pth"  # Path to your saved model
    image_path = "./golden.jpg"  # Path to the image you want to classify
    class_names = ['Chihuahua', 'Japanese_spaniel', 'Maltese_dog', 'Pekinese', 'Shih-Tzu', 'Blenheim_spaniel', 'papillon', 'toy_terrier', 'Rhodesian_ridgeback', 'Afghan_hound', 'basset', 'beagle', 'bloodhound', 'bluetick', 'black-and-tan_coonhound', 'Walker_hound', 'English_foxhound', 'redbone', 'borzoi', 'Irish_wolfhound', 'Italian_greyhound', 'whippet', 'Ibizan_hound', 'Norwegian_elkhound', 'otterhound', 'Saluki', 'Scottish_deerhound', 'Weimaraner', 'Staffordshire_bullterrier', 'American_Staffordshire_terrier', 'Bedlington_terrier', 'Border_terrier', 'Kerry_blue_terrier', 'Irish_terrier', 'Norfolk_terrier', 'Norwich_terrier', 'Yorkshire_terrier', 'wire-haired_fox_terrier', 'Lakeland_terrier', 'Sealyham_terrier', 'Airedale', 'cairn', 'Australian_terrier', 'Dandie_Dinmont', 'Boston_bull', 'miniature_schnauzer', 'giant_schnauzer', 'standard_schnauzer', 'Scotch_terrier', 'Tibetan_terrier', 'silky_terrier', 'soft-coated_wheaten_terrier', 'West_Highland_white_terrier', 'Lhasa', 'flat-coated_retriever', 'curly-coated_retriever', 'golden_retriever', 'Labrador_retriever', 'Chesapeake_Bay_retriever', 'German_short-haired_pointer', 'vizsla', 'English_setter', 'Irish_setter', 'Gordon_setter', 'Brittany_spaniel', 'clumber', 'English_springer', 'Welsh_springer_spaniel', 'cocker_spaniel', 'Sussex_spaniel', 'Irish_water_spaniel', 'kuvasz', 'schipperke', 'groenendael', 'malinois', 'briard', 'kelpie', 'komondor', 'Old_English_sheepdog', 'Shetland_sheepdog', 'collie', 'Border_collie', 'Bouvier_des_Flandres', 'Rottweiler', 'German_shepherd', 'Doberman', 'miniature_pinscher', 'Greater_Swiss_Mountain_dog', 'Bernese_mountain_dog', 'Appenzeller', 'EntleBucher', 'boxer', 'bull_mastiff', 'Tibetan_mastiff', 'French_bulldog', 'Great_Dane', 'Saint_Bernard', 'Eskimo_dog', 'malamute', 'Siberian_husky', 'affenpinscher', 'basenji', 'pug', 'Leonberg', 'Newfoundland', 'Great_Pyrenees', 'Samoyed', 'Pomeranian', 'chow', 'keeshond', 'Brabancon_griffon', 'Pembroke', 'Cardigan', 'toy_poodle', 'miniature_poodle', 'standard_poodle', 'Mexican_hairless', 'dingo', 'dhole', 'African_hunting_dog']  # List of class names
    mean = [0.485, 0.456, 0.406]
    std = [0.229, 0.224, 0.225]
    dropout_ratio = 0.9

    # Load model
    model = load_model(model_path, num_classes=len(class_names), dropout_ratio=dropout_ratio)

    # Transform image
    image_tensor = transform_image(image_path, mean, std)

    # Predict
    breed = predict_breed(model, image_tensor, class_names)
    print(f"The predicted dog breed is: {breed.replace('_', ' ')}")