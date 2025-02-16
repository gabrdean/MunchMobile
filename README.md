# About NomNow 

NomNow is an online platform that connects people with local restaurants, similar to UberEats. It allows users to browse restaurants and their menus, place new orders, reorder past meals, leave restaurant reviews, and create their own restaurant listings and menus.

[Visit the Live Site](https://nomnow-75lb.onrender.com/) 

<img width="400" alt="NomNow-homepage" src="./react-vite/public/images/home.png">

## Tech Stack

### Frameworks and Libraries
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) 
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white) 
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) 
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) 
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white) 
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) 
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)

 ### Database:
 ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
 
 ### Hosting:
 ![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)

## Features & Functionality

1. Restaurants
2. Menu Items
3. Reviews
4. Cart
5. Checkout
6. Past Orders
7. Manage Account


### Restaurants:
Users can browse restaurants to explore and order from.

<img width="400" alt="NomNow-restaurants" src="./react-vite/public/images/restaurants.png">

### Menu Items:
Users can view all menu items for each restaurant.

<img width="400" alt="NomNow-menu-items" src="./react-vite/public/images/menu-items.png">

### Reviews:
Users can read reviews for each restaurant, and leave reviews for restaurants they have ordered from.

<img width="400" alt="NomNow-reviews" src="./react-vite/public/images/reviews.png">

### Cart:
Users can add items to their cart from a single restaurant.

<img width="400" alt="NomNow-cart" src="./react-vite/public/images/cart.png">

### Checkout:
Users can checkout to place an order from a single restaurant.

<img width="400" alt="NomNow-checkout" src="./react-vite/public/images/checkout.png">

### Past Orders:
Users can view and re-order past orders.

<img width="400" alt="NomNow-orders" src="./react-vite/public/images/past-orders.png">

### Manage Account:
Users can manage their account and create, update, and delete restaurants and menu items.

<img width="400" alt="NomNow-account" src="./react-vite/public/images/manage-account.png">

## Future Features

1. Search

## Setup
1. Clone this repository 

2. Install dependencies

      ```bash
      pipenv install -r requirements.txt
      ```

3. Create a **.env** file based on the example with proper settings for your
   development environment

4. Make sure the SQLite3 database connection URL is in the **.env** file

5. This starter organizes all tables inside the `flask_schema` schema, defined
   by the `SCHEMA` environment variable.  Replace the value for
   `SCHEMA` with a unique name, **making sure you use the snake_case
   convention**.

6. Get into your pipenv, migrate your database, seed your database, and run your Flask app

   ```bash
   pipenv shell
   ```

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

   ```bash
   flask run
   ```


## Contact

• Burak Ozdemir | &nbsp; [GitHub](https://github.com/burakoncuy)

• Gabriel Dean | &nbsp; [GitHub](https://github.com/gabrdean)

• Katie Leong | &nbsp; [GitHub](https://github.com/heykatie)

• Marcelle Armstrong | &nbsp; [GitHub](https://github.com/Mcode4)

• Samai Althiabat | &nbsp; [GitHub](https://github.com/SamaAlt)