class RfqLineItem < ApplicationRecord
  enum :condition_requested, { NE: "NE", SV: "SV", OH: "OH", AR: "AR",
                                NS: "NS", RP: "RP", INS: "INS" }, allow_nil: true

  belongs_to :rfq
  belongs_to :catalog_part,    class_name: "Part",          optional: true
  belongs_to :inventory_item,  optional: true

  validates :part_number, :quantity, presence: true
  validates :quantity, numericality: { greater_than: 0 }
end
