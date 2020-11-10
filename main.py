import csv
import json
import os


def trans(long: float, lat: float):
    long_diff = 0.000277777777777
    lat_diff = 0.000227272727272
    return [
        [long - long_diff, lat + lat_diff],
        [long + long_diff, lat + lat_diff],
        [long + long_diff, lat - lat_diff],
        [long - long_diff, lat - lat_diff],
    ]


if __name__ == "__main__":
    path = os.path.join("src", "assets", "data", "convert_data.csv")
    file = open(path, "r", encoding="utf-8")
    data = csv.reader(file)
    features = []
    values = []
    maximum = 0
    count = 0
    for index, row in enumerate(data):
        if index == 0:
            continue
        long, lat, value = row
        value = float(value)
        if value <= 400:
            continue
        if value > maximum:
            maximum = value
        values.append([count, value])
        features.append([count, trans(float(long), float(lat))])
        count += 1

    with open("src/assets/maps/geo.json", "w") as outfile:
        json.dump(features, outfile, indent=2)
    with open("src/assets/maps/geo-values.json", "w") as outfile:
        json.dump(values, outfile, indent=2)
    print("Complete Write GeoJson")
    print(f"Maximum is {maximum}")
    print(f"Count is {count}")
