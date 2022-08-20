# link-monitoring

### Description

An API server that stores some URLs of authenticated users. Continuously monitor the URLs. If the URLs state change sends an SMS to the user.

### API Documentation

- **Auth Related**
  - `signup`
    - Req Type: post
    - Auth Type: public
    - Body
    ```
    {
      "firstName": "Md. Al Asad Nur",
      "lastName": "Riyad",
      "phone": "01712458192",
      "address": "rangpur",
      "password": "sdfsdfd"
    }
    ```
- `ingnin`
  - Req Type: post
  - Auth Type: Public
  - Body
  ```
    {
      "phone": "01730232345",
      "password": "sdfs"
    }
  ```
- `signout`
  - Req Type: get
  - Auth Type: Private/token
