class InventoryItem < ApplicationRecord
  enum :condition, { NE: "NE", SV: "SV", OH: "OH", AR: "AR", NS: "NS", RP: "RP", INS: "INS" }
  enum :status,    { available: "available", in_repair: "in_repair", on_loan: "on_loan",
                     reserved: "reserved", sold: "sold", scrapped: "scrapped" }

  belongs_to :organization
  belongs_to :part
  belongs_to :supplier, optional: true

  has_many :traceability_documents, dependent: :destroy
  has_many :rfq_line_items,         dependent: :nullify

  validates :condition, presence: true

  scope :available,    -> { where(status: :available) }
  scope :for_sale,     -> { where(status: :available).where.not(price_cents: nil) }
  scope :by_condition, ->(cond) { where(condition: cond) }
end
