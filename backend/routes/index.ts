import { Request, Response as Res } from "express";

interface Req extends Request {
  body: {}
}

export default function (req: Req, res: Res) {
  res.status(200).json({
    message: "Hello world"
  });
}