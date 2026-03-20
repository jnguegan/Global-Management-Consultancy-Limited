exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" })
      };
    }

    const { fullName, email, requestedPlan, message } = JSON.parse(event.body || "{}");

    if (!email || !requestedPlan) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" })
      };
    }

    const adminEmail = process.env.UPGRADE_ADMIN_EMAIL;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!adminEmail || !resendApiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing email configuration" })
      };
    }

    const subject = `New upgrade request: ${requestedPlan}`;
    const html = `
      <h2>New Agent Academy upgrade request</h2>
      <p><strong>Full name:</strong> ${fullName || "-"}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Requested plan:</strong> ${requestedPlan}</p>
      <p><strong>Message:</strong><br>${(message || "-").replace(/\n/g, "<br>")}</p>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Agent Academy <onboarding@resend.dev>",
        to: [adminEmail],
        subject,
        html
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: data.message || "Email send failed", details: data })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Server error" })
    };
  }
};
