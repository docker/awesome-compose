use tokio_postgres::{Error, GenericClient, Row};

#[derive(Debug, serde::Serialize)]
pub struct User {
    pub id: i32,
    pub login: String,
}

impl From<Row> for User {
    fn from(row: Row) -> Self {
        Self {
            id: row.get(0),
            login: row.get(1),
        }
    }
}

impl User {
    pub async fn all<C: GenericClient>(client: &C) -> Result<Vec<User>, Error> {
        let stmt = client.prepare("SELECT id, login FROM users").await?;
        let rows = client.query(&stmt, &[]).await?;

        Ok(rows.into_iter().map(User::from).collect())
    }
}
