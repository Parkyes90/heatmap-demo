import csv
import json
import os


def trans(long: float, lat: float):
    long_diff = 0.000277777777777 * 5
    lat_diff = 0.000227272727272 * 5
    return [
        [long - long_diff, lat + lat_diff],
        [long + long_diff, lat + lat_diff],
        [long + long_diff, lat - lat_diff],
        [long - long_diff, lat - lat_diff],
    ]


if __name__ == "__main__":
    for i in range(24):
        try:
            path = os.path.join("src", "assets", "data", f"time_{i}_250.csv")
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
                if value > maximum:
                    maximum = value
                values.append([count, value])
                features.append([count, trans(float(long), float(lat))])
                count += 1
            with open(f"src/assets/values/geo_{i}.json", "w") as outfile:
                json.dump(features, outfile)
            with open(f"src/assets/values/values_{i}.json", "w") as outfile:
                json.dump(values, outfile)
            print("Complete Write GeoJson")
            print(f"Maximum is {maximum}")
            print(f"Count is {count}")
        except FileNotFoundError as e:
            print(e)
            print(f"Not exists time_{i}.csv")
