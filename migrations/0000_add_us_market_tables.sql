CREATE TABLE "article_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid,
	"author_name" text NOT NULL,
	"author_email" text,
	"content" text NOT NULL,
	"status" text DEFAULT 'pending',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"meta_description" text,
	"content" text NOT NULL,
	"category" text NOT NULL,
	"country" text DEFAULT 'SV',
	"keywords" text[],
	"status" text DEFAULT 'draft',
	"featured_image_url" text,
	"word_count" integer,
	"generated_by" text DEFAULT 'claude',
	"author_name" text,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "insurance_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid,
	"product_name" text NOT NULL,
	"insurance_type" text NOT NULL,
	"price_from" numeric(10, 2),
	"coverage_amount" numeric(12, 2),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "insurance_providers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo_url" text,
	"affiliate_url" text,
	"country" text DEFAULT 'SV' NOT NULL,
	"active" boolean DEFAULT true,
	CONSTRAINT "insurance_providers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "loan_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid,
	"product_name" text NOT NULL,
	"loan_type" text NOT NULL,
	"rate_min" numeric(6, 4),
	"rate_max" numeric(6, 4),
	"amount_min" numeric(12, 2),
	"amount_max" numeric(12, 2),
	"term_min_months" integer,
	"term_max_months" integer,
	"ssf_rate_source" boolean DEFAULT false,
	"scraped_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "loan_providers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo_url" text,
	"affiliate_url" text,
	"provider_type" text NOT NULL,
	"country" text DEFAULT 'SV' NOT NULL,
	"active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "loan_providers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "rate_change_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"old_value" jsonb,
	"new_value" jsonb,
	"article_generated" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "remittance_providers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo_url" text,
	"affiliate_url" text,
	"active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "remittance_providers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "remittance_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid,
	"from_country" text NOT NULL,
	"to_country" text NOT NULL,
	"from_currency" text NOT NULL,
	"to_currency" text NOT NULL,
	"exchange_rate" numeric(10, 6),
	"fee_flat" numeric(10, 2),
	"fee_percent" numeric(5, 4),
	"transfer_speed" text,
	"min_amount" numeric(10, 2),
	"max_amount" numeric(10, 2),
	"scraped_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "us_auto_insurance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_name" text NOT NULL,
	"state" text NOT NULL,
	"coverage_type" text NOT NULL,
	"annual_premium_avg" numeric(10, 2),
	"annual_premium_min" numeric(10, 2),
	"annual_premium_max" numeric(10, 2),
	"source_url" text,
	"data_year" integer,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "us_health_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cms_plan_id" text NOT NULL,
	"plan_name" text NOT NULL,
	"issuer_name" text NOT NULL,
	"state" text NOT NULL,
	"county_fips" text,
	"metal_level" text NOT NULL,
	"plan_type" text,
	"premium_adult_40" numeric(10, 2),
	"deductible_individual" numeric(10, 2),
	"oop_max_individual" numeric(10, 2),
	"plan_year" integer NOT NULL,
	"scraped_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "us_life_insurance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_name" text NOT NULL,
	"provider_slug" text NOT NULL,
	"affiliate_url" text,
	"product_type" text NOT NULL,
	"term_years" integer,
	"coverage_amount" numeric(12, 2) NOT NULL,
	"age_group" integer NOT NULL,
	"gender" text NOT NULL,
	"health_class" text NOT NULL,
	"monthly_premium" numeric(8, 2) NOT NULL,
	"scraped_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "us_loan_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid,
	"product_name" text NOT NULL,
	"loan_type" text NOT NULL,
	"apr_min" numeric(6, 4),
	"apr_max" numeric(6, 4),
	"amount_min" numeric(12, 2),
	"amount_max" numeric(12, 2),
	"term_min_months" integer,
	"term_max_months" integer,
	"min_credit_score" integer,
	"origination_fee_percent" numeric(5, 4),
	"funding_days" integer,
	"scraped_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "us_loan_providers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo_url" text,
	"affiliate_url" text,
	"provider_type" text NOT NULL,
	"accepts_itin" boolean DEFAULT false,
	"active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "us_loan_providers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "article_comments" ADD CONSTRAINT "article_comments_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insurance_products" ADD CONSTRAINT "insurance_products_provider_id_insurance_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."insurance_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_products" ADD CONSTRAINT "loan_products_provider_id_loan_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."loan_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "remittance_rates" ADD CONSTRAINT "remittance_rates_provider_id_remittance_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."remittance_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "us_loan_products" ADD CONSTRAINT "us_loan_products_provider_id_us_loan_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."us_loan_providers"("id") ON DELETE no action ON UPDATE no action;