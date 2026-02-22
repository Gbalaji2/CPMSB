import csvParser from "csv-parser";
import fs from "fs";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";

export const importStudentsFromCSV = async (filePath) => {
  const students = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => students.push(row))
      .on("end", async () => {
        try {
          let created = 0;

          for (const s of students) {
            const existing = await User.findOne({ email: s.email });
            if (existing) continue;

            const hashed = await bcrypt.hash(s.password || "123456", 10);

            const user = await User.create({
              name: s.name,
              email: s.email,
              password: hashed,
              role: "student",
            });

            await StudentProfile.create({
              userId: user._id,
              department: s.department || "",
              year: s.year || "",
              cgpa: Number(s.cgpa || 0),
            });

            created++;
          }

          resolve({ success: true, created });
        } catch (err) {
          reject(err);
        }
      })
      .on("error", reject);
  });
};