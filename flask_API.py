from flask import Flask, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float

app = Flask(__name__)

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
def welcome():
    """List all available API routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/all_data"
    )

@app.route("/api/v1.0/all_data")
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

if __name__ == '__main__':
    app.run(debug=True)