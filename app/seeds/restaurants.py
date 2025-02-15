from datetime import datetime
from app.models import db, Restaurant, SCHEMA, environment
from app.models.restaurants import CuisineType, PriceLevel
from sqlalchemy.sql import text



def seed_restaurants():
    restaurants = [
        Restaurant(
            owner_id=1,
            address="123 East Houston St",
            city="New York",
            state="NY",
            zip=10002,
            name="Taco Casa",
            cuisine_type=CuisineType.MEXICAN,
            delivery_fee=3.99,
            business_hours="11:00 AM - 10:00 PM",
            servicing=True,
            store_image="https://www.tourhero.com/en/magazine/wp-content/uploads/2024/08/jarritos-mexican-soda-PNCPZ-NcTE4-unsplash-1536x1536.jpg",
            description="Authentic Mexico City street tacos and hand-pressed tortillas",
            price_level=PriceLevel.INEXPENSIVE,
            delivery_time=30,
        ),
        Restaurant(
            owner_id=2,
            address="789 Broadway",
            city="New York",
            state="NY",
            zip=10003,
            name="El Mariachi",
            cuisine_type=CuisineType.MEXICAN,
            delivery_fee=4.99,
            business_hours="10:00 AM - 11:00 PM",
            servicing=True,
            store_image="https://latina.com/wp-content/uploads/2022/01/La_Santa_Torta-1-e1642643780672.jpg",
            description="Family-style Mexican dining with fresh guacamole and artisanal mezcal",
            price_level=PriceLevel.MODERATE,
            delivery_time=35,
        ),
        Restaurant(
            owner_id=3,
            address="456 9th Avenue",
            city="New York",
            state="NY",
            zip=10018,
            name="Olive Grove",
            cuisine_type=CuisineType.MEDITERRANEAN,
            delivery_fee=4.99,
            business_hours="12:00 PM - 10:00 PM",
            servicing=True,
            store_image="https://aladdinshouston.com/wp-content/uploads/2018/11/mediterranean-diet-for-families.jpg",
            description="Classic Mediterranean mezze and grilled specialties",
            price_level=PriceLevel.MODERATE,
            delivery_time=40,
        ),
        Restaurant(
            owner_id=4,
            address="234 7th Avenue",
            city="New York",
            state="NY",
            zip=10011,
            name="Blue Mediterranean",
            cuisine_type=CuisineType.MEDITERRANEAN,
            delivery_fee=5.99,
            business_hours="11:30 AM - 9:30 PM",
            servicing=True,
            store_image="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/44/2b/80/house-combo-plate.jpg?w=1400&h=800&s=1",
            description="Fresh seafood and traditional Mediterranean dishes with a modern twist",
            price_level=PriceLevel.EXPENSIVE,
            delivery_time=45,
        ),
        Restaurant(
            owner_id=5,
            address="567 2nd Avenue",
            city="New York",
            state="NY",
            zip=10016,
            name="Thai Orchid",
            cuisine_type=CuisineType.THAI,
            delivery_fee=3.99,
            business_hours="11:00 AM - 10:30 PM",
            servicing=True,
            store_image="https://26thai.com/n1/wp-content/uploads/2024/03/pad-thai-2-2048x1365.png",
            description="Authentic Thai curries and noodles with fresh herbs from our garden",
            price_level=PriceLevel.VERY_EXPENSIVE,
            delivery_time=35,
        ),
        Restaurant(
            owner_id=4,
            address="890 1st Avenue",
            city="New York",
            state="NY",
            zip=10022,
            name="Bangkok Kitchen",
            cuisine_type=CuisineType.THAI,
            delivery_fee=4.99,
            business_hours="11:30 AM - 10:00 PM",
            servicing=True,
            store_image="https://26thai.com/n1/wp-content/uploads/2024/03/26-Thai_1.2024-17-2048x2048.jpg",
            description="Modern Thai cuisine featuring street food favorites and regional specialties",
            price_level=PriceLevel.MODERATE,
            delivery_time=40,
        ),
    ]

    for restaurant in restaurants:
        db.session.add(restaurant)

    db.session.commit()


def undo_restaurants():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
