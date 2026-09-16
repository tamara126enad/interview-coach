from pathlib import Path
p=Path('/home/ubuntu/interview-coach/client/src/App.tsx')
s=p.read_text()
old='[[FileText,"تحليل السيرة الذاتية","احصل على تقييم شامل لسيرتك الذاتية ونصائح عملية لتحسينها.","bg-[#eef2ff] text-[#4265ff]"],[Mic,"مقابلة تجريبية","تدرب أمام لجنة مقابلات افتراضية بأسئلة تناسب وظيفتك.","bg-[#eafaf5] text-[#23a67b]"],[BarChart3,"تقرير الأداء","تابع نقاط قوتك والجوانب التي تحتاج إلى تطويرها.","bg-[#fff4df] text-[#d79524]"]].map(([Icon,title,desc,color],i)'
new='([{Icon:FileText,title:"تحليل السيرة الذاتية",desc:"احصل على تقييم شامل لسيرتك الذاتية ونصائح عملية لتحسينها.",color:"bg-[#eef2ff] text-[#4265ff]"},{Icon:Mic,title:"مقابلة تجريبية",desc:"تدرب أمام لجنة مقابلات افتراضية بأسئلة تناسب وظيفتك.",color:"bg-[#eafaf5] text-[#23a67b]"},{Icon:BarChart3,title:"تقرير الأداء",desc:"تابع نقاط قوتك والجوانب التي تحتاج إلى تطويرها.",color:"bg-[#fff4df] text-[#d79524]"}]).map(({Icon,title,desc,color},i)'
if old not in s: raise SystemExit('target not found')
p.write_text(s.replace(old,new))
