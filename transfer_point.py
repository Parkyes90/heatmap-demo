import csv
import json
import os


def get_geo():
    return {
        "type": "FeatureCollection",
        "name": "Seongnam",
        "crs": {
            "type": "name",
            "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"},
        },
        "features": [],
    }


def main():
    for i in range(24):
        try:
            path = os.path.join("src", "assets", "data", f"time_{i}_250.csv")
            file = open(path, "r", encoding="utf-8")
            data = csv.reader(file)
            maximum = 0
            count = 0
            geo = get_geo()
            for index, row in enumerate(data):
                if index == 0:
                    continue
                long, lat, value = row
                value = float(value)
                if value > maximum:
                    maximum = value
                geo["features"].append(
                    {
                        "geometry": {
                            "coordinates": [long, lat, 0],
                            "type": "Point",
                        },
                        "properties": {"id": index, "value": value, "time": 0},
                    }
                )

                count += 1
            with open(f"src/assets/values/geo_{i}.json", "w") as outfile:
                json.dump(geo, outfile)
            print("Complete Write GeoJson")
            print(f"Maximum is {maximum}")
            print(f"Count is {count}")
        except FileNotFoundError:
            print(f"Not exists time_{i}.csv")


if __name__ == "__main__":
    main()
