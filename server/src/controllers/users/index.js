const mongoose = require('mongoose'),
  Model = require('../../models/users'),
  validate = require('../../utils/validate'),
  crypto = require('../../utils/crypto'),
  moment = require('moment'),
  request = require('../../utils/request'),
  Logger = require('../../services/logger');

const name = 'users';
module.exports.name = name;
module.exports.get = async function (req, res, next) {
  try {
    let conditions = { $and: [{ enable: req.query.enable ? req.query.enable : true }] };
    if (req.query.filter) {
      conditions.$and.push({
        $or: [
          { email: new RegExp(req.query.filter, 'i') },
          { fullName: new RegExp(req.query.filter, 'i') },
          { personNumber: new RegExp(req.query.filter, 'i') },
          { phone: new RegExp(req.query.filter, 'i') },
        ],
      });
    }
    if (!req.query.sortBy) req.query.sortBy = 'email';
    req.query.rowsNumber = await Model.where(conditions).countDocuments();
    const options = {
      skip: (parseInt(req.query.page) - 1) * parseInt(req.query.rowsPerPage),
      limit: parseInt(req.query.rowsPerPage),
      sort: { [req.query.sortBy || 'email']: req.query.descending === 'true' ? -1 : 1 }, // 1 ASC, -1 DESC
    };
    Model.find(conditions, null, options, function (e, rs) {
      if (e) return res.status(500).send(e);
      // if (!rs) return res.status(404).send('No data exist!')
      return res.status(200).json({ rowsNumber: req.query.rowsNumber, data: rs });
    });
  } catch (e) {
    return res.status(500).send('invalid');
  }
};

module.exports.find = async function (req, res, next) {
  try {
    if (!req.query._id) {
      if (mongoose.Types.ObjectId.isValid(req.query._id)) {
        Model.findById(req.query._id, (e, rs) => {
          if (e) return res.status(500).send(e);
          if (!rs) return res.status(404).send('no_exist');
          return res.status(200).json(rs);
        });
      } else {
        return res.status(500).send('invalid');
      }
    } else if (!req.query.email) {
      Model.findOne({ email: req.query.email }, (e, rs) => {
        if (e) return res.status(500).send(e);
        if (!rs) return res.status(404).send('no_exist');
        return res.status(200).json(rs);
      });
    }
  } catch (e) {
    return res.status(500).send('invalid');
  }
};

