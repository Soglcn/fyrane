# core/models.py
from . import db 
from . import bcrypt 

class User(db.Model): 
    __tablename__ = 'users' 

    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.String(120), nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False) 
    fullname = db.Column(db.String(120), nullable=False) 
    email = db.Column(db.String(120), unique=True, nullable=False) 
    phone = db.Column(db.String(20), nullable=False) 
    role = db.Column(db.String(50), nullable=False) 
    profession = db.Column(db.String(120), nullable=False) 
    
    def __repr__(self):
        return f'<User {self.username} (Company: {self.company_id})>'

    # Parola hash'leme
    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Parola doğrulama
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)