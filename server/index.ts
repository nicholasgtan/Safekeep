// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// async function main() {
//   // ... you will write your Prisma Client queries here
//   await prisma.client.update({
//     where: { id: "7adf59ec-86b1-4ee1-960f-b08a4840995b" },
//     data: {
//       userList: {
//         create: {
//           email: "bobbylee@abc.com",
//           firstName: "Bobby",
//           lastName: "Lee",
//           password: "321",
//         },
//       },
//     },
//   });

//   const allClients = await prisma.client.findMany({
//     include: {
//       userList: true,
//     },
//   });
//   console.dir(allClients, { depth: null });

//   // const allUsers = await prisma.user.findMany({
//   //   include: {
//   //     client: true,
//   //   },
//   // });
//   // console.dir(allUsers, { depth: null });
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
