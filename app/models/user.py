from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy import Numeric
import datetime


class User(db.Model, UserMixin):
    __tablename__ = "users"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(40))
    last_name = db.Column(db.String(40))
    phone_number = db.Column(db.String(20), unique=True)
    restaurant_owner = db.Column(db.Boolean, default=False)
    address = db.Column(db.String(40))
    city = db.Column(db.String(40))
    state = db.Column(db.String(40))
    zip = db.Column(db.Integer)
    profile_image = db.Column(db.Text)
    wallet = db.Column(Numeric(10, 2))
    email = db.Column(db.String(255), unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.now())
    updated_at = db.Column(
        db.DateTime, default=datetime.datetime.now(), onupdate=datetime.datetime.now()
    )

    reviews = db.relationship("Review", back_populates="users")
    restaurants = db.relationship("Restaurant", back_populates="users")
    orders = db.relationship("Order", back_populates="users")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)
        print("\nPASSWORD AFTER HASH: ", self.hashed_password, "\n")

    def check_password(self, password):
        print("\nPASSWORD: ", password)
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            "id": self.id,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "email": self.email,
            "phoneNumber": self.phone_number,
            "address": self.address,
            "city": self.city,
            "state": self.state,
            "zip": self.zip,
            "profileImage": self.profile_image,
            "wallet": self.wallet,
            "restaurantOwner": self.restaurant_owner,
            "createdAt": self.created_at,
            "updatedAt": self.updated_at,
        }
    
    def add_funds(self, amount):
        self.wallet += amount
        db.session.commit()
        return self.wallet
    
    def update(self, values):
        for key, val in values.items():
            if(hasattr(self, key) and val != None):
                print(val, f' going into {self}.{key}')
                setattr(self, key, val)
        db.session.commit()
