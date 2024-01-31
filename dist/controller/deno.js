"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var pool = require("../config/pool");
var generateNumericValue = require("../Generator/NumericId");

var _require = require('@aws-sdk/s3-request-presigner'),
    getSignedUrl = _require.getSignedUrl;

var _require2 = require('@aws-sdk/client-s3'),
    S3Client = _require2.S3Client,
    GetObjectCommand = _require2.GetObjectCommand;

exports.createDemo = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var connection, _req$body, name, Category, _Number, playList, size, Type, image, url, check, aid, result, query, values;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            connection = void 0;
            _context.prev = 1;
            _req$body = req.body, name = _req$body.name, Category = _req$body.Category, _Number = _req$body.Number, playList = _req$body.playList, size = _req$body.size, Type = _req$body.Type;
            image = req.files.image;
            url = image[0].location;
            _context.next = 7;
            return pool.connect();

          case 7:
            connection = _context.sent;
            check = 'SELECT * FROM demo WHERE d_id = $1';
            aid = 'D-' + generateNumericValue(8);
            _context.next = 12;
            return connection.query(check, [aid]);

          case 12:
            result = _context.sent;

          case 13:
            if (!(result.rowCount > 0)) {
              _context.next = 20;
              break;
            }

            aid = 'D-' + generateNumericValue(8);
            _context.next = 17;
            return connection.query(check, [aid]);

          case 17:
            result = _context.sent;
            _context.next = 13;
            break;

          case 20:
            query = 'INSERT INTO demo(name,d_id,Category,Number,playList,size,Type,url) VALUES ($1, $2, $3, $4, $5,$6,$7,$8)';
            values = [name, aid, Category, _Number, playList, size, Type, url];
            _context.next = 24;
            return connection.query(query, values);

          case 24:
            return _context.abrupt("return", res.status(201).send({ message: 'Created successfully' }));

          case 27:
            _context.prev = 27;
            _context.t0 = _context["catch"](1);

            console.error(_context.t0);
            return _context.abrupt("return", res.status(400).send({ message: 'Error creating !' }));

          case 31:
            _context.prev = 31;

            if (!connection) {
              _context.next = 35;
              break;
            }

            _context.next = 35;
            return connection.release();

          case 35:
            return _context.finish(31);

          case 36:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined, [[1, 27, 31, 36]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.viewDemo = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var connection, _req$query, name, category, type, findQuery, result, demoData, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, row, _name, d_id, _category, number, url, _type, playlist, fileUrl, key, s3Client, command, signedUrl;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            connection = void 0;
            _context2.prev = 1;
            _req$query = req.query, name = _req$query.name, category = _req$query.category, type = _req$query.type;

            console.log(req.query);
            _context2.next = 6;
            return pool.connect();

          case 6:
            connection = _context2.sent;
            findQuery = 'SELECT * FROM demo WHERE true';


            if (name !== undefined) {
              findQuery += " AND name = '" + name + "'";
            }

            if (category !== undefined) {
              findQuery += " AND category = '" + category + "'";
            }

            if (type !== undefined) {
              findQuery += " AND type = " + type;
            }

            _context2.next = 13;
            return connection.query(findQuery);

          case 13:
            result = _context2.sent;

            if (!(result.rowCount === 0)) {
              _context2.next = 16;
              break;
            }

            return _context2.abrupt("return", res.status(404).send({ message: 'No records found' }));

          case 16:
            demoData = [];
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 20;
            _iterator = result.rows[Symbol.iterator]();

          case 22:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context2.next = 42;
              break;
            }

            row = _step.value;
            _name = row.name, d_id = row.d_id, _category = row.category, number = row.number, url = row.url, _type = row.type, playlist = row.playlist;
            fileUrl = url;
            key = 'demo1/' + fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
            _context2.prev = 27;
            s3Client = new S3Client({
              region: process.env.BUCKET_REGION,
              credentials: {
                accessKeyId: process.env.ACCESS_KEY,
                secretAccessKey: process.env.SECRET_ACCESS_KEY
              }
            });
            command = new GetObjectCommand({
              Bucket: process.env.BUCKET_NAME,
              Key: key
            });
            _context2.next = 32;
            return getSignedUrl(s3Client, command, { expiresIn: 36000 });

          case 32:
            signedUrl = _context2.sent;


            demoData.push({ name: _name, d_id: d_id, category: _category, number: number, type: _type, url: signedUrl, playlist: playlist });
            _context2.next = 39;
            break;

          case 36:
            _context2.prev = 36;
            _context2.t0 = _context2["catch"](27);

            console.error("Error retrieving file '" + key + "': " + _context2.t0);

          case 39:
            _iteratorNormalCompletion = true;
            _context2.next = 22;
            break;

          case 42:
            _context2.next = 48;
            break;

          case 44:
            _context2.prev = 44;
            _context2.t1 = _context2["catch"](20);
            _didIteratorError = true;
            _iteratorError = _context2.t1;

          case 48:
            _context2.prev = 48;
            _context2.prev = 49;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 51:
            _context2.prev = 51;

            if (!_didIteratorError) {
              _context2.next = 54;
              break;
            }

            throw _iteratorError;

          case 54:
            return _context2.finish(51);

          case 55:
            return _context2.finish(48);

          case 56:
            if (!(demoData.length === 0)) {
              _context2.next = 58;
              break;
            }

            return _context2.abrupt("return", res.status(404).send({ error: 'Data not found.' }));

          case 58:
            return _context2.abrupt("return", res.send({ data: demoData }));

          case 61:
            _context2.prev = 61;
            _context2.t2 = _context2["catch"](1);

            console.error(_context2.t2);
            return _context2.abrupt("return", res.status(500).send({ message: 'Internal server error!' }));

          case 65:
            _context2.prev = 65;

            if (!connection) {
              _context2.next = 69;
              break;
            }

            _context2.next = 69;
            return connection.release();

          case 69:
            return _context2.finish(65);

          case 70:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[1, 61, 65, 70], [20, 44, 48, 56], [27, 36], [49,, 51, 55]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=deno.js.map