// 内容页的中英文案。
// 版式与取数逻辑写在对应组件里（GuidePage / JobsPage / AboutPage / NotFoundPage），
// 这里只放随语言变化的文字——译文天然是两份，但版式只有一份，改版式不必改两处。
import type { Locale } from './i18n';

export const SITE = 'https://www.81japan.com';

// 面包屑首页项：中文站是 /，英文站是 /en
export function homeCrumbItem(locale: Locale): string {
  return locale === 'zh' ? `${SITE}/` : `${SITE}/en`;
}

// ── 指南类页面（rules / admin / tax / rent）──
// 四者共用 src/data/*.json 的同一套字段：id / icon / titleZh|En / summaryZh|En / pointsZh|En / tipZh|En
export type GuideKey = 'rules' | 'admin' | 'tax' | 'rent';

export interface GuideCopy {
  title: string;        // <title>
  description: string;  // meta description
  keywords?: string;
  eyebrow: string;
  h1: string;           // 含 <em> 标记，按 HTML 输出
  intro?: string;       // 省略时，单篇版式回落到条目自身的 summary
  listName: string;     // JSON-LD ItemList / Article 的 name
  crumb: string;        // 面包屑末级名称
}

export const GUIDE_COPY: Record<GuideKey, Record<Locale, GuideCopy>> = {
  rules: {
    zh: {
      title: '日本ルール · 在日生活规矩速查 | 81Japan',
      description: '初到日本最容易踩坑的文化与社会礼仪：电车・电梯礼仪、食べ歩き 等。',
      keywords: '日本生活规则,日本电车礼仪,电梯礼仪,食べ歩き,公共交通礼仪,日本生活指南',
      eyebrow: '日本ルール',
      h1: '初到日本，先记<em>这些规矩</em>',
      intro: '日本社会里不成文但人人遵守的礼仪。',
      listName: '日本生活ルール',
      crumb: '日本ルール',
    },
    en: {
      title: 'Living in Japan · Everyday Etiquette | 81Japan',
      description: 'Unwritten everyday etiquette newcomers most often trip on: train and elevator manners, eating in public, and more.',
      keywords: 'Japan etiquette,train etiquette Japan,elevator etiquette,eating walking Japan,Japan social rules,living in Japan guide',
      eyebrow: 'Living in Japan',
      h1: 'Things to know <em>before you settle in</em>',
      intro: 'The unwritten etiquette everyone in Japan follows.',
      listName: 'Living in Japan — Everyday Etiquette',
      crumb: 'Living in Japan',
    },
  },
  admin: {
    zh: {
      title: '行政手续 · 在日必办手续速查 | 81Japan',
      description: '初到日本最关键的行政手续：住民票、在留卡、マイナンバー、国民健康保险、银行开户——按办理顺序整理。',
      keywords: '日本行政手续,住民票,在留卡,マイナンバー,国民健康保险,日本银行开户,在日生活指南',
      eyebrow: '行政手续',
      h1: '来日本，先把<em>这些手续办了</em>',
      listName: '在日行政手续指南',
      crumb: '行政手续',
    },
    en: {
      title: 'Administration · Essential Paperwork in Japan | 81Japan',
      description: "The essential paperwork to handle after moving to Japan: resident registration, residence card, My Number, health insurance, bank account — in the order you'll do them.",
      keywords: 'Japan paperwork,juminhyo,residence card,my number Japan,national health insurance,Japan bank account,living in Japan',
      eyebrow: 'Administration',
      h1: 'Paperwork to <em>knock out first</em>',
      listName: 'Administration in Japan',
      crumb: 'Administration',
    },
  },
  tax: {
    zh: {
      title: '税务 · 在日工资族税务速查 | 81Japan',
      description: '在日工作必懂的税务：所得税源泉徴収、住民税、確定申告、ふるさと納税、医疗费扣除——日常工资族角度整理。',
      keywords: '日本税务,確定申告,住民税,ふるさと納税,医疗费扣除,e-Tax,日本所得税,在日工资税',
      eyebrow: '税务',
      h1: '在日本工作，<em>税该怎么办</em>',
      intro: '日本税务知识知多少',
      listName: '在日税务指南',
      crumb: '税务',
    },
    en: {
      title: 'Taxes · For Salaried Workers in Japan | 81Japan',
      description: 'Taxes when working in Japan: payroll withholding, resident tax, final filing (kakutei shinkoku), Furusato Nozei, medical deductions — from a salaried-worker perspective.',
      keywords: 'Japan tax,kakutei shinkoku,resident tax Japan,furusato nozei,medical deduction Japan,e-Tax,Japan income tax,salaried worker Japan',
      eyebrow: 'Taxes',
      h1: 'Taxes <em>when working in Japan</em>',
      intro: "How much do you know about Japan's taxes?",
      listName: 'Taxes in Japan',
      crumb: 'Taxes',
    },
  },
  rent: {
    zh: {
      title: '租房 · 在日租房指南 | 81Japan',
      description: '在日租房必懂：敷金、礼金、仲介手数料、保証会社、入居审查、UR 物件等——外国人在日本找房子的关键信息。',
      keywords: '日本租房,敷金,礼金,仲介手数料,保証会社,入居審査,UR 物件,外国人租房日本',
      eyebrow: '租房',
      h1: '在日本找房子，<em>先搞懂规则</em>',
      listName: '',   // 单篇版式用条目自身的 title
      crumb: '租房',
    },
    en: {
      title: 'Renting · Finding a Place to Live in Japan | 81Japan',
      description: 'Renting in Japan: shikikin, reikin, agent fees, guarantor companies, tenant screening, UR housing — what foreigners need to know about finding an apartment.',
      keywords: 'renting in Japan,shikikin,reikin,key money Japan,guarantor company,nyukyo shinsa,UR housing,foreigner rental Japan',
      eyebrow: 'Renting',
      h1: 'Finding a place <em>to live in Japan</em>',
      listName: '',
      crumb: 'Renting',
    },
  },
};

