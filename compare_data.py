import os, json, mysql.connector
from environs import Env
from collections import namedtuple

env=Env()
env.read_env()

mydb=mysql.connector.connect(host='127.0.0.1',
    user=os.getenv('DB_DEVELOPMENT_USER'), 
    password=os.getenv('DB_DEVELOPMENT_PASS'), 
    database=os.getenv('DB_DEVELOPMENT_DATABASE'))

JSON_FILE='data.json'

def get_db_countries(cursor):
    Country=namedtuple('Country',['id', 'code', 'regions'])
    select="""
        SELECT RegionID, RegionCode FROM regions
        WHERE RegionParentID IS Null"""
    cursor.execute(select)
    countries=cursor.fetchall()

    country_dict={}
    for country in countries:
        country_dict[country[1]]=country[0]
    return country_dict

def get_db_regions(id):
    select=f"""
        SELECT RegionID, RegionCode FROM regions
        WHERE RegionParentID='{id}'"""
    cursor.execute(select)
    regions=cursor.fetchall()
    return regions

def compare_regions(db_regions, json_regions):
    #TODO: save db id info
    db_regions=[region[1] for region in db_regions]
    db_regions.sort()
    json_regions=[region['shortCode'] for region in json_regions]
    json_regions.sort()
    return db_regions == json_regions

def compare_data(db_countries):
    with open(JSON_FILE) as json_file:
        countries=json.loads(json_file.read())

    for country in countries:
        code=country['countryShortCode']
        if code in db_countries:
            db_regions=get_db_regions(db_countries[code])
            print('comparing', country['countryName']+'...', end=' ')
            if not compare_regions(db_regions, country['regions']):
                print('data does not match!')
                return
            print('ok')

if __name__=='__main__':
    with mydb.cursor() as cursor:
        db_countries=get_db_countries(cursor)
        compare_data(db_countries)
