/**
 * PerformAir — aviation MRO domain schema
 *
 * Four-layer architecture per entity:
 *
 *   CMS / Postgres   — source of truth (parts, inventory, RFQs, suppliers)
 *   IPFS             — document proof (airworthiness certs, trace docs pinned with CID + sha256)
 *   NFT / contract   — authenticity + transfer (cert NFT minted from IPFS metadata)
 *
 * Tables:
 *   parts                  — part number catalog
 *   suppliers              — approved suppliers / vendors
 *   inventory_items        — serialized (S/N-tracked) physical units
 *   traceability_documents — airworthiness docs per unit, pinned to IPFS, optionally minted as NFT
 *   rfqs                   — inbound requests for quote (header)
 *   rfq_line_items         — individual part lines per RFQ
 */

import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { contacts, documents, organizations } from '../../core';

// ─── Enums ────────────────────────────────────────────────────────────────────

/**
 * Full FAA/industry condition code set.
 * Matches the Zod CONDITION_CODES in performair-nextjs/src/types/rfq.ts.
 */
export const inventoryConditionEnum = pgEnum('inventory_condition', [
  'NE',   // New
  'SV',   // Serviceable
  'OH',   // Overhauled
  'AR',   // As Removed
  'NS',   // New Surplus
  'RP',   // Repairable
  'INS',  // Inspected
]);

export const inventoryStatusEnum = pgEnum('inventory_status', [
  'available',
  'in_repair',
  'on_loan',
  'reserved',
  'sold',
  'scrapped',
]);

/**
 * Airworthiness release document types.
 * Matches certTypeEnum in performair-nextjs Drizzle schema.
 */
export const certTypeEnum = pgEnum('cert_type', [
  'FAA_8130',       // FAA Form 8130-3 Airworthiness Approval Tag
  'EASA_Form1',     // EASA Form 1
  'CAAC_AP_Form',   // CAAC Airworthiness tag
  'COC',            // Certificate of Conformance
  'MRO_Release',    // MRO work order release
  'OEM_New_Release',// OEM factory new release
  'Other',
]);

/**
 * Mint status lifecycle — mirrors bear-creek mintStatusEnum.
 * draft    → cert entered in CMS, not yet pinned
 * ready    → document pinned to IPFS, metadata built, awaiting mint
 * submitted→ mint tx broadcast, waiting for on-chain confirmation
 * confirmed→ token ID confirmed on-chain, stored in Postgres
 * failed   → tx failed, can retry
 */
export const certMintStatusEnum = pgEnum('cert_mint_status', [
  'draft',
  'ready',
  'submitted',
  'confirmed',
  'failed',
]);

export const rfqStatusEnum = pgEnum('rfq_status', [
  'new',
  'in_review',
  'quoted',
  'won',
  'lost',
  'cancelled',
]);

export const rfqSourceEnum = pgEnum('rfq_source', [
  'website',
  'email',
  'phone',
  'portal',
]);

// ─── parts ───────────────────────────────────────────────────────────────────
/**
 * Part number catalog — the capability list.
 * Sourced from CapabilityData.csv (22,737 unique part numbers).
 * Aircraft types stored in a separate junction table (not here).
 */
export const parts = pgTable(
  'parts',
  {
    id:             uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id),
    partNumber:     text('part_number').notNull(),
    nomenclature:   text('nomenclature').notNull(),
    /** Full ATA reference e.g. "25-36-62" */
    ataNumber:      text('ata_number'),
    /** First segment e.g. "25" — used for facet filtering */
    ataChapter:     text('ata_chapter'),
    manufacturer:   text('manufacturer'),
    description:    text('description'),
    easa:           boolean('easa').notNull().default(true),
    caac:           boolean('caac').notNull().default(false),
    derAvailable:   boolean('der_available').notNull().default(false),
    active:         boolean('active').notNull().default(true),
    createdAt:      timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt:      timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    orgIdx:        index('parts_organization_id_idx').on(t.organizationId),
    partNumberIdx: index('parts_org_part_number_idx').on(t.organizationId, t.partNumber),
    ataChapterIdx: index('parts_ata_chapter_idx').on(t.ataChapter),
    caacIdx:       index('parts_caac_idx').on(t.caac),
    derIdx:        index('parts_der_idx').on(t.derAvailable),
  })
);

// ─── suppliers ───────────────────────────────────────────────────────────────
export const suppliers = pgTable(
  'suppliers',
  {
    id:             uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id),
    name:           text('name').notNull(),
    contactEmail:   text('contact_email'),
    phone:          text('phone'),
    /** 1–5 internal rating */
    rating:         integer('rating'),
    notes:          text('notes'),
    contactId:      uuid('contact_id').references(() => contacts.id),
    active:         boolean('active').notNull().default(true),
    createdAt:      timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt:      timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    orgIdx: index('suppliers_organization_id_idx').on(t.organizationId),
  })
);

