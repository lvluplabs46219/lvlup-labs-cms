class CreateBearCreekTables < ActiveRecord::Migration[8.1]
  def change
    # --- Enums -----------------------------------------------------------
    create_enum :horse_sex,      %w[mare stallion gelding filly colt]
    create_enum :horse_status,   %w[active for_sale reserved sold retired deceased archived]
    create_enum :mint_status,    %w[draft ready submitted confirmed failed]
    create_enum :listing_status, %w[draft private published sold]
    create_enum :horse_doc_type, %w[registration_papers vet_record coggins
                                    health_certificate farrier_record breeding_contract
                                    sale_contract insurance other]

    # --- horses ----------------------------------------------------------
    create_table :horses, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :organization, null: false, type: :uuid, foreign_key: true,
                   index: { name: "horses_organization_id_idx" }
      t.string  :slug,          null: false
      t.string  :name,          null: false
      t.string  :registry_id,   null: false
      t.string  :breed,         null: false, default: "Arabian"
      t.string  :color
      t.enum    :sex,           enum_type: :horse_sex
      t.integer :foaled_year
      t.text    :description
      t.enum    :status,        enum_type: :horse_status, null: false, default: "active"
      t.text    :pedigree_pdf_path
      t.references :hero_asset, type: :uuid, foreign_key: { to_table: :assets }
      t.text    :hero_image_url
      t.string  :price_display
      t.integer :price_cents
      t.timestamps null: false, default: -> { "now()" }
    end
    add_index :horses, %i[organization_id slug],        name: "horses_org_slug_idx"
    add_index :horses, %i[organization_id registry_id], name: "horses_org_registry_id_idx"
    add_index :horses, :status,                         name: "horses_status_idx"

    # --- horse_pedigrees -------------------------------------------------
    create_table :horse_pedigrees, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :organization, null: false, type: :uuid, foreign_key: true,
                   index: { name: "horse_pedigrees_organization_id_idx" }
      t.references :horse, null: false, type: :uuid, foreign_key: true,
                   index: { name: "horse_pedigrees_horse_id_idx" }
      # CMS / Postgres layer
      t.string  :sire_name,           null: false
      t.string  :sire_registry_id
      t.string  :dam_name,            null: false
      t.string  :dam_registry_id
      t.jsonb   :lineage,             null: false
      t.references :source_document,  type: :uuid, foreign_key: { to_table: :documents }
      t.string  :source_document_name
      # IPFS proof layer
      t.string  :source_document_cid
      t.string  :source_document_sha256
      t.references :metadata_document, type: :uuid, foreign_key: { to_table: :documents }
      t.string  :metadata_cid
      t.text    :metadata_uri
      # NFT / contract layer
      t.string  :contract_address
      t.integer :chain_id
      t.string  :token_id
      t.string  :tx_hash
      t.string  :minted_to_wallet
      t.enum    :mint_status, enum_type: :mint_status, null: false, default: "draft"
      t.datetime :minted_at
      t.timestamps null: false, default: -> { "now()" }
    end
    add_index :horse_pedigrees, :token_id,             name: "horse_pedigrees_token_id_idx"
    add_index :horse_pedigrees, :mint_status,          name: "horse_pedigrees_mint_status_idx"
    add_index :horse_pedigrees, :source_document_cid,  name: "horse_pedigrees_source_cid_idx"

    # --- horse_documents -------------------------------------------------
    create_table :horse_documents, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :organization, null: false, type: :uuid, foreign_key: true,
                   index: { name: "horse_documents_organization_id_idx" }
      t.references :horse, null: false, type: :uuid, foreign_key: true,
                   index: { name: "horse_documents_horse_id_idx" }
      t.references :document, type: :uuid, foreign_key: true
      t.enum    :type,       enum_type: :horse_doc_type, null: false,
                             index: { name: "horse_documents_type_idx" }
      t.string  :title,      null: false
      t.string  :issued_by
      t.string  :issued_date
      t.string  :expires_date
      t.text    :notes
      # IPFS
      t.string  :document_cid
      t.string  :document_sha256
      t.string  :metadata_cid
      t.text    :metadata_uri
      # NFT
      t.string  :contract_address
      t.integer :chain_id
      t.string  :token_id
      t.string  :tx_hash
      t.string  :minted_to_wallet
      t.enum    :mint_status, enum_type: :mint_status, null: false, default: "draft",
                              index: { name: "horse_documents_mint_status_idx" }
      t.datetime :minted_at
      t.timestamps null: false, default: -> { "now()" }
    end
    add_index :horse_documents, :document_cid, name: "horse_documents_cid_idx"

    # --- inspection_reports ----------------------------------------------
    create_table :inspection_reports, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :organization, null: false, type: :uuid, foreign_key: true,
                   index: { name: "inspection_reports_organization_id_idx" }
      t.references :horse, null: false, type: :uuid, foreign_key: true,
                   index: { name: "inspection_reports_horse_id_idx" }
      t.references :document, type: :uuid, foreign_key: true
      t.string  :title,       null: false
      t.string  :issued_by
      t.datetime :issued_at
      t.text    :notes
      t.boolean :passed
      t.string  :report_cid,    null: false
      t.string  :report_sha256, null: false
      t.timestamps null: false, default: -> { "now()" }
    end
    add_index :inspection_reports, :report_cid, name: "inspection_reports_cid_idx"

    # --- exclusive_listings ----------------------------------------------
    create_table :exclusive_listings, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :organization, null: false, type: :uuid, foreign_key: true,
                   index: { name: "exclusive_listings_organization_id_idx" }
      t.references :horse, type: :uuid, foreign_key: true,
                   index: { name: "exclusive_listings_horse_id_idx" }
      t.string  :title,   null: false
      t.text    :summary
      t.enum    :status,  enum_type: :listing_status, null: false, default: "draft",
                          index: { name: "exclusive_listings_status_idx" }
      t.string  :price
      t.integer :price_cents
      # Token gate
      t.integer :minimum_token_balance,  default: 1
      t.string  :token_contract_address
      t.string  :token_type,             null: false, default: "erc721"
      t.integer :chain_id,               null: false, default: 84532
      t.timestamps null: false, default: -> { "now()" }
    end
    add_index :exclusive_listings, %i[token_contract_address chain_id],
              name: "exclusive_listings_token_gate_idx"
  end
end