// ── 找工作 ──
export interface JobsCopy {
  title: string;
  description: string;
  keywords: string;
  eyebrow: string;
  h1: string;
  intro: string;
  listName: string;
  crumb: string;
  note: string;   // 页尾免责说明
}

export const JOBS_COPY: Record<Locale, JobsCopy> = {
  zh: {
    title: '日本找工作 · 求职 / 兼职网址导航 | 81Japan',
    description: '在日本找工作的常用网站合集：Indeed、バイトル、NEXT IN JAPAN 等。综合转职、兼职打工、外国人中文友好与公共职介一站速查。',
    keywords: '日本找工作,日本求职网站,日本兼职,アルバイト,Indeed Japan,バイトル,外国人 日本 工作,在日华人求职',
    eyebrow: '找工作',
    h1: '在日本，<em>找工作</em>从这里开始',
    intro: '综合转职、兼职打工、外国人友好与公共职介，常用求职网站一站速查。',
    listName: '日本找工作网址导航',
    crumb: '找工作',
    note: '外部链接由 81Japan 整理，仅供参考。求职时请通过官方渠道核实招聘信息，注意保护个人信息，谨防诈骗。',
  },
  en: {
    title: 'Finding a Job in Japan · Job & Part-time Site Directory | 81Japan',
    description: 'A curated directory of job-search sites in Japan: Indeed, Baitoru, NEXT IN JAPAN and more — full-time, part-time, foreigner-friendly and public placement, all in one place.',
    keywords: 'jobs in Japan,find work Japan,part-time Japan,baito,Indeed Japan,foreigner jobs Japan,job search Japan',
    eyebrow: 'Jobs',
    h1: 'Finding work in Japan <em>starts here</em>',
    intro: "Full-time, part-time, foreigner-friendly and public placement — the job-search sites you'll actually use, in one place.",
    listName: 'Finding a Job in Japan — Useful Sites',
    crumb: 'Jobs',
    note: 'External links are curated by 81Japan for reference only. Always verify listings through official channels, protect your personal information, and watch out for scams.',
  },
};

// ── 关于 ──
export interface AboutLink { href?: string; label: string; tail: string }
export interface AboutSection { h2: string; list?: AboutLink[]; paragraphs?: string[] }

export interface AboutCopy {
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  ldName: string;
  ldDescription: string;
  crumb: string;
  sections: AboutSection[];
  cta: { html: string; href: string; label: string };
}

