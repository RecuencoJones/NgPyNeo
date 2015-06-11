from flask import Flask, request, redirect, url_for, render_template, session, jsonify
from flask.ext.cors import CORS
from json import dumps, dump
from chef.models import *

app = Flask(__name__)

sessions = {}

cors = CORS(app, resources=r'/api/*', allow_headers='*')


@app.route('/api/get_recipes', methods=['GET'])
def _get_recipes():
    recipes = get_recipes()

    json = {'recipes': [{
        "name": recipe['recipe_name'],
        "desc": recipe['recipe_desc'],
        "ingr": recipe['recipe_ingr'],
        "id": recipe['id'],
        "user": recipe['user_name'],
        "likes": recipe['likes'],
        "dislikes": recipe['dislikes'],
        "tags": recipe['tags']} for recipe in recipes]}

    return jsonify(**json)


@app.route('/api/register', methods=['GET', 'POST'])
def register():
    error = None
    if request.method == 'POST':
        usermail = request.form['usermail']
        username = request.form['username']
        password = request.form['password']

        # do validation
        if not User(usermail).set_username(username).set_password(password).register():
            error = 'A user with that email already exists.'
        else:
            return jsonify(response=True)

    return jsonify(response=False, error=error)


@app.route('/api/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        usermail = request.form['usermail']
        password = request.form['password']

        user = User(usermail)

        if not user.verify_password(password):
            error = 'Invalid login'
        else:
            import uuid
            token = str(uuid.uuid4()).replace("-", "")
            ip = str(request.remote_addr).replace(".", "")  # use for hashing
            sessions[ip+token] = user.usermail
            return jsonify(response=True, token=token)

    return jsonify(response=False, error=error)


@app.route('/api/logout', methods=['POST'])
def logout():
    token = str(request.form['token'])
    ip = str(request.remote_addr).replace(".", "")
    sessions.pop(ip+token, None)
    return jsonify(response=True)


@app.route('/add_recipe', methods=['POST'])
def add_recipe():
    token = request.form['token']
    user = User(sessions[token])
    name = request.form['name']
    tags = request.form['tags']
    desc = request.form['desc']
    ingr = request.form['ingr']

    user.add_recipe(name, tags, desc, ingr)

    return redirect(url_for('index'))


@app.route('/api/does_like/<recipe_id>', methods=['POST'])
def _does_like(recipe_id):
    usermail = get_user_from_token(request)

    try:
        selected = does_like(usermail, recipe_id)
        json = {'response': selected[0]['like']}
        return jsonify(**json)
    except:
        return jsonify(response=None)


@app.route('/api/like_recipe/<recipe_id>', methods=['POST'])
def like_recipe(recipe_id):
    usermail = get_user_from_token(request)

    try:
        User(usermail).like_recipe(recipe_id)
        return jsonify(response=True)
    except:
        return jsonify(response=False)


@app.route('/api/dislike_recipe/<recipe_id>', methods=['POST'])
def dislike_recipe(recipe_id):
    usermail = get_user_from_token(request)

    try:
        User(usermail).dislike_recipe(recipe_id)
        return jsonify(response=True)
    except:
        return jsonify(response=False)


def get_user_from_token(req):
    token = str(req.form['token'])
    ip = str(req.remote_addr).replace(".", "")
    usermail = sessions[ip+token]

    return usermail