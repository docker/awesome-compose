import Config

# We load production configuration and secrets from environment variables

config :app, App.Repo,
  username: System.fetch_env!("POSTGRES_USER"),
  password: System.fetch_env!("POSTGRES_PASSWORD"),
  database: System.fetch_env!("POSTGRES_DB"),
  hostname: System.fetch_env!("PGHOST"),
  port: String.to_integer(System.get_env("PGPORT") || "5432"),
  virtual_host: "/",
  show_sensitive_data_on_connection_error: false,
  pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10")

config :app, AppWeb.Endpoint,
  url: [host: System.get_env("host") || "localhost"],
  http: [
    port: String.to_integer(System.get_env("PORT") || "4000"),
    transport_options: [socket_opts: [:inet6]]
  ]
