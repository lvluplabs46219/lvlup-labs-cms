# CORS — allow Next.js frontend (and any other origin in dev) to call this API.
# In production, lock origins down to the actual frontend domain.

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(
      "http://localhost:3000",      # Next.js dev server
      "http://localhost:3001",      # alternate Next.js port
      ENV.fetch("FRONTEND_URL", "")  # production frontend URL via env
    )

    resource "*",
      headers: :any,
      methods: %i[get post put patch delete options head],
      credentials: true,
      max_age: 86_400
  end
end
