const IMAGES = {
  tomate:
    "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=80",
  papa:
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80",
  zanahoria:
    "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=900&q=80",
  maiz:
    "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=900&q=80",
  aguacate:
    "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=900&q=80",
  banano:
    "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=80",
  naranja:
    "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=900&q=80",
  lechuga:
    "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=900&q=80",
  cafe:
    "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80",
  hortalizas:
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80",
  tuberculos:
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80",
  frutas:
    "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=900&q=80",
  default:
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80",
};

export const FALLBACK_IMAGE = IMAGES.hortalizas;

const ALIASES = [
  ["tomate", "tomate"],
  ["papa", "papa"],
  ["patata", "papa"],
  ["zanahoria", "zanahoria"],
  ["maiz", "maiz"],
  ["maíz", "maiz"],
  ["aguacate", "aguacate"],
  ["banano", "banano"],
  ["platano", "banano"],
  ["plátano", "banano"],
  ["naranja", "naranja"],
  ["lechuga", "lechuga"],
  ["cafe", "cafe"],
  ["café", "cafe"],
  ["hortaliza", "hortalizas"],
  ["tuberculo", "tuberculos"],
  ["tubérculo", "tuberculos"],
  ["fruta", "frutas"],
];

function normalize(text = "") {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function resolveProductImage({ imageUrl, name, category } = {}) {
  if (imageUrl && String(imageUrl).trim()) return String(imageUrl).trim();

  const haystack = normalize(`${name || ""} ${category || ""}`);
  for (const [needle, key] of ALIASES) {
    if (haystack.includes(normalize(needle))) return IMAGES[key];
  }
  return IMAGES.default;
}

export const IMAGE_PRESETS = [
  { label: "Tomate", url: IMAGES.tomate },
  { label: "Papa", url: IMAGES.papa },
  { label: "Zanahoria", url: IMAGES.zanahoria },
  { label: "Maíz", url: IMAGES.maiz },
  { label: "Aguacate", url: IMAGES.aguacate },
  { label: "Banano", url: IMAGES.banano },
  { label: "Naranja", url: IMAGES.naranja },
  { label: "Lechuga", url: IMAGES.lechuga },
  { label: "Café", url: IMAGES.cafe },
  { label: "Hortalizas varias", url: IMAGES.hortalizas },
  { label: "Frutas varias", url: IMAGES.frutas },
];
