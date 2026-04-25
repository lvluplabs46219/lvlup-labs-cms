class CreatePerformairTables < ActiveRecord::Migration[8.1]
  def change
    # --- Enums -----------------------------------------------------------
    create_enum :inventory_condition, %w[NE SV OH AR NS RP INS]
    create_enum :inventory_status,    %w[available in_repair on_loan reserved sold scrapped]
    create_enum :cert_type,           %w[FAA_8130 EASA_Form1 CAAC_AP_Form COC
                                         MRO_Release OEM_New_Release Other]
    create_enum :cert_mint_status,    %w[draft ready submitted confirmed failed]
    create_enum :rfq_status,          %w[new in_review quoted won lost cancelled]
    create_enum :rfq_source,          %w[website email phone portal]

    # --- parts -----------------------------------------------------------
    create_table :parts, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :organization, null: false, type: :uuid, foreign_key: true,
                   index: { name: "parts_organization_id_idx" }
      t.string  :part_number,   null: false
      t.string  :nomenclature,  null: false
      t.string  :ata_number
      t.string  :ata_chapter,   index: { name: "parts_ata_chapter_idx" }
      t.string  :manufacturer
      t.text    :description
      t.boolean :easa,          null: false, default: true
      t.boolean :caac,          null: false, default: false,
                                index: { name: "parts_caac_idx" }
      t.boolean :der_available, null: false, default: false,
                                index: { name: "parts_der_idx" }
      t.boolean :active,        null: false, default: true
      t.timestamps null: false, default: -> { "now()" }
    end
    add_index :parts, %i[organization_id part_number], name: "parts_org_part_number_idx"

    # --- suppliers -------------------------------------------------------
    create_table :suppliers, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :organization, null: false, type: :uuid, foreign_key: true,
                   index: { name: "suppliers_organization_id_idx" }
      t.string  :name,          null: false
      t.string  :contact_email
      t.string  :phone
      t.integer :rating
      t.text    :notes
      t.references :contact, type: :uuid, foreign_key: true
      t.boolean :active, null: false, default: true
      t.timestamps null: false, default: -> { "now()" }
    end

    # --- inventory_items -------------------------------------------------
    create_table :inventory_items, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :organization, null: false, type: :uuid, foreign_key: true,
                   index: { name: "inventory_items_organization_id_idx" }
      t.references :part, null: false, type: :uuid, foreign_key: true,
                   index: { name: "inventory_items_part_id_idx" }
      t.string  :serial_number
      t.enum    :condition, enum_type: :inventory_condition, null: false,
                            index: { name: "inventory_items_condition_idx" }
      t.enum    :status,    enum_type: :inventory_status, null: false, default: "available",
                            index: { name: "inventory_items_status_idx" }
      t.string  :location
      t.string  :bin
      t.references :supplier, type: :uuid, foreign_key: true
      t.string  :removed_from
      t.integer :total_time_since_new_hours
      t.integer :time_since_overhaul_hours
      t.integer :cycles_since_new
      t.integer :cycles_since_overhaul
      t.string  :shelf_life
      t.integer :price_cents
      t.boolean :price_on_request, null: false, default: false
      t.datetime :received_at
      t.text    :notes
      t.timestamps null: false, default: -> { "now()" }
    end

    # --- traceability_documents ------------------------------------------
    create_table :traceability_documents, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :organization, null: false, type: :uuid, foreign_key: true,
                   index: { name: "traceability_documents_organization_id_idx" }
      t.references :inventory_item, null: false, type: :uuid, foreign_key: true,
                   index: { name: "traceability_documents_inventory_item_id_idx" }
      # CMS / Postgres layer
      t.references :document, type: :uuid, foreign_key: true
      t.enum    :type,       enum_type: :cert_type, null: false
      t.string  :reference
      t.string  :issued_by,  null: false
      t.string  :issued_date
      # IPFS proof layer
      t.string  :document_cid
      t.string  :document_sha256
      t.string  :metadata_cid
      t.text    :metadata_uri
      # NFT / contract layer
      t.string  :contract_address
      t.integer :chain_id
      t.string  :token_id
      t.string  :tx_hash
      t.string  :minted_to_wallet
      t.enum    :mint_status, enum_type: :cert_mint_status, null: false, default: "draft",
                              index: { name: "traceability_documents_mint_status_idx" }
      t.datetime :minted_at
      t.timestamps null: false, default: -> { "now()" }
    end
    add_index :traceability_documents, :token_id,     name: "traceability_documents_token_id_idx"
    add_index :traceability_documents, :document_cid, name: "traceability_documents_document_cid_idx"

    # --- rfqs ------------------------------------------------------------
    create_table :rfqs, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :organization, null: false, type: :uuid, foreign_key: true,
                   index: { name: "rfqs_organization_id_idx" }
      t.enum    :status,  enum_type: :rfq_status, null: false, default: "new",
                          index: { name: "rfqs_status_idx" }
      t.enum    :source,  enum_type: :rfq_source, null: false, default: "website"
      t.string  :company_name,  null: false
      t.string  :contact_name,  null: false
      t.string  :email,         null: false, index: { name: "rfqs_email_idx" }
      t.string  :phone
      t.text    :message
      t.boolean :is_aog,        null: false, default: false,
                                index: { name: "rfqs_is_aog_idx" }
      t.string  :assigned_to
      t.text    :internal_notes
      t.integer :quoted_price_cents
      t.datetime :quote_sent_at
      t.timestamps null: false, default: -> { "now()" }
    end

    # --- rfq_line_items --------------------------------------------------
    create_table :rfq_line_items, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :rfq, null: false, type: :uuid, foreign_key: true,
                   index: { name: "rfq_line_items_rfq_id_idx" }
      t.string  :part_number, null: false, index: { name: "rfq_line_items_part_number_idx" }
      t.references :catalog_part,    type: :uuid, foreign_key: { to_table: :parts }
      t.integer :quantity,           null: false, default: 1
      t.enum    :condition_requested, enum_type: :inventory_condition
      t.text    :notes
      t.integer :quoted_unit_price_cents
      t.references :inventory_item, type: :uuid, foreign_key: true
    end
  end
end
