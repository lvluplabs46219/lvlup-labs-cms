class Rfq < ApplicationRecord
  enum :status, { new: "new", in_review: "in_review", quoted: "quoted",
                  won: "won", lost: "lost", cancelled: "cancelled" }
  enum :source, { website: "website", email: "email", phone: "phone", portal: "portal" }

  belongs_to :organization
  has_many :rfq_line_items, dependent: :destroy
  accepts_nested_attributes_for :rfq_line_items, allow_destroy: false,
                                reject_if: :all_blank

  validates :company_name, :contact_name, :email, presence: true

  scope :aog,    -> { where(is_aog: true) }
  scope :open,   -> { where(status: %i[new in_review quoted]) }
  scope :closed, -> { where(status: %i[won lost cancelled]) }
end
