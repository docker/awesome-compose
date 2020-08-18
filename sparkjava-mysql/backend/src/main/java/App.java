import com.google.gson.Gson;
import com.mysql.cj.jdbc.exceptions.CommunicationsException;

import static spark.Spark.*;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class App {

    public static void main(String[] args) throws Exception {
        Class.forName("com.mysql.cj.jdbc.Driver");

        prepare();

        port(8080);

        get("/", (req, res) -> new Gson().toJson(titles()));
    }

    private static List<String> titles() {
        try (Connection conn = connect()) {
            List<String> titles = new ArrayList<>();
            try (Statement stmt = conn.createStatement()) {
                try (ResultSet rs = stmt.executeQuery("SELECT title FROM blog")) {
                    while (rs.next()) {
                        titles.add(rs.getString("title"));
                    }
                }
            }
            return titles;
        } catch (Exception ex) {
            return new ArrayList<>();
        }
    }

    public static void prepare() throws Exception {
        try (Connection conn = connect()) {
            recreateTable(conn);
            insertData(conn);
        }
    }

    private static void insertData(Connection conn) throws SQLException {
        for (int i = 0; i < 5; i++) {
            try (PreparedStatement stmt = conn.prepareStatement("INSERT INTO blog (title) VALUES (?);")) {
                stmt.setString(1, "Blog post #" + i);
                stmt.execute();
            }
        }
    }

    private static void recreateTable(Connection conn) throws SQLException {
        try (Statement stmt = conn.createStatement()) {
            stmt.execute("DROP TABLE IF EXISTS blog");
            stmt.execute("CREATE TABLE IF NOT EXISTS blog (id int NOT NULL AUTO_INCREMENT, title varchar(255), PRIMARY KEY (id))");
        }
    }


    private static Connection connect() throws Exception {
        for (int i = 0; i < 60; i++) {
            try {
                return DriverManager.getConnection("jdbc:mysql://db/example?allowPublicKeyRetrieval=true&useSSL=false", "root", Files.lines(Paths.get("/run/secrets/db-password")).findFirst().get());
            } catch (CommunicationsException ex) {
                Thread.sleep(1000L);
                continue;
            } catch (Exception ex) {
                throw ex;
            }
        }
        throw new RuntimeException("Unable to connect to MySQL");
    }
}

