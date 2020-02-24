from app import db

class Computer(db.Model):
    __tablename__ = 'computers'

    compID = db.Column(db.Integer, primary_key=True)
    reserved = db.Column(db.Boolean())
    username = db.Column(db.String())
    reservTil = db.Column(db.DateTime())
    computername = db.Column(db.String())
    
    def serialize(self):
        return {
            'compID': self.compID,
            'reserved': self.reserved,
            'username': self.username,
            'reservTil': self.reservTil,
            'computername': self.computername,
        }
    
    def __repr__(self):
        return 'Computer'+str(self.serialize())

class User(db.Model):
    __tablename__ = 'users'

    username = db.Column(db.String(), primary_key=True)
    password = db.Column(db.String())
    
    def serialize(self):
        return {
            'username': self.username,
            'password': self.password,
        }

    def __repr__(self):
        return 'User'+str(self.serialize())