export const ABOUT_COPY: Record<Locale, AboutCopy> = {
  zh: {
    title: '关于 · 81Japan | 在日中文生活信息',
    description: '81Japan是我在日本生活几年自己整理的医疗、行政、生活信息。可能不一定都对，欢迎指正。',
    eyebrow: '关于 81Japan',
    h1: '和 81Japan 一起，在日生活 <em>少走点弯路</em>',
    intro: '81Japan 是我在日本生活几年，自己整理的一些关于日本的信息资料。可能不一定都对，欢迎指正。',
    ldName: '关于 81Japan',
    ldDescription: '81Japan：我在日本生活几年，自己整理的一些信息资料。',
    crumb: '关于',
    sections: [
      {
        h2: '站上有什么',
        list: [
          { href: '/',      label: '医院诊所',   tail: '——日本各地能用中文看病的医院和诊所' },
          { href: '/rules', label: '日本ルール', tail: '——刚到日本最容易踩坑的生活规则' },
          { href: '/admin', label: '行政手续',   tail: '——住民票、在留卡、健保、银行开户等' },
          { href: '/tax',   label: '税务',       tail: '——所得税、住民税、確定申告、ふるさと納税' },
          {                 label: '生活服务',   tail: '——在做，欢迎一起补' },
        ],
      },
      {
        h2: '信息怎么来的',
        paragraphs: ['信息我都查过医院官网和公开资料，卡片上有更新日期。情况会变，看病前最好先打个电话。写错了<a href="/submit">告诉我</a>。'],
      },
      {
        h2: '联系我',
        paragraphs: ['有医院要补、信息要纠、单纯吐槽——<a href="/submit">欢迎联系</a>。'],
      },
    ],
    cta: { html: '发现漏掉的医院，或有想补充的内容？<br><strong>投稿直达我。</strong>', href: '/submit', label: '前往投稿 →' },
  },
  en: {
    title: 'About · 81Japan | Chinese Living Guide in Japan',
    description: "81Japan is a personal collection of info I've gathered after a few years in Japan — covering healthcare, paperwork, taxes, and daily life. Corrections welcome.",
    eyebrow: 'About 81Japan',
    h1: 'Making life in Japan <em>a little easier</em>',
    intro: "81Japan is a personal collection of info I've put together after a few years living in Japan. Some of it may not be accurate — corrections welcome.",
    ldName: 'About 81Japan',
    ldDescription: "81Japan: a personal collection of info I've put together after a few years living in Japan.",
    crumb: 'About',
    sections: [
      {
        h2: "What's here",
        list: [
          { href: '/en',       label: 'Hospitals & Clinics', tail: ' — places across Japan where you can be seen in Chinese' },
          { href: '/en/rules', label: 'Living in Japan',     tail: ' — the everyday etiquette newcomers most often miss' },
          { href: '/en/admin', label: 'Administration',      tail: ' — residence registration, residence card, health insurance, banking' },
          { href: '/en/tax',   label: 'Taxes',               tail: ' — income tax, resident tax, final filing, Furusato Nozei' },
          {                    label: 'Life services',       tail: ' — in progress; contributions welcome' },
        ],
      },
      {
        h2: 'Where the info comes from',
        paragraphs: ['I checked each entry against the hospital site or official sources. Cards show last-updated dates. Things change — call ahead before visiting. Wrong? <a href="/en/submit">Let me know</a>.'],
      },
      {
        h2: 'Reach me',
        paragraphs: ['Hospitals to add, info to correct, or just feedback — <a href="/en/submit">submit here</a>.'],
      },
    ],
    cta: { html: 'Know a hospital I missed, or want to add something?<br><strong>Submissions reach me directly.</strong>', href: '/en/submit', label: 'Contribute →' },
  },
};

// ── 404 ──
export interface NotFoundCopy {
  title: string;
  description: string;
  heading: string;
  desc: string;
  home: string;
  submit: string;
  back: string;   // NavSimple 的返回按钮文案
}

