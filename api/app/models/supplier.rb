class Supplier < ApplicationRecord
  belongs_to :organization
  belongs_to :contact, optional: true

  has_many :inventory_items, dependent: :nullify

  validates :name, presence: true
  validates :rating, numericality: { in: 1..5, allow_nil: true }
end
