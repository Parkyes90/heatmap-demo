import json
import os


def main():
    map_path = os.path.join("src", "assets", "maps")
    path = os.path.join(map_path, "seongnam.json")
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    features = data["features"]

    for feature in features:
        geometry = feature["geometry"]
        coordinates = geometry["coordinates"][0]
        geometry["type"] = "Polygon"
        geometry["coordinates"] = coordinates

    with open(
        os.path.join(map_path, "seongnam2.json"), "w", encoding="utf-8"
    ) as f:
        json.dump(data, f)


if __name__ == "__main__":
    main()
