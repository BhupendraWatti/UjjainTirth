import os
import shutil
from PIL import Image

src_dir = r"D:\Company Work\Company projects\UT Splash screen\Splace Screen"
dest_dir = r"D:\Company Work\Company projects\UjjainTirth\assets\images"

files_to_copy = [
    "9c1fe3c41740d02bf0e539e25fd03106-removebg-preview.png",
    "51AB0KMRZPL._AC_UF894_1000_QL80_-removebg-preview.png",
    "ujjain_tirth_logo.png",
    "unnamed-removebg-preview.png",
    "Trishul Straight.png"
]

print("Copying files:")
for f in files_to_copy:
    src_path = os.path.join(src_dir, f)
    # Rename ujjain_tirth_logo.png to ujjain_tirth_logo_new.png to prevent overwriting the current main logo
    dest_name = "ujjain_tirth_logo_new.png" if f == "ujjain_tirth_logo.png" else f
    dest_path = os.path.join(dest_dir, dest_name)
    
    if os.path.exists(src_path):
        shutil.copy2(src_path, dest_path)
        img = Image.open(dest_path)
        print(f"  Copied {f} -> {dest_name} (Size: {img.size}, Format: {img.format})")
    else:
        print(f"  File not found at: {src_path}")
