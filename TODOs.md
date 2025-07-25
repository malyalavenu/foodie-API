# TODOs: Unimplemented API Routes

This file lists API endpoints required by the project (see Prompt.md) but not yet implemented in the codebase.

## Dish Information APIs
- [ ] GET /restaurants/{restaurantId}/menu — Fetch restaurant’s menu
- [ ] GET /dishes/{dishId} — Fetch specific dish details

## Order Management APIs
- [ ] POST /orders — Create a new order
- [ ] GET /orders/{orderId} — Fetch specific order details
- [ ] GET /users/{userId}/orders — Fetch user’s orders (history)
- [ ] PATCH /orders/{orderId} — Update order status

## Favorites APIs
- [ ] POST /users/{userId}/favorites — Add restaurant/dish to favorites
- [ ] GET /users/{userId}/favorites — Fetch user’s favorites
- [ ] DELETE /users/{userId}/favorites/{itemId} — Remove item from favorites

## Order History APIs
- [ ] GET /users/{userId}/history — Fetch user’s order history

## Customer Support APIs
- [ ] POST /support/tickets — Create support ticket
- [ ] GET /users/{userId}/support/tickets — Fetch user’s support tickets
- [ ] GET /support/tickets/{ticketId} — Fetch specific ticket details

## Reviews and Ratings APIs
- [ ] POST /restaurants/{restaurantId}/reviews — Submit restaurant review
- [ ] GET /restaurants/{restaurantId}/reviews — Fetch restaurant reviews
- [ ] POST /dishes/{dishId}/reviews — Submit dish review

## Promotions and Discounts APIs
- [ ] GET /promotions — Fetch active promotions
- [ ] POST /orders/{orderId}/apply-promotion — Apply promotion to order

## Delivery Tracking APIs
- [ ] GET /orders/{orderId}/tracking — Fetch delivery status and location
- [ ] POST /orders/{orderId}/tracking — Update delivery status

## Notifications APIs
- [ ] POST /users/{userId}/notifications — Send notification to user
- [ ] GET /users/{userId}/notifications — Fetch user’s notifications

## Analytics APIs (Admin)
- [ ] GET /analytics/restaurants — Fetch restaurant performance metrics
- [ ] GET /analytics/orders — Fetch order analytics

## Cart Management APIs
- [ ] POST /users/{userId}/cart — Add items to cart
- [ ] GET /users/{userId}/cart — Fetch user’s cart
- [ ] DELETE /users/{userId}/cart — Clear user’s cart

## Payment APIs
- [ ] POST /orders/{orderId}/payment — Process order payment
- [ ] GET /users/{userId}/payment-methods — Fetch user’s saved payment methods

## Search and Recommendations APIs
- [ ] GET /search — Search restaurants or dishes
- [ ] GET /users/{userId}/recommendations — Fetch personalized recommendations

---

If you implement a route, please check it off here! 