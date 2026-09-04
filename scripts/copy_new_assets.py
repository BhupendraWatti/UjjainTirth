import os
import shutil

src_trishul = r"D:\Company Work\Company projects\UT Splash screen\Splace Screen\Trishul_Straight-removebg-preview.png"
src_temple = r"D:\Company Work\Company projects\UT Splash screen\Splace Screen\bc2abdad-aecd-4021-8bb6-ba39c8f10a29 2.png"

dest_dir = r"D:\Company Work\Company projects\UjjainTirth\assets\images"

trishul_dest = os.path.join(dest_dir, "splash_trishul_straight.png")
temple_dest = os.path.join(dest_dir, "splash_temple.png")

print("Copying new assets:")
if os.path.exists(src_trishul):
    shutil.copy2(src_trishul, trishul_dest)
    print(f"  Copied Trishul to: {trishul_dest}")
else:
    print(f"  Trishul source not found: {src_trishul}")

if os.path.exists(src_temple):
    shutil.copy2(src_temple, temple_dest)
    print(f"  Copied Temple to: {temple_dest}")
else:
    print(f"  Temple source not found: {src_temple}")
