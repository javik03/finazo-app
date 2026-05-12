/**
 * Seed US authors for finazo.us E-E-A-T scaffolding
 * Run once: npx tsx src/db/seed-us-authors.ts
 *
 * NOTE: bios are placeholders — Javier + Sabrina to review and replace
 *       before publishing. avatarUrl pending headshots.
 */

import { db } from "@/lib/db";
import { usAuthors } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import pino from "pino";

const logger = pino({ name: "seed-us-authors" });

const AUTHORS = [
  {
    slug: "javier-keough",
    displayName: "Javier Keough",
    bioShort:
      "Fundador de Finazo. Agente licenciado de seguros (Florida 2-20). Construye productos financieros para la comunidad Hispana en EE.UU.",
    bioLong:
      "Javier Keough es fundador de Finazo LLC, publicación independiente de finanzas personales para Hispanos en EE.UU. Es agente de seguros licenciado en Florida (licencia 2-20) y socio afiliado de Cubierto (agencia de seguros) y Hogares (broker hipotecario, próximamente). Lleva más de una década construyendo productos para la comunidad Hispana, con foco en el acceso a crédito, seguros y servicios financieros sin papeles tradicionales. Escribe sobre cómo navegar el sistema financiero de EE.UU. en español, con énfasis en familias con ITIN, self-employed y recién llegados.",
    linkedinUrl: "https://www.linkedin.com/in/javier-keough",
    twitterUrl: null,
    avatarUrl: null,
    expertise: ["seguros", "hipotecas", "credito", "remesas", "fintech"],
    active: true,
  },
  {
    slug: "sabrina-keough",
    displayName: "Sabrina Keough",
    bioShort:
      "Editora de Finazo. Cubre seguros, hipotecas y servicios financieros para la comunidad Hispana en EE.UU.",
    bioLong:
      "Sabrina Keough es editora en Finazo, donde cubre seguros, hipotecas y productos financieros para Hispanos en EE.UU. Su enfoque es traducir el lenguaje del sistema financiero gringo a español claro — sin jerga, sin letra chica, y con números reales. Antes de Finazo trabajó en marketing y comunicación de productos digitales en LATAM.",
    linkedinUrl: "https://es.linkedin.com/in/sabrina-keough",
    twitterUrl: null,
    avatarUrl: null,
    expertise: ["seguros", "salud", "vida", "educacion-financiera"],
    active: true,
  },
];

async function seedUsAuthors(): Promise<void> {
  logger.info({ count: AUTHORS.length }, "Seeding US authors");

  for (const author of AUTHORS) {
    await db
      .insert(usAuthors)
      .values(author)
      .onConflictDoUpdate({
        target: usAuthors.slug,
        set: {
          displayName: sql.raw(`EXCLUDED.display_name`),
          bioShort: sql.raw(`EXCLUDED.bio_short`),
          bioLong: sql.raw(`EXCLUDED.bio_long`),
          linkedinUrl: sql.raw(`EXCLUDED.linkedin_url`),
          twitterUrl: sql.raw(`EXCLUDED.twitter_url`),
          avatarUrl: sql.raw(`EXCLUDED.avatar_url`),
          expertise: sql.raw(`EXCLUDED.expertise`),
          active: sql.raw(`EXCLUDED.active`),
        },
      });
    logger.info({ slug: author.slug }, "Upserted author");
  }

  logger.info("Done");
  process.exit(0);
}

seedUsAuthors().catch((err: unknown) => {
  logger.error({ err }, "Seeding failed");
  process.exit(1);
});
