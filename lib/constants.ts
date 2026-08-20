export const BRAND = {
  name: "FORMAZA11",
  short: "F11",
  badge: "/brand/formaza11-badge.png",
  wordmark: "/brand/formaza11-wordmark.svg",
} as const;

export const ADULT_SIZES = ["S", "M", "L", "XL", "XXL"] as const;
export const KID_SIZES = ["3-4", "5-6", "7-8", "9-10", "11-12", "13-14"] as const;
export const ALL_SIZES = [...ADULT_SIZES, ...KID_SIZES] as const;

export type SizeGroup = { label: string; sizes: readonly string[] };
export const SIZE_GROUPS: SizeGroup[] = [
  { label: "Böyük ölçülər", sizes: ADULT_SIZES },
  { label: "Uşaq ölçüləri (yaş)", sizes: KID_SIZES },
];

export const STOCK_STATUSES = [
  { value: "in_stock", label: "Əldədir" },
  { value: "on_way", label: "Yoldadır" },
  { value: "pre_order", label: "Sifarişlə" },
] as const;

export type StockStatus = (typeof STOCK_STATUSES)[number]["value"];

export function stockLabel(value: string): string {
  return STOCK_STATUSES.find((s) => s.value === value)?.label ?? "Əldədir";
}

export const DEFAULT_SETTINGS: Record<string, string> = {
  whatsappNumber: "+994777457080",
  instagramUrl: "",
  tiktokUrl: "",
  heroTitle: "OYUN\nSƏNİN\nRƏNGLƏRİNDƏ",
  heroSubtitle:
    "Klub, milli komanda, retro və uşaq formaları. Orijinala sadiq keyfiyyət — qiymət və sifariş üçün WhatsApp-da yaz.",
  campaignText: "",
};

export const SETTING_KEYS = Object.keys(DEFAULT_SETTINGS);

/** Emoji matching a product category (by slug). Defaults to a jersey. */
const CATEGORY_EMOJI: Record<string, string> = {
  klublar: "⚽",
  "milli-komandalar": "🏆",
  retro: "👕",
  "usaq-destleri": "🧒",
  basketbol: "🏀",
  f1: "🏎️",
  ufc: "🥊",
  hokkey: "🏒",
  reqbi: "🏉",
  "amerikan-futbolu": "🏈",
  aksesuar: "🧢",
  sort: "🩳",
};

export function categoryEmoji(slug?: string): string {
  return (slug && CATEGORY_EMOJI[slug]) || "👕";
}

export const MARQUEE_ITEMS = [
  "KLUBLAR",
  "MİLLİ KOMANDALAR",
  "RETRO",
  "UŞAQ DƏSTLƏRİ",
] as const;

export const HOW_TO_STEPS = [
  {
    n: "01",
    title: "Formanı və ölçünü seç",
    text: "Kataloqdan bəyəndiyin formanı aç, sənə uyğun ölçünü işarələ.",
  },
  {
    n: "02",
    title: "WhatsApp-da bizə yaz",
    text: "“WhatsApp-da soruş” düyməsi seçdiyin forma və ölçü ilə bizə hazır mesaj göndərir.",
  },
  {
    n: "03",
    title: "Qısa zamanda əlində",
    text: "Sifarişi təsdiqlə, behi ödə — forman qısa zamanda ünvanına çatsın.",
  },
] as const;

export type SizeRow = {
  size: string;
  height: string;
  weight: string;
  chest: string;
  length: string;
};
export type SizeGuide = {
  key: string;
  label: string;
  fit: string;
  rows: SizeRow[];
};

