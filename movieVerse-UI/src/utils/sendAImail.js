export const triggerN8NforMail = async (email,fullname,subject,message) => {
    const endpoint=process.env.REACT_APP_N8N_ENDPOINT;
    const url=process.env.REACT_APP_N8N_URL;
  try {
    const response = await fetch(`${url}/webhook/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fullname,
        Subject: subject,
        email: email,
        message:message,
        date: new Date().toLocaleString()
      }),
    });

    console.log("response in n8n trigger", response);
    const text = await response.text();
    console.log("Body:", text);

    if (response.ok) {
      console.log("n8n workflow triggered successfully!");
    } else {
      console.error("Error triggering workflow.");
    }
  } catch (err) {
    console.error("Error calling n8n:", err);
  }
};