from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    mar = User(
        first_name="Mar",
        last_name="Eats",
        phone_number="999033959",
        address="Same St",
        city="Same City",
        state="Same State",
        zip=11111,
        wallet=9999999.99,
        password="password",
        email="m@user.io",
        restaurant_owner=True,
    )
    gabe = User(
        first_name="Gabe",
        last_name="Eats",
        phone_number="999033958",
        address="Same St",
        city="Same City",
        state="Same State",
        zip=11111,
        wallet=9999999.99,
        password="password",
        email="g@user.io",
        restaurant_owner=True,
    )
    burak = User(
        first_name="Burak",
        last_name="Eats",
        phone_number="999033957",
        address="Same St",
        city="Same City",
        state="Same State",
        zip=11111,
        wallet=9999999.99,
        password="password",
        email="b@user.io",
        restaurant_owner=True,
    )
    katie = User(
        first_name="Katie",
        last_name="Eats",
        phone_number="999033956",
        address="Same St",
        city="Same City",
        state="Same State",
        zip=11111,
        wallet=9999999.99,
        password="password",
        email="k@user.io",
        restaurant_owner=True,
    )
    sama = User(
        first_name="Sama",
        last_name="Eats",
        phone_number="999033955",
        address="Same St",
        city="Same City",
        state="Same State",
        zip=11111,
        wallet=9999999.99,
        password="password",
        email="s@user.io",
        restaurant_owner=True,
    )

    db.session.add(mar)
    db.session.add(gabe)
    db.session.add(burak)
    db.session.add(katie)
    db.session.add(sama)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
