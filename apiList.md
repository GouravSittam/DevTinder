# DevTinder APIs

## Authentication
- **POST** `/signup` - Register a new user
- **POST** `/login` - Login a user
- **POST** `/logout` - Logout a user

## Profile Management
- **GET** `/profile/view` - View user profile
- **PATCH** `/profile/edit` - Edit user profile
- **PATCH** `/profile/password` - //forgot password api

## Connection Requests
- **POST** `/request/send/interested/:userId` - Send an interested connection request
- **POST** `/request/send/ignored/:userId` - Send an ignored connection request

## Request Review
- **POST** `/request/review/accepted/:requestedId` - Accept a connection request
- **POST** `/request/review/rejected/:requestedId` - Reject a connection request

## Connections and Requests
- **GET** `/connections` - Get all connections
- **GET** `/requests/rejections` - Get all rejected requests

## Feed
- **GET** `/feed` - Get profiles of other users on the platform

## UserRouter

- GET /user/requests
/user/connections
/user/feed - Gets you the profiles of other users on platform


## Status
- **ignore** - Ignore a request
- **interested** - Show interest in a request
- **accepted** - Accept a request
- **rejected** - Reject a request