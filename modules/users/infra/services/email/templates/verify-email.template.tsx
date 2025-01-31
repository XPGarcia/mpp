import * as React from "react"

interface VerifyEmailTemplateProps {
  firstName: string
  token: string
}

export const VerifyEmailTemplate: React.FC<Readonly<VerifyEmailTemplateProps>> = ({ firstName, token }) => (
  <div
    style={{
      fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
      backgroundColor: "#f9f9f9",
      padding: "20px",
    }}
  >
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        padding: "40px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1
          style={{
            color: "#333",
            fontSize: "24px",
            marginBottom: "20px",
          }}
        >
          Welcome, {firstName}!
        </h1>
        <p
          style={{
            color: "#666",
            fontSize: "16px",
            lineHeight: "1.5",
            marginBottom: "30px",
          }}
        >
          Thanks for signing up! Please verify your email address to get started.
        </p>
        <a
          href={`${process.env.BASE_URL}/verify-email?token=${token}`}
          style={{
            backgroundColor: "#121212",
            color: "#ffffff",
            padding: "12px 30px",
            borderRadius: "5px",
            textDecoration: "none",
            fontWeight: "bold",
            display: "inline-block",
            marginBottom: "20px",
          }}
        >
          Verify Your Email
        </a>
        <p
          style={{
            color: "#999",
            fontSize: "14px",
            marginTop: "20px",
          }}
        >
          {`If the button doesn't work, copy and paste this link into your browser:`}
          <br />
          <span style={{ color: "#666" }}>{`${process.env.BASE_URL}/verify-email?token=${token}`}</span>
        </p>
      </div>
      <div
        style={{
          borderTop: "1px solid #eee",
          paddingTop: "20px",
          textAlign: "center",
          color: "#999",
          fontSize: "12px",
        }}
      >
        <p>
          {`If you didn't create an account, you can safely ignore this email.`}
          <br />
          Need help? Contact me xavier.garcia@prometeo.dev
        </p>
      </div>
    </div>
  </div>
)