// ─── inventory_items ─────────────────────────────────────────────────────────
/**
 * Serialized (S/N-tracked) physical units — "rotables" in PerformAir terminology.
 * One row = one physical part with a serial number.
 *
 * Postgres layer: all structured data lives here.
 * IPFS layer: cert docs are pinned per traceability_document row (FK below).
 * NFT layer: cert NFT fields live on traceability_documents, not here,
 *            because the document is what gets minted — not the item itself.
 */
export const inventoryItems = pgTable(
  'inventory_items',
  {
    id:             uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id),
    partId:         uuid('part_id').notNull().references(() => parts.id),

    serialNumber:   text('serial_number'),
    condition:      inventoryConditionEnum('condition').notNull(),
    status:         inventoryStatusEnum('status').notNull().default('available'),

    /** Location in warehouse e.g. "Aisle B, Shelf 3, Bin 12" */
    location:       text('location'),
    bin:            text('bin'),

    supplierId:     uuid('supplier_id').references(() => suppliers.id),

    /** Aircraft registration or MSN this was removed from */
    removedFrom:    text('removed_from'),
    totalTimeSinceNewHours:  integer('total_time_since_new_hours'),
    timeSinceOverhaulHours:  integer('time_since_overhaul_hours'),
    cyclesSinceNew:          integer('cycles_since_new'),
    cyclesSinceOverhaul:     integer('cycles_since_overhaul'),

    /** Shelf-life expiry ISO date string "YYYY-MM-DD" */
    shelfLife:      text('shelf_life'),
    /** Price in cents USD */
    priceCents:     integer('price_cents'),
    priceOnRequest: boolean('price_on_request').notNull().default(false),

    receivedAt:     timestamp('received_at', { withTimezone: true }),
    notes:          text('notes'),
    createdAt:      timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt:      timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    orgIdx:      index('inventory_items_organization_id_idx').on(t.organizationId),
    partIdx:     index('inventory_items_part_id_idx').on(t.partId),
    statusIdx:   index('inventory_items_status_idx').on(t.status),
    conditionIdx:index('inventory_items_condition_idx').on(t.condition),
  })
);

// ─── traceability_documents ──────────────────────────────────────────────────
/**
 * Airworthiness release and traceability documents per inventory unit.
 *
 * This table spans all four layers:
 *
 *   CMS ops layer    → type, issuedBy, issuedAt, inventoryItemId, documentId
 *   Postgres truth   → all fields stored and queryable here
 *   IPFS proof layer → documentCid + documentSha256 (the actual file, pinned)
 *                      metadataCid + metadataUri    (the NFT metadata JSON, pinned)
 *   NFT / contract   → contractAddress, chainId, tokenId, txHash,
 *                      mintedToWallet, mintStatus, mintedAt
 *
 * Flow:
 *   1. Staff uploads cert PDF via CMS → stored in R2, documentId FK written
 *   2. Background job pins PDF to IPFS → documentCid + documentSha256 written
 *   3. Metadata JSON built (part number, cert type, CID, sha256, attributes)
 *      and pinned to IPFS → metadataCid + metadataUri written
 *   4. mintStatus set to 'ready'
 *   5. Admin triggers mint → smart contract called with metadataUri
 *   6. On tx broadcast  → txHash written, mintStatus = 'submitted'
 *   7. On confirmation  → tokenId written, mintStatus = 'confirmed'
 *
 * The resulting NFT is the on-chain proof that this document exists,
 * is immutable (IPFS CID), and is associated with this part/serial number.
 */
export const traceabilityDocuments = pgTable(
  'traceability_documents',
  {
    id:              uuid('id').primaryKey().defaultRandom(),
    organizationId:  uuid('organization_id').notNull().references(() => organizations.id),
    inventoryItemId: uuid('inventory_item_id').notNull().references(() => inventoryItems.id),

    // ── CMS / Postgres layer ─────────────────────────────────────────────────
    /** FK to core documents table (R2 storage URL + mime type) */
    documentId:      uuid('document_id').references(() => documents.id),
    type:            certTypeEnum('type').notNull(),
    /** Document or work order reference number e.g. "8130-2024-001" */
    reference:       text('reference'),
    issuedBy:        text('issued_by').notNull(),
    /** ISO date string "YYYY-MM-DD" */
    issuedDate:      text('issued_date'),

    // ── IPFS proof layer ─────────────────────────────────────────────────────
    /**
     * CID of the pinned source document (PDF/image).
     * Independently verifiable: sha256(file) should match documentSha256.
     */
    documentCid:     text('document_cid'),
    documentSha256:  text('document_sha256'),
    /**
     * CID of the NFT metadata JSON pinned to IPFS.
     * Contains: name, description, image, attributes (cert type, issued by,
     * part number, serial number, issued date), source_document { cid, sha256 }.
     */
    metadataCid:     text('metadata_cid'),
    /** ipfs://<metadataCid>/<slug>.json — passed to the mint call */
    metadataUri:     text('metadata_uri'),

    // ── NFT / smart contract layer ───────────────────────────────────────────
    contractAddress: text('contract_address'),
    /** EIP-155 chain ID: 1=mainnet, 137=polygon, 8453=base, 84532=base-sepolia */
    chainId:         integer('chain_id'),
    /** On-chain token ID (returned after mint confirmation) */
    tokenId:         text('token_id'),
    /** Transaction hash of the mint call */
    txHash:          text('tx_hash'),
    /** Wallet address the NFT was minted to */
    mintedToWallet:  text('minted_to_wallet'),
    mintStatus:      certMintStatusEnum('mint_status').notNull().default('draft'),
    mintedAt:        timestamp('minted_at', { withTimezone: true }),

    createdAt:       timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt:       timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    orgIdx:      index('traceability_documents_organization_id_idx').on(t.organizationId),
    inventoryIdx:index('traceability_documents_inventory_item_id_idx').on(t.inventoryItemId),
    mintStatusIdx:index('traceability_documents_mint_status_idx').on(t.mintStatus),
    tokenIdx:    index('traceability_documents_token_id_idx').on(t.tokenId),
    cidIdx:      index('traceability_documents_document_cid_idx').on(t.documentCid),
  })
);

