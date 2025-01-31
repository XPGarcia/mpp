import type React from "react"

interface OTPEmailTemplateProps {
  firstName: string
  otp: string
}

export const OTPEmailTemplate: React.FC<OTPEmailTemplateProps> = ({ firstName, otp }) => {
  return (
    <div
      style={{
        backgroundColor: "#f3f4f6",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "42rem",
          backgroundColor: "#ffffff",
          borderRadius: "0.5rem",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: "#1f2937",
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              height: "3rem",
              margin: "0 auto",
            }}
          />
        </div>

        {/* Content */}
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#121212",
              marginBottom: "1rem",
            }}
          >
            Welcome, {firstName}!👋
          </h1>
          <p
            style={{
              color: "#4b5563",
              marginBottom: "1.5rem",
            }}
          >
            Please use the following One-Time Password (OTP) to verify your email address:
          </p>
          <div
            style={{
              backgroundColor: "#f3f4f6",
              borderRadius: "0.375rem",
              padding: "1rem",
              marginBottom: "1.5rem",
              userSelect: "all",
            }}
          >
            <span
              style={{
                fontSize: "1.875rem",
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                fontWeight: "bold",
                letterSpacing: "0.6em",
                color: "#121212",
              }}
            >
              {otp}
            </span>
          </div>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
              marginBottom: "1rem",
            }}
          >
            {`This OTP will expire in 10 minutes. If you didn't request this verification, please ignore this email.`}
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: "#f9fafb",
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              color: "#6b7280",
              marginTop: "0.5rem",
            }}
          >
            {`If you didn't create an account, you can safely ignore this email.`}
            <br />
            Need help? Contact me xavier.garcia@prometeo.dev
          </p>
        </div>
      </div>
    </div>
  )
}

export default OTPEmailTemplate
