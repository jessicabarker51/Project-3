from flask import Flask, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float
import requests
import json
from pprint import pprint   
import pandas as pd
import re
from flask_cors import CORS
from config_new import api_key;

url = "https://api.collegefootballdata.com/recruiting/players?year=2022&classification=HighSchool"

headers = { 
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    data = response.json()  # Extract the response data in JSON format

    # Create a DataFrame from the data
    df = pd.DataFrame(data)
    df=df[df["stateProvince"].apply(lambda x: len(x) == 2)]
    df.dropna(inplace=True)
    df.drop('recruitType', axis=1, inplace=True)

    # Split "hometownInfo" into "latitude" and "longitude" columns
    df['latitude'] = df['hometownInfo'].apply(lambda x: x['latitude'])
    df['longitude'] = df['hometownInfo'].apply(lambda x: x['longitude'])
    df.drop('hometownInfo', axis=1, inplace=True)

    # Create a SQLAlchemy engine
    engine = create_engine('sqlite:///recruiting_data.db')

    # Save the DataFrame to the database as a table
    df.to_sql('recruits', con=engine, if_exists='replace', index=False)

    print('Table created successfully.')
else:
    print(f'Request failed with status code {response.status_code}')

df.head()


#import and establish connection to the database for which classes will be constructed
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

#import modules to declare columns and column data types
from sqlalchemy import Column, Integer, String, Float, Boolean


app = Flask(__name__)
CORS(app)

# Database Setup
engine = create_engine("sqlite:///recruiting_data.db")
Base = declarative_base()
Base.metadata.reflect(bind=engine)

class Recruits(Base):
    __tablename__ = 'recruits'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    athleteId = Column(Integer)
    year = Column(Integer)
    ranking = Column(Integer)
    name = Column(String)
    school = Column(String)
    committedTo = Column(String)
    position = Column(String)
    height = Column(String)
    weight = Column(Integer)
    stars = Column(Integer)
    rating = Column(Float)
    city = Column(String)
    stateProvince = Column(String)
    country = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)

# Flask Routes
@app.route("/")
def get_all_data():
    """Return all data from the engine."""
    session = Session(engine)
    
    # Query all data
    results = session.query(Recruits).all()
    session.close()

    # Convert the query results to a list of dictionaries
    all_data = []
    for row in results:
        data_dict = {}
        for column in row.__table__.columns:
            data_dict[column.name] = getattr(row, column.name)
        all_data.append(data_dict)

    return jsonify(all_data)

@app.route("/api/recruits/top10/<college>")
def top_10(college):
    """Return the top 10 of all recruits."""
    # Query all data
    session = Session(engine)
    #write a query to return the top 10 recruits for a given college
    results = session.query(Recruits).filter(Recruits.committedTo == college).order_by(Recruits.rating.desc()).limit(10).all() 
    session.close()

    # Create a dictionary from the row data and append to a list of all_data
    all_data = []
    for row in results:
        data_dict = {}
        for column in row.__table__.columns:
            data_dict[column.name] = getattr(row, column.name)
        all_data.append(data_dict)
    return jsonify(all_data)

if __name__ == '__main__':
    app.run(debug=True)

