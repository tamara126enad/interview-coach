from pathlib import Path
p = Path('/home/ubuntu/interview-coach/client/src/App.tsx')
s = p.read_text()
old = '[["CV Score","78/100",FileText,"text-[#4265ff] bg-[#eef2ff]"],["Interview Readiness","82/100",Mic,"text-[#23a67b] bg-[#eafaf5]"],["Job Match","81%",Target,"text-[#d79524] bg-[#fff4df]"],["CV Versions","3 نسخ",FileText,"text-[#7b82df] bg-[#f0efff]"]].map(([a,b,Icon,c])=><div key={a as string} className="rounded-3xl border border-[#e5eaf4] bg-white p-5"><div className="flex items-start justify-between"><span className={`grid h-10 w-10 place-items-center rounded-xl ${c}`}><Icon size={19}/></span>'
new = '([{a:"CV Score",b:"78/100",Icon:FileText,c:"text-[#4265ff] bg-[#eef2ff]"},{a:"Interview Readiness",b:"82/100",Icon:Mic,c:"text-[#23a67b] bg-[#eafaf5]"},{a:"Job Match",b:"81%",Icon:Target,c:"text-[#d79524] bg-[#fff4df]"},{a:"CV Versions",b:"3 نسخ",Icon:FileText,c:"text-[#7b82df] bg-[#f0efff]"}]).map(({a,b,Icon,c})=><div key={a} className="rounded-3xl border border-[#e5eaf4] bg-white p-5"><div className="flex items-start justify-between"><span className={`grid h-10 w-10 place-items-center rounded-xl ${c}`}><Icon size={19}/></span>'
if old not in s:
    raise SystemExit('target not found')
p.write_text(s.replace(old,new))