// ─── rfqs ─────────────────────────────────────────────────────────────────────
/**
 * Inbound request-for-quote submissions.
 * One row = one RFQ header. Line items are in rfq_line_items.
 *
 * These are pure CMS/Postgres layer — no IPFS or NFT involvement.
 * Quote documents (PDFs sent to customers) could be pinned to IPFS
 * in the future as a tamper-proof audit trail.
 */
export const rfqs = pgTable(
  'rfqs',
  {
    id:             uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id),

    status:         rfqStatusEnum('status').notNull().default('new'),
    source:         rfqSourceEnum('source').notNull().default('website'),

    companyName:    text('company_name').notNull(),
    contactName:    text('contact_name').notNull(),
    email:          text('email').notNull(),
    phone:          text('phone'),
    message:        text('message'),

    /** Aircraft on Ground — triggers priority handling */
    isAog:          boolean('is_aog').notNull().default(false),

    /** Internal assignment */
    assignedTo:     text('assigned_to'),
    /** Internal notes — never visible to customer */
    internalNotes:  text('internal_notes'),
    /** Quoted total in cents USD */
    quotedPriceCents: integer('quoted_price_cents'),
    quoteSentAt:    timestamp('quote_sent_at', { withTimezone: true }),

    createdAt:      timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt:      timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    orgIdx:    index('rfqs_organization_id_idx').on(t.organizationId),
    statusIdx: index('rfqs_status_idx').on(t.status),
    aogIdx:    index('rfqs_is_aog_idx').on(t.isAog),
    emailIdx:  index('rfqs_email_idx').on(t.email),
  })
);

// ─── rfq_line_items ───────────────────────────────────────────────────────────
/**
 * Individual part lines within an RFQ.
 * Each line references a part number (not necessarily in the catalog —
 * customers may request parts we don't have on file).
 */
export const rfqLineItems = pgTable(
  'rfq_line_items',
  {
    id:                  uuid('id').primaryKey().defaultRandom(),
    rfqId:               uuid('rfq_id').notNull().references(() => rfqs.id),
    /** Part number as submitted — may not exist in parts catalog */
    partNumber:          text('part_number').notNull(),
    /** FK to catalog if the part number matches */
    catalogPartId:       uuid('catalog_part_id').references(() => parts.id),
    quantity:            integer('quantity').notNull().default(1),
    conditionRequested:  inventoryConditionEnum('condition_requested'),
    notes:               text('notes'),
    /** Quoted unit price in cents */
    quotedUnitPriceCents: integer('quoted_unit_price_cents'),
    /** Inventory item we're quoting from (if identified) */
    inventoryItemId:     uuid('inventory_item_id').references(() => inventoryItems.id),
  },
  (t) => ({
    rfqIdx:    index('rfq_line_items_rfq_id_idx').on(t.rfqId),
    partIdx:   index('rfq_line_items_part_number_idx').on(t.partNumber),
  })
);

// ─── Inferred types ───────────────────────────────────────────────────────────
export type Part               = typeof parts.$inferSelect;
export type NewPart            = typeof parts.$inferInsert;
export type Supplier           = typeof suppliers.$inferSelect;
export type NewSupplier        = typeof suppliers.$inferInsert;
export type InventoryItem      = typeof inventoryItems.$inferSelect;
export type NewInventoryItem   = typeof inventoryItems.$inferInsert;
export type TraceabilityDoc    = typeof traceabilityDocuments.$inferSelect;
export type NewTraceabilityDoc = typeof traceabilityDocuments.$inferInsert;
export type Rfq                = typeof rfqs.$inferSelect;
export type NewRfq             = typeof rfqs.$inferInsert;
export type RfqLineItem        = typeof rfqLineItems.$inferSelect;
export type NewRfqLineItem     = typeof rfqLineItems.$inferInsert;
