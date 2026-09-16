export type InterviewType = "general" | "technical" | "behavioral" | "hr" | "managerial";
export type CatalogQuestion = { id: string; type: InterviewType; prompt: string; referenceAnswer: string; criteria: string[]; difficulty: string };
export type CatalogJob = { id: string; title: string; category: string; icon: string; questions: CatalogQuestion[] };

const common = (type: InterviewType, id: string, prompt: string, referenceAnswer: string, criteria: string[], difficulty = "متوسط"): CatalogQuestion => ({ id, type, prompt, referenceAnswer, criteria, difficulty });

export const interviewCatalog: CatalogJob[] = [
  { id: "frontend", title: "مطور واجهات أمامية", category: "التقنية والبرمجة", icon: "</>", questions: [
    common("general", "fe-g1", "عرفنا عن نفسك وخبرتك في تطوير الواجهات.", "أنا مطور واجهات أمامية بخبرة في بناء منتجات سريعة وسهلة الاستخدام. عملت على مشاريع باستخدام React وTypeScript، وركزت على تحسين الأداء وتجربة المستخدم.", ["الاسم أو التعريف", "المسمى الوظيفي", "سنوات الخبرة", "التقنيات", "مشروع", "إنجاز"]),
    common("technical", "fe-t1", "ما الفرق بين state و props في React؟", "الـprops بيانات يمررها المكون الأب ولا يملك المكون الابن تغييرها مباشرة، بينما state بيانات داخلية قابلة للتغيير وتؤثر في إعادة التصيير.", ["تعريف props", "تعريف state", "قابلية التغيير", "إعادة التصيير"]),
    common("technical", "fe-t2", "كيف تحسن أداء صفحة ويب بطيئة؟", "أبدأ بقياس الأداء، ثم أراجع حجم الحزمة والصور، أستخدم code splitting وlazy loading، أحسن الاستعلامات وأتأكد من عدم وجود إعادة تصيير غير ضرورية.", ["القياس", "الحزمة أو الصور", "التقسيم أو التحميل الكسول", "التحقق من النتيجة"]),
    common("behavioral", "fe-b1", "احكِ عن خلاف تقني مع زميل وكيف تعاملت معه.", "أوضح السياق، أستمع لوجهة النظر الأخرى، أقارن الخيارات بمعايير واضحة مثل الأثر والصيانة، ثم نتفق على تجربة أو قرار قابل للمراجعة.", ["السياق", "الاستماع", "معايير القرار", "النتيجة", "التعلم"]),
    common("hr", "fe-h1", "لماذا تريد الانضمام إلى فريقنا؟", "أربط خبرتي باحتياج الفريق والمنتج، وأوضح القيمة التي أستطيع تقديمها بدل الاكتفاء بعبارة عامة عن الرغبة في التطور.", ["سبب محدد", "ربط الخبرة", "قيمة للفريق"]),
  ]},
  { id: "backend", title: "مطور Backend", category: "التقنية والبرمجة", icon: "API", questions: [
    common("general", "be-g1", "حدثنا عن خبرتك في بناء الخدمات الخلفية.", "أنا مطور Backend أعمل على تصميم APIs موثوقة وقابلة للتوسع، مع خبرة في قواعد البيانات، الاختبارات، والمراقبة.", ["الدور", "الخبرة", "التقنيات", "مشروع", "أثر"]),
    common("technical", "be-t1", "كيف تصمم API قابلة للتوسع وآمنة؟", "أحدد الموارد والعقود، أطبق المصادقة والتفويض والتحقق من المدخلات، أستخدم pagination وcaching عند الحاجة، وأضيف logging واختبارات ومراقبة.", ["العقد", "الأمان", "الأداء", "المراقبة"]),
    common("technical", "be-t2", "متى تستخدم قاعدة بيانات علائقية أو NoSQL؟", "أختار العلائقية عندما تكون العلاقات والاتساق والمعاملات أساسية، وNoSQL عندما أحتاج مرونة في البنية أو حجمًا وتوزيعًا مناسبين لنمط الوصول.", ["الاتساق", "العلاقات", "نمط الوصول", "المقارنة"]),
    common("behavioral", "be-b1", "صف عطلًا إنتاجيًا تعاملت معه.", "أثبت الأثر أولًا، أوقف التدهور إن لزم، أستخدم السجلات لتحديد السبب، أتواصل مع أصحاب المصلحة، ثم أوثق السبب والإجراء الوقائي.", ["الأثر", "التشخيص", "التواصل", "الوقاية"]),
  ]},
  { id: "designer", title: "مصمم UI/UX", category: "التصميم والإبداع", icon: "UX", questions: [
    common("general", "ux-g1", "قدم نفسك وحدثنا عن منهجيتك في تصميم المنتجات.", "أنا مصمم UI/UX أبدأ بفهم المستخدم والمشكلة، ثم أحول الأفكار إلى تدفقات ونماذج أولية وأختبرها قبل بناء واجهة متسقة.", ["التعريف", "فهم المستخدم", "النماذج", "الاختبار"]),
    common("technical", "ux-t1", "كيف تقيس نجاح تجربة مستخدم جديدة؟", "أحدد فرضية ومؤشرات مثل إكمال المهمة والوقت والأخطاء والرضا، أقارن خط أساس بالنسخة الجديدة، وأجمع بيانات كمية ونوعية.", ["فرضية", "مؤشرات", "مقارنة", "بيانات"]),
    common("behavioral", "ux-b1", "كيف تتعامل مع ملاحظات متعارضة من أصحاب المصلحة؟", "أعيد الملاحظات إلى هدف المنتج واحتياج المستخدم، أوثق البدائل، وأقترح اختبارًا أو قرارًا واضحًا بدل اعتماد الرأي الأعلى صوتًا.", ["الهدف", "المستخدم", "البدائل", "القرار"]),
  ]},
  { id: "marketing", title: "أخصائي تسويق", category: "التسويق والمبيعات", icon: "MKT", questions: [
    common("general", "mk-g1", "حدثنا عن حملة تسويقية تفتخر بها.", "أشرح الهدف والجمهور والقناة ورسالة الحملة ودوري، ثم أذكر النتائج بالأرقام وما الذي تعلمته.", ["الهدف", "الجمهور", "الدور", "القنوات", "نتيجة"]),
    common("technical", "mk-t1", "كيف تختار مؤشرات أداء حملة جديدة؟", "أربط المؤشر بهدف الحملة: الوعي، التفاعل، العملاء المحتملون أو التحويل، وأحدد خط أساس وفترة قياس ومصدر بيانات واضح.", ["الهدف", "المؤشر", "خط الأساس", "القياس"]),
    common("behavioral", "mk-b1", "ماذا تفعل إذا لم تحقق الحملة النتائج المتوقعة؟", "أراجع الفرضية والجمهور والرسالة والقناة والبيانات، أختبر تغييرًا واحدًا أو أكثر، ثم أقرر الاستمرار أو الإيقاف بناءً على تكلفة النتيجة.", ["التشخيص", "البيانات", "التجربة", "القرار"]),
  ]},
  { id: "sales", title: "مندوب مبيعات", category: "التسويق والمبيعات", icon: "CRM", questions: [
    common("general", "sl-g1", "كيف تقدم نفسك وما خبرتك في المبيعات؟", "أنا مندوب مبيعات أركز على فهم احتياج العميل، بناء الثقة، وإدارة دورة البيع حتى الإغلاق والمتابعة.", ["التعريف", "الخبرة", "فهم العميل", "نتيجة"]),
    common("technical", "sl-t1", "كيف تتعامل مع اعتراض السعر؟", "أستوضح القيمة التي يقارن بها العميل، أعود إلى المشكلة والنتيجة المتوقعة، وأعرض بدائل واقعية دون تقديم خصم عشوائي.", ["الاستيضاح", "القيمة", "البدائل", "النتيجة"]),
    common("behavioral", "sl-b1", "صف صفقة صعبة نجحت في إتمامها.", "أشرح السياق وصاحب القرار والاعتراض والخطوات التي اتبعتها والنتيجة وما الذي جعل الحل مناسبًا للعميل.", ["السياق", "الاعتراض", "الخطوات", "الإغلاق", "النتيجة"]),
  ]},
  { id: "hr-specialist", title: "أخصائي موارد بشرية", category: "الإدارة والموارد البشرية", icon: "HR", questions: [
    common("general", "hr-g1", "حدثنا عن خبرتك في الموارد البشرية.", "أعمل على تحسين تجربة الموظف ودعم التوظيف أو العمليات، وأستخدم البيانات والسياسات بشكل عادل وواضح.", ["الدور", "الخبرة", "العمليات", "الأثر"]),
    common("technical", "hr-t1", "كيف تبني عملية مقابلات عادلة؟", "أحدد كفاءات مرتبطة بالدور، أستخدم أسئلة ومعايير موحدة، أوثق التقييمات وأدرب المقابلين وأراجع النتائج بحثًا عن تحيزات.", ["الكفاءات", "المعايير", "التوثيق", "التحيز"]),
    common("behavioral", "hr-b1", "كيف تتعامل مع شكوى موظف حساسة؟", "أستمع بسرية، أتحقق من الوقائع والسياسة المعتمدة، أتجنب الوعود المسبقة، وأتخذ إجراءً موثقًا وعادلًا مع حماية الأطراف.", ["السرية", "التحقق", "السياسة", "العدالة"]),
  ]},
];