module.exports.post = async function (req, res, next) {
  try {
    if (!req.body || Object.keys(req.body).length < 1 || !req.body.email) {
      return res.status(500).send('invalid');
    }
    const x = await Model.findOne({ email: req.body.email });
    if (x) return res.status(501).send('exist');
    const password = crypto.NewGuid().split('-')[0];
    req.body.salt = crypto.NewGuid('n');
    req.body.password = crypto.SHA256(password + req.body.salt);
    req.body.created = { at: new Date(), by: req.verify._id, ip: request.getIp(req) };
    req.body.dateBirth = moment(req.body.dateBirth, 'DD/MM/YYYY');
    const data = new Model(req.body);
    // data.validate()
    data.save((e, rs) => {
      if (e) return res.status(500).send(e);
      rs.password = password;
      // Push logs
      Logger.set(req, name, rs._id, 'insert');
      return res.status(201).json(rs);
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send('invalid');
  }
};

module.exports.import = async function (req, res, next) {
  if (!req.body || !req.body.length) return res.status(500).send('invalid');
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const rs = { success, error };
    let i = 0;
    for await (const e of req.body) {
      i++;
      const x = await MUser.findOne({ username: e.username });
      if (x) {
        rs.error.push(i);
        continue;
      }
      e.salt = NewGuid('n');
      e.password = SHA256(e.password + e.salt);
      e.created = { at: new Date(), by: req.verify._id, ip: getIp(req) };
      const item = new MUser(e);
      const itemSave = await item.save();
      if (itemSave) rs.success.push(i);
      else rs.error.push(i);
    }
    return res.status(201).json(rs);
  } catch (e) {
    console.log(e);
    await session.abortTransaction();
    session.endSession();
    return res.status(500).send('invalid');
  }
};

module.exports.create = async function (req, res, next) {
  try {
    if (!req.body && !Array.isArray(req.body)) return res.status(500).send('invalid');
    if (req.body.length < 1) return res.status(500).send('Empty data!');
    const data = [];
    req.body.forEach((e) => {
      data.push(new Model(e));
    });
    Model.create(data)
      .then((rs) => {
        return res.status(201).json(rs);
      })
      .catch((e) => {
        return res.status(500).send(e);
      });
  } catch (e) {
    return res.status(500).send('invalid');
  }
};

module.exports.insertOne = async function (req, res, next) {
  try {
    if (!req.body) return res.status(500).send('invalid');
    const data = new Model(req.body);
    data.validate();
    Model.collection.insertOne(data, (e, rs) => {
      if (e) return res.status(500).send(e);
      // Push logs
      Logger.set(req, name, rs._id, 'insert');
      return res.status(200).json(rs);
    });
  } catch (e) {
    return res.status(500).send('invalid');
  }
};

module.exports.put = async function (req, res, next) {
  try {
    // if (!req.body._id) return res.status(500).send('invalid')
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid');
    if (mongoose.Types.ObjectId.isValid(req.body._id)) {
      Model.updateOne(
        { _id: req.body._id },
        {
          $set: {
            group: req.body.group,
            fullName: req.body.fullName,
            phone: req.body.phone,
            personNumber: req.body.personNumber,
            region: req.body.region,
            avatar: req.body.avatar,
            note: req.body.note,
            dateBirth: req.body.dateBirth,
            gender: req.body.gender,
            address: req.body.address,
            roles: req.body.roles,
          },
        },
        (e, rs) => {
          // { multi: true, new: true },
          if (e) return res.status(500).send(e);
          // Push logs
          Logger.set(req, name, req.body._id, 'update');
          return res.status(202).json(rs);
        },
      );
    } else {
      return res.status(500).send('invalid');
    }
  } catch (e) {
    return res.status(500).send('invalid');
  }
};

module.exports.resetPassword = async function (req, res, next) {
  try {
    if (mongoose.Types.ObjectId.isValid(req.body._id)) {
      // Find user by id
      const x = await Model.findById(req.body._id);
      if (!x) return res.status(404).send('no_exist');
      // Generate password
      const password = crypto.NewGuid().split('-')[0];
      Model.updateOne(
        { _id: req.body._id },
        { $set: { password: crypto.SHA256(password + x.salt) } },
        (e, rs) => {
          if (e) return res.status(500).send(e);
          // Push logs
          Logger.set(req, name, req.body._id, 'reset-password');
          res.status(206).json({ password: password });
        },
      );
    } else {
      return res.status(500).send('invalid');
    }
  } catch (e) {
    return res.status(500).send('invalid');
  }
};

module.exports.changePassword = async function (req, res, next) {
  try {
    // Find user by id
    const user = await Model.findOne({ _id: req.verify._id });
    if (!user) return res.status(404).send('no_exist');
    // check password
    if (user.password !== crypto.SHA256(req.body.oldPassword + user.salt))
      return res.status(505).json({ msg: 'wrong_password' });
    // set new password
    Model.updateOne(
      { _id: req.verify._id },
      { $set: { password: crypto.SHA256(req.body.newPassword + user.salt) } },
      (e, rs) => {
        if (e) return res.status(500).send(e);
        // Push logs
        Logger.set(req, name, user._id, 'change-password');
        res.status(202).json(true);
      },
    );
  } catch (e) {
    return res.status(500).send('invalid');
  }
};

module.exports.patch = async function (req, res, next) {
  try {
    let rs = { success: [], error: [] };
    for await (let _id of req.body._id) {
      // if (!validate.isBoolean(req.body.disabled)) {
      //   rs.error.push(id)
      //   continue
      // }
      const x = await Model.findById(_id);
      if (x) {
        var _x = await Model.updateOne(
          { _id: _id },
          { $set: { enable: x.enable === true ? false : true } },
        );
        if (_x.nModified) {
          rs.success.push(_id);
          // Push logs
          Logger.set(req, name, _id, x.enable === true ? 'lock' : 'unlock');
        } else rs.error.push(_id);
      }
    }
    return res.status(203).json(rs);
    // if (!validate.isBoolean(req.body.disabled)) return res.status(500).send('invalid')
    // if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    //   Model.updateOne({ _id: req.params.id }, { $set: { disabled: req.body.disabled } }, (e, rs) => {
    //     if (e) return res.status(500).send(e)
    //     if (!rs) return res.status(404).send('no_exist')
    //     return res.status(203).json(rs)
    //   })
    // } else {
    //   return res.status(500).send('invalid')
    // }
  } catch (e) {
    return res.status(500).send('invalid');
  }
};

module.exports.verified = async function (req, res, next) {
  try {
    if (!validate.isBoolean(req.body.verified)) return res.status(500).send('invalid');
    if (mongoose.Types.ObjectId.isValid(req.body._id)) {
      Model.updateOne({ _id: req.body._id }, { $set: { verified: req.body.verified } }, (e, rs) => {
        if (e) return res.status(500).send(e);
        // Push logs
        Logger.set(req, name, req.body._id, 'verified');
        return res.status(205).json(rs);
      });
    } else {
      return res.status(500).send('invalid');
    }
  } catch (e) {
    return res.status(500).send('invalid');
  }
};

module.exports.delete = async function (req, res, next) {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params._id)) {
      Model.deleteOne({ _id: req.params._id }, (e, rs) => {
        if (e) return res.status(500).send(e);
        // Push logs
        Logger.set(req, name, req.params._id, 'delete');
        return res.status(204).json(rs);
      });
    } else {
      return res.status(500).send('invalid');
    }
  } catch (e) {
    return res.status(500).send('invalid');
  }
};
