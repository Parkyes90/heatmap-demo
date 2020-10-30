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


def get_geojson(features):
    return {
        "type": "FeatureCollection",
        "name": "Seongnam",
        "crs": {
            "type": "name",
            "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"},
        },
        "features": features,
    }


if __name__ == "__main__":
    path = os.path.join("src", "assets", "data", "convert_data.csv")
    file = open(path, "r", encoding="utf-8")
    data = csv.reader(file)
    features = []
    values = []
    maximum = 0
    for index, row in enumerate(data):
        if index == 0:
            continue
        long, lat, value = row
        value = float(value)
        if value > maximum:
            maximum = value
        values.append({"name": index, "value": value})
        feature = {
            "type": "Feature",
            "properties": {
                "OBJECTID": index,
                "adm_nm": index,
                "adm_cd": index,
                "adm_cd2": index,
                "sidonm": index,
                "name": index,
                "sggnm": index,
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [trans(float(long), float(lat))],
            },
        }
        features.append(feature)
    with open("geo.json", "w") as outfile:
        json.dump(get_geojson(features), outfile, indent=2)
    with open("geo-values.json", "w") as outfile:
        json.dump(values, outfile, indent=2)
    print("Complete Write GeoJson")
    print(f"Maximum is {maximum}")
