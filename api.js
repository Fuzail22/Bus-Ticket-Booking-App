let express = require("express");
let cors = require("cors"); //cross origin Resource Sharing
let bodyParser = require("body-parser");
let mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/busDb", {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

let ticketModel = require("./database/tickerDetails");

let app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/fillDb", function (req, res) {
  for (let i = 1; i <= 40; i++) {
    let ins = new ticketModel({ status: true, ticketNo: i });
    ins.save(function (err) {
      if (err) {
        console.log(err);
      }
    });
  }
  res.json({ msg: "Data Saved" });
});

// app.get(
//     "/userDetails/:number",function (
//     req /*request is always the first parameter even if you write res over here request is only received*/,
//     res
//   ){});

app.get("/userDetails/:number", function (req, res) {
  let no = req.params.number;
  if (no > 40 || no < 1) {
    res.json({ Data: "Invalid Request" });
    return;
  }
  let lt = ticketModel.findOne({ ticketNo: no });
  lt.exec(function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.json({ Data: data });
    }
  });
});

app.get("/closed", function (req, res) {
  let query = ticketModel.find({ status: false }).select("ticketNo");
  query.exec((err, data) => {
    if (err) console.log(err);
    else res.json({ Data: data });
  });
});

app.get("/open", function (req, res) {
  let query = ticketModel.find({ status: true }).select("ticketNo");
  query.exec((err, data) => {
    if (err) console.log(err);
    else res.json({ Data: data });
  });
});

app.put("/updateTicket", function (req, res) {
  let no = req.body.ticketNo;
  if (no > 40 || no < 1) {
    res.json({ data: "Invalid Input" });
    return;
  }
  ticketModel.updateOne({ ticketNo: no }, req.body, function (err) {
    if (err) console.log(err);
    else res.json({ Data: "Data Updated" });
  });
});

app.get("/ticketStatus/:number", (req, res) => {
  let no = req.params.number;
  if (no > 40 || no < 1) {
    res.json({ Data: "invalid request" });
    return;
  }
  let query = ticketModel.findOne({ ticketNo: no }).select("status");
  query.exec((err, data) => {
    if (err) console.log(err);
    else if (data.status) res.json({ Data: "open" });
    else res.json({ Data: "close" });
  });
});

app.put("/reset", (req, res) => {
  ticketModel.updateMany(
    { status: false },
    { $set: { Status: true, userDetails: [] } },
    (err) => {
      if (err) console.log(err);
      else res.json({ Data: "Reset Successful" });
    }
  );
});
app.listen(8899, function () {
  console.log("server started @ 8899");
});
