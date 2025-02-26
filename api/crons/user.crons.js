import cron from "node-cron";
import prisma from "../lib/prisma.js";

cron.schedule("*/15 * * * *", async () => {
  console.log("Running cleanup for unverified users...");

  const twoHoursAgo = new Date();
  twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

  try {
    const deleteUsers = await prisma.user.deleteMany({
      where: {
        verified: false,
        createdAt: { lt: twoHoursAgo },
      },
    });

    console.log(`Deleted ${deleteUsers.count} unverified users`);
  } catch (error) {
    console.error("Error deleting unverified users: ", error.message);
  }
});
