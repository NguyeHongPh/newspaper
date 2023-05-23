<br/>
<p align="center">
  <a href="https://github.com/NguyeHongPh/newspaper">
    <img src="https://github.com/NguyeHongPh/newspaper/blob/main/6306498.jpg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Newspaper</h3>

  <p align="center">
    <a href="https://github.com/NguyeHongPh/newspaper/issues">Report Bug</a>
    .
  </p>
</p>

![Downloads](https://img.shields.io/github/downloads/NguyeHongPh/newspaper/total) ![Contributors](https://img.shields.io/github/contributors/NguyeHongPh/newspaper?color=dark-green) ![Forks](https://img.shields.io/github/forks/NguyeHongPh/newspaper?style=social) ![Stargazers](https://img.shields.io/github/stars/NguyeHongPh/newspaper?style=social) ![Issues](https://img.shields.io/github/issues/NguyeHongPh/newspaper) ![License](https://img.shields.io/github/license/NguyeHongPh/newspaper) 

## Table Of Contents

* [About the Project](#about-the-project)
* [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Authors](#authors)
* [Acknowledgements](#acknowledgements)

## About The Project

This project is a RESTful API that handles user and article management. It provides endpoints for various operations such as getting user information, creating users, changing user passwords, registering users, deleting users, retrieving articles by label, getting all articles, creating articles, updating article information, and deleting articles. The API utilizes the Express framework and includes authentication middleware for securing the routes.

## Built With

Javascript, NodeJS, and ExpressJS

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

Make sure you have installed npm, and nodeJS in your system

### Installation

1. Clone the repo

```sh
git clone git@github.com:NguyeHongPh/newspaper.git
```

2. Go to the folder and install NPM packages

```sh
npm install
```

3. Edit the mongoDB link in the ./app.js to connect with your database as I have to retire it due to some reasons


4. To run the projects, please run npm run dev

```sh
npm install
```

## Usage

For user administration:
Get all users info

    Route: GET /users/
    Description: Retrieves information about all users.
    Access: Login required.

Create user

    Route: POST /users/createuser
    Description: Creates a new user.
    Access: Login and admin role required.

Change user password

    Route: PUT /users/:id
    Description: Changes the password for a specific user.
    Access: Login and admin role required.

Register user

    Route: POST /users/register
    Description: Registers a new user.

Delete user

    Route: DELETE /users/:id
    Description: Deletes a specific user.
    Access: Login and admin role required.

For articles administration:

Get article by label

    Route: GET /article/label/:labelname
    Description: Retrieves articles based on the provided label.
    Access: Login required.

Get all articles

    Route: GET /article/
    Description: Retrieves information about all articles.
    Access: Login required.

Create an article

    Route: POST /article/
    Description: Creates a new article.
    Access: Login and admin role required.

Change article information

    Route: PUT /article/:id
    Description: Updates the information of a specific article.
    Access: Login and admin role required.

Delete an article

    Route: DELETE /article/:id
    Description: Deletes a specific article.
    Access: Login and admin role required.


## Roadmap

See the [open issues](https://github.com/NguyeHongPh/newspaper/issues) for a list of proposed features (and known issues).

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.
* If you have suggestions for adding or removing projects, feel free to [open an issue](https://github.com/NguyeHongPh/newspaper/issues/new) to discuss it, or directly create a pull request after you edit the *README.md* file with necessary changes.
* Please make sure you check your spelling and grammar.
* Create individual PR for each suggestion.
* Please also read through the [Code Of Conduct](https://github.com/NguyeHongPh/newspaper/blob/main/CODE_OF_CONDUCT.md) before posting your first idea as well.

### Creating A Pull Request

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the Apache License 2.0. See LICENSE for more information.

## Authors

* **Nguyen Hong Phuc** - *Junior Back End Developer* - [Nguyen Hong Phuc](https://github.com/NguyeHongPh) - *Built ReadME Template from ShaanCoding*

## Acknowledgements

* [ShaanCoding](https://github.com/ShaanCoding/)
* [ NguyeHongPh](https://github.com/NguyeHongPh)
* [freepik](https://www.freepik.com)
