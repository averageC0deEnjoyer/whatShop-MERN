Live Demo: 
## Welcome to whatShop

https://github.com/averageC0deEnjoyer/whatShop-MERN/assets/136006438/80cfe2d4-caa8-40e9-98c6-fcf5193d7f79

https://github.com/averageC0deEnjoyer/whatShop-MERN/assets/136006438/d2831b5f-6599-45e3-adab-3337e6578d25

This is a project that I create to deepen my understanding about fullstack development, specifically in MERN stack.
Project created by following Brad Traversy video in MERN Stack.
This project is a simple e-commerce, there can be 2 user (normal user and admin user)
Normal user can add items to cart, search item(by category, by search bar), create order to buy items
Admin user can CRUD Product, modify normal user, and can check order

### Flow

1. Put item in cart
2. Sign In/Register if not logged in to checkout
3. Input shipping address
4. Choose payment method
5. Check if everything is correct, then create order
6. Pay for the order

## Description

MERN with Redux to organize state

## What I Learn

- Product
  - Conditional HomeScreen rendering based on searchKeyword / categoryName / page, setup React Route
  - Dynamic pagination
  - Handle error in backend using asyncHandler
  - Logic to handle user review more than once
  - Upload image using multer
- User
  - Can put bcrypt(to verify and to hash) in User model, doesnt need to be in controller
  - JWT in httpOnly cookie (to prevent XSS)
  - MongoDB project using select
- Order
  - Learn how to hit another api from backend (example paypal)
  - Proxy
- Others
  - Redux and RTK Query to simplify state management (but a lot of boilerplate and opinionated)
  - Custom LoginScreen Logic (example, if user already loggedIn, conditional redirect.(new URLSearchParams))
  - If using mutation dont forget to unwrap()
  - Put frontend in the same directory as backend(before i host frontend backend separately)
  - Protect backend route using protect and admin middleware
  - Using mongoose checkObjectId method to check route that uses ID
  - Can put schema inside a model (example reviewSchema, don't have to create a model for it)
  - Calculate price in the server side (so we send only item ID from frontend)
  - Populate database data
  - Package.json type:module to use import export at backend
  - Using bootstrap (Paginate, Carousel, Spinner(Loader Component), Alert(Message Component))
  - Create a react Component to protect react route (in this case user logged in and user admin)
  - Using toastify
  - FaIcon
  - Using CheckoutSteps component to notify client at which step they are
  - FormContainer to position form

## Custom refactor

- Cant buy if qty > stock (tested in POSTman)
- Update stock if user created order (validate, invalidate Tags)
- Category filter
- Only user already bought item can review it
