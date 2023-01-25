# Safekeep

Custody Services portal for institutional clients to view their account balances, input trades and view trade history.

<!-- DEMO -->
<details>
  <summary>Demo</summary>
  <ul>
    <li><a href="https://safekeep.onrender.com/">View Demo</a></li>
    <li>
      Demo Login
      <ul>
        <li>Email: demo@email.com</li>
        <li>Password: demo</li>
      </ul>
    </li>
    <li>Note:  This site is hosted on Render and is automatically spun down after a period of inactivity. Please allow up to 30 seconds for the service to spin back up!</li>
  </ul>
</details>
<br />

## About the project

As my final (capstone) project for the General Assembly Software Engineering Immersive course, I decided to go back to my finance roots, referencing my time as an institutional account manager for custody service clients. This client facing application is used by clients daily to manage their accounts and transactions with the custodian. I have simplified the advanced features and database in view of the tight timeline for this project, however, the basic functionality of viewing account/trade data and creating trades will be showcased here.

![image](https://user-images.githubusercontent.com/115612053/214499295-24ea3498-89ad-46c0-9aa4-6910118ca980.png)

## Client stack

- Language: TypeScript
- Framework: Reactjs
- UI Library: Material UI
- Other Libraries: Formik, Yup, Chartjs, Axios
- Package Manager: npm

## Server stack

- Language: TypeScript
- Framework: Express
- ORM: Prisma
- Database: PostgreSQL
- Other Libraries: Express-session, Express-validation, bcrypt, helmet, dotenv
- Package Manager: npm

## Deployment

- Monorepo deployment on Render

## User Stories

**Client**

- able to login
- able to redirect to client dashboard with role specific drawer menu
  - able to view dashboard summary with account balance, trade log with pagination, account representative information
  - able to send email to listed account manager
- able to navigate to account balance view via drawer menu
  - able to view account balance details and deposit/withdraw cash forms
  - able to deposit/withdraw cash upon submit and see details refresh accordingly
  - able to see status failure when withdrawing more cash than available balance
- able to navigate to trades view via drawer menu
  - able to see trade log with pagination and trade input form
  - able to input trades and see details added to trade log
  - able to see status failure when:
    - buy trade with insufficient cash balance
    - sell trade with insufficient equity/fixed income balance
  - able to see equity and fixed income trades update balances on dashboard summary and account balance view.

**Admin**

- able to login
- able to redirect to admin dashboard with role specific drawer menu
  - able to view first client (sorted by ascending order) summary details, including account balance, trade log with pagination, client's user list and a client select dropdown box with retrieve button
  - able to change client on client select dropdown box and submit retrieve to refresh account balance, trade log with pagination and client's user list to selected client
  - able to only see own assigned clients
- able to navigate to access view via drawer menu
  - able to see create new client and create user form
  - able submit new client request and see successful client creation status
  - able to create users under assigned clients, selected from dropdown

## Contact

Send me a DM on [LinkedIn](https://www.linkedin.com/in/nicholasgtan/)

## Acknowledgements

- SVG: [uxwing](https://uxwing.com/)
- Hero background: Photo by [Etienne Martin](https://unsplash.com/photos/2_K82gx9Uk8) on [Unsplash](https://unsplash.com/)
