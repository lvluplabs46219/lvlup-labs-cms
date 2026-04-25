class ApplicationController < ActionController::API
  before_action :authenticate_request!

  private

  # ---------------------------------------------------------------------------
  # Firebase JWT authentication
  # Validates the Authorization: Bearer <firebase_id_token> header.
  # Sets @current_user_uid from the decoded token.
  # ---------------------------------------------------------------------------
  def authenticate_request!
    header = request.headers["Authorization"]
    token  = header&.split(" ")&.last

    render json: { error: "Unauthorized" }, status: :unauthorized and return if token.blank?

    @current_user_uid = verify_firebase_token(token)
    render json: { error: "Unauthorized" }, status: :unauthorized unless @current_user_uid
  end

  def verify_firebase_token(token)
    payload = JWT.decode(
      token,
      nil,
      false,          # skip verification for now — swap to true + JWKS in production
      algorithms: ["RS256"]
    ).first

    payload["user_id"] || payload["sub"]
  rescue JWT::DecodeError
    nil
  end

  # Skip auth in development if no token is sent (allows curl testing without Firebase)
  def skip_auth_in_dev?
    Rails.env.development? && request.headers["Authorization"].blank?
  end
end
