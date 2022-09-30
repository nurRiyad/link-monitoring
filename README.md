# link-monitoring

### Description

An API server that stores some URLs of authenticated users. Continuously monitor the URLs. If the URLs state change sends an SMS to the user.

This project is build with raw nodejs, without using any other packages.My main goal for this project was to learn, how nodejs work with it's built in module like http, os, path, url and others

### API Documentation

- **Auth Related**
  - `/signup`
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
  - `/signin`
    - Req Type: post
    - Auth Type: Public
    - Body
    ```
      {
        "phone": "01730232345",
        "password": "sdfs"
      }
    ```
  - `/signout`
    - Req Type: get
    - Auth Type: Private/token

<br>

- **User Related**

  - `/user`

    - Req Type: get
    - Auth Type: private/token
    - Query: ?phone=5464
    - Body

  - `/user`
    - Req Type: put
    - Auth Type: Private/token
    - Body
    ```
      {
        "firstName": "Md. Al Asad Nur ",
        "lastName": "Riyad",
        "phone": "01124538191",
        "address": "dhaka",
        "password": "sdfsd"
      }
    ```
  - `/user`
    - Req Type: delete
    - Auth Type: Private/token
    - Query: ?phone=5464

<br>

- **Check Related**

  - `/check`

    - Req Type: post
    - Auth Type: private/token
    - Body

    ```
    {
        "protocol": "http",
        "method": "GET",
        "url": "www.google.com",
        "successcode": ["200","201"],
        "timeout":3
    }
    ```

  - `/check`
    - Req Type: get
    - Auth Type: Private/token
    - Query: ?id=5464
    - Body
  - `/check`

    - Req Type: put
    - Auth Type: Private/token
    - Body

    ```
    {
        "id": "xj6zefdd0054mpz4rp",
        "protocol": "http",
        "method": "GET",
        "url": "www.reddit.com",
        "successcode": ["200","201","400"],
        "timeout":3
    }
    ```

  - `/check`
    - Req Type: delete
    - Auth Type: Private/token
    - Query: ?id=5464

## Next thing to do in this project

[] Send token in cookie instead of Body<br>
⬜ When a user account deleted all its check should be auto deleted<br>
⬜ When a user is deleted all it's token shuld be auto deleted<br>
⬜ Auto cleanup expire auth token<br>
⬜ Use promice base api and esm
