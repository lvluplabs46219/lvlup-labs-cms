class TraceabilityDocument < ApplicationRecord
  enum :type, { FAA_8130: "FAA_8130", EASA_Form1: "EASA_Form1", CAAC_AP_Form: "CAAC_AP_Form",
                COC: "COC", MRO_Release: "MRO_Release", OEM_New_Release: "OEM_New_Release",
                Other: "Other" }

  enum :mint_status, { draft: "draft", ready: "ready", submitted: "submitted",
                       confirmed: "confirmed", failed: "failed" }

  belongs_to :organization
  belongs_to :inventory_item
  belongs_to :document, optional: true

  validates :type, :issued_by, presence: true

  scope :minted,  -> { where(mint_status: :confirmed) }
  scope :pending, -> { where(mint_status: %i[ready submitted]) }
end