// Böyük (adult) ölçülər — Asiya biçimi. Hər idman növü üçün ayrıca cədvəl.
export const SIZE_GUIDES: SizeGuide[] = [
  {
    key: "futbol",
    label: "Futbol",
    fit: "Bədənə uyğun biçim — klub, milli və retro formalar. Boy və çəkinə görə seç.",
    rows: [
      { size: "S", height: "160–168", weight: "50–60", chest: "90–96", length: "68" },
      { size: "M", height: "165–173", weight: "58–68", chest: "96–102", length: "70" },
      { size: "L", height: "170–178", weight: "66–77", chest: "102–108", length: "72" },
      { size: "XL", height: "175–183", weight: "75–86", chest: "108–114", length: "74" },
      { size: "XXL", height: "180–190", weight: "84–98", chest: "114–122", length: "76" },
    ],
  },
  {
    key: "basketbol",
    label: "Basketbol",
    fit: "Sərbəst və uzun biçim — adətən adi ölçünü seç.",
    rows: [
      { size: "S", height: "165–172", weight: "55–65", chest: "96–104", length: "72" },
      { size: "M", height: "170–178", weight: "63–73", chest: "104–112", length: "75" },
      { size: "L", height: "175–183", weight: "71–82", chest: "112–120", length: "78" },
      { size: "XL", height: "180–188", weight: "80–92", chest: "120–128", length: "81" },
      { size: "XXL", height: "185–195", weight: "90–105", chest: "128–136", length: "84" },
    ],
  },
  {
    key: "amerikan",
    label: "Amerikan futbolu",
    fit: "Oversize oyun forması — çiyin/gövdə geniş gəlir.",
    rows: [
      { size: "S", height: "165–173", weight: "60–72", chest: "104–112", length: "74" },
      { size: "M", height: "170–178", weight: "70–82", chest: "112–120", length: "76" },
      { size: "L", height: "175–183", weight: "80–93", chest: "120–128", length: "78" },
      { size: "XL", height: "180–188", weight: "90–105", chest: "128–138", length: "80" },
      { size: "XXL", height: "185–195", weight: "100–118", chest: "138–148", length: "82" },
    ],
  },
  {
    key: "ufc",
    label: "UFC",
    fit: "Rashguard / walkout — bədənə uyğun, elastik biçim.",
    rows: [
      { size: "S", height: "160–168", weight: "55–65", chest: "88–94", length: "66" },
      { size: "M", height: "165–173", weight: "63–72", chest: "94–100", length: "68" },
      { size: "L", height: "170–178", weight: "70–80", chest: "100–106", length: "70" },
      { size: "XL", height: "175–183", weight: "78–88", chest: "106–112", length: "72" },
      { size: "XXL", height: "180–188", weight: "86–98", chest: "112–120", length: "74" },
    ],
  },
  {
    key: "hokkey",
    label: "Hokkey",
    fit: "Çox geniş biçim (avadanlıq üstündən geyilir) — bir ölçü kiçik də seçə bilərsən.",
    rows: [
      { size: "S", height: "165–173", weight: "60–72", chest: "108–116", length: "74" },
      { size: "M", height: "170–178", weight: "70–82", chest: "116–124", length: "77" },
      { size: "L", height: "175–183", weight: "80–93", chest: "124–132", length: "80" },
      { size: "XL", height: "180–188", weight: "90–105", chest: "132–142", length: "83" },
      { size: "XXL", height: "185–195", weight: "100–120", chest: "142–152", length: "86" },
    ],
  },
];

export const SIZE_NOTE =
  "Ölçülər Asiya biçimidir — bir az kiçik gəlir. Sərhəddə qalırsansa bir ölçü böyük seçməyi tövsiyə edirik. Əmin deyilsənsə, boyunu və çəkini WhatsApp-da yaz.";

export const FAQ_ITEMS = [
  {
    q: "Çatdırılma nə qədər çəkir?",
    a: "Sifariş təsdiqləndikdən sonra formanı hazırlayıb ünvanına göndəririk. Təxmini müddəti WhatsApp-da təsdiqləyirik.",
  },
  {
    q: "Beh (avans) qaydası necədir?",
    a: "Sifarişi rəsmiləşdirmək üçün kiçik bir beh alınır, qalan məbləği isə forma əlinizə çatanda ödəyirsiniz. Şərtləri WhatsApp-da izah edirik.",
  },
  {
    q: "Formaların keyfiyyəti necədir?",
    a: "Orijinal dizayna sadiq, nəfəs alan idman parçasından hazırlanmış premium formalar təqdim edirik. Tikişlər və emblemlər səliqəli işlənir.",
  },
  {
    q: "Məhsulu qaytarmaq olar?",
    a: "Formalar sifariş əsasında hazırlandığı üçün qaytarılma və geri ödəniş yoxdur. Ölçü seçimindən əmin deyilsənsə, sifarişdən əvvəl WhatsApp-da bizimlə məsləhətləş.",
  },
  {
    q: "Qiymətlər saytda niyə yoxdur?",
    a: "Ən sərfəli və aktual qiyməti hər forma üçün fərdi olaraq WhatsApp-da bildiririk. Beləcə həmişə ən yaxşı təklifi ala bilirsiniz.",
  },
] as const;
