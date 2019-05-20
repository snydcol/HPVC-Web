from flask import abort, Flask, json, redirect,\
    render_template, request, Response, url_for, session, jsonify
from werkzeug.utils import secure_filename
from flask_sqlalchemy import SQLAlchemy
import os
import datetime

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = app.config['SECRET_KEY']
db = SQLAlchemy(app)

# Import any SQLAlchemy model classes you wish.
from models import User, Computer

def validate(d, keys):
    for k in keys:
        if k not in d:
            raise Exception('{} does not conatain key "{}"'.format(d,k))


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/logout/', methods=['POST'])    
def api_logout():    
    try:
        session['username'] = None
        return 'ok'
    except Exception as e:
        return str(e),420 


@app.route('/api/login/', methods=['POST'])
def api_login():
    try:
        validate(request.form, ['username', 'password'])

        username, password = request.form['username'], request.form['password']
        
        user = User.query.filter(User.username == username).first()

        if user is not None and (user.password == password):      
            session['username'] = username
            return 'ok'
        else:
            return 'fail'

    except Exception as e:
        return str(e), 400

@app.route('/api/register/', methods=['POST'])
def api_register():
    
    try:
        validate(request.form, ['username', 'password'])

        username, password = request.form['username'], request.form['password']
        user = User.query.filter(User.username == username).first()
    
        if user is None:

            db.session.add(User(username = username, password = password))
            db.session.commit()

            session['username'] = username
            return 'ok'
        else:
            return 'fail'

    except Exception as e:
        return str(e), 400

@app.route('/api/reserve/', methods=['POST'])
def api_reserve():
    
    validate(request.form, ['computer', 'reserve_time'])

    computer_id, reserve_time = request.form['computer'], int(request.form['reserve_time'])
    computer_num = computer_id[computer_id.index('_')+1:]

    t = datetime.datetime.now()
    release_time = t + datetime.timedelta(hours=reserve_time)

    c = Computer.query.filter(Computer.compID == computer_num).first()
    c.reserved = True
    c.username = session['username']
    c.reservTil = release_time
    db.session.commit()
    print("found:",c)
    #print("Got time of:",t)
    #print("releasing:",release_time)

    return 'ok'
    
#   except Exception as e:
#     return str(e), 400

if __name__ == '__main__':
    app.run()
