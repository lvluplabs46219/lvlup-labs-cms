# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_04_24_000004) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"
  enable_extension "pgcrypto"
  enable_extension "uuid-ossp"

  # Custom types defined in this database.
  # Note that some types may not work with other database engines. Be careful if changing database.
  create_enum "cert_mint_status", ["draft", "ready", "submitted", "confirmed", "failed"]
  create_enum "cert_type", ["FAA_8130", "EASA_Form1", "CAAC_AP_Form", "COC", "MRO_Release", "OEM_New_Release", "Other"]
  create_enum "horse_doc_type", ["registration_papers", "vet_record", "coggins", "health_certificate", "farrier_record", "breeding_contract", "sale_contract", "insurance", "other"]
  create_enum "horse_sex", ["mare", "stallion", "gelding", "filly", "colt"]
  create_enum "horse_status", ["active", "for_sale", "reserved", "sold", "retired", "deceased", "archived"]
  create_enum "inventory_condition", ["NE", "SV", "OH", "AR", "NS", "RP", "INS"]
  create_enum "inventory_status", ["available", "in_repair", "on_loan", "reserved", "sold", "scrapped"]
  create_enum "listing_status", ["draft", "private", "published", "sold"]
  create_enum "mint_status", ["draft", "ready", "submitted", "confirmed", "failed"]
  create_enum "organization_status", ["active", "inactive", "archived"]
  create_enum "rfq_source", ["website", "email", "phone", "portal"]
  create_enum "rfq_status", ["new", "in_review", "quoted", "won", "lost", "cancelled"]
  create_enum "user_role", ["admin", "sales", "ops"]

  create_table "assets", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "alt_text"
    t.datetime "created_at", default: -> { "now()" }, null: false
    t.string "kind", null: false
    t.jsonb "metadata"
    t.uuid "organization_id", null: false
    t.uuid "uploaded_by_user_id"
    t.text "url", null: false
    t.index ["kind"], name: "assets_kind_idx"
    t.index ["organization_id"], name: "assets_organization_id_idx"
    t.index ["uploaded_by_user_id"], name: "index_assets_on_uploaded_by_user_id"
  end

  create_table "contacts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "company"
    t.datetime "created_at", default: -> { "now()" }, null: false
    t.string "email"
    t.string "name", null: false
    t.text "notes"
    t.uuid "organization_id", null: false
    t.string "phone"
    t.index ["organization_id"], name: "contacts_organization_id_idx"
  end

  create_table "documents", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", default: -> { "now()" }, null: false
    t.string "ipfs_cid"
    t.jsonb "metadata"
    t.string "mime_type"
    t.uuid "organization_id", null: false
    t.string "sha256"
    t.text "storage_url", null: false
    t.string "title", null: false
    t.string "type", null: false
    t.uuid "uploaded_by_user_id"
    t.index ["organization_id"], name: "documents_organization_id_idx"
    t.index ["type"], name: "documents_type_idx"
    t.index ["uploaded_by_user_id"], name: "index_documents_on_uploaded_by_user_id"
  end

  create_table "exclusive_listings", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer "chain_id", default: 84532, null: false
    t.datetime "created_at", default: -> { "now()" }, null: false
    t.uuid "horse_id"
    t.integer "minimum_token_balance", default: 1
    t.uuid "organization_id", null: false
    t.string "price"
    t.integer "price_cents"
    t.enum "status", default: "draft", null: false, enum_type: "listing_status"
    t.text "summary"
    t.string "title", null: false
    t.string "token_contract_address"
    t.string "token_type", default: "erc721", null: false
    t.datetime "updated_at", default: -> { "now()" }, null: false
    t.index ["horse_id"], name: "exclusive_listings_horse_id_idx"
    t.index ["organization_id"], name: "exclusive_listings_organization_id_idx"
    t.index ["status"], name: "exclusive_listings_status_idx"
    t.index ["token_contract_address", "chain_id"], name: "exclusive_listings_token_gate_idx"
  end

  create_table "horse_documents", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer "chain_id"
    t.string "contract_address"
    t.datetime "created_at", default: -> { "now()" }, null: false
    t.string "document_cid"
    t.uuid "document_id"
    t.string "document_sha256"
    t.string "expires_date"
    t.uuid "horse_id", null: false
    t.string "issued_by"
    t.string "issued_date"
    t.string "metadata_cid"
    t.text "metadata_uri"
    t.enum "mint_status", default: "draft", null: false, enum_type: "mint_status"
    t.datetime "minted_at"
    t.string "minted_to_wallet"
    t.text "notes"
    t.uuid "organization_id", null: false
    t.string "title", null: false
    t.string "token_id"
    t.string "tx_hash"
    t.enum "type", null: false, enum_type: "horse_doc_type"
    t.datetime "updated_at", default: -> { "now()" }, null: false
    t.index ["document_cid"], name: "horse_documents_cid_idx"
    t.index ["document_id"], name: "index_horse_documents_on_document_id"
    t.index ["horse_id"], name: "horse_documents_horse_id_idx"
    t.index ["mint_status"], name: "horse_documents_mint_status_idx"
    t.index ["organization_id"], name: "horse_documents_organization_id_idx"
    t.index ["type"], name: "horse_documents_type_idx"
  end

  create_table "horse_pedigrees", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer "chain_id"
    t.string "contract_address"
    t.datetime "created_at", default: -> { "now()" }, null: false
    t.string "dam_name", null: false
    t.string "dam_registry_id"
    t.uuid "horse_id", null: false
    t.jsonb "lineage", null: false
    t.string "metadata_cid"
    t.uuid "metadata_document_id"
    t.text "metadata_uri"
    t.enum "mint_status", default: "draft", null: false, enum_type: "mint_status"
    t.datetime "minted_at"
    t.string "minted_to_wallet"
    t.uuid "organization_id", null: false
    t.string "sire_name", null: false
    t.string "sire_registry_id"
    t.string "source_document_cid"
    t.uuid "source_document_id"
    t.string "source_document_name"
    t.string "source_document_sha256"
    t.string "token_id"
    t.string "tx_hash"
    t.datetime "updated_at", default: -> { "now()" }, null: false
    t.index ["horse_id"], name: "horse_pedigrees_horse_id_idx"
    t.index ["metadata_document_id"], name: "index_horse_pedigrees_on_metadata_document_id"
    t.index ["mint_status"], name: "horse_pedigrees_mint_status_idx"
    t.index ["organization_id"], name: "horse_pedigrees_organization_id_idx"
    t.index ["source_document_cid"], name: "horse_pedigrees_source_cid_idx"
    t.index ["source_document_id"], name: "index_horse_pedigrees_on_source_document_id"
    t.index ["token_id"], name: "horse_pedigrees_token_id_idx"
  end

  create_table "horses", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "breed", default: "Arabian", null: false
    t.string "color"
    t.datetime "created_at", default: -> { "now()" }, null: false
    t.text "description"
    t.integer "foaled_year"
    t.uuid "hero_asset_id"
    t.text "hero_image_url"
    t.string "name", null: false
    t.uuid "organization_id", null: false
    t.text "pedigree_pdf_path"
    t.integer "price_cents"
    t.string "price_display"
    t.string "registry_id", null: false
    t.enum "sex", enum_type: "horse_sex"
    t.string "slug", null: false
    t.enum "status", default: "active", null: false, enum_type: "horse_status"
    t.datetime "updated_at", default: -> { "now()" }, null: false
    t.index ["hero_asset_id"], name: "index_horses_on_hero_asset_id"
    t.index ["organization_id", "registry_id"], name: "horses_org_registry_id_idx"
    t.index ["organization_id", "slug"], name: "horses_org_slug_idx"
    t.index ["organization_id"], name: "horses_organization_id_idx"
    t.index ["status"], name: "horses_status_idx"
  end

  create_table "inspection_reports", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", default: -> { "now()" }, null: false
    t.uuid "document_id"
    t.uuid "horse_id", null: false
    t.datetime "issued_at"
    t.string "issued_by"
    t.text "notes"
    t.uuid "organization_id", null: false
    t.boolean "passed"
    t.string "report_cid", null: false
    t.string "report_sha256", null: false
    t.string "title", null: false
    t.datetime "updated_at", default: -> { "now()" }, null: false
    t.index ["document_id"], name: "index_inspection_reports_on_document_id"
    t.index ["horse_id"], name: "inspection_reports_horse_id_idx"
    t.index ["organization_id"], name: "inspection_reports_organization_id_idx"
    t.index ["report_cid"], name: "inspection_reports_cid_idx"
  end

  create_table "inventory_items", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "bin"
    t.enum "condition", null: false, enum_type: "inventory_condition"
    t.datetime "created_at", default: -> { "now()" }, null: false
    t.integer "cycles_since_new"
    t.integer "cycles_since_overhaul"
    t.string "location"
    t.text "notes"
    t.uuid "organization_id", null: false
    t.uuid "part_id", null: false
    t.integer "price_cents"
    t.boolean "price_on_request", default: false, null: false
    t.datetime "received_at"
    t.string "removed_from"
    t.string "serial_number"
    t.string "shelf_life"
    t.enum "status", default: "available", null: false, enum_type: "inventory_status"
    t.uuid "supplier_id"
    t.integer "time_since_overhaul_hours"
    t.integer "total_time_since_new_hours"
    t.datetime "updated_at", default: -> { "now()" }, null: false
    t.index ["condition"], name: "inventory_items_condition_idx"
    t.index ["organization_id"], name: "inventory_items_organization_id_idx"
    t.index ["part_id"], name: "inventory_items_part_id_idx"
    t.index ["status"], name: "inventory_items_status_idx"
    t.index ["supplier_id"], name: "index_inventory_items_on_supplier_id"
  end

  create_table "organizations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", default: -> { "now()" }, null: false
    t.string "name", null: false
    t.string "slug", null: false
    t.enum "status", default: "active", null: false, enum_type: "organization_status"
    t.datetime "updated_at", default: -> { "now()" }, null: false
    t.index ["slug"], name: "organizations_slug_idx", unique: true
  end

  create_table "parts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.boolean "active", default: true, null: false
    t.string "ata_chapter"
    t.string "ata_number"
    t.boolean "caac", default: false, null: false
    t.datetime "created_at", default: -> { "now()" }, null: false
    t.boolean "der_available", default: false, null: false
    t.text "description"
    t.boolean "easa", default: true, null: false
    t.string "manufacturer"
    t.string "nomenclature", null: false
    t.uuid "organization_id", null: false
    t.string "part_number", null: false
    t.datetime "updated_at", default: -> { "now()" }, null: false
    t.index ["ata_chapter"], name: "parts_ata_chapter_idx"
    t.index ["caac"], name: "parts_caac_idx"
    t.index ["der_available"], name: "parts_der_idx"
    t.index ["organization_id", "part_number"], name: "parts_org_part_number_idx"
    t.index ["organization_id"], name: "parts_organization_id_idx"
  end

  create_table "rfq_line_items", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "catalog_part_id"
    t.enum "condition_requested", enum_type: "inventory_condition"
    t.uuid "inventory_item_id"
    t.text "notes"
    t.string "part_number", null: false
    t.integer "quantity", default: 1, null: false
    t.integer "quoted_unit_price_cents"
    t.uuid "rfq_id", null: false
    t.index ["catalog_part_id"], name: "index_rfq_line_items_on_catalog_part_id"
    t.index ["inventory_item_id"], name: "index_rfq_line_items_on_inventory_item_id"
    t.index ["part_number"], name: "rfq_line_items_part_number_idx"
    t.index ["rfq_id"], name: "rfq_line_items_rfq_id_idx"
  end

  create_table "rfqs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "assigned_to"
    t.string "company_name", null: false
    t.string "contact_name", null: false
    t.datetime "created_at", default: -> { "now()" }, null: false
    t.string "email", null: false
    t.text "internal_notes"
    t.boolean "is_aog", default: false, null: false
    t.text "message"
    t.uuid "organization_id", null: false
    t.string "phone"
    t.datetime "quote_sent_at"
    t.integer "quoted_price_cents"
    t.enum "source", default: "website", null: false, enum_type: "rfq_source"
    t.enum "status", default: "new", null: false, enum_type: "rfq_status"
    t.datetime "updated_at", default: -> { "now()" }, null: false
    t.index ["email"], name: "rfqs_email_idx"
    t.index ["is_aog"], name: "rfqs_is_aog_idx"
    t.index ["organization_id"], name: "rfqs_organization_id_idx"
    t.index ["status"], name: "rfqs_status_idx"
  end

  create_table "suppliers", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.boolean "active", default: true, null: false
    t.string "contact_email"
    t.uuid "contact_id"
    t.datetime "created_at", default: -> { "now()" }, null: false
    t.string "name", null: false
    t.text "notes"
    t.uuid "organization_id", null: false
    t.string "phone"
    t.integer "rating"
    t.datetime "updated_at", default: -> { "now()" }, null: false
    t.index ["contact_id"], name: "index_suppliers_on_contact_id"
    t.index ["organization_id"], name: "suppliers_organization_id_idx"
  end

  create_table "traceability_documents", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer "chain_id"
    t.string "contract_address"
    t.datetime "created_at", default: -> { "now()" }, null: false
    t.string "document_cid"
    t.uuid "document_id"
    t.string "document_sha256"
    t.uuid "inventory_item_id", null: false
    t.string "issued_by", null: false
    t.string "issued_date"
    t.string "metadata_cid"
    t.text "metadata_uri"
    t.enum "mint_status", default: "draft", null: false, enum_type: "cert_mint_status"
    t.datetime "minted_at"
    t.string "minted_to_wallet"
    t.uuid "organization_id", null: false
    t.string "reference"
    t.string "token_id"
    t.string "tx_hash"
    t.enum "type", null: false, enum_type: "cert_type"
    t.datetime "updated_at", default: -> { "now()" }, null: false
    t.index ["document_cid"], name: "traceability_documents_document_cid_idx"
    t.index ["document_id"], name: "index_traceability_documents_on_document_id"
    t.index ["inventory_item_id"], name: "traceability_documents_inventory_item_id_idx"
    t.index ["mint_status"], name: "traceability_documents_mint_status_idx"
    t.index ["organization_id"], name: "traceability_documents_organization_id_idx"
    t.index ["token_id"], name: "traceability_documents_token_id_idx"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "avatar_url"
    t.datetime "created_at", default: -> { "now()" }, null: false
    t.string "email", null: false
    t.string "name"
    t.uuid "organization_id", null: false
    t.enum "role", default: "admin", null: false, enum_type: "user_role"
    t.datetime "updated_at", default: -> { "now()" }, null: false
    t.string "wallet_address"
    t.index ["organization_id", "email"], name: "users_org_email_idx"
    t.index ["organization_id"], name: "users_organization_id_idx"
  end

  add_foreign_key "assets", "organizations"
  add_foreign_key "assets", "users", column: "uploaded_by_user_id"
  add_foreign_key "contacts", "organizations"
  add_foreign_key "documents", "organizations"
  add_foreign_key "documents", "users", column: "uploaded_by_user_id"
  add_foreign_key "exclusive_listings", "horses"
  add_foreign_key "exclusive_listings", "organizations"
  add_foreign_key "horse_documents", "documents"
  add_foreign_key "horse_documents", "horses"
  add_foreign_key "horse_documents", "organizations"
  add_foreign_key "horse_pedigrees", "documents", column: "metadata_document_id"
  add_foreign_key "horse_pedigrees", "documents", column: "source_document_id"
  add_foreign_key "horse_pedigrees", "horses"
  add_foreign_key "horse_pedigrees", "organizations"
  add_foreign_key "horses", "assets", column: "hero_asset_id"
  add_foreign_key "horses", "organizations"
  add_foreign_key "inspection_reports", "documents"
  add_foreign_key "inspection_reports", "horses"
  add_foreign_key "inspection_reports", "organizations"
  add_foreign_key "inventory_items", "organizations"
  add_foreign_key "inventory_items", "parts"
  add_foreign_key "inventory_items", "suppliers"
  add_foreign_key "parts", "organizations"
  add_foreign_key "rfq_line_items", "inventory_items"
  add_foreign_key "rfq_line_items", "parts", column: "catalog_part_id"
  add_foreign_key "rfq_line_items", "rfqs"
  add_foreign_key "rfqs", "organizations"
  add_foreign_key "suppliers", "contacts"
  add_foreign_key "suppliers", "organizations"
  add_foreign_key "traceability_documents", "documents"
  add_foreign_key "traceability_documents", "inventory_items"
  add_foreign_key "traceability_documents", "organizations"
  add_foreign_key "users", "organizations"
end
