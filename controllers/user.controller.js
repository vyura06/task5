const db = require('../database');

class UserController {
  async getAllUsers(req, res) {
    try {
      let users = [];

      if (req.query.bySenderId) {
        users = await db.query(`SELECT sender_id, name
        FROM "public".users join "public".messages on users.id = sender_id
        group by name, sender_id
        order by sender_id`
        );
      } else {
        users = await db.query(`SELECT * from "public".users`);
      }

      res.json({ users: users.rows });
      console.log(req.body);
    } catch (err) {
      console.error(err.message);
    }
  }

  async createUser(req, res) {
    try {
      const { name } = req.body;
      let user = await db.query(`SELECT * FROM "public".users WHERE name = $1`, [name]);

      if (user.rowCount) {
        res.json({ user: user.rows[0] });
      } else {
        user = await db.query(`INSERT INTO "public".users (name) values ($1) RETURNING *`, [name]);
        res.json({ user: user.rows[0] });
      }
      console.log(req.body);
    } catch (err) {
      console.error(err.message);
    }
  }

  async getUserMessages(req, res) {
    try {
      const id = +req.params.id;

      const messages = await db.query(`SELECT * from "public".messages where receiver_id = $1`, [id]);
      res.json({ messages: messages.rows });
      console.log(req.body);
    } catch (err) {
      console.error(err.message);
    }
  }

  async sendMessage(req, res) {
    try {
      const {
        title,
        message,
        sender_id,
        receiver_id
      } = req.body;

      const sendedMessage = await db.query(`INSERT INTO "public".messages
      (title, message, sender_id, receiver_id, reply_message_id, created_date)
      values ($1, $2, $3, $4, null, $5) RETURNING *`,
        [title, message, sender_id, receiver_id, new Date().toLocaleString()]
      );

      res.json({ message: sendedMessage.rows[0] });
      console.log(req.body);
    } catch (err) {
      console.error(err.message);
    }
  }

  async getMessage(req, res) {
    try {
      const message_id = +req.params.message_id;

      const message = await db.query(`
      select messages.id, title, message, reply_message_id, created_date, messages.sender_id, messages.receiver_id,
        (
          select name
          from "public".users as u join "public".messages as m on u.id = messages.sender_id
          group by name
        ) as sender,
        (
          select name
          from "public".users as u join "public".messages as m on u.id = messages.receiver_id
          group by name
        ) as receiver
      from "public".messages where id = $1;
      `, [message_id]
      );
      res.json({ message: message.rows[0] });
      console.log(req.body);
    } catch (err) {
      console.error(err.message);
    }
  }
}

module.exports = new UserController();