#!flask/bin/python
# -*- coding: utf-8 -*-
from flask import Flask, request, abort, jsonify
from flask_cors import CORS, cross_origin
import time

app = Flask(__name__)
CORS(app)

@app.route('/cv', methods=['POST'])
def cv_generator():
    if not request.json:
        abort(400)

    return 'static/test.pdf'

if __name__ == '__main__':
    app.run(debug=True)