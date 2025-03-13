import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import requests
from PIL import Image
from io import BytesIO
from pymongo_get_database import get_database

# Get the database
dbname = get_database()
collection_name = dbname["activities"]

# Choose the user to display
selected_user = "plasta_stephanieyao"

# Define status colors
status_colors = {
    "online": "green",
    "dnd": "red",
    "idle": "orange"
}

# Fetch relevant documents for the selected user
item_details = collection_name.find({"name": selected_user, "status": {"$in": ["online", "dnd", "idle"]}})

# Extract timestamps and Spotify activity
timestamps = {"online": [], "dnd": [], "idle": []}
spotify_data = None  # Store Spotify details if available

for item in item_details:
    if "updatedAt" in item and "status" in item:
        timestamps[item["status"]].append(item["updatedAt"])

    # Check if the user is listening to music (activityType = 2)
    if item.get("activityType") == 2 and item.get("spotifySongName") and item.get("spotifySongComposer"):
        spotify_data = {
            "timestamp": item["updatedAt"],  # Store the time the song was played
            "song": item["spotifySongName"],
            "artist": item["spotifySongComposer"],
            "cover_url": item.get("spotifyAlbumCoverURL")
        }

# Ensure there's data to plot
if not any(timestamps.values()) and not spotify_data:
    print(f"No activity found for {selected_user}")
else:
    # Create figure
    plt.figure(figsize=(10, 5))

    # Plot each status with different colors
    for status, times in timestamps.items():
        if times:
            plt.scatter(times, [selected_user] * len(times), color=status_colors[status], label=status.capitalize(), marker="o")

    # Formatting
    plt.xlabel("Time")
    plt.ylabel("User")
    plt.title(f"Activity Status of {selected_user}")
    plt.legend()
    plt.xticks(rotation=45)
    plt.gca().xaxis.set_major_formatter(mdates.DateFormatter("%Y-%m-%d %H:%M"))  # Format date
    plt.grid(True, linestyle="--", alpha=0.6)

    # Display song info and cover if available
    if spotify_data:
        song_time = spotify_data["timestamp"]  # Get the timestamp
        song_text = f"{spotify_data['song']} - {spotify_data['artist']}"
        plt.text(song_time, selected_user, song_text, fontsize=10, color="black", verticalalignment='bottom')

        # Try to load and display album cover above the timestamp
        try:
            response = requests.get(spotify_data["cover_url"])
            img = Image.open(BytesIO(response.content))
            
            # Convert timestamp to figure coordinates
            ax = plt.gca()
            x_coord = mdates.date2num(song_time)  # Convert timestamp to x-axis coordinate
            y_coord = ax.get_ylim()[1] + 0.5  # Position slightly above the user label
            
            plt.figimage(img, x_coord, y_coord, alpha=0.8, origin="upper")  # Overlay image above timestamp
        except:
            print("Could not load album cover.")

    plt.tight_layout()
    plt.savefig("output.png")
    # plt.show()
