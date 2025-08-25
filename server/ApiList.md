# DevConnect APIs

## authUser
- POST /signup
- POST /login
- POST /logout

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connection Request Router
- POST /request/send/:status/:userId  [Status can be ignored or interested]
- POST /request/review /accepted/:requestId
- POST /request/review/rejected/:requestId

## userRouter
- GET /user/requests/received
- GET /user/connections
- GET /user/feed - Gets your profiles of others user on Platforms

Status: ignore, interested, accepted, rejected