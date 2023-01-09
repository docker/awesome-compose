use mega_etl::{async_trait, Pipe, Transformer, TransformerError, TransformerResult};

use serde::{Deserialize, Serialize};
#[derive(Serialize, Deserialize, Debug)]
struct Order {
    order_id: i32,
    product_id: i32,
    quantity: i32,
    amount: f32,
    shipping: f32,
    tax: f32,
    shipping_address: String,
}

#[async_trait]
impl Transformer for Order {
    async fn transform(inbound_data: &Vec<u8>) -> TransformerResult<Vec<String>> {
        let s = std::str::from_utf8(&inbound_data)
            .map_err(|e| TransformerError::Custom(e.to_string()))?;
        let order: Order = serde_json::from_str(String::from(s).as_str())
            .map_err(|e| TransformerError::Custom(e.to_string()))?;
        log::info!("{:?}", &order);
        let mut ret = vec![];
        let sql_string = format!(
            r"INSERT INTO orders VALUES ({:?}, {:?}, {:?}, {:?}, {:?}, {:?}, {:?}, CURRENT_TIMESTAMP);",
            order.order_id,
            order.product_id,
            order.quantity,
            order.amount,
            order.shipping,
            order.tax,
            order.shipping_address,
        );
        dbg!(sql_string.clone());
        ret.push(sql_string);
        Ok(ret)
    }

    async fn init() -> TransformerResult<String> {
        Ok(String::from(
            r"CREATE TABLE IF NOT EXISTS orders (order_id INT, product_id INT, quantity INT, amount FLOAT, shipping FLOAT, tax FLOAT, shipping_address VARCHAR(50), date_registered TIMESTAMP DEFAULT CURRENT_TIMESTAMP);",
        ))
    }
}

#[tokio::main(flavor = "current_thread")]
async fn main() -> anyhow::Result<()> {
    env_logger::init();

    // can use builder later
    let database_uri = std::env::var("DATABASE_URL")?;
    let kafka_uri = std::env::var("KAFKA_URL")?;
    let mut pipe = Pipe::new(database_uri, kafka_uri).await;

    // This is async because this calls the async transform() function in Order
    pipe.start::<Order>().await?;
    Ok(())
}
