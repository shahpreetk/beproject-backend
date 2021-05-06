![beproject-backend](https://socialify.git.ci/shahpreetk/beproject-backend/image?description=1&descriptionEditable=Backend%20of%20BE%20Project%20-%20Online%20Auditorium%20and%20Turf%20Booking%20System.&font=KoHo&language=1&owner=1&pattern=Charlie%20Brown&theme=Light)

### 🛠 Built with

The API system is made using Express, a lightweight Nodejs library. The data is saved on a NoSQL MongoDB database. To welcome the user after signup, we send an email using the Sendgrid service. For the security and privacy of the user, we use bcrypt to hash the user’s password in the database, and session authentication is done via JSON web tokens.

### 👩‍💻 Author

This project was built with ❤️ by [Preet Shah](https://github.com/shahpreetk).

### 🔨 Installation and Setting it Up

If you are interested in setting up the project on your local machine you can simply follow these steps -

- Clone the repository

- To the root of the folder, make a new folder named `config`

- In the `config` folder make a new file named `dev.env`

- In the `dev.env` file add the following -

  - `PORT=3010`
  - `SENDGRID_API_KEY=YOUR_SENDGRID_KEY`
  - `MONGODB_URL=YOUR_LOCAL_DB_URL`
  - `JWT_SECRET=A_KEY_YOU_WOULD_LIKE_TO_KEEP`
  - `STRIPE_API_SECRET=YOUR_SECRET_STRIPE_KEY`

  PS: To learn how to run MongoDB locally, you can refer to the following videos -

  1. for [Mac](https://youtu.be/MIByvzueqHQ)

  2. for [Windows](https://youtu.be/wcx3f0eUiAw)

- Run `npm install` and `npm install -D`

- Run `npm run dev`

### 🖥 Where can I find it?

You can find the backend of BookIt [here](https://onlinebooking-backend.herokuapp.com)!!

And the frontend of BookIt can be found [here](https://kjsieit-onlinebooking.netlify.app/)!!

The code to the frontend of the project can be found at this [repository](https://github.com/shahpreetk/online-booking-frontend)!!

### 🙈 A kind request

This was my first complete MERN stack project and if you like it please do give it a star ⭐️.

Thank you!! 😁

### 📝 License

This project is licensed under [GNU General Public License v3.0
GNU GPLv3](https://spdx.org/licenses/GPL-3.0-or-later.html)
