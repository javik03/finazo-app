export type EnCorridor = {
  slug: string;
  esSlug: string;
  from: string;
  to: string;
  label: string;
  fromLabel: string;
  toLabel: string;
  fromFlag: string;
  toFlag: string;
};

export const EN_CORRIDORS: EnCorridor[] = [
  {
    slug: "us-to-el-salvador",
    esSlug: "eeuu-el-salvador",
    from: "US",
    to: "SV",
    label: "US → El Salvador",
    fromLabel: "United States",
    toLabel: "El Salvador",
    fromFlag: "🇺🇸",
    toFlag: "🇸🇻",
  },
  {
    slug: "us-to-guatemala",
    esSlug: "eeuu-guatemala",
    from: "US",
    to: "GT",
    label: "US → Guatemala",
    fromLabel: "United States",
    toLabel: "Guatemala",
    fromFlag: "🇺🇸",
    toFlag: "🇬🇹",
  },
  {
    slug: "us-to-honduras",
    esSlug: "eeuu-honduras",
    from: "US",
    to: "HN",
    label: "US → Honduras",
    fromLabel: "United States",
    toLabel: "Honduras",
    fromFlag: "🇺🇸",
    toFlag: "🇭🇳",
  },
  {
    slug: "us-to-mexico",
    esSlug: "eeuu-mexico",
    from: "US",
    to: "MX",
    label: "US → Mexico",
    fromLabel: "United States",
    toLabel: "Mexico",
    fromFlag: "🇺🇸",
    toFlag: "🇲🇽",
  },
  {
    slug: "us-to-dominican-republic",
    esSlug: "eeuu-republica-dominicana",
    from: "US",
    to: "DO",
    label: "US → Dominican Republic",
    fromLabel: "United States",
    toLabel: "Dominican Republic",
    fromFlag: "🇺🇸",
    toFlag: "🇩🇴",
  },
  {
    slug: "spain-to-el-salvador",
    esSlug: "espana-el-salvador",
    from: "ES",
    to: "SV",
    label: "Spain → El Salvador",
    fromLabel: "Spain",
    toLabel: "El Salvador",
    fromFlag: "🇪🇸",
    toFlag: "🇸🇻",
  },
  {
    slug: "canada-to-el-salvador",
    esSlug: "canada-el-salvador",
    from: "CA",
    to: "SV",
    label: "Canada → El Salvador",
    fromLabel: "Canada",
    toLabel: "El Salvador",
    fromFlag: "🇨🇦",
    toFlag: "🇸🇻",
  },
  {
    slug: "uk-to-el-salvador",
    esSlug: "reino-unido-el-salvador",
    from: "GB",
    to: "SV",
    label: "UK → El Salvador",
    fromLabel: "United Kingdom",
    toLabel: "El Salvador",
    fromFlag: "🇬🇧",
    toFlag: "🇸🇻",
  },
];

export function getEnCorridorBySlug(slug: string): EnCorridor | undefined {
  return EN_CORRIDORS.find((c) => c.slug === slug);
}

export function getEnCorridorByEsSlug(esSlug: string): EnCorridor | undefined {
  return EN_CORRIDORS.find((c) => c.esSlug === esSlug);
}
