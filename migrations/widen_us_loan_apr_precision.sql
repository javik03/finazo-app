-- ============================================================================
-- Widen us_loan_products APR columns to allow APRs > 99.9999%.
-- ITIN / payday-tier lenders (OppLoans, Oportun) routinely report APRs
-- above 100% — original decimal(6,4) overflowed.
-- ============================================================================

ALTER TABLE us_loan_products
  ALTER COLUMN apr_min TYPE DECIMAL(6, 2),
  ALTER COLUMN apr_max TYPE DECIMAL(6, 2);
