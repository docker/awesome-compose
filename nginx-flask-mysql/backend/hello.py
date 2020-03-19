import os
import time
from flask import Flask
import mysql.connector

passfile = open('/run/secrets/db-password', 'r')

#give db some time to start
time.sleep(5)
        
#connect to db
conn = mysql.connector.connect(
    user='root', 
    password=passfile.read(),
    host='db', # name of the mysql service as set in the docker-compose file
    database='example',
    auth_plugin='mysql_native_password'
)

passfile.close()
# populate db
cursor = conn.cursor()
def prepare_db():
    cursor.execute('DROP TABLE IF EXISTS blog')
    cursor.execute('CREATE TABLE blog (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255))')
    cursor.executemany('INSERT INTO blog (id, title) VALUES (%s, %s);', [(i, 'Blog post #%d'% i) for i in range (1,5)])
    conn.commit()
prepare_db()

# server
app = Flask(__name__)
@app.route('/')
def listBlog():
    cursor.execute('SELECT title FROM blog')
    response = ''
    for c in cursor:
        response = response  + '<div>' + c[0] + '</div>'
    return response


if __name__ == '__main__':
    app.run()
