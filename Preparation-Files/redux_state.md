# NomNow Redux State

```javascript
{
  users: {
    1:{
      id: 1,
      firstName: 'Demo',
      lastName: 'AA',
      email: "demo@aa.io",
    },
    2: {
      id: 2,
      firstName: 'Demo',
      lastName: 'AA',
      email: "demo@aa.io",
    }
  },
  cart: {
    user_id: 2,
    storeId: 2124,
    storeName: 'FireWings', // optional
    storeAddress: 'etc', // optional
    items: {
      1: {
        itemId: 321,
        quantity: 3,
        name: 'Chicken Wings',
        price: 3.20,
      },
      2: {
        itemId: 4343,
        quantity: 1,
        name: 'Chicken Wings',
        price: 3.20,
      },
      3: {
        itemId: 23,
        quantity: 2,
        name: 'Chicken Wings',
        price: 3.20,
      }
    },
    total: 55,
    tax: 0.04,
    delivery_fee: 5,
  },
  session: {
    user: {
      id: 23,
      firstName: 'Bob',
      lastName: 'Bobber',
      email: 'BobBobber@aa.io',
      phone: '14125232345',
      wallet: 100,
      restaurant_owner: true,
      address: '22 Forever Drive',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90210',
    },
    pastOrders: {
      1: {
        order_id: 123,
        order: {
            user_id: 2,
            storeId: 2124,
            storeName: 'FireWings', // optional
            storeAddress: 'etc', // optional
            items: {
              1: {
                itemId: 321,
                quantity: 3,
                name: 'Chicken Wings',
                price: 3.20,
              },
              2: {
                itemId: 4343,
                quantity: 1,
                name: 'Chicken Wings',
                price: 3.20,
              },
              3: {
                itemId: 23,
                quantity: 2,
                name: 'Chicken Wings',
                price: 3.20,
              }
            },
            total: 55,
            tax: 0.04,
            delivery_fee: 5,
          },
        },
      2: {
        order_id: 332,
        order: {
          user_id: 2,
          storeId: 2124,
          storeName: 'FireWings', // optional
          storeAddress: 'etc', // optional
          items: {
            1: {
              itemId: 321,
              quantity: 3,
              name: 'Chicken Wings',
              price: 3.20,
            },
            2: {
              itemId: 4343,
              quantity: 1,
              name: 'Chicken Wings',
              price: 3.20,
            },
            3: {
              itemId: 23,
              quantity: 2,
              name: 'Chicken Wings',
              price: 3.20,
            }
          },
          total: 55,
          tax: 0.04,
          delivery_fee: 5,
        },
      },
    },
  },
  restaurants: {
    1: {
      id: 23,
      name: 'FireWings',
      owner_id: 3,
      price_level: 2,
      address: '464 8th Street',
      city: 'Oakland',
      state: 'CA',
      zip: '94607',
      cuisine_type: 'Asian',
      delivery_fee: 3.20,
      business_hours: ,
      servicing: true,
      store_image: 'banner.img',
      description: 'blah blah',
      delivery_time: 30
      menu: {
        1: {
          id: 2,
          name: 'Wings',
          food_type: 'Entree',
          description: 'crispy',
          price: 3.99,
          food_image: 'wings.url',
        },
        2: {
          id: 43,
          name: 'Wings',
          food_type: 'Entree',
          description: 'crispy',
          price: 3.99,
          food_image: 'wings.url',
        },
        3: {
          id: 14,
          name: 'Wings',
          food_type: 'Entree',
          description: 'crispy',
          price: 3.99,
          food_image: 'wings.url',
        }
      },
      reviews: {
        1: {
          id: 23,
          restaurant_id: 2,
          user_id: 4,
          order_id: 42,
          review: 'great',
          order_rating: 5,
          restaurant_rating: 4
        },
        2: {
          id: 233,
          restaurant_id: 32,
          user_id: 14,
          order_id: 42,
          review: 'great',
          order_rating: 5,
          restaurant_rating: 4
        },
        3: {
          id: 123,
          restaurant_id: 22,
          user_id: 4,
          order_id: 42,
          review: 'great',
          order_rating: 5,
          restaurant_rating: 4
        }
      },
    },
    2: {
      id: 123,
      name: 'FireWings2',
      owner_id: 3,
      price_level: 2,
      address: '464 8th Street',
      city: 'Oakland',
      state: 'CA',
      zip: '94607',
      cuisine_type: 'Asian',
      delivery_fee: 3.20,
      business_hours: ,
      servicing: true,
      store_image: 'banner.img',
      description: 'blah blah',
      delivery_time: 30,
      menu: {
        1: {
          id: 2,
          name: 'Wings',
          food_type: 'Entree',
          description: 'crispy',
          price: 3.99,
          food_image: 'wings.url',
        },
        2: {
          id: 43,
          name: 'Wings',
          food_type: 'Entree',
          description: 'crispy',
          price: 3.99,
          food_image: 'wings.url',
        },
        3: {
          id: 14,
          name: 'Wings',
          food_type: 'Entree',
          description: 'crispy',
          price: 3.99,
          food_image: 'wings.url',
        }
      },
      reviews: {
        1: {
          id: 23,
          restaurant_id: 2,
          user_id: 4,
          order_id: 42,
          review: 'great',
          order_rating: 5,
          restaurant_rating: 4
        },
        2: {
          id: 233,
          restaurant_id: 32,
          user_id: 14,
          order_id: 42,
          review: 'great',
          order_rating: 5,
          restaurant_rating: 4
        },
        3: {
          id: 123,
          restaurant_id: 22,
          user_id: 4,
          order_id: 42,
          review: 'great',
          order_rating: 5,
          restaurant_rating: 4
        }
      },
    }
  },
  errors: [
    "Unauthorized",
    "Incorrect username/password combination",
    "Title cannot exceed 20 characters in length"
  ]
}
```
