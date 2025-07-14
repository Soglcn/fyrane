# create_db.py
from app import create_app, db 
from app.models import User 

app = create_app()

with app.app_context(): 
    db.create_all() 
    print("Database tables created successfully!")


    if not User.query.filter_by(company_id='60DM1N', username='Godmin').first():

        godmin_user = User(
            company_id='60DM1N',
            username='@godmin',
            fullname='The Mighty One',
            email='scyozgat@gmail.com',
            phone='+90-(530)-279-3228',
            role='godmin',
            profession='System Administrator'
        )
        godmin_user.set_password('0666')
        db.session.add(godmin_user) 
        db.session.commit()
        print("Godmin user '60DM1N:Godmin' added to the database.")


    if not User.query.filter_by(company_id='rigel', username='testuser').first():
        test_user = User(
            company_id='R163L',
            username='@testuser',
            fullname='Test User',
            email='test@rigel.com',
            phone='0987654321',
            role='user',
            profession='Developer'
        )
        test_user.set_password('testuser') 
        db.session.add(test_user)
        db.session.commit()
        print("Test user 'R163L:testuser' added to the database.")