use Mix.Config

config :app, App.Repo,
  username: "postgres",
  password: "postgres",
  database: "AppDB",
  hostname: "localhost",
  port: "5432",
  virtual_host: "/",
  show_sensitive_data_on_connection_error: false,
  pool_size: 10
