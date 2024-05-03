import axios from "axios";
import redisClient from "../lib/redis/index.js";

const DEFAULT_EXPIRATION = 3600;

const GetBarang = async (req, res) => {
  try {
    const cacheValue = await redisClient.get("list-barang");
    let data;

    if (cacheValue) {
      data = JSON.parse(cacheValue);
    } else {
      const response = await axios.get("http://localhost:8080/api/barang");

      if (!response) {
        var params = {
          status: "error",
          message: response.message,
        };

        res.json(params);
        res.end();
      }

      redisClient.setEx(
        "list-barang",
        DEFAULT_EXPIRATION,
        JSON.stringify(response.data.data)
      );
      data = response.data.data;
    }
    var params = {
      status: "success",
      data,
    };

    res.json(params);
    res.end();
  } catch (err) {
    params = {
      status: "error",
      message: err,
    };

    res.json(params);
    res.end();
  }
};

export default GetBarang;