export function getJob(jobId: string) { return interviewCatalog.find(job => job.id === jobId) ?? interviewCatalog[0]; }
export function pickQuestions(jobId: string, type: InterviewType, count: number) {
  const job = getJob(jobId);
  const pool = job.questions.filter(question => type === "general" || question.type === type || question.type === "general");
  return [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));
}

export function evaluateCatalogAnswer(question: CatalogQuestion, answer: string) {
  const text = answer.trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  const matched = question.criteria.filter(criterion => {
    const terms = criterion.toLowerCase().split(/\s+/).filter(term => term.length > 2);
    return terms.some(term => text.toLowerCase().includes(term)) || (criterion === "النتيجة" && /نتيجة|أثر|تحسن|رقم|result|impact/i.test(text));
  });
  const coverage = question.criteria.length ? matched.length / question.criteria.length : 0;
  const detail = words >= 80 ? 18 : words >= 50 ? 12 : words >= 30 ? 7 : words >= 15 ? 2 : 0;
  const structure = /أولًا|ثانيًا|أخيرًا|بداية|ثم|نتيجة|because|first|then|result/i.test(text) ? 7 : 0;
  const score = Math.max(0, Math.min(100, Math.round(coverage * 70 + detail + structure)));
  const missing = question.criteria.filter(criterion => !matched.includes(criterion));
  return {
    score,
    wordCount: words,
    matched,
    missing,
    level: score >= 80 ? "إجابة قوية" : score >= 60 ? "إجابة جيدة" : "إجابة تحتاج إلى تفاصيل أكثر",
    feedback: { matched, missing, tip: `قارن إجابتك بالمرجع، واذكر ${missing.slice(0, 2).join(" و") || "مثالًا ونتيجة قابلة للقياس"}.` },
  };
}
