import * as React from "react";

interface AccountDisabledEmailProps {
  name: string;
}

export const AccountDisabledEmail: React.FC<AccountDisabledEmailProps> = ({
  name,
}) => (
  <div style={{ fontFamily: "sans-serif", lineHeight: "1.6", color: "#333" }}>
    <h1 style={{ color: "#ef4444" }}>Account Disabled</h1>
    <p>Hi {name},</p>
    <p>
      We are writing to inform you that your Algora account has been disabled by
      an administrator.
    </p>
    <p>
      As a result, you will no longer be able to sign in or access your data on
      the platform.
    </p>
    <p>
      If you believe this is a mistake or have any questions regarding this
      action, please contact our support team at support@joinalgora.com.
    </p>
    <p>
      Best,
      <br />
      The Algora Team
    </p>
  </div>
);
