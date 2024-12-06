from flask import jsonify, request
from torchvision import models, transforms
from PIL import Image
import torch
import os
def upload():
    try:
        print(request.files.items())
        if 'file' not in request.files:
            raise Exception("No file part")
        
        file = request.files['file']
        if file.filename == '':
            raise Exception("No selected file")
        
        #check file type 
        print(file)
        
        #get the prediction from model by passing in the file images
        model_path = "./resnet152.pth"  # Path to your saved model
        class_names = ['Chihuahua', 'Japanese_spaniel', 'Maltese_dog', 'Pekinese', 'Shih-Tzu', 'Blenheim_spaniel', 'papillon', 'toy_terrier', 'Rhodesian_ridgeback', 'Afghan_hound', 'basset', 'beagle', 'bloodhound', 'bluetick', 'black-and-tan_coonhound', 'Walker_hound', 'English_foxhound', 'redbone', 'borzoi', 'Irish_wolfhound', 'Italian_greyhound', 'whippet', 'Ibizan_hound', 'Norwegian_elkhound', 'otterhound', 'Saluki', 'Scottish_deerhound', 'Weimaraner', 'Staffordshire_bullterrier', 'American_Staffordshire_terrier', 'Bedlington_terrier', 'Border_terrier', 'Kerry_blue_terrier', 'Irish_terrier', 'Norfolk_terrier', 'Norwich_terrier', 'Yorkshire_terrier', 'wire-haired_fox_terrier', 'Lakeland_terrier', 'Sealyham_terrier', 'Airedale', 'cairn', 'Australian_terrier', 'Dandie_Dinmont', 'Boston_bull', 'miniature_schnauzer', 'giant_schnauzer', 'standard_schnauzer', 'Scotch_terrier', 'Tibetan_terrier', 'silky_terrier', 'soft-coated_wheaten_terrier', 'West_Highland_white_terrier', 'Lhasa', 'flat-coated_retriever', 'curly-coated_retriever', 'golden_retriever', 'Labrador_retriever', 'Chesapeake_Bay_retriever', 'German_short-haired_pointer', 'vizsla', 'English_setter', 'Irish_setter', 'Gordon_setter', 'Brittany_spaniel', 'clumber', 'English_springer', 'Welsh_springer_spaniel', 'cocker_spaniel', 'Sussex_spaniel', 'Irish_water_spaniel', 'kuvasz', 'schipperke', 'groenendael', 'malinois', 'briard', 'kelpie', 'komondor', 'Old_English_sheepdog', 'Shetland_sheepdog', 'collie', 'Border_collie', 'Bouvier_des_Flandres', 'Rottweiler', 'German_shepherd', 'Doberman', 'miniature_pinscher', 'Greater_Swiss_Mountain_dog', 'Bernese_mountain_dog', 'Appenzeller', 'EntleBucher', 'boxer', 'bull_mastiff', 'Tibetan_mastiff', 'French_bulldog', 'Great_Dane', 'Saint_Bernard', 'Eskimo_dog', 'malamute', 'Siberian_husky', 'affenpinscher', 'basenji', 'pug', 'Leonberg', 'Newfoundland', 'Great_Pyrenees', 'Samoyed', 'Pomeranian', 'chow', 'keeshond', 'Brabancon_griffon', 'Pembroke', 'Cardigan', 'toy_poodle', 'miniature_poodle', 'standard_poodle', 'Mexican_hairless', 'dingo', 'dhole', 'African_hunting_dog']  # List of class names
        mean = [0.485, 0.456, 0.406]
        std = [0.229, 0.224, 0.225]
        dropout_ratio = 0.9

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

        def transform_image(file, mean, std):
            transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=torch.Tensor(mean), std=torch.Tensor(std)),
            ])
            image = Image.open(file.stream).convert('RGB')
            return transform(image).unsqueeze(0)

        def predict_breed(model, image_tensor, class_names):
            with torch.no_grad():
                outputs = model(image_tensor)
                _, predicted = outputs.max(1)
                return class_names[predicted.item()]
            
        model = load_model(model_path, num_classes=len(class_names), dropout_ratio=dropout_ratio)

        # Transform image
        image_tensor = transform_image(file, mean, std)

        # Predict
        breed = predict_breed(model, image_tensor, class_names)
        
        #breed dictionary
        dog_info = {
    "Chihuahua": "A tiny, energetic breed known for its big personality and loyalty to its owner.",
    "Japanese_spaniel": "A toy breed with a distinctively elegant appearance, often seen as a companion dog.",
    "Maltese_dog": "A small breed with long, silky white hair, known for being affectionate and gentle.",
    "Pekinese": "A compact toy breed with a lion-like mane, known for its regal demeanor and loyalty.",
    "Shih-Tzu": "A sturdy toy breed with a luxurious coat, often friendly and affectionate.",
    "Blenheim_spaniel": "A variety of Cavalier King Charles Spaniel with a distinct red-and-white coat.",
    "papillon": "A small, friendly breed with distinctive butterfly-like ears.",
    "toy_terrier": "A tiny terrier breed, spirited and lively, with a smooth coat.",
    "Rhodesian_ridgeback": "A large and muscular hound breed known for its distinctive ridge of hair along its back.",
    "Afghan_hound": "A sighthound with a long, silky coat and a reputation for elegance and speed.",
    "basset": "A low-to-the-ground hound with a keen sense of smell and a gentle disposition.",
    "beagle": "A small-to-medium hound breed known for its friendly nature and excellent tracking ability.",
    "bloodhound": "A large scent hound famous for its exceptional tracking skills and loose, wrinkled skin.",
    "bluetick": "A coonhound breed with a distinctive bluish mottled coat and excellent hunting ability.",
    "black-and-tan_coonhound": "A coonhound breed with a sleek black coat and tan markings, skilled in tracking.",
    "Walker_hound": "A coonhound breed known for its speed and stamina, often used for hunting.",
    "English_foxhound": "A traditional British hunting hound with stamina and a friendly temperament.",
    "redbone": "A coonhound breed with a striking red coat, known for its versatility and hunting skills.",
    "borzoi": "A large, graceful sighthound breed with a silky coat, originally bred for hunting wolves.",
    "Irish_wolfhound": "One of the tallest dog breeds, known for its gentle giant nature and history as a wolf hunter.",
    "Italian_greyhound": "A small, sleek sighthound known for its speed and affectionate nature.",
    "whippet": "A medium-sized sighthound with a slim build, known for its speed and gentle demeanor.",
    "Ibizan_hound": "A lean and agile sighthound with erect ears, originally bred for hunting rabbits.",
    "Norwegian_elkhound": "A sturdy spitz-type dog, historically used for hunting elk and other large game.",
    "otterhound": "A rare breed with a shaggy coat, known for its swimming ability and friendly nature.",
    "Saluki": "An ancient sighthound breed, valued for its speed and grace.",
    "Scottish_deerhound": "A large sighthound breed, originally bred to hunt deer, known for its gentle demeanor.",
    "Weimaraner": "A sleek, athletic breed with a distinctive silver-gray coat, known for its intelligence and energy.",
    "Staffordshire_bullterrier": "A muscular and affectionate breed, often called the 'nanny dog' for its love of children.",
    "American_Staffordshire_terrier": "A strong and loyal breed, known for its courage and friendly nature.",
    "Bedlington_terrier": "A unique-looking terrier with a lamb-like appearance and a lively personality.",
    "Border_terrier": "A small, scrappy terrier breed, known for its working ability and friendly disposition.",
    "Kerry_blue_terrier": "A medium-sized terrier with a distinctive blue-gray coat, known for its versatility.",
    "Irish_terrier": "A fiery and spirited terrier breed, known for its courage and loyalty.",
    "Norfolk_terrier": "A small and hardy terrier breed, known for its affectionate and outgoing personality.",
    "Norwich_terrier": "A tiny, confident terrier breed, often friendly and curious.",
    "Yorkshire_terrier": "A toy-sized terrier with a long, silky coat, known for its spunky nature.",
    "wire-haired_fox_terrier": "A terrier breed with a wiry coat, known for its energy and intelligence.",
    "Lakeland_terrier": "A small, confident terrier breed, originally bred for hunting vermin.",
    "Sealyham_terrier": "A rare terrier breed with a distinct white coat, known for its calm demeanor.",
    "Airedale": "The largest of the terrier breeds, known for its intelligence and versatility.",
    "cairn": "A small, hardy terrier breed, known for its curious and lively nature.",
    "Australian_terrier": "A small terrier breed with a wiry coat, known for its confidence and loyalty.",
    "Dandie_Dinmont": "A unique terrier breed with a distinctive topknot of hair and a friendly personality.",
    "Boston_bull": "A small, sturdy breed, also known as the Boston Terrier, known for its tuxedo-like markings.",
    "miniature_schnauzer": "A small, intelligent terrier-like breed, known for its distinctive beard and eyebrows.",
    "giant_schnauzer": "A large working breed, known for its loyalty and protective nature.",
    "standard_schnauzer": "A medium-sized breed with a wiry coat, known for its versatility and intelligence.",
    "Scotch_terrier": "Better known as the Scottish Terrier, a small and dignified breed with a wiry coat.",
    "Tibetan_terrier": "A medium-sized breed with a long, shaggy coat, known for its adaptability and affectionate nature.",
    "silky_terrier": "A small, silky-coated terrier breed, known for its elegance and lively personality.",
    "soft-coated_wheaten_terrier": "A medium-sized terrier with a soft, wavy coat, known for its cheerful nature.",
    "West_Highland_white_terrier": "A small, white terrier breed, known for its friendly and spirited nature.",
    "Lhasa": "Short for Lhasa Apso, a small breed with a long, flowing coat, known for its watchful nature.",
    "flat-coated_retriever": "A medium-to-large retriever breed with a glossy black or liver coat, known for its cheerful demeanor.",
    "curly-coated_retriever": "A large retriever breed with a distinctive curly coat, known for its hunting skills.",
    "golden_retriever": "A popular, friendly breed with a golden coat, known for its intelligence and trainability.",
    "Labrador_retriever": "The most popular dog breed, known for its friendly nature and versatility.",
    "Chesapeake_Bay_retriever": "A rugged retriever breed, known for its water-resistant coat and love of water.",
    "German_short-haired_pointer": "A versatile hunting breed with a sleek coat and a high energy level.",
    "vizsla": "A medium-sized, sleek hunting breed with a friendly and affectionate nature.",
    "English_setter": "A medium-to-large breed with a speckled coat, known for its hunting ability and friendly nature.",
    "Irish_setter": "A large, elegant breed with a striking red coat, known for its playful and friendly nature.",
    "Gordon_setter": "A large setter breed with a black-and-tan coat, known for its loyalty and hunting ability.",
    "Brittany_spaniel": "A medium-sized, agile breed, known for its hunting ability and friendly demeanor.",
    "clumber": "Short for Clumber Spaniel, a large and sturdy spaniel breed, known for its gentle nature.",
    "English_springer": "Short for English Springer Spaniel, a versatile breed known for its hunting skills and friendly personality.",
    "Welsh_springer_spaniel": "A medium-sized spaniel breed with a red-and-white coat, known for its friendly nature.",
    "cocker_spaniel": "A medium-sized breed with a silky coat, known for its cheerful and affectionate demeanor.",
    "Sussex_spaniel": "A low-to-the-ground spaniel breed, known for its golden liver coat and friendly nature.",
    "Irish_water_spaniel": "A large spaniel breed with a distinctive curly coat and a love of water.",
    "kuvasz": "A large, white guard dog breed, known for its courage and loyalty.",
    "schipperke": "A small, black spitz-type breed, known for its fox-like face and lively personality.",
    "groenendael": "A variety of the Belgian Shepherd, known for its black coat and intelligence.",
    "malinois": "A variety of the Belgian Shepherd, known for its versatility and working ability.",
    "briard": "A large, shaggy-coated herding breed, known for its loyalty and intelligence.",
    "kelpie": "An Australian herding breed, known for its high energy and intelligence.",
    "komondor": "A large breed with a distinctive corded coat, known for its protective nature.",
    "Old_English_sheepdog": "A large, shaggy herding breed, known for its gentle and friendly nature.",
    "Shetland_sheepdog": "A small herding breed, known for its intelligence and agility.",
    "collie": "A medium-to-large herding breed, known for its elegance and loyalty.",
    "Border_collie": "A highly intelligent and energetic herding breed, known for its trainability.",
    "Bouvier_des_Flandres": "A large, sturdy herding breed, known for its strength and gentle demeanor.",
    "Rottweiler": "A large working breed, known for its protective nature and loyalty.",
    "German_shepherd": "A versatile and intelligent working breed, known for its loyalty and courage.",
    "Doberman": "A large, sleek working breed, known for its intelligence and protective nature.",
    "miniature_pinscher": "A tiny, lively breed with a sleek coat, often called the 'King of Toys'.",
    "Greater_Swiss_Mountain_dog": "A large, sturdy working breed, known for its strength and gentle nature.",
    "Bernese_mountain_dog": "A large, tricolored working breed, known for its friendly and affectionate demeanor.",
    "Appenzeller": "A medium-sized Swiss working breed, known for its agility and versatility.",
    "EntleBucher": "The smallest of the Swiss Mountain Dogs, known for its agility and friendly personality.",
    "boxer": "A medium-to-large breed with a muscular build, known for its playful and protective nature.",
    "bull_mastiff": "A large, muscular breed, known for its protective instincts and calm demeanor.",
    "Tibetan_mastiff": "A giant, fluffy breed, known for its protective nature and independent spirit.",
    "French_bulldog": "A small, muscular breed with a distinctive bat-like ear shape, known for its affectionate nature.",
    "Great_Dane": "One of the largest dog breeds, known for its gentle giant personality.",
    "Saint_Bernard": "A giant working breed, known for its rescue ability and gentle nature.",
    "Eskimo_dog": "A large, fluffy sled dog breed, known for its endurance and friendly demeanor.",
    "malamute": "A large sled dog breed, known for its strength and loyalty.",
    "Siberian_husky": "A medium-sized sled dog breed, known for its striking eyes and high energy.",
    "affenpinscher": "A small, monkey-like dog with a playful and curious nature.",
    "basenji": "A small African hunting dog, known for its yodel-like bark.",
    "pug": "A small, wrinkly dog with a big personality.",
    "Leonberg": "A giant, friendly breed with a lion-like appearance.",
    "Newfoundland": "A massive and gentle dog, excellent in water rescue.",
    "Great_Pyrenees": "A large and fluffy livestock guardian dog with a calm nature.",
    "Samoyed": "A fluffy white dog with a characteristic 'Sammy smile'.",
    "Pomeranian": "A tiny and fluffy dog, full of energy and charm.",
    "chow": "A fluffy, lion-like dog with a blue-black tongue.",
    "keeshond": "A medium-sized spitz breed, known for its friendly and outgoing nature.",
    "Brabancon_griffon": "A small and expressive dog, often compared to a monkey.",
    "Pembroke": "A small herding dog, also known as the Pembroke Welsh Corgi.",
    "Cardigan": "A corgi breed with a tail, known for its herding abilities.",
    "toy_poodle": "A tiny, intelligent dog with a curly coat.",
    "miniature_poodle": "A medium-sized poodle, known for its intelligence and agility.",
    "standard_poodle": "A large and elegant breed, known for its intelligence and versatility.",
    "Mexican_hairless": "A unique hairless breed, also known as the Xoloitzcuintli.",
    "dingo": "A wild dog native to Australia, known for its independence.",
    "dhole": "An Asian wild dog, known for its pack behavior and unique vocalizations.",
    "African_hunting_dog": "A highly social and efficient pack hunter, also known as the painted dog."
        }
    # get the breed info
        breed_info = dog_info[breed]
        return jsonify({
            "success": True,
            "message": "File uploaded successfully",
            "data": {
                     "breed": breed.replace('_', ' '),
                     "breed_info": breed_info.replace('_', ' ')
                    }
        }), 200
    except Exception as e:
        print(e)
        return jsonify({
            "success": False,
            "message": "An error occurred",
            "error": str(e)
        }), 400
