class HorsePedigree < ApplicationRecord
  enum :mint_status, { draft: "draft", ready: "ready", submitted: "submitted",
                       confirmed: "confirmed", failed: "failed" }

  belongs_to :organization
  belongs_to :horse
  belongs_to :source_document,   class_name: "Document", optional: true
  belongs_to :metadata_document, class_name: "Document", optional: true

  validates :sire_name, :dam_name, presence: true
  validates :lineage, presence: true

  scope :minted,   -> { where(mint_status: :confirmed) }
  scope :pending,  -> { where(mint_status: %i[ready submitted]) }
end
