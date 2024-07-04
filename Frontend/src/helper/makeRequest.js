const BASE_URL = "http://localhost";
const REQ_PORT = "4000";

const makeRequest = async ({ body, path, method, params, type }) => {
  const url = new URL(BASE_URL + ":" + REQ_PORT + path);
  console.log("url => ", url);

  params &&
    Object.keys(params).forEach((param) => {
      url.append(param, params[param]);
    });

  try {
    const response = await fetch(url, {
      method,
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json" || type, // Set the Content-Type header
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch schools");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching schools:", error);
  }
};

export default makeRequest;
