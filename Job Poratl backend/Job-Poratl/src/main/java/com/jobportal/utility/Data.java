package com.jobportal.utility;

public class Data {

    public static String getMessageBody(String otp, String name) {

        return """
            <!DOCTYPE html>
            <html>
            <body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial;">
                <table width="100%%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="center">
                            <table width="600" style="background:#ffffff; border-radius:8px; padding:20px;">
                                <tr>
                                    <td style="text-align:center; background:#2563eb; color:white; padding:15px;">
                                        <h2>OTP Verification</h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:30px;">
                                        <p style="font-size:16px;">
                                            Hello <b>%s</b>,
                                        </p>

                                        <p>Your verification code is:</p>

                                        <p style="text-align:center;">
                                            <span style="font-size:28px; letter-spacing:6px; color:#2563eb; font-weight:bold;">
                                                %s
                                            </span>
                                        </p>

                                        <p>This code is valid for <b>5 minutes</b>.</p>
                                        <p>If you did not request this, please ignore this email.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align:center; font-size:12px; color:#777;">
                                        © 2026 JobNet
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        """.formatted(name, otp);
    }
}
