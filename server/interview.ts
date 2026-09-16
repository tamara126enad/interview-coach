type QuestionId = 1 | 2 | 3;

type Criterion = { key: string; label: string; patterns: RegExp[]; points: number };

const questionConfig: Record<QuestionId, { prompt: string; criteria: Criterion[]; reference: (job: string) => string }> = {
  1: {
    prompt: "حدثنا عن نفسك وخبرتك في تطوير واجهات الويب.",
    criteria: [
      { key: "name", label: "الاسم والتعريف بالنفس", patterns: [/اسمي|أنا|i am|my name/i], points: 10 },
      { key: "role", label: "المسمى الوظيفي", patterns: [/مطور|مهندس|واجهة|frontend|web developer|engineer/i], points: 18 },
      { key: "experience", label: "سنوات أو مستوى الخبرة", patterns: [/سنوات|خبرة|عام|years|experience|junior|mid|senior/i], points: 15 },
      { key: "skills", label: "مهارات مرتبطة بالوظيفة", patterns: [/react|javascript|typescript|html|css|git|api|مهارات|تقنيات/i], points: 15 },
      { key: "projects", label: "مشروع أو تجربة عملية", patterns: [/مشروع|منتج|تطبيق|بنيت|طورت|project|product|built|developed/i], points: 15 },
      { key: "achievement", label: "إنجاز أو نتيجة", patterns: [/حسنت|رفعت|خفضت|نتيجة|إنجاز|impact|improved|increased|reduced|result/i], points: 17 },
      { key: "motivation", label: "ربط الخبرة بالوظيفة", patterns: [/أبحث|أرغب|أستطيع|أضيف|فرصة|وظيفة|company|role|contribute/i], points: 10 },
    ],
    reference: job => `أنا [الاسم]، ${job} بخبرة [عدد السنوات] سنوات في بناء تجارب ويب سريعة وسهلة الاستخدام. عملت على [اسم مشروع أو منتج] باستخدام [أهم التقنيات]، وكان دوري [الدور الفعلي]. من أبرز النتائج التي حققتها [إنجاز أو نتيجة حقيقية]. أبحث عن هذه الفرصة لأنني أستطيع توظيف خبرتي في [مهارة مرتبطة] والمساهمة في تطوير منتجات الفريق.`,
  },
  2: {
    prompt: "ما هو المشروع الذي تفخر بإنجازه؟ ولماذا؟",
    criteria: [
      { key: "context", label: "السياق أو المشكلة", patterns: [/المشكلة|التحدي|الهدف|احتياج|problem|challenge|goal|needed/i], points: 18 },
      { key: "role", label: "دورك الفعلي", patterns: [/دوري|مسؤوليتي|قمت|كنت|طورت|صممت|implemented|my role|responsible/i], points: 22 },
      { key: "tools", label: "التقنيات أو الأدوات", patterns: [/react|javascript|typescript|figma|node|sql|git|تقنية|أداة|باستخدام/i], points: 15 },
      { key: "result", label: "نتيجة أو أثر", patterns: [/نتيجة|أثر|تحسن|مستخدم|أداء|نجح|result|impact|users|performance|improved/i], points: 25 },
      { key: "learning", label: "ما تعلمته", patterns: [/تعلمت|اكتسبت|طورني|تعلم|learned|lesson/i], points: 20 },
    ],
    reference: job => `أفتخر بمشروع [اسم المشروع] لأنه عالج [المشكلة أو احتياج المستخدم]. كان دوري الفعلي هو [الدور]، واستخدمت [التقنيات] لتنفيذ [ما أنجزته]. النتيجة كانت [أثر أو نتيجة حقيقية قابلة للشرح]. تعلمت من المشروع [درس محدد]، وهو ما سيساعدني في دور ${job}.`,
  },
  3: {
    prompt: "كيف تتعامل مع تحدٍ تقني صعب أثناء العمل؟",
    criteria: [
      { key: "situation", label: "الموقف والتحدي", patterns: [/واجهت|تحدي|مشكلة|ضغط|bug|issue|challenge|situation/i], points: 20 },
      { key: "action", label: "الخطوات التي اتخذتها", patterns: [/حللت|قسمت|بحثت|جربت|تواصلت|طبقت|خطوة|analy|researched|tested|communicated|action/i], points: 28 },
      { key: "reasoning", label: "سبب اختيار الحل", patterns: [/لأن|اعتمدت|اخترت|مقارنة|trade-off|because|decided/i], points: 16 },
      { key: "result", label: "النتيجة", patterns: [/نتيجة|تحسن|حل|نجح|أصلحت|result|resolved|fixed|improved/i], points: 22 },
      { key: "reflection", label: "ما تعلمته أو ما ستفعله لاحقًا", patterns: [/تعلمت|سأكرر|مستقبلًا|درس|learned|next time|future/i], points: 14 },
    ],
    reference: job => `في أحد مشاريع ${job} واجهت [التحدي الحقيقي]. بدأت بتحليل السبب وتقسيم المشكلة إلى أجزاء، ثم [الخطوات التي نفذتها] ونسقت مع [الأشخاص المعنيين] عند الحاجة. اخترت هذا الحل لأنه [سبب منطقي]. النتيجة كانت [نتيجة حقيقية]، وتعلمت أن [درس قابل للتطبيق].`,
  },
};

function hasAny(text: string, patterns: RegExp[]) {
  return patterns.some(pattern => pattern.test(text));
}

export function evaluateInterviewAnswer(question: QuestionId, answer: string, targetJob: string) {
  const config = questionConfig[question];
  const text = answer.trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  const criteria = config.criteria.map(item => ({ ...item, present: hasAny(text, item.patterns) }));
  const criterionPoints = criteria.reduce((sum, item) => sum + (item.present ? item.points : 0), 0);
  const lengthBonus = words >= 80 ? 12 : words >= 45 ? 7 : words >= 25 ? 3 : 0;
  const structureBonus = /أولًا|ثانيًا|أخيرًا|situation|task|action|result|بداية|ثم|وأخيرًا/i.test(text) ? 6 : 0;
  const score = Math.max(0, Math.min(100, Math.round(criterionPoints + lengthBonus + structureBonus)));
  const missing = criteria.filter(item => !item.present).map(item => item.label);
  const matched = criteria.filter(item => item.present).map(item => item.label);
  const level = score >= 80 ? "إجابة قوية" : score >= 60 ? "إجابة جيدة وتحتاج بعض التفصيل" : "إجابة مختصرة وتحتاج إلى أمثلة";

  return {
    score,
    level,
    wordCount: words,
    matched,
    missing,
    referenceAnswer: config.reference(targetJob),
    rubric: `تم احتساب ${criterionPoints} نقطة من عناصر الإجابة، مع إضافة نقاط للوضوح والتفصيل. الإجابة المرجعية نموذج للمقارنة وليست نصًا مطلوبًا للحفظ.`,
  };
}
