# Database Schema

# Layout
<img width="848" alt="image" src="https://github.com/user-attachments/assets/93682c52-f826-4efe-8fd5-9067050d7d9d" />


## Users Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | int | PRIMARY KEY |
| firsName | varchar | NOT NULL |
| lastName | varchar | NOT NULL |
| phoneNumber | varchar | UNIQUE, NOT NULL |
| restaurantOwner | boolean | |
| first_name | varchar | NOT NULL |
| last_name | varchar | NOT NULL |
| phone_number | varchar | UNIQUE | NOT NULL |
| restarauntOwner | boolean | |
| address | varchar | NOT NULL |
| city | varchar | NOT NULL |
| state | varchar | NOT NULL |
| zip | int | NOT NULL |
| wallet | decimal | |
| hashed_password | varchar | NOT NULL |
| email | varchar | NOT NULL |
| createdAt | timestamp | |
| updatedAt | timestamp | |

## Restaurants Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | int | PRIMARY KEY |
| ownerId | int | |
| address | varchar | NOT NULL |
| city | varchar | NOT NULL |
| state | varchar | NOT NULL |
| zip | int | NOT NULL |
| name | varchar | UNIQUE, NOT NULL |
| cuisineType | enum | |
| deliveryFee | decimal | |
| businessHours | varchar | NOT NULL |
| Servicing | boolean | |
| storeImage | url | |
| description | text | |
| priceLevel | enum | |
| deliveryTime | int | |
| createdAt | timestamp | |
| updatedAt | timestamp | |

## Reviews Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | int | PRIMARY KEY |
| restaurantId | int | |
| userId | int | |
| orderId | int | |
| review | text | |
| orderRating | int | |
| restarauntRating | int | |
| createdAt | timestamp | |
| updatedAt | timestamp | |

## MenuItems Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | int | PRIMARY KEY |
| restaurantId | int | |
| name | varchar | |
| foodtype | ENUM | ('Appetizers', 'Entrees', 'Desserts', 'Drinks') |
| description | text | |
| price | decimal | |
| foodImage | url | |
| createdAt | timestamp | |
| updatedAt | timestamp | |

## Orders Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | int | PRIMARY KEY |
| restaurantId | int | |
| userId | int | |
| totalCost | decimal | |
| status | enum | ('Completed', 'Canceled', 'Active') |
| promo | varchar | |
| createdAt | timestamp | |
| updatedAt | timestamp | |

## OrderItems Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | int | PRIMARY KEY |
| orderId | int | |
| menuItemId | int | |
| quantity | int | |
| price | decimal | |

## Foreign Key References
```
Users.id < Reviews.userId
Users.id < Orders.userId
Users.id < Restaurants.ownerId
Restaurants.id < MenuItems.restaurantId
Restaurants.id < Reviews.restaurantId
MenuItems.id < Orders.totalCost
MenuItems.restaurantId < Orders.restaurantId
Orders.id < OrderItems.orderId
MenuItems.id < OrderItems.menuItemId
```
