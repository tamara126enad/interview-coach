from PIL import Image
from pathlib import Path
src = Path('/home/ubuntu/webdev-static-assets/interview-coach-hero.png')
dst = Path('/home/ubuntu/interview-coach/client/src/assets/interview-coach-hero.jpg')
img = Image.open(src).convert('RGB')
img.thumbnail((1400, 1050), Image.Resampling.LANCZOS)
img.save(dst, 'JPEG', quality=82, optimize=True, progressive=True)
print(dst, dst.stat().st_size)
