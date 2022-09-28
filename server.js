const express = require('express');
const app = express();
const userRoutes = require("./routes/user.routes");
const cors = require('cors')

const PORT = process.env.PORT || 8080;

app.use(cors())
app.use(express.json());
app.use("/api", userRoutes);

app.listen(PORT, () => console.log(`App is running on ${PORT}`));
