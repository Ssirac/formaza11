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
};

export const SETTING_KEYS = Object.keys(DEFAULT_SETTINGS);

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
    title: "15–20 günə əlində",
    text: "Sifarişi təsdiqlə, behi ödə — forman qısa zamanda ünvanına çatsın.",
  },
] as const;

export const SIZE_GUIDE_ROWS = [
  { size: "S", chest: "88–94", length: "68", advice: "48–52 beden" },
  { size: "M", chest: "96–102", length: "71", advice: "52–54 beden" },
  { size: "L", chest: "104–110", length: "74", advice: "54–56 beden" },
  { size: "XL", chest: "112–118", length: "77", advice: "56–58 beden" },
  { size: "XXL", chest: "120–126", length: "80", advice: "58–60 beden" },
] as const;

export const SIZE_NOTE =
  "Ölçülər bir az dar gəlir — adətən geyindiyindən bir ölçü böyük seçməyi tövsiyə edirik.";

export const FAQ_ITEMS = [
  {
    q: "Çatdırılma nə qədər çəkir?",
    a: "Adətən sifariş təsdiqləndikdən sonra 15–20 iş günü ərzində əlinizdə olur. Dəqiq müddəti WhatsApp-da təsdiqləyirik.",
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
    q: "Ölçü uyğun gəlməsə dəyişdirmək olar?",
    a: "Bəli. Ölçü uyğun gəlmədikdə şərtlər daxilində dəyişdirmə mümkündür — bizimlə WhatsApp vasitəsilə əlaqə saxlayın.",
  },
  {
    q: "Qiymətlər saytda niyə yoxdur?",
    a: "Ən sərfəli və aktual qiyməti hər forma üçün fərdi olaraq WhatsApp-da bildiririk. Beləcə həmişə ən yaxşı təklifi ala bilirsiniz.",
  },
] as const;