export const NOTFOUND_COPY: Record<Locale, NotFoundCopy> = {
  zh: {
    title: '页面未找到 · 404 | 81Japan',
    description: '抱歉，你访问的页面不存在。返回 81Japan 首页查看在日中文医院信息。',
    heading: '页面走丢了',
    desc: '你访问的页面不存在，或者已经被移动。可以回首页继续查找在日中文医院信息。',
    home: '回到首页',
    submit: '投稿・纠错',
    back: '返回首页',
  },
  en: {
    title: 'Page not found · 404 | 81Japan',
    description: "The page you're looking for doesn't exist. Return to 81Japan to find Chinese-speaking hospitals in Japan.",
    heading: 'Page not found',
    desc: "The page you're looking for doesn't exist or was moved. Head back to the home page to find Chinese-speaking hospitals in Japan.",
    home: 'Back to home',
    submit: 'Submit / Correct',
    back: 'Home',
  },
};

// ── 投稿页 ──
// 表单的 name 属性在两种语言下都保持中文（/api/submit 按中文键取值），这里只翻界面文案。
export interface SubmitCopy {
  title: string;
  description: string;
  navBack: string;
  eyebrow: string;
  h1: string;
  intro: string;
  stepsHeading: string;
  steps: Array<{ title: string; desc: string }>;
  sideNote: string;
  types: { new: string; fix: string; other: string };
  labels: Record<
    'name' | 'location' | 'lang' | 'dept' | 'phone' | 'site' | 'hours' | 'note' |
    'fixName' | 'fixDesc' | 'other' | 'contact',
    string
  >;
  placeholders: Record<
    'name' | 'location' | 'dept' | 'phone' | 'site' | 'hours' | 'note' |
    'fixName' | 'fixDesc' | 'other' | 'contact',
    string
  >;
  langOptions: Array<{ value: string; label: string }>;
  submitBtn: string;
  formNote: string;
  success: { heading: string; body: string; again: string; home: string };
  footerHome: string;
}

export const SUBMIT_COPY: Record<Locale, SubmitCopy> = {
  zh: {
    title: '投稿・信息纠错 | 81Japan',
    description: '向 81Japan 提交新医院信息、纠正现有错误，或提供其他建议，共同完善在日中文医疗信息库。',
    navBack: '返回首页',
    eyebrow: '投稿',
    h1: '帮我<em>完善</em>这份指南',
    intro: '知道某家提供中文服务的医院还没收录？或者发现信息有误？都欢迎告诉我。',
    stepsHeading: '投稿流程',
    steps: [
      { title: '填写表单', desc: '告诉我医院名称、地址及语言服务等信息' },
      { title: '人工核实', desc: '收到通知后我会核实信息的准确性' },
      { title: '更新上线', desc: '确认无误后更新到网站，通常 1–3 天内完成' },
    ],
    sideNote: '纠错请注明具体问题及信息来源，这样能更快处理。',
    types: { new: '新增医院', fix: '纠错/补充', other: '其他建议' },
    labels: {
      name: '医院名称', location: '所在地', lang: '语言服务', dept: '科室',
      phone: '电话号码', site: '官网 / SNS', hours: '营业时间', note: '备注',
      fixName: '哪家医院', fixDesc: '问题描述', other: '你的建议', contact: '联系方式（选填）',
    },
    placeholders: {
      name: '中文或日文均可', location: '都道府县・城市', dept: '内科、産科、歯科…',
      phone: '03-XXXX-XXXX', site: 'https://…',
      hours: '例：周一至周五 9:00–17:30 / 周六 9:00–12:30',
      note: '是否需要预约、休息日、注意事项等…',
      fixName: '医院名称', fixDesc: '哪里有误？正确信息是什么？如有来源请附上。',
      other: '功能建议、内容补充等…', contact: '邮箱、微信、LINE ID 均可',
    },
    langOptions: [
      { value: '', label: '请选择…' },
      { value: '中文（普通话）', label: '中文（普通话）' },
      { value: '中文（广东话）', label: '中文（广东话）' },
      { value: '中文＋英文', label: '中文＋英文' },
      { value: '英文', label: '英文' },
      { value: '其他', label: '其他' },
    ],
    submitBtn: '提交投稿',
    formNote: '提交即表示你同意我将信息用于网站内容更新',
    success: {
      heading: '已收到，谢谢！',
      body: '我会尽快核实并更新。<br>如果你留了联系方式，有疑问时我会回复你。',
      again: '再提交一条',
      home: '返回首页',
    },
    footerHome: '← 返回首页',
  },
  en: {
    title: 'Submit / Correct Info | 81Japan',
    description: 'Submit a new hospital, correct existing info, or suggest improvements to 81Japan.',
    navBack: 'Back',
    eyebrow: 'Contribute',
    h1: 'Help me <em>improve</em> this guide',
    intro: "Know a hospital with Chinese-speaking staff that I haven't listed? Or spotted an error? Let me know.",
    stepsHeading: 'How it works',
    steps: [
      { title: 'Fill in the form', desc: 'Tell me the hospital name, location and language services' },
      { title: 'Manual review', desc: "I'll verify after receiving your submission" },
      { title: 'Published', desc: "Once confirmed, I'll add it to the site within 1–3 days" },
    ],
    sideNote: 'For corrections, please include the specific issue and a source if possible — that speeds things up.',
    types: { new: 'Add hospital', fix: 'Correction', other: 'Other' },
    labels: {
      name: 'Hospital name', location: 'Location', lang: 'Language', dept: 'Department',
      phone: 'Phone', site: 'Website', hours: 'Hours', note: 'Notes',
      fixName: 'Which hospital', fixDesc: 'Describe the issue', other: 'Your suggestion',
      contact: 'Contact (optional)',
    },
    placeholders: {
      name: 'Chinese or Japanese name', location: 'Prefecture / city',
      dept: 'Internal, OB/GYN, Dental…', phone: '03-XXXX-XXXX', site: 'https://…',
      hours: 'e.g. Mon–Fri 9:00–17:30 / Sat 9:00–12:30',
      note: 'Reservation needed? Closed days? Anything to watch for…',
      fixName: 'Hospital name', fixDesc: "What's wrong? What's the correct info? Include a source if possible.",
      other: 'Feature ideas, content suggestions, etc.', contact: 'Email, WeChat, LINE ID',
    },
    langOptions: [
      { value: '', label: 'Select…' },
      { value: '中文（普通话）', label: 'Chinese (Mandarin)' },
      { value: '中文（广东话）', label: 'Chinese (Cantonese)' },
      { value: '中文＋英文', label: 'Chinese + English' },
      { value: '英文', label: 'English' },
      { value: '其他', label: 'Other' },
    ],
    submitBtn: 'Submit',
    formNote: 'By submitting you agree to your information being used for site updates',
    success: {
      heading: 'Received, thank you!',
      body: "I'll verify and update soon.<br>If you left contact info, I'll reach out if I have questions.",
      again: 'Submit another',
      home: 'Back to home',
    },
    footerHome: '← Home',
  },
};

