const mongoose = require(`mongoose`);

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`Conectado ao banco de dados`);
}

main().catch((err) => console.log(err));

module.exports = mongoose;
