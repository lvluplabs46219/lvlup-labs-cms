import { pgTable, uuid, text, timestamp, integer, boolean, varchar, decimal } from '-orm/pg-core';

export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  email: text('email').notNull().unique(),
  role: varchar('role', { length: 20 }).notNull().default('ops'), // admin | sales | ops
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const parts = pgTable('parts', {
  id: uuid('id').defaultRandom().primaryKey(),
  partNumber: text('part_number').notNull().unique(),
  manufacturer: text('manufacturer'),
  description: text('description'),
  aircraftType: text('aircraft_type'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const inventoryItems = pgTable('inventory_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  partId: uuid('part_id').references(() => parts.id).notNull(),
  serialNumber: text('serial_number'),
  condition: varchar('condition', { length: 20 }).notNull().default('new'), // new | OH | SV
  quantity: integer('quantity').default(1).notNull(),
  location: text('location'),
  bin: text('bin'),
  supplierId: uuid('supplier_id'),
  certType: text('cert_type'), 
  certDocumentId: uuid('cert_document_id'),
  blockchainTokenId: integer('blockchain_token_id'), // NEW: For NFT binding
  ipfsHash: text('ipfs_hash'), // NEW: Double-bind storage
  dnaHash: text('dna_hash'), // NEW: For verification
  receivedAt: timestamp('received_at'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const pedigrees = pgTable('pedigrees', {
  id: uuid('id').defaultRandom().primaryKey(),
  inventoryItemId: uuid('inventory_item_id').references(() => inventoryItems.id).notNull(),
  name: text('name').notNull(),
  sire: text('sire'), // Father
  dam: text('dam'), // Mother
  birthDate: timestamp('birth_date'),
  registrationNumber: text('registration_number'),
  performanceRank: varchar('performance_rank', { length: 5 }), // A+, B, etc.
  dnaVerified: boolean('dna_verified').default(false).notNull(),
  lastMintedAt: timestamp('last_minted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const healthRecords = pgTable('health_records', {
  id: uuid('id').defaultRandom().primaryKey(),
  pedigreeId: uuid('pedigree_id').references(() => pedigrees.id).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // Vaccination, Vet Check, Performance
  description: text('description').notNull(),
  verifiedBy: text('verified_by'), // e.g., Dr. Smith (FAA-DER style for horses)
  recordDate: timestamp('record_date').notNull(),
  ipfsEvidenceHash: text('ipfs_evidence_hash'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const suppliers = pgTable('suppliers', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  name: text('name').notNull(),
  contactEmail: text('contact_email'),
  phone: text('phone'),
  rating: integer('rating'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const traceabilityDocuments = pgTable('traceability_documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  type: text('type'), // 8130-3, invoice, teardown, etc
  fileUrl: text('file_url').notNull(),
  sha256: text('sha256'),
  issuedBy: text('issued_by'),
  issuedAt: timestamp('issued_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const rfqs = pgTable('rfqs', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('new'), // new | quoted | won | lost
  companyName: text('company_name'),
  contactName: text('contact_name'),
  email: text('email'),
  phone: text('phone'),
  isAog: boolean('is_aog').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const rfqLineItems = pgTable('rfq_line_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  rfqId: uuid('rfq_id').references(() => rfqs.id).notNull(),
  partNumber: text('part_number').notNull(),
  quantity: integer('quantity').default(1).notNull(),
  conditionRequested: text('condition_requested'),
  notes: text('notes'),
});

export const alerts = pgTable('alerts', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  type: varchar('type', { length: 20 }).notNull(), // AOG | RFQ | inventory
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
