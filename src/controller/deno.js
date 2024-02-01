const pool = require("../config/pool");
const generateNumericValue = require("../Generator/NumericId");
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');

exports.createDemo = async (req, res) => {
    let connection;
    try {
        const{name,Category,Number,playList,size,Type,user_name}=req.body;
        const image= req.files.image;
        const url = image[0].location;
        connection=await pool.connect();

        const check = 'SELECT * FROM demo WHERE d_id = $1';
        let aid = 'D-' + generateNumericValue(8);
        let result = await connection.query(check, [aid]);
  
        while (result.rowCount > 0) {
          aid = 'D-' + generateNumericValue(8);
          result = await connection.query(check, [aid]);
        }
  
        const query = 'INSERT INTO demo(name,d_id,Category,Number,playList,size,Type,url,user_name) VALUES ($1, $2, $3, $4, $5,$6,$7,$8,$9)';
        const values = [name, aid, Category,Number,playList,size,Type, url,user_name];
        await connection.query(query, values);
      
  
      return res.status(201).send({ message: 'Created successfully' });
      } catch (error) {
          console.error(error);
      return res.status(400).send({ message: 'Error creating !' });
      }
      finally {
          if (connection) {
            await connection.release();
          }
      }
    };




  

  // exports.viewDemo = async (req, res) => {
  //   let connection;
  //   try {
  //     const { name, category, type  } = req.query;
  //     connection = await pool.connect();
  
  //     let findQuery = 'SELECT * FROM demo WHERE true';
  
  //     if (name !== undefined) {
  //       findQuery += ` AND name = '${name}'`;
  //     }
  
  //     if (category !== undefined) {
  //       findQuery += ` AND category = '${category}'`;
  //     }
  
  //     if (type !== undefined) {
  //       findQuery += ` AND type = ${type}`;
  //     }
  
  //     const result = await connection.query(findQuery);
  
  //     if (result.rowCount === 0) {
  //       return res.status(404).send({ message: 'No records found' });
  //     }
  
  //     const demoData = [];
  
  //     for (const row of result.rows) {
  //       const { name, d_id, category, number, url,type,playlist,created_at } = row;
  //       const fileUrl = url;
  //       const key = 'demo1/' + fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
  
  //       try {
  //         const s3Client = new S3Client({
  //           region: process.env.BUCKET_REGION,
  //           credentials: {
  //             accessKeyId: process.env.ACCESS_KEY,
  //             secretAccessKey: process.env.SECRET_ACCESS_KEY,
  //           },
  //         });
  
  //         const command = new GetObjectCommand({
  //           Bucket: process.env.BUCKET_NAME,
  //           Key: key,
  //         });
  //         const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 36000 });
  
  //         demoData.push({ name, d_id, category, number,type, url: signedUrl,playlist,created_at });
  //       } catch (error) {
  //         console.error(`Error retrieving file '${key}': ${error}`);
  //       }
  //     }
  
  //     if (demoData.length === 0) {
  //       return res.status(404).send({ error: 'Data not found.' });
  //     }
  
  //     return res.send({ data: demoData });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).send({ message: 'Internal server error!' });
  //   } finally {
  //     if (connection) {
  //       await connection.release();
  //     }
  //   }
  // };
  
  exports.viewDemo = async (req, res) => {
    let connection;
    try {
      const { name, category, type } = req.query;
      connection = await pool.connect();
  
      // let findQuery = 'SELECT * FROM demo WHERE true';
      let findQuery = 'SELECT *, created_at as "created_at" FROM demo WHERE true';

  
      if (name !== undefined) {
        findQuery += ` AND name = '${name}'`;
      }
  
      if (category !== undefined) {
        findQuery += ` AND category = '${category}'`;
      }
  
      if (type !== undefined) {
        findQuery += ` AND type = '${type}'`;
      }
  
      const result = await connection.query(findQuery);
  
      if (result.rowCount === 0) {
        return res.status(404).send({ message: 'No records found' });
      }
  
      const demoData = [];
  
      for (const row of result.rows) {
        const {
          name,
          d_id,
          category,
          number,
          url,
          type,
          playlist,
          user_name,
          created_at, // Include created_at from the database
        } = row;
  
        const fileUrl = url;
        const key = 'demo1/' + fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
  
        try {
          const s3Client = new S3Client({
            region: process.env.BUCKET_REGION,
            credentials: {
              accessKeyId: process.env.ACCESS_KEY,
              secretAccessKey: process.env.SECRET_ACCESS_KEY,
            },
          });
  
          const command = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: key,
          });
          const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 36000 });
  
          demoData.push({
            name,
            d_id,
            category,
            number,
            type,
            url: signedUrl,
            playlist,
            user_name,
            created_at, // Include created_at in the response
          });
        } catch (error) {
          console.error(`Error retrieving file '${key}': ${error}`);
        }
      }
  
      if (demoData.length === 0) {
        return res.status(404).send({ error: 'Data not found.' });
      }
  
      return res.send({ data: demoData });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Internal server error!' });
    } finally {
      if (connection) {
        await connection.release();
      }
    }
  };
  

  