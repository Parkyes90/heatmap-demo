def trans(long: float, lat: float):
    long_diff = 0.000277777777777
    lat_diff = 0.000227272727272
    return [
        [long - long_diff, lat + lat_diff],
        [long + long_diff, lat + lat_diff],
        [long + long_diff, lat - lat_diff],
        [long - long_diff, lat - lat_diff],
    ]
