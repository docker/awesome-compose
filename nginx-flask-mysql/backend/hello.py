import os
import time
from flask import Flask
import mysql.connector

passfile = open('/run/secrets/db-password', 'r')

#give db some time to start
time.sleep(3)
#connect to db
conn = mysql.connector.connect(
    user='root', 
    password=passfile.read(),
    host='db', # name of the mysql service as set in the docker-compose file
    database='example',
    auth_plugin='mysql_native_password'
)
passfile.close()

cursor = conn.cursor()

app = Flask(__name__)

@app.route('/')
def listBlog():
    cursor.execute('SELECT title FROM blog')
    response = ''
    for c in cursor:
        response = response  + '<div>' + c[0] + '</div>'
    return response

def prepare_db():
    cursor.execute('DROP TABLE IF EXISTS blog')
    cursor.execute('CREATE TABLE blog (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255))')
    cursor.executemany('INSERT INTO blog (id, title) VALUES (%s, %s);', [(i, 'Blog post #%d'% i) for i in range (1,5)])
    conn.commit()


if __name__ == '__main__':
    prepare_db()
    app.run()
