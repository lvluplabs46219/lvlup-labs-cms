class Part < ApplicationRecord
  belongs_to :organization

  has_many :inventory_items, dependent: :destroy
  has_many :rfq_line_items,  foreign_key: :catalog_part_id, dependent: :nullify

  validates :part_number, :nomenclature, presence: true
  validates :part_number, uniqueness: { scope: :organization_id }

  scope :active,        -> { where(active: true) }
  scope :easa,          -> { where(easa: true) }
  scope :caac,          -> { where(caac: true) }
  scope :der_available, -> { where(der_available: true) }
  scope :by_ata,        ->(chapter) { where(ata_chapter: chapter) }
end
