from pymongo_get_database import get_database
from datetime import datetime

# Get the database
dbname = get_database()

# Retrieve the "activities" collection
collection_name = dbname["activities"]

# Fetch all documents
item_details = collection_name.find()

# Loop through each document
for item in item_details:
    if item.get("name") == "plasta_stephanieyao" and item.get("status") in ["online", "dnd", "idle"]:
        print(f"Name: {item['name']}, Status: {item['status']}, Date: {item['updatedAt']}")
