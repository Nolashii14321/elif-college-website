// hash.js - This is the only code in this file
const bcrypt = require('bcrypt');

// The password you want to hash
const password = 'password123';

// The number of salt rounds (10 is a good default)
const saltRounds = 10;

console.log(`Hashing password: "${password}"...`);

bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
        console.error("Error during hashing:", err);
        return;
    }
    console.log("\n--- PASSWORD HASH GENERATED ---");
    console.log("Your new password hash is:");
    console.log(hash);
    console.log("--- COPY THIS HASH AND PASTE IT INTO MYSQL WORKBENCH ---\n");
});