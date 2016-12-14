#!/usr/bin/python
import MySQLdb

# connect
db = MySQLdb.connect(host="localhost", user="root", passwd="vubinhne",
db="mysql")

cursor = db.cursor()

# execute SQL select statement
cursor.execute("SELECT * FROM user")

# commit your changes
db.commit()

# get the number of rows in the resultset
numrows = int(cursor.rowcount)

# get and display one row at a time.
for x in range(0,numrows):
    row = cursor.fetchone()
    print row[0], "-->", row[1]
