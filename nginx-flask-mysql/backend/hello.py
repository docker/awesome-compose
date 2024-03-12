import os
from flask import Flask
import mysql.connector


class DBManager:
    def __init__(self, database='example', host="db", user="root", password_file=None):
        with open(password_file, 'r') as pf:
            self.connection = mysql.connector.connect(
                user=user, 
                password=pf.read(),
                host=host, # name of the mysql service as set in the docker compose file
                database=database,
                auth_plugin='mysql_native_password'
            )
        self.cursor = self.connection.cursor()
    
    def populate_db(self):
        self.cursor.execute('DROP TABLE IF EXISTS blog')
        self.cursor.execute('CREATE TABLE blog (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255))')
        self.cursor.executemany('INSERT INTO blog (id, title) VALUES (%s, %s);', [(i, 'Blog post #%d'% i) for i in range (1,5)])
        self.connection.commit()
    
    def query_titles(self):
        self.cursor.execute('SELECT title FROM blog')
        return [c[0] for c in self.cursor]


server = Flask(__name__)
conn = None

@server.route('/')
def listBlog():
    global conn
    if not conn:
        conn = DBManager(password_file='/run/secrets/db-password')
        conn.populate_db()
    rec = conn.query_titles()

    response = ''
    for c in rec:
        response = f'{response}<div>   Hello  {c}</div>'
    return response


if __name__ == '__main__':
    server.run()
