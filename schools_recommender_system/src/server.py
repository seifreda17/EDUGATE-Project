from flask import Flask, request, jsonify
from flask_cors import CORS
import utils
import json
import numpy as np

app = Flask(__name__)
CORS(app)


@app.route("/recommend", methods=["GET", "POST"])
def recommend():
    request_data = request.json
    school_ids = request_data.get("school_ids", [])
    print(school_ids)
    print(type(school_ids))
    response = jsonify(utils.recommend_schools(school_ids))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == "__main__":
    utils.load_artifacts()
    app.run(port=5000)