// ── 首页 ──
export interface HomeCopy {
  title: string;
  description: string;
  keywords: string;
  eyebrow: string;
  h1: string;            // 视觉隐藏的 h1
  sub: string;
  searchAria: string;
  searchPlaceholder: string;
  searchBtn: string;
  coverage: string;
  filtersAria: string;
  regionTitle: string;
  regionAll: string;
  langTitle: string;
  langAll: string;
  langCn: string;
  langEn: string;
  langVi: string;
  deptTitle: string;
  depts: Array<[string, string]>;   // [搜索词, 显示名]
  listAria: string;
  foundPre: string;                 // 计数前后的文案（含所需空格）
  foundPost: string;
  sortDate: string;
  sortRegion: string;
  sortDept: string;
  emptyTitle: string;
  emptyHint: string;
  emptyLink: string;
  bannerH1: string;                 // 含 <em>
  bannerText: string;
  bannerBtn: string;
  ldSiteDescription: string;
  ldListName: string;
}

export const HOME_COPY: Record<Locale, HomeCopy> = {
  zh: {
    title: '81Japan | 在日中文生活 · 医院・行政・税务指南',
    description: '为在日中文使用者整理的医疗、行政、税务、租房指南。首页为中文医院・诊所列表，涵盖东京、横浜、大阪、京都、神户、福冈、名古屋、北海道、广岛、冈山。',
    keywords: '在日中文医院,日本中文诊所,日本看病,中文医疗,日本华人医院,东京中文医院,大阪中文医院,京都中文医院,在日生活,中文医生,华人论坛,日本论坛,日本移民,日本留学,日本租房',
    eyebrow: '81Japan · 在日生活中文指南',
    h1: '81Japan — 在日中文医院・诊所查询指南',
    sub: '为初到日本的你整理中文就医与生活资讯，欢迎收藏，持续更新。',
    searchAria: '搜索医院',
    searchPlaceholder: '搜索医院名称、城市、科室…',
    searchBtn: '搜索',
    coverage: '覆盖 关东・关西・九州・北海道・中部',
    filtersAria: '筛选条件',
    regionTitle: '地区',
    regionAll: '全部地区',
    langTitle: '服务语言',
    langAll: '全部',
    langCn: '🇨🇳 中文对应',
    langEn: '🇺🇸 英文对应',
    langVi: '🇻🇳 越南语对应',
    deptTitle: '科室',
    depts: [['内科', '内科'], ['外科', '外科'], ['产科', '产科・妇科'], ['儿科', '儿科'], ['皮肤科', '皮肤科'], ['精神科', '精神科・心理'], ['牙科', '牙科・口腔']],
    listAria: '医院列表',
    foundPre: '共找到 ',
    foundPost: ' 家医疗机构',
    sortDate: '最近更新',
    sortRegion: '按地区',
    sortDept: '按科室',
    emptyTitle: '没有找到相关结果',
    emptyHint: '换个关键词试试，或者',
    emptyLink: '提交新信息',
    bannerH1: '知道遗漏的<em>信息？</em>',
    bannerText: '如果你知道某家医院提供中文服务，或发现信息有误，欢迎投稿——我会人工审核后更新。',
    bannerBtn: '前往投稿 →',
    ldSiteDescription: '收录日本全国提供中文医疗服务的医院与诊所信息',
    ldListName: '在日中文医院列表',
  },
  en: {
    title: '81Japan | Living in Japan for Chinese Speakers · Hospitals, Admin, Taxes',
    description: 'A guide for Chinese speakers in Japan — hospitals, admin, taxes, and renting. Home page lists Chinese-speaking hospitals and clinics across Tokyo, Yokohama, Osaka, Kyoto, Kobe, Fukuoka, Nagoya, and Hokkaido.',
    keywords: 'Chinese hospital Japan,Chinese-speaking clinic,Tokyo Chinese doctor,Osaka Chinese hospital,Japan medical guide,Mandarin medical,Chinese medical Japan,Chinese forum Japan,Japan forum,Japan immigration,study in Japan,renting in Japan',
    eyebrow: '81Japan · Chinese Living Guide',
    h1: '81Japan — Chinese-Speaking Hospital & Clinic Guide in Japan',
    sub: 'Chinese-language medical & living info for newcomers to Japan — bookmark us, updated regularly.',
    searchAria: 'Search hospitals',
    searchPlaceholder: 'Search by hospital name, city, department…',
    searchBtn: 'Search',
    coverage: 'Tokyo · Yokohama · Osaka · Kyoto · Kobe · Fukuoka · Nagoya · Hokkaido',
    filtersAria: 'Filters',
    regionTitle: 'Region',
    regionAll: 'All',
    langTitle: 'Language',
    langAll: 'All',
    langCn: '🇨🇳 Chinese',
    langEn: '🇺🇸 English',
    langVi: '🇻🇳 Vietnamese',
    deptTitle: 'Department',
    depts: [['内科', 'Internal medicine'], ['外科', 'Surgery'], ['产科', 'Ob/Gyn'], ['儿科', 'Pediatrics'], ['皮肤科', 'Dermatology'], ['精神科', 'Psychiatry'], ['牙科', 'Dental']],
    listAria: 'Hospital list',
    foundPre: '',
    foundPost: ' facilities found',
    sortDate: 'Latest update',
    sortRegion: 'By region',
    sortDept: 'By department',
    emptyTitle: 'No results found',
    emptyHint: 'Try a different keyword, or',
    emptyLink: 'submit a new entry',
    bannerH1: 'Know something <em>I missed?</em>',
    bannerText: "If you know a hospital with Chinese-speaking staff, or spot an error, please contribute — I'll verify and update.",
    bannerBtn: 'Contribute →',
    ldSiteDescription: 'Directory of hospitals and clinics with Chinese-speaking staff across Japan',
    ldListName: 'Hospitals with Chinese-speaking staff in Japan',
  },
};
