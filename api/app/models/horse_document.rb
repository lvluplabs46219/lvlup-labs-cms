class HorseDocument < ApplicationRecord
  enum :type, { registration_papers: "registration_papers", vet_record: "vet_record",
                coggins: "coggins", health_certificate: "health_certificate",
                farrier_record: "farrier_record", breeding_contract: "breeding_contract",
                sale_contract: "sale_contract", insurance: "insurance", other: "other" }

  enum :mint_status, { draft: "draft", ready: "ready", submitted: "submitted",
                       confirmed: "confirmed", failed: "failed" }

  belongs_to :organization
  belongs_to :horse
  belongs_to :document, optional: true

  validates :type, :title, presence: true
end
