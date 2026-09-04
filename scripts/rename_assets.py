import os

images_dir = r"D:\Company Work\Company projects\UjjainTirth\assets\images"

rename_map = {
    "9c1fe3c41740d02bf0e539e25fd03106-removebg-preview.png": "splash_trishul.png",
    "51AB0KMRZPL._AC_UF894_1000_QL80_-removebg-preview.png": "splash_tripundra.png",
    "ujjain_tirth_logo_new.png": "splash_logo_new.png",
    "unnamed-removebg-preview.png": "splash_shivling.png",
    "Trishul Straight.png": "splash_trishul_straight.png"
}

print("Renaming files in assets/images:")
for old_name, new_name in rename_map.items():
    old_path = os.path.join(images_dir, old_name)
    new_path = os.path.join(images_dir, new_name)
    
    if os.path.exists(old_path):
        if os.path.exists(new_path):
            os.remove(new_path) # Overwrite if exists
        os.rename(old_path, new_path)
        print(f"  Renamed {old_name} -> {new_name}")
    else:
        print(f"  File not found: {old_name}")
