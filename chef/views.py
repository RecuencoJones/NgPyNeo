from flask import Flask, request, redirect, url_for, render_template, session
from chef.models import *

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    recipes = get_recipes()
    return render_template('index.html', recipes=recipes)

@app.route('/register', methods=['GET', 'POST'])
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
            # enviar JSON con true
            return redirect(url_for('login'))

    # enviar JSON con errores
    return render_template('register.html', error=error)

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        usermail = request.form['usermail']
        password = request.form['password']

        user = User(usermail)

        if not user.verify_password(password):
            error = 'Invalid login'
        else:
            session['usermail'] = user.usermail
            # enviar JSON con true
            return redirect(url_for('index'))

    # enviar JSON con errores
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    session.pop('usermail', None)
    # flash('Logged out.')
    return redirect(url_for('index'))

@app.route('/add_recipe', methods=['POST'])
def add_recipe():
    user = User(session['usermail'])
    name = request.form['name']
    tags = request.form['tags']
    desc = request.form['desc']
    ingr = request.form['ingr']

    user.add_recipe(name, tags, desc, ingr)

    return redirect(url_for('index'))

@app.route('/like_recipe/<recipe_id>')
def like_recipe(recipe_id):
    usermail = session.get('usermail')

    User(usermail).like_recipe(recipe_id)

    # flash('Liked post.')
    return redirect(request.referrer)

@app.route('/dislike_recipe/<recipe_id>')
def dislike_recipe(recipe_id):
    usermail = session.get('usermail')

    User(usermail).dislike_recipe(recipe_id)

    # flash('Liked post.')
    return redirect(request.referrer)