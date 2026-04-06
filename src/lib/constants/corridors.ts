export type Corridor = {
  slug: string;
  from: string;
  to: string;
  label: string;
  fromLabel: string;
  toLabel: string;
  fromFlag: string;
  toFlag: string;
};

export const CORRIDORS: Corridor[] = [
  {
    slug: "eeuu-el-salvador",
    from: "US",
    to: "SV",
    label: "EE.UU. → El Salvador",
    fromLabel: "Estados Unidos",
    toLabel: "El Salvador",
    fromFlag: "🇺🇸",
    toFlag: "🇸🇻",
  },
  {
    slug: "eeuu-guatemala",
    from: "US",
    to: "GT",
    label: "EE.UU. → Guatemala",
    fromLabel: "Estados Unidos",
    toLabel: "Guatemala",
    fromFlag: "🇺🇸",
    toFlag: "🇬🇹",
  },
  {
    slug: "eeuu-honduras",
    from: "US",
    to: "HN",
    label: "EE.UU. → Honduras",
    fromLabel: "Estados Unidos",
    toLabel: "Honduras",
    fromFlag: "🇺🇸",
    toFlag: "🇭🇳",
  },
  {
    slug: "eeuu-mexico",
    from: "US",
    to: "MX",
    label: "EE.UU. → México",
    fromLabel: "Estados Unidos",
    toLabel: "México",
    fromFlag: "🇺🇸",
    toFlag: "🇲🇽",
  },
  {
    slug: "espana-el-salvador",
    from: "ES",
    to: "SV",
    label: "España → El Salvador",
    fromLabel: "España",
    toLabel: "El Salvador",
    fromFlag: "🇪🇸",
    toFlag: "🇸🇻",
  },
  {
    slug: "canada-el-salvador",
    from: "CA",
    to: "SV",
    label: "Canadá → El Salvador",
    fromLabel: "Canadá",
    toLabel: "El Salvador",
    fromFlag: "🇨🇦",
    toFlag: "🇸🇻",
  },
  {
    slug: "italia-el-salvador",
    from: "IT",
    to: "SV",
    label: "Italia → El Salvador",
    fromLabel: "Italia",
    toLabel: "El Salvador",
    fromFlag: "🇮🇹",
    toFlag: "🇸🇻",
  },
  {
    slug: "reino-unido-el-salvador",
    from: "GB",
    to: "SV",
    label: "Reino Unido → El Salvador",
    fromLabel: "Reino Unido",
    toLabel: "El Salvador",
    fromFlag: "🇬🇧",
    toFlag: "🇸🇻",
  },
];

export function getCorridorBySlug(slug: string): Corridor | undefined {
  return CORRIDORS.find((c) => c.slug === slug);
}
