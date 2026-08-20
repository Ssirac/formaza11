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

// Çin (1688 / Taobao) idman forması ölçüləri — Asiya biçimi (Avropadan ~1 ölçü kiçik).
export const SIZE_GUIDE_ROWS = [
  { size: "S", chest: "90–96", length: "68", height: "160–168", weight: "50–60", advice: "44–46 beden" },
  { size: "M", chest: "96–102", length: "70", height: "165–173", weight: "58–68", advice: "46–48 beden" },
  { size: "L", chest: "102–108", length: "72", height: "170–178", weight: "66–77", advice: "48–50 beden" },
  { size: "XL", chest: "108–114", length: "74", height: "175–183", weight: "75–86", advice: "50–52 beden" },
  { size: "XXL", chest: "114–122", length: "76", height: "180–190", weight: "84–98", advice: "52–54 beden" },
] as const;

export const SIZE_NOTE =
  "Çin (1688 / Taobao) ölçüləridir — Avropa ölçüsündən bir az kiçik gəlir. Sərhəddə qalırsansa bir ölçü böyük seçməyi tövsiyə edirik.";

export const SPORT_FIT_NOTE =
  "Basketbol, Amerikan futbolu, UFC və hokkey formaları daha sərbəst (oversize) biçimdədir — adətən adi ölçünü seç. Klub, milli və retro futbol formaları bədənə uyğun biçimdədir; boy və çəkiyə görə seç.";

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
