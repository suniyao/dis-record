from pymongo import MongoClient
import json

with open("../config.json", "r") as file:
    config = json.load(file)
Connection_URL = config["mongoConnectionURL"]

def get_database():
   # Create a connection using MongoClient. You can import MongoClient or use pymongo.MongoClient
   client = MongoClient(Connection_URL)
 
   # Create the database for our example (we will use the same database throughout the tutorial
   return client['creepiscord']
  
# This is added so that many files can reuse the function get_database()
if __name__ == "__main__":   
   # Get the database
   dbname = get_database